let loginOverlayUserIdInput = document.getElementById("login-overlay-user-id-input");
let loginOverlayUserIdSubmitButton = document.getElementById("login-overlay-user-id-submit-button");
let dayInfoPageGoToMainPageButton = document.getElementById("day-info-page-go-to-main-page-button");
let userId = "";

function getQueryParameter(name) 
{
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

const sessionId = getQueryParameter('sessionId');

function convertTimeToHumanReadableFormat(timeInSeconds)
{
    let answer = "";
    let hours = Math.floor(timeInSeconds / 3600);
    let minutes = Math.floor((timeInSeconds - (hours * 3600)) / 60);
    let seconds = timeInSeconds - (hours * 3600 + minutes * 60);
    answer += hours + "h. ";
    answer += minutes + "m. ";
    answer += seconds + "s.";
    return answer;
}

function calculateSessionStreak(data, sessionsLength)
{
    let streak = (sessionsLength === 0) ? 0 : 1;
    for (let i = 0; i < sessionId; i++)
    {
        if(sessionId - i >= 0 && sessionId - 1 - i >= 0)
        {
            let currentSessionDate = data.sessions[sessionId - i].date;
            let previousSessionDate = data.sessions[sessionId - 1 - i].date;
            if (((Date.parse(currentSessionDate) - Date.parse(previousSessionDate)) / (1000 * 3600 * 24)) === 1)
            {
                streak++;
            }
            else
            {
                break;
            }
        }
    }
    return streak;
}

function calculateProgress(data, dataLength)
{
    if (data.tasks.topics.length === 0)
    {
        return "0.00%";
    }
    let progressRate = 0;
    for (let i = 0; i < dataLength; i++)
    {
        if (data.tasks.topics[i].is_finished)
        {
            progressRate++;
        }
    }
    return (progressRate / dataLength * 100).toFixed(2) + "%";
}

function instantiateAndDrawPlot(xAxisArray, yIntensityArray, yEngagementArray, yDifficultyArray, yDurationArray)
{
    let intensityTrace = {
        x: xAxisArray,  
        y: yIntensityArray,  
        mode: 'lines+markers',  
        name: 'Intensity',  
        line: {  
          dash: 'dot',  
          width: 4  
        }  
    };
      
    let engagementRateTrace = {
        x: xAxisArray,  
        y: yEngagementArray,  
        mode: 'lines+markers',
        name: 'Engagement',
        line: {
            dash: 'dashdot',
            width: 4
        }
    };
    
    let difficultyTrace = {
        x: xAxisArray,
        y: yDifficultyArray,
        name: 'Difficulty',
        line: {
            dash: 'dashdot',
            width: 4
        }
    };

    let durationTrace = {
        x: xAxisArray,
        y: yDurationArray,
        name: 'Session duration',
        line: {
            dash: 'solid',
            width: 4
        }
    };
    
    let tracesData = [intensityTrace, engagementRateTrace, difficultyTrace, durationTrace];
    
    let TracesLayout = {
        title: {
            text: '5 last seessions progression'
        },
        xaxis: {
            range: ["2024-12-31", "2025-01-14"],
            autorange: true
        },
        yaxis: {
            // range: [0, 18.5],
            autorange: true
        },
        legend: {
            y: 0.5,
            traceorder: 'reversed',
            font: {
                size: 16
            }
        }
    };
    
    Plotly.newPlot('day-info-graph-container', tracesData, TracesLayout);
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

let xAxisArray = [];
let yIntensityArray = [];
let yEngagementArray = [];
let yDifficultyArray = [];
let yDurationArray = [];

window.onload = async function()
{
    loginOverlayUserIdInput.value = "";
    $("#login-overlay").hide();
    if (sessionStorage.getItem('userId')) 
    {
        userId = sessionStorage.getItem('userId');
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
        let response = await fetch(`/data/sessions?s=${getCookie("user_id")}`, {
            method: 'get',
            headers: new Headers({
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache, no-store, max-age=0'
            })
        });
        let data = await response.json();

        let tasksListResponse = await fetch(`/data/tasks?s=${getCookie("user_id")}`, {
            method: 'get',
            headers: new Headers({
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache, no-store, max-age=0'
            })
        });
        let tasksListData = await tasksListResponse.json();
        
        let dayInfoDate = document.getElementById("day-info-date");
        let dayInfoFeedbackIntensity = document.getElementById("day-info-feedback-intensity");
        let dayInfoFeedbackEngagement = document.getElementById("day-info-feedback-engagement");
        let dayInfoFeedbackDifficulty = document.getElementById("day-info-feedback-difficulty");
        let dayInfoFeedbackPauses = document.getElementById("day-info-feedback-pauses");
        let dayInfoFeedbackDistractions = document.getElementById("day-info-feedback-distractions");
        let dayInfoFeedbackDailyGoal = document.getElementById("day-info-feedback-daily-goal");
        let dayInfoFeedbackTopic = document.getElementById("day-info-feedback-topic");
        let dayInfoFeedbackOverall = document.getElementById("day-info-feedback-overall");
        let dayInfoCumulativeSummary = document.getElementById("day-info-cumulative-summary");
        let dayInfoStreakText = document.getElementById("day-info-streak-text");
        let dayInfoProgressText = document.getElementById("day-info-progress-text");      

        dayInfoDate.innerHTML = data.sessions[sessionId].date + " - " + convertTimeToHumanReadableFormat(data.sessions[sessionId].duration);
        dayInfoFeedbackIntensity.innerHTML = "Average intensity: " + data.sessions[sessionId].intensity.toFixed(2) + "/10.";
        dayInfoFeedbackEngagement.innerHTML = "Average engagement: " + data.sessions[sessionId].engagement.toFixed(2) + "/10.";
        dayInfoFeedbackDifficulty.innerHTML = "Average difficulty: " + data.sessions[sessionId].difficulty.toFixed(2) + "/10.";
        dayInfoFeedbackDailyGoal.innerHTML = "Duration goal: " + convertTimeToHumanReadableFormat(data.sessions[sessionId].daily_goal);
        dayInfoFeedbackDistractions.innerHTML = "Distractions: " + data.sessions[sessionId].distractions;
        dayInfoFeedbackPauses.innerHTML = "Pauses: " + data.sessions[sessionId].pauses;

        dayInfoFeedbackTopic.innerHTML = "Covered topics: ";
        for (let i = 0; i < data.sessions[sessionId].covered_topics.length; i++)
        {
            dayInfoFeedbackTopic.innerHTML += data.sessions[sessionId].covered_topics[i];
            if (data.sessions[sessionId].covered_topics.length - i > 1)
            {
                dayInfoFeedbackTopic.innerHTML += ", ";
            }
        }
        dayInfoFeedbackTopic.innerHTML += ".";

        dayInfoFeedbackOverall.innerHTML = "Overall experience: " + data.sessions[sessionId].text_feedback + ".";

        let dates = data.sessions.slice(0, sessionId + 1).map(session => session.date);
        let intensities = data.sessions.slice(0, sessionId + 1).map(session => session.intensity);
        let engagements = data.sessions.slice(0, sessionId + 1).map(session => session.engagement);
        let difficulties = data.sessions.slice(0, sessionId + 1).map(session => session.difficulty);
        let durations = data.sessions.slice(0, sessionId + 1).map(session => session.duration);
        xAxisArray.push(dates[sessionId]);
        yIntensityArray.unshift(intensities[sessionId]);
        yEngagementArray.unshift(engagements[sessionId]);
        yDifficultyArray.unshift(difficulties[sessionId]);
        yDurationArray.unshift(durations[sessionId]);
        let initialDate = Date.parse(dates[sessionId]);
        let dayInMilliSeconds = 1000 * 3600 * 24;
        const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
        for (let i = 0; i < 4; i++)
        {
            let currentDateInMilliseconds = initialDate - (dayInMilliSeconds * (i + 1));
            let currentDate = new Date(currentDateInMilliseconds);
            let dateString = currentDate.getFullYear() + "-" + months[currentDate.getMonth()] + "-" + currentDate.getDate().toString().padStart(2, "0");
            xAxisArray.unshift(dateString);
            if (sessionId - i - 1 < 0)
            {
                yIntensityArray.unshift(null);
                yEngagementArray.unshift(null);
                yDifficultyArray.unshift(null);
                yDurationArray.unshift(null);
                continue;
            }
            let sessionRecordFoundFlag = false;
            for (let j = 0; j <= i; j++)
            {
                let tempDate = Date.parse(dates[sessionId - j - 1]);
                if (Date.parse(currentDate) === tempDate)
                {
                    yIntensityArray.unshift(intensities[sessionId - j - 1]);
                    yEngagementArray.unshift(engagements[sessionId - j - 1]);
                    yDifficultyArray.unshift(difficulties[sessionId - j - 1]);
                    yDurationArray.unshift(durations[sessionId - j - 1]);
                    sessionRecordFoundFlag = true;
                    break;
                }
            }
            if (!sessionRecordFoundFlag)
            {
                yIntensityArray.unshift(null);
                yEngagementArray.unshift(null);
                yDifficultyArray.unshift(null);
                yDurationArray.unshift(null);
            }
        }

        instantiateAndDrawPlot(xAxisArray, yIntensityArray, yEngagementArray, yDifficultyArray, yDurationArray);
        
        let sessionsWithlessThanCurrentSessionDurationCount = 0;
        for (let i = 0; i < sessionId; i++)
        {
            if (durations[i] < durations[sessionId])
            {
                sessionsWithlessThanCurrentSessionDurationCount++;
            }
        }
        let percentageOfSessionsWithLowerDuration = 100;
        let dayInfoCumulativeSummaryText = "";
        if (sessionId > 0)
        {
            percentageOfSessionsWithLowerDuration = ((sessionsWithlessThanCurrentSessionDurationCount / sessionId) * 100);
            dayInfoCumulativeSummaryText = `Today you worked better than ${percentageOfSessionsWithLowerDuration.toFixed(2)}% of all previous records!`;
        }
        else
        {
            dayInfoCumulativeSummaryText = "No previous sessions data.";
        }

        dayInfoCumulativeSummary.innerHTML = dayInfoCumulativeSummaryText;
        dayInfoStreakText.innerHTML = calculateSessionStreak(data, data.sessions.length) + " days";

        dayInfoProgressText.innerHTML = calculateProgress(tasksListData, tasksListData.tasks.topics.length);
    } 
    catch (error) 
    {
        console.log('Error fetching the JSON:', error);
    }
}

dayInfoPageGoToMainPageButton.addEventListener('click', () => {
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