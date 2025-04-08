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

window.onload = function()
{
    setTimeout(loadMainPage, 5000);
};

function loadMainPage()
{
    window.location.href = "../main/index.html";
}

sessionStorage.setItem('visitedWelcomePage', true);