import * as AchievementMethods from "../data/scripts/achievements_checkinkg_scripts.js";

let loginOverlayUserIdInput = document.getElementById("login-overlay-user-id-input");
let loginOverlayUserIdSubmitButton = document.getElementById("login-overlay-user-id-submit-button");
let tasksPageGoToMainPageButton = document.getElementById("tasks-page-go-to-main-page-button");
let userId = "";

function calculateProgress(finishedTasks, totalTasksNumber)
{
    if (parseInt(totalTasksNumber) === 0)
    {
        return "0.00%";
    }
    return (finishedTasks / totalTasksNumber * 100).toFixed(2) + "%";
}

function calculateProgressUsingDOM(checkboxes)
{
    var checkedItems = 0;
    for (var i = 0; i < checkboxes.length; i++)
    {
        if (checkboxes[i].checked)
        {
            checkedItems++;
        }
    }
    return calculateProgress(checkedItems, checkboxes.length);
}

function getCookie(name) 
{
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) 
    {
        return parts.pop().split(';').shift();
    }
    return null;
}

function generateUserSessionId() 
{
    return 'user_session_' + Math.random().toString(36).substr(2, 9);
}

function setCookie(name, value, days) 
{
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax;";
}

async function updateData(checkboxes, data)
{
    let timestamp = Date.now();
    for (var i = 0; i < checkboxes.length; i++)
    {
        data.tasks.topics[i].is_finished = checkboxes[i].checked;
        if (checkboxes[i].checked === true)
        {
            data.tasks.topics[i].completion_time = timestamp;
        }
        else
        {
            data.tasks.topics[i].completion_time = null;
        }
    }
}

async function download(content, fileName, contentType) 
{
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href); 
}

async function postDataAndRunFunction(uri, data, functionToRun)
{      
    try 
    {
        let response = await fetch(uri, {
            method: "POST",
            body: data,
            headers: {
                "Content-type": "application/json",
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-cache, no-store, max-age=0'
            }
        });
        
        if (response.ok) 
        {
            if (functionToRun) 
            {
                await functionToRun();
            }
        } 
        else 
        {
            console.error("POST request failed: ", response.statusText);
        }
    } 
    catch (error) 
    {
        console.error("Error in postDataAndRunFunction: ", error);
    }
}

function createTasksContainer(index)
{
    let tasksContainer = document.createElement("div");
    tasksContainer.id = "tasks-container-" + index;
    tasksContainer.className = "tasks-container";
    return tasksContainer;
}

function createTasksContainerText(index)
{
    let tasksContainerText = document.createElement("div");
    tasksContainerText.id = "tasks-container-text-" + index;
    tasksContainerText.className = "tasks-container-text";
    // tasksContainerText.innerHTML = index + 1 + ".";
    return tasksContainerText;
}

function createTasksContainerInput(index, data)
{
    let tasksContainerInput = document.createElement("input");
    tasksContainerInput.id = "tasks-container-input-" + index;
    tasksContainerInput.className = "tasks-container-input";
    tasksContainerInput.type = "text";
    tasksContainerInput.value = data.tasks.topics[index].task_name;
    return tasksContainerInput;
}

function createTasksContainerCheckbox(index, data)
{
    let tasksContainerCheckbox = document.createElement("input");
    tasksContainerCheckbox.id = "tasks-container-checkbox-" + index;
    tasksContainerCheckbox.className = "tasks-container-checkbox";
    tasksContainerCheckbox.type = "checkbox";
    tasksContainerCheckbox.checked = data.tasks.topics[index].is_finished;
    return tasksContainerCheckbox;
}

function createTasksContainerRemoveTaskButton(index)
{
    let tasksContainerRemoveTaskButton = document.createElement("button");
    tasksContainerRemoveTaskButton.id = "tasks-container-remove-task-button-" + index;
    tasksContainerRemoveTaskButton.className = "tasks-container-remove-task-button";
    tasksContainerRemoveTaskButton.innerHTML = "🗑";
    return tasksContainerRemoveTaskButton;
}

function createTasksContainerAddNewTaskButton(index)
{
    let tasksContainerAddNewTaskButton = document.createElement("button");
    tasksContainerAddNewTaskButton.id = "tasks-container-add-new-task-button-" + index;
    tasksContainerAddNewTaskButton.className = "tasks-container-add-new-task-button";
    tasksContainerAddNewTaskButton.innerHTML = "➕";
    return tasksContainerAddNewTaskButton;
}

async function addNewTaskAndUpdateTasksList(index, data)
{
    const topic = {
        "task_name": "",
        "is_finished": false,
        "creation_time": Date.now(),
        "completion_time": null,
        "deletion_time": null
    };
    let tasksPageTasksListContainer = document.getElementById("tasks-page-tasks-list-container");
    tasksPageTasksListContainer.innerHTML = "";
    data.tasks.topics.splice(index + 1, 0, topic);
    await postDataAndRunFunction(`/update/tasks?s=${getCookie("user_id")}`, JSON.stringify(data), fetchData);
}

async function removeTaskAndUpdateList(index, data)
{
    let tasksPageTasksListContainer = document.getElementById("tasks-page-tasks-list-container");
    data.tasks.topics[index].deletion_time = Date.now();
    let deletedTask = data.tasks.topics[index];
    data.tasks.deleted_topics.splice(data.tasks.deleted_topics.length, 0, deletedTask);
    tasksPageTasksListContainer.innerHTML = "";
    data.tasks.topics.splice(index, 1);
    await postDataAndRunFunction(`/update/tasks?s=${getCookie("user_id")}`, JSON.stringify(data), fetchData);
}

async function updateTaskInputAndTasksList(index, data)
{
    let tasksPageTasksListContainer = document.getElementById("tasks-page-tasks-list-container");
    data.tasks.topics[index].task_name = tasksPageTasksListContainer.children[index].children[0].value;
    tasksPageTasksListContainer.innerHTML = "";
    await postDataAndRunFunction(`/update/tasks?s=${getCookie("user_id")}`, JSON.stringify(data), fetchData);
}

async function fetchData()
{
    try 
    {
        let response = await fetch(`/data/tasks?s=${getCookie("user_id")}`, {
            method: 'get',
            headers: new Headers({
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache, no-store, max-age=0'
            })
        });
        let data = await response.json();

        let tasksPageTasksListContainer = document.getElementById("tasks-page-tasks-list-container");

        if (data.tasks.topics.length === 0)
        {
            tasksPageTasksListContainer.innerHTML = "There is no tasks. Please add new one."
            let addFirstTaskToEmptyTasksButton = createTasksContainerAddNewTaskButton(0);
            addFirstTaskToEmptyTasksButton.addEventListener('click', async () => {
                tasksPageTasksListContainer.innerHTML = "";
                await addNewTaskAndUpdateTasksList(0, data);
                await AchievementMethods.fetchDataAndCheckAchievementsStatuses();
            });
            tasksPageTasksListContainer.appendChild(addFirstTaskToEmptyTasksButton);
        }

        let checkboxes = [];
        let addNewTaskButtons = [];
        let removeTaskButtons = [];
        let tasksContainerInputs = [];

        let tasksPageProgressText = document.getElementById("tasks-page-progress-text");
        let tasksContainer = {};
        let tasksContainerInput = {};
        let tasksContainerCheckbox = {};
        let tasksContainerRemoveTaskButton = {};
        let tasksContainerAddNewTaskButton = {};

        let progressRate = 0;

        for (let i = 0; i < data.tasks.topics.length; i++) 
        {
            tasksContainer = createTasksContainer(i);
            tasksContainerInput = createTasksContainerInput(i, data);
            tasksContainerCheckbox = createTasksContainerCheckbox(i, data);
            tasksContainerRemoveTaskButton = createTasksContainerRemoveTaskButton(i);
            tasksContainerAddNewTaskButton = createTasksContainerAddNewTaskButton(i);

            checkboxes.push(tasksContainerCheckbox);
            removeTaskButtons.push(tasksContainerRemoveTaskButton);
            addNewTaskButtons.push(tasksContainerAddNewTaskButton);
            tasksContainerInputs.push(tasksContainerInput);

            tasksContainerCheckbox.addEventListener('change', async () => {
                tasksPageProgressText.innerHTML = calculateProgressUsingDOM(checkboxes);
                await updateData(checkboxes, data);
                // download(JSON.stringify(data), 'tasks.json', 'application/json');
                await postDataAndRunFunction(`/update/tasks?s=${getCookie("user_id")}`, JSON.stringify(data), null);
                await AchievementMethods.fetchDataAndCheckAchievementsStatuses();
            });

            if (data.tasks.topics[i].is_finished)
            {
                progressRate++;
            }
            
            tasksContainer.appendChild(tasksContainerInput);
            tasksContainer.appendChild(tasksContainerCheckbox);
            tasksContainer.appendChild(tasksContainerRemoveTaskButton);
            tasksContainer.appendChild(tasksContainerAddNewTaskButton);
            tasksPageTasksListContainer.appendChild(tasksContainer);
        }        

        for (let j = 0; j < removeTaskButtons.length; j++)
        {
            removeTaskButtons[j].addEventListener('click', async () => {
                await removeTaskAndUpdateList(j, data);
            });
        }

        for (let k = 0; k < addNewTaskButtons.length; k++)
        {
            addNewTaskButtons[k].addEventListener('click', async () => {
                await addNewTaskAndUpdateTasksList(k, data);
                await AchievementMethods.fetchDataAndCheckAchievementsStatuses();
            });
        }

        for (let l = 0; l < tasksContainerInputs.length; l++)
            {
                tasksContainerInputs[l].addEventListener('change', async () => {
                    await updateTaskInputAndTasksList(l, data);
                    await AchievementMethods.fetchDataAndCheckAchievementsStatuses();
                });
            }
        tasksPageProgressText.innerHTML = calculateProgress(progressRate, data.tasks.topics.length);
    } 
    catch (error) 
    {
        console.log('Error fetching the JSON:', error);
    }
}

window.onload = async function()
{
    loginOverlayUserIdInput.value = "";
    $("#login-overlay").hide();
    if (sessionStorage.getItem('userId')) 
    {
        let userId = sessionStorage.getItem('userId');
        if (getCookie("user_id") !== userId)
        {
            setCookie("user_id", userId, 1);
        }
        await fetchData();
    }
    else
    {
        $("#login-overlay").show();
    }
}

tasksPageGoToMainPageButton.addEventListener('click', () => {
    history.back();
});

loginOverlayUserIdSubmitButton.addEventListener('click', async () => {
    const regex = new RegExp("[0-9]{1,2}[BMbm][Dd]?[0-9]{3,6}");
    if (!regex.test(loginOverlayUserIdInput.value))
    {
        alert("Wrong ID! Check and fix it.");
    }
    else
    {
        sessionStorage.setItem('userId', loginOverlayUserIdInput.value.toUpperCase());
        userId = sessionStorage.getItem('userId');
        if (getCookie("user_id") !== userId)
        {
            setCookie("user_id", userId, 1);
        }
        await fetchData();
        $("#login-overlay").hide();
    }
});