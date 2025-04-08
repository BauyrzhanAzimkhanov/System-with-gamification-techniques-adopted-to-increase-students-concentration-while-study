let loginOverlayUserIdInput = document.getElementById("login-overlay-user-id-input");
let loginOverlayUserIdSubmitButton = document.getElementById("login-overlay-user-id-submit-button");

let loadFileInput = document.getElementById("load-file-input");
let loadFileButton = document.getElementById("load-file-button");
let downloadFileButton = document.getElementById("download-file-button");
let factoryResetButton = document.getElementById("factory-reset-button");
let settingsPageGoToMainPageButton = document.getElementById("settings-page-go-to-main-page-button");

let userId = "";
let tasksData = [];
let sessionsData = [];
let achievementsData = [];

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

window.onload = async function()
{
    loadFileInput.value = "";
    loginOverlayUserIdInput.value = "";
    $("#login-overlay").hide();
    if (sessionStorage.getItem('userId')) 
    {
        userId = sessionStorage.getItem('userId');
        if (getCookie("user_id") !== userId)
        {
            setCookie("user_id", userId, 1);
        }
    }
    else
    {
        $("#login-overlay").show();
    }
}

function decodeBase64(encodedString) 
{
    return JSON.parse(atob(encodedString));
}

async function postData(uri, data)
{
    fetch(uri, {
        method: "POST",
        body: data,
        headers: {
          "Content-type": "application/json",
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache, no-store, max-age=0'
        }
    });
}

loadFileButton.addEventListener("click", () => {
    let file = loadFileInput.files[0];

    if (file) 
    {
        let reader = new FileReader();
        reader.onload = async function(event) {
            let encodedSave = event.target.result;
            let save = decodeBase64(encodedSave);
            await postData(`/load/save?s=${getCookie("user_id")}`, JSON.stringify(save));
        };
        reader.readAsText(file);
    }
});

async function fetchTasksData() 
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
        tasksData = await response.json();
    }
    catch (error)
    {
        console.log('Error fetching the JSON:', error);
    }
}

async function fetchSessionsData() 
{
    try
    {
        let response = await fetch(`/data/sessions?s=${getCookie("user_id")}`, {
            method: 'get',
            headers: new Headers({
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache, no-store, max-age=0'
            })
        });
        sessionsData = await response.json();
    }
    catch (error)
    {
        console.log('Error fetching the JSON:', error);
    }
}

async function fetchAchievementsData() 
{
    try
    {
        let response = await fetch(`/data/achievements?s=${getCookie("user_id")}`, {
            method: 'get',
            headers: new Headers({
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache, no-store, max-age=0'
            })
        });
        achievementsData = await response.json();
    }
    catch (error)
    {
        console.log('Error fetching the JSON:', error);
    }
}

function getCurrentDateString()
{
    let currentDate = new Date();
    const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    return currentDate.getFullYear() + "-" + months[currentDate.getMonth()] + "-" + currentDate.getDate().toString().padStart(2, "0");
}

function encodeBase64(obj) 
{
    return btoa(JSON.stringify(obj));
}

function downloadSaveEncrypted(content, fileName) 
{
    let encodedContent = encodeBase64(content);
    let a = document.createElement("a");
    let file = new Blob([encodedContent]);
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href); 
}

downloadFileButton.addEventListener("click", async () => {
    await fetchTasksData();
    await fetchSessionsData();
    await fetchAchievementsData();
    let save = {
        "tasksData": tasksData,
        "sessionsData": sessionsData,
        "achievementsData": achievementsData 
    };
    downloadSaveEncrypted(save, `save-${userId}-${getCurrentDateString()}`);
});

factoryResetButton.addEventListener("click", async () => {
    tasksData = {
        "tasks": {
            "topics": [],
            "deleted_topics": []
        }
    };
    sessionsData = {
        "sessions": []
    };
    achievementsData = {
        "achievements": [
            {
                "name": "In the beginning was the Word...",
                "description": "Complete your very first study session.",
                "rarity": "bronze",
                "status": "unfinished",
                "finish_time": null
            },
            {
                "name": "Hasta la Vista, Laziness!",
                "description": "Achieve a streak of 2 consecutive study sessions without missing a day.",
                "rarity": "bronze",
                "status": "unfinished",
                "finish_time": null
            },
            {
                "name": "Concentration Commando!",
                "description": "Finish 5 consecutive study sessions with no distractions.",
                "rarity": "bronze",
                "status": "unfinished",
                "finish_time": null
            },
            {
                "name": "Mission: Fifteen",
                "description": "Achieve your daily study goals for 15 sessions.",
                "rarity": "silver",
                "status": "unfinished",
                "finish_time": null
            },
            {
                "name": "Mission: Thirty",
                "description": "Achieve your daily study goals for 30 sessions.",
                "rarity": "gold",
                "status": "unfinished",
                "finish_time": null
            },
            {
                "name": "Laser Focus",
                "description": "Keep the total number of distractions and pauses below 2 per session.",
                "rarity": "bronze",
                "status": "unfinished",
                "finish_time": null
            },
            {
                "name": "No Breaks, No Mercy!",
                "description": "Achieve your daily study goal without any breaks and with no more than one pause at the end of the session.",
                "rarity": "bronze",
                "status": "unfinished",
                "finish_time": null
            },
            {
                "name": "Go Long or Go Home!",
                "description": "Complete a session lasting more than 3 hours with no distractions and at most one pause.",
                "rarity": "silver",
                "status": "unfinished",
                "finish_time": null
            },
            {
                "name": "If your dreams do not scare you, they are not big enough.",
                "description": "Begin a study session with a daily goal exceeding 4 hours.",
                "rarity": "silver",
                "status": "unfinished",
                "finish_time": null
            },
            {
                "name": "Lock and Load!",
                "description": "Create your first study task.",
                "rarity": "bronze",
                "status": "unfinished",
                "finish_time": null
            },
            {
                "name": "Task Annihilator!",
                "description": "Complete all tasks for the session.",
                "rarity": "bronze",
                "status": "unfinished",
                "finish_time": null
            },
            {
                "name": "Jack of All Trades",
                "description": "Cover at least 3 different topics during one session.",
                "rarity": "silver",
                "status": "unfinished",
                "finish_time": null
            },
            {
                "name": "Level Up!",
                "description": "Achieve consistent improvement in session difficulty over five consecutive sessions without missing a day.",
                "rarity": "silver",
                "status": "unfinished",
                "finish_time": null
            },
            {
                "name": "Session Sleuth",
                "description": "Review your session details 15 times.",
                "rarity": "bronze",
                "status": "unfinished",
                "finish_time": null
            },
            {
                "name": "Achievement Unlocked!",
                "description": "Unlock all achievements.",
                "rarity": "platinum",
                "status": "hidden",
                "finish_time": null
            }
        ]
    };
    let save = {
        "tasksData": tasksData,
        "sessionsData": sessionsData,
        "achievementsData": achievementsData 
    };
    await postData(`/load/save?s=${getCookie("user_id")}`, JSON.stringify(save));
});

settingsPageGoToMainPageButton.addEventListener('click', () => {
    history.back();
});

loginOverlayUserIdSubmitButton.addEventListener('click', () => {
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
        $("#login-overlay").hide();
    }
});