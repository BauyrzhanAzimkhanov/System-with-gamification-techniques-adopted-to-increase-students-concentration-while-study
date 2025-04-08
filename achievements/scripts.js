let loginOverlayUserIdInput = document.getElementById("login-overlay-user-id-input");
let loginOverlayUserIdSubmitButton = document.getElementById("login-overlay-user-id-submit-button");
let achievementsPageGoToMainPageButton = document.getElementById("achievements-page-go-to-main-page-button");

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

async function fetchData() 
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
        let data = await response.json();
        
        let achievementsListContainer = document.getElementById("achievements-list-container");
        let achievementContainer = {};
        let achievementTextContainer = {};
        let achievementName = {};
        let achievementDescription = {};
        let achievementIcon = {};

        for (let i = 0; i < data.achievements.length; i++) 
        {
            achievementContainer = document.createElement("div");
            achievementContainer.id = "achievement-container-" + i;
            achievementContainer.className = "achievement-container";

            achievementTextContainer = document.createElement("div");
            achievementTextContainer.id = "achievement-text-container-" + i;
            achievementTextContainer.className = "achievement-text-container";

            achievementName = document.createElement("div");
            achievementName.innerHTML = data.achievements[i].name;
            achievementName.id = "achievement-name-" + i;
            achievementName.className = "achievement-name";

            achievementDescription = document.createElement("div");
            achievementDescription.innerHTML = data.achievements[i].description;
            achievementDescription.id = "achievement-description-" + i;
            achievementDescription.className = "achievement-description";

            achievementIcon = document.createElement("div");
            achievementIcon.id = "achievement-icon-" + i;
            achievementIcon.className = "achievement-icon";

            achievementTextContainer.appendChild(achievementName);
            achievementTextContainer.appendChild(achievementDescription);
            achievementContainer.appendChild(achievementTextContainer);
            achievementContainer.appendChild(achievementIcon);
            achievementsListContainer.appendChild(achievementContainer);

            if (data.achievements[i].status === "unfinished")
            {
                achievementContainer.classList.add("unfinished");
                achievementName.classList.add("unfinished");
                achievementDescription.classList.add("unfinished");
            }
            else if (data.achievements[i].status === "hidden")
            {
                achievementContainer.classList.add("hidden");
                achievementName.classList.add("hidden");
                achievementDescription.classList.add("hidden");
                achievementName.innerHTML = "Hidden";
                achievementDescription.innerHTML = "Hidden";
            }
            switch (data.achievements[i].rarity)
            {
                case "bronze":
                    achievementContainer.classList.add("bronze");
                    achievementIcon.classList.add("bronze");
                    break;
                case "silver":
                    achievementContainer.classList.add("silver");
                    achievementIcon.classList.add("silver");
                    break;
                case "gold":
                    achievementContainer.classList.add("gold");
                    achievementIcon.classList.add("gold");
                    break;
                case "platinum":
                    achievementContainer.classList.add("platinum");
                    achievementIcon.classList.add("platinum");
                    break;
                default:
                    break;
            }
        }        

    } 
    catch (error) 
    {
        console.log('Error fetching the JSON:', error);
    }
}

achievementsPageGoToMainPageButton.addEventListener('click', () => {
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
        let userId = sessionStorage.getItem('userId');
        if (getCookie("user_id") !== userId)
        {
            setCookie("user_id", userId, 1);
        }
        await fetchData();
        $("#login-overlay").hide();
    }
});