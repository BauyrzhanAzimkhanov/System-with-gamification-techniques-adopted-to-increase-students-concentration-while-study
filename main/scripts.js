import * as AchievementMethods from "../data/scripts/achievements_checkinkg_scripts.js";

class Timer 
{
    constructor() 
    {
        this.isRunning = false;
        this.startTime = 0;
        this.overallTime = 0;
    }
  
    _getTimeElapsedSinceLastStart() 
    {
        if (!this.startTime) 
        {
            return 0;
        }
        return Date.now() - this.startTime;
    }
  
    start() 
    {
        if (this.isRunning) 
        {
            return console.error('Timer is already running');
        }
        this.isRunning = true;
        this.startTime = Date.now();
    }
  
    stop() 
    {
        if (!this.isRunning) 
        {
            return console.error('Timer is already stopped');
        }
        this.isRunning = false;
        this.overallTime = this.overallTime + this._getTimeElapsedSinceLastStart();
    }
  
    reset() 
    {
        this.overallTime = 0;
        if (this.isRunning) 
        {
            this.startTime = Date.now();
            return;
        }
        this.startTime = 0;
    }
  
    getTime() 
    {
        if (!this.startTime) 
        {
            return 0;
        }
        if (this.isRunning) 
        {
            return this.overallTime + this._getTimeElapsedSinceLastStart();
        }
        return this.overallTime;
    }
}

let pauses = 0;
let distractions = 0;
let sessionData = {};
let tasksData = {};
let tasksCheckboxes = [];
let recordedDays = [];
let userId = "";
let dailyGoal = 3600;
let didUserMovedBackFromOtherPage = false;
let didUserTriedToUnloadPage = false;
let didUserTriedToGoToOtherPageOrSubmittedSession = false;

let progressBar = new ProgressBar.Circle("#main-page-timer-and-button-progress-bar", {
    color: "red",
    duration: 1000,
    easing: 'easeOut',
    strokeWidth: 5
});

let startingRgbColor = [255, 164, 164];  // Red
let dailyGoalRgbColor = [175, 248, 172];  // Green
let overTimeRgbColor = [0, 150, 0]; // Intensive green

let timer = new Timer();
const sessionExample = {
    "date": "",
    "pauses": 0,
    "duration": 0,
    "daily_goal": 0,
    "distractions": 0,
    "intensity": 0,
    "engagement": 0,
    "difficulty": 0,
    "covered_topics": [],
    "text_feedback": ""
};
const dayInMilliSeconds = 1000 * 3600 * 24;
const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];




// Converting time
function convertTimeToHumanReadableFormat(timeInSeconds)
{
    let answer = "";
    let hours = Math.floor(timeInSeconds / 3600);
    let minutes = Math.floor((timeInSeconds - (hours * 3600)) / 60);
    let seconds = timeInSeconds - (hours * 3600 + minutes * 60);
    answer += hours + "h ";
    answer += minutes + "m ";
    answer += seconds + "s";
    return answer;
}

function formatTimeForTimer(timeInSeconds)
{
    let answer = "";
    let hours = Math.floor(timeInSeconds / 3600);
    let minutes = Math.floor((timeInSeconds - (hours * 3600)) / 60);
    let seconds = timeInSeconds - (hours * 3600 + minutes * 60);
    if (hours > 0)
    {
        answer += hours.toString().padStart(2, "0") + ":";
    }
    answer += minutes.toString().padStart(2, "0") + ":";
    answer += seconds.toString().padStart(2, "0");
    return answer;
}


// Rendering
function renderOnboardingLines()
{
    let upperHintsAchievementsLineStart = document.getElementById('upper-hints-achievements-container');
    let upperHintsAchievementsLineEnd = document.getElementById('main-page-achievements-link');
    new LeaderLine(
        LeaderLine.pointAnchor(upperHintsAchievementsLineStart,
            {
                x: "30%", 
                y: "-10%"
            }
        ),
        LeaderLine.pointAnchor(upperHintsAchievementsLineEnd,
            {
                x: "50%", 
                y: "110%"
            }
        ),
        {
            color: "black",
            size: 2,
            path: "straight",
            startSocket: 'top', 
            endSocket: 'bottom',
        }
    );

    let upperHintsTasksLineStart = document.getElementById('upper-hints-tasks-container');
    let upperHintsTasksLineEnd = document.getElementById('main-page-tasks-link');
    new LeaderLine(
        LeaderLine.pointAnchor(upperHintsTasksLineStart,
            {
                x: "50%", 
                y: "-10%"
            }
        ),
        LeaderLine.pointAnchor(upperHintsTasksLineEnd,
            {
                x: "50%",
                // x: "70%", 
                y: "110%"
            }
        ),
        {
            color: "black",
            size: 2,
            path: "straight",
            startSocket: 'top', 
            endSocket: 'bottom',
        }
    );

    let upperHintsSettingsLineStart = document.getElementById('upper-hints-settings-container');
    let upperHintsSettingsLineEnd = document.getElementById('main-page-settings-link');
    new LeaderLine(
        LeaderLine.pointAnchor(upperHintsSettingsLineStart,
            {
                x: "70%", 
                y: "-10%"
            }
        ),
        LeaderLine.pointAnchor(upperHintsSettingsLineEnd,
            {
                x: "80%", 
                y: "110%"
            }
        ),
        {
            color: "black",
            size: 2,
            path: "straight",
            startSocket: 'top', 
            endSocket: 'bottom',
        }
    );

    let lowerHintsStreakDayLineStart = document.getElementById('lower-hints-streak-day-container');
    let lowerHintsStreakDayLineEnd = document.getElementById('main-page-streak-days-container');
    new LeaderLine(
        LeaderLine.pointAnchor(lowerHintsStreakDayLineStart,
            {
                x: "30%", 
                y: "120%"
            }
        ),
        LeaderLine.pointAnchor(lowerHintsStreakDayLineEnd,
            {
                x: "11.5%", 
                y: "-10%"
            }
        ),
        {
            color: "black",
            size: 2,
            path: "straight",
            startSocket: 'top', 
            endSocket: 'bottom',
        }
    );

    let lowerHintsTimerLineStart = document.getElementById('lower-hints-timer-container');
    let lowerHintsTimerLineEnd = document.getElementById('main-page-timer-button');
    new LeaderLine(
        LeaderLine.pointAnchor(lowerHintsTimerLineStart,
            {
                x: "10%", 
                y: "50%"
            }
        ),
        LeaderLine.pointAnchor(lowerHintsTimerLineEnd,
            {
                x: "100%", 
                y: "60%"
            }
        ),
        {
            color: "black",
            size: 2,
            path: "straight",
            startSocket: 'top', 
            endSocket: 'bottom',
        }
    );
}

function interpolateColor(rgbA, rgbB, value) 
{
    var rDiff = rgbA[0] - rgbB[0];
    var gDiff = rgbA[1] - rgbB[1];
    var bDiff = rgbA[2] - rgbB[2];
    value = 1 - value;
    return [
        rgbB[0] + rDiff * value,
        rgbB[1] + gDiff * value,
        rgbB[2] + bDiff * value
    ];
}

function rgbArrayToString(rgb) 
{
    return 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
}

function barColor(startingColor, finalColor, progress) 
{
    return interpolateColor(startingColor, finalColor, progress);
}

function renderDailyGoalProgressBar(currentDuration)
{
    let progress = currentDuration / dailyGoal;
    let startColor = "";
    let endColor = "";
    if (progress >= 1)
    {
        progress = 1;
        startColor = rgbArrayToString(overTimeRgbColor);
        endColor = startColor;
    }
    // if (progress > 1)
    // {
    //     progress = parseFloat(progress) / 1000;
    //     dailyGoalRgbColor = barColor(dailyGoalRgbColor, overTimeRgbColor, progress);
    //     startColor = rgbArrayToString(dailyGoalRgbColor);        
    //     endColor = rgbArrayToString(barColor(dailyGoalRgbColor, overTimeRgbColor, progress));
    //     progress = 1;
    // }
    else
    {
        startColor = currentDuration === 0 ? rgbArrayToString(startingRgbColor) : rgbArrayToString(barColor(startingRgbColor, dailyGoalRgbColor, progressBar.value()));
        endColor = progress === 0 ? rgbArrayToString(startingRgbColor) : rgbArrayToString(barColor(startingRgbColor, dailyGoalRgbColor, progress));
    } 

    progressBar.animate(progress, {
        from: {
            color: startColor
        },
        to: {
            color: endColor
        },
        step: function(state, bar) {
            bar.path.setAttribute('stroke', state.color);
        }
    });
}


// Getting or calculating data
function getCurrentDateString()
{
    let currentDate = new Date();
    return currentDate.getFullYear() + "-" + months[currentDate.getMonth()] + "-" + currentDate.getDate().toString().padStart(2, "0");
}

function getCoveredTopics(tasksCheckboxes)
{
    let coveredTopics = [];
    for (let i = 0; i < tasksCheckboxes.length; i++)
    {
        if (tasksCheckboxes[i].checked)
        {
            coveredTopics.push(tasksData.tasks.topics[i].task_name);
        }
    }
    return coveredTopics;
}

function calculateSessionStreak(data, sessionsLength)
{
    let streak = (sessionsLength === 0) ? 0 : 1;
    for (let i = 0; i < sessionsLength; i++)
    {
        if(sessionsLength - 1 - i >= 0 && sessionsLength - 2 - i >= 0)
        {
            let currentSessionDate = data.sessions[sessionsLength - 1 - i].date;
            let previousSessionDate = data.sessions[sessionsLength - 2 - i].date;
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

function getCurrentSessionLiveData()
{
    let session = sessionExample;
    let submitSessionOverlayFieldIntensityInput = document.getElementById("submit-session-overlay-field-intensity-input");
    let submitSessionOverlayFieldEngagementInput = document.getElementById("submit-session-overlay-field-engagement-input");
    let submitSessionOverlayFieldDifficultyInput = document.getElementById("submit-session-overlay-field-difficulty-input");
    let submitSessionOverlayFieldTextFeedbackTextarea = document.getElementById("submit-session-overlay-field-text-feedback-textarea");

    session.date = getCurrentDateString();
    session.pauses = parseInt(pauses);
    session.distractions = parseInt(distractions);
    session.duration = Math.round(timer.getTime() / 1000);
    session.daily_goal = dailyGoal;
    session.intensity = parseFloat(submitSessionOverlayFieldIntensityInput.value);
    session.engagement = parseFloat(submitSessionOverlayFieldEngagementInput.value);
    session.difficulty = parseFloat(submitSessionOverlayFieldDifficultyInput.value);
    session.covered_topics = getCoveredTopics(tasksCheckboxes);
    session.text_feedback = submitSessionOverlayFieldTextFeedbackTextarea.value;

    return session;
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
    return 'session_' + Math.random().toString(36).substr(2, 9);
}


// Update data
function updatePauses()
{
    let submitSessionOverlayFieldPauses = document.getElementById("submit-session-overlay-field-pauses");
    submitSessionOverlayFieldPauses.innerHTML = "Pauses: " + (pauses - 1);
}

function updateDistractions()
{
    let submitSessionOverlayFieldDistractions = document.getElementById("submit-session-overlay-field-distractions");
    submitSessionOverlayFieldDistractions.innerHTML = "Distarctions: " + distractions;
}

function updateDate()
{
    let submitSessionOverlayFieldDate = document.getElementById("submit-session-overlay-field-date");
    submitSessionOverlayFieldDate.innerHTML = "Date: " + getCurrentDateString();
}

function updateDuration()
{
    let submitSessionOverlayFieldDuration = document.getElementById("submit-session-overlay-field-duration");
    submitSessionOverlayFieldDuration.innerHTML = "Time: " + convertTimeToHumanReadableFormat(Math.round(timer.getTime() / 1000));
    $('#submit-session-overlay').show();
}

function clearPausesAndDistractions()
{
    pauses = 0;
    distractions = 0;
}

function clearDailyGoalAndPausesAndDistractions()
{
    dailyGoal = 3600;
    pauses = 0;
    distractions = 0;
}

function resetInputs()
{
    let inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(function(input) 
    {
        if (input.id !== "main-page-timer-daily-goal-input-seconds")
        {
            input.value = 0;
        }
        else
        {
            input.value = 1;
        }
    });

    inputs = document.querySelectorAll('textarea');
    inputs.forEach(function(input)
    {
        input.value = "";
    });
    let loginOverlayUserIdInput = document.getElementById("login-overlay-user-id-input");
    loginOverlayUserIdInput.value = "";
}

function validateInputsValues()
{
    let inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(function(input) 
    {
        input.addEventListener("change", () => {
            let isHoursOrMinutesIsMoreThanZero = false;
            if ($("#main-page-timer-daily-goal-input-hours").val() > 0 || $("#main-page-timer-daily-goal-input-minutes").val() > 0)
            {
                isHoursOrMinutesIsMoreThanZero = true;
            }
            if (input.id !== "main-page-timer-daily-goal-input-seconds")
            {
                if (input.value < 0)
                {
                    input.value = 0;
                }
            }
            else
            {
                if (input.value < 1 && !isHoursOrMinutesIsMoreThanZero)
                {
                    input.value = 1;
                }
                else if (input.value < 1 && isHoursOrMinutesIsMoreThanZero)
                {
                    input.value = 0;
                }
            }
            if (!isHoursOrMinutesIsMoreThanZero && $("#main-page-timer-daily-goal-input-seconds").val() < 1)
            {
                $("#main-page-timer-daily-goal-input-seconds").prop("value", 1);
            }
        });
    });

    inputs = document.querySelectorAll('textarea');
    inputs.forEach(function(input)
    {
        input.value = "";
    });
}

function disableLinks()
{
    let links = document.querySelectorAll('a');
    links.forEach(function(link) 
    {
        if (!link.hasAttribute('data-original-href')) 
        {
            link.setAttribute('data-original-href', link.getAttribute('href'));
        }
        link.setAttribute("href", "#" + link.getAttribute('href'));
        link.style.display = "none";
    });
}

function enableLinks()
{
    let links = document.querySelectorAll('a');
    links.forEach(function(link) 
    {
        if (link.hasAttribute('data-original-href')) 
        {
            link.setAttribute("href", link.getAttribute('data-original-href'));
            link.removeAttribute('data-original-href');
            link.style.display = "";
        }
    });
}

function addOrUpdateSession(newSession)
{
    let newSessionIndex = sessionData.sessions.map(session => session.date).indexOf(newSession.date);
    if (newSessionIndex !== -1)
    {
        let sessionToUpdate = sessionData.sessions[newSessionIndex];
        sessionToUpdate.pauses += newSession.pauses;
        sessionToUpdate.duration += newSession.duration;
        sessionToUpdate.daily_goal += newSession.daily_goal;
        sessionToUpdate.distractions += newSession.distractions;
        sessionToUpdate.intensity += newSession.intensity;
        sessionToUpdate.intensity /= 2;
        // sessionToUpdate.intensity = sessionToUpdate.intensity.toFixed(2);
        sessionToUpdate.engagement += newSession.engagement;
        sessionToUpdate.engagement /= 2;
        // sessionToUpdate.engagement = sessionToUpdate.engagement.toFixed(2);
        sessionToUpdate.difficulty += newSession.difficulty;
        sessionToUpdate.difficulty /= 2;
        // sessionToUpdate.difficulty = sessionToUpdate.difficulty.toFixed(2);

        let newCoveredTopics = newSession.covered_topics.filter(value => !sessionToUpdate.covered_topics.includes(value));
        sessionToUpdate.covered_topics.push(...newCoveredTopics);
        sessionToUpdate.covered_topics.sort(function(a, b) {
            return a - b;
        });
        sessionToUpdate.text_feedback += " " + newSession.text_feedback;
    }
    else
    {
        sessionData.sessions.push(newSession);
    }
    return sessionData;
}

function updateDailyGoal()
{
    let mainPageTimerDailyGoalInputsContainer = document.getElementById("main-page-timer-daily-goal-inputs-container");
    let answer = 0;
    answer += parseInt(mainPageTimerDailyGoalInputsContainer.children[0].value) * 3600;
    answer += parseInt(mainPageTimerDailyGoalInputsContainer.children[2].value) * 60;
    answer += parseInt(mainPageTimerDailyGoalInputsContainer.children[4].value);
    dailyGoal = answer;
}


// Create objects
function createCoveredTopicItem(index)
{
    let submitSessionOverlayFieldCoveredTopicsItem = document.createElement("div");
    submitSessionOverlayFieldCoveredTopicsItem.id = "submit-session-overlay-field-covered-topics-item-" + index;
    submitSessionOverlayFieldCoveredTopicsItem.className = "submit-session-overlay-field-covered-topics-item";
    
    let submitSessionOverlayFieldCoveredTopicsLabel = document.createElement("label");
    submitSessionOverlayFieldCoveredTopicsLabel.id = "submit-session-overlay-field-covered-topics-label-" + index;
    submitSessionOverlayFieldCoveredTopicsLabel.className = "submit-session-overlay-field-covered-topics-label";
    submitSessionOverlayFieldCoveredTopicsLabel.htmlFor = "covered-topic-" + index;
    submitSessionOverlayFieldCoveredTopicsLabel.innerHTML = tasksData.tasks.topics[index].task_name;

    let submitSessionOverlayFieldCoveredTopicsInput = document.createElement("input");
    submitSessionOverlayFieldCoveredTopicsInput.id = "submit-session-overlay-field-covered-topics-input-" + index;
    submitSessionOverlayFieldCoveredTopicsInput.className = "submit-session-overlay-field-covered-topics-input";
    submitSessionOverlayFieldCoveredTopicsInput.type = "checkbox";
    submitSessionOverlayFieldCoveredTopicsInput.name = "covered-topic-" + index;

    submitSessionOverlayFieldCoveredTopicsItem.appendChild(submitSessionOverlayFieldCoveredTopicsLabel);
    submitSessionOverlayFieldCoveredTopicsItem.appendChild(submitSessionOverlayFieldCoveredTopicsInput);

    return submitSessionOverlayFieldCoveredTopicsItem;
}

function createStreakDayContainer(id)
{
    let streakDayContainer = document.createElement("div");
    streakDayContainer.id = "streak-day-container-" + id;
    streakDayContainer.className = "streak-day-container";
    return streakDayContainer;
}

function createStreakDayDate(id)
{
    let streakDayDate = document.createElement("div");
    streakDayDate.id = "streak-day-date-" + id;
    streakDayDate.className = "streak-day-date";
    return streakDayDate;
}

function createStreakDaySessionDuration(id)
{
    let streakDaySessionDuration = document.createElement("div");
    streakDaySessionDuration.id = "streak-day-session-duration-" + id;
    streakDaySessionDuration.className = "streak-day-session-duration";
    return streakDaySessionDuration;
}

function createMainPageTimerDailyGoalBakedText()
{
    let mainPageTimerDailyGoalBakedText = document.createElement("div");
    mainPageTimerDailyGoalBakedText.id = "main-page-timer-daily-goal-baked-text";
    mainPageTimerDailyGoalBakedText.innerHTML = convertTimeToHumanReadableFormat(dailyGoal);
    return mainPageTimerDailyGoalBakedText;
}

function setCookie(name, value, days) 
{
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax;";
}


// API manipulation
function downloadSessionsJson(content, fileName, contentType) 
{
    let a = document.createElement("a");
    let file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href); 
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

async function fetchTasksDataAndHandleSubmitSession() 
{
    try
    {
        tasksCheckboxes = [];
        // let response = await fetch("../data/tasks.json");
        let response = await fetch(`/data/tasks?s=${getCookie("user_id")}`, {
            method: 'get',
            headers: new Headers({
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache, no-store, max-age=0'
            })
        });
        tasksData = await response.json();

        let session = sessionExample;
        let submitSessionOverlayFieldCoveredTopicsItemContainer = document.getElementById("submit-session-overlay-field-covered-topics-item-container");
        let submitSessionOverlaySaveButton = document.getElementById("submit-session-overlay-save-button");

        let timerFinishSession = document.getElementById("main-page-timer-finish-session");
        timerFinishSession.addEventListener('click', () => {
            updatePauses();
            updateDuration();            
            updateDistractions();
        });
        updateDate();

        for (let i = 0; i < tasksData.tasks.topics.length; i++)
        {
            let submitSessionOverlayFieldCoveredTopicsItem = createCoveredTopicItem(i);
            submitSessionOverlayFieldCoveredTopicsItemContainer.appendChild(submitSessionOverlayFieldCoveredTopicsItem);
            tasksCheckboxes.push(submitSessionOverlayFieldCoveredTopicsItem.children[1]);
        }

        await AchievementMethods.fetchDataAndCheckAchievementsStatuses();

        if (!didUserMovedBackFromOtherPage)
        {
            submitSessionOverlaySaveButton.addEventListener("click", async () => {
                pauses--;
                session = getCurrentSessionLiveData();

                sessionData = addOrUpdateSession(session);
                // downloadSessionsJson(JSON.stringify(sessionData), 'sessions.json', 'application/json')
                await postData(`/update/sessions?s=${getCookie("user_id")}`, JSON.stringify(sessionData));
                didUserTriedToGoToOtherPageOrSubmittedSession = true;
                setTimeout(function() 
                {
                    location.reload();
                }, 750);
            })
        }
    }
    catch (error)
    {
        console.log('Error fetching the JSON:', error);
    }
}

async function fetchSessionsDataAndHandleSessionsContainers()
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
        sessionData = await response.json();
        
        let mainPageStreakDaysContainer = document.getElementById("main-page-streak-days-container");
        let mainPageStreakCounterText = document.getElementById("main-page-streak-counter-text");
        let streakDayContainer = {};
        let streakDayDate = {};
        let streakDaySessionDuration = {};

        const sessionsLength = sessionData.sessions.length;
        let streakCounter = 0;
        let wasSessionDisruted = false;
        let daysBetweenCurrentDateAndFirstSession = 0;
        
        let sessionDatesParsed = [];

        let tempDate = new Date();
        tempDate.setHours(0, 0, 0, 0);
        let initialCurrentDateString = `${tempDate.getFullYear()}-${(tempDate.getMonth() + 1).toString().padStart(2, "0")}-${tempDate.getDate().toString().padStart(2, "0")}`;
        let currentDateParsed = Date.parse(initialCurrentDateString);

        if (sessionsLength != 0)
        {
            daysBetweenCurrentDateAndFirstSession = (currentDateParsed - Date.parse(sessionData.sessions[0].date)) / dayInMilliSeconds;
            sessionDatesParsed = sessionData.sessions.map(session => Date.parse(session.date));
        }

        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! Render all sessions from last session date till first date of session with all absent days !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

        for (let i = 0; i <= ((daysBetweenCurrentDateAndFirstSession < 7) ? 6 : daysBetweenCurrentDateAndFirstSession); i++) 
        {            
            streakDayContainer = createStreakDayContainer(i);
            streakDayDate = createStreakDayDate(i);          
            streakDaySessionDuration = createStreakDaySessionDuration(i);
            let currentDate = new Date(currentDateParsed);

            let currentDateIndexInSessionDates = sessionDatesParsed.indexOf(currentDateParsed);
            let currentDateString = currentDate.getFullYear() + "-" + months[currentDate.getMonth()] + "-" + currentDate.getDate().toString().padStart(2, "0");
            if (currentDateIndexInSessionDates === -1)
            {
                wasSessionDisruted = true;
                if (sessionsLength === 0 || currentDateParsed < Date.parse(sessionData.sessions[0].date))
                {
                    streakDayDate.innerHTML = "-";
                }
                else
                {
                    streakDayDate.innerHTML = currentDateString;
                }
                streakDaySessionDuration.innerHTML = "s-";
            }
            else
            {
                if (!wasSessionDisruted)
                {
                    streakCounter++;
                }
                if (sessionData.sessions[currentDateIndexInSessionDates].daily_goal <= sessionData.sessions[currentDateIndexInSessionDates].duration)
                {
                    streakDayContainer.classList.add("passed-goal");
                }
                else
                {
                    streakDayContainer.classList.add("not-passed-goal");
                }
                streakDayDate.innerHTML = sessionData.sessions[currentDateIndexInSessionDates].date;
                streakDaySessionDuration.innerHTML = convertTimeToHumanReadableFormat(sessionData.sessions[currentDateIndexInSessionDates].duration);
                recordedDays.push({
                    streakDayContainer: streakDayContainer,
                    streakIdInStreaks: currentDateIndexInSessionDates
                });
            }
            streakDayContainer.appendChild(streakDayDate);
            streakDayContainer.appendChild(streakDaySessionDuration);
            mainPageStreakDaysContainer.appendChild(streakDayContainer);

            currentDateParsed = currentDateParsed - (dayInMilliSeconds);
        }

        for (let j = 0; j < recordedDays.length; j++)
        {
            recordedDays[j].streakDayContainer.addEventListener('click', () => {
                if (timerCondition === "initial")
                {
                    didUserTriedToGoToOtherPageOrSubmittedSession = true;
                    window.location.href = `../day-info/index.html?sessionId=${recordedDays[j].streakIdInStreaks}`;
                }
            });
        }

        mainPageStreakCounterText.innerHTML = streakCounter + " days";
    } 
    catch (error) 
    {
        console.log('Error fetching the JSON:', error);
    }
}






window.addEventListener('pageshow', function (event) {
    if (event.persisted || performance.getEntriesByType("navigation")[0].type === 'back_forward') 
    {
        clearDailyGoalAndPausesAndDistractions();
        setTimeout(async function() 
        {
            didUserTriedToGoToOtherPageOrSubmittedSession = false;
            didUserMovedBackFromOtherPage = true;
            let submitSessionOverlayFieldCoveredTopicsItemContainer = document.getElementById("submit-session-overlay-field-covered-topics-item-container");
            submitSessionOverlayFieldCoveredTopicsItemContainer.innerHTML = "";
            await fetchTasksDataAndHandleSubmitSession();
            let mainPageStreakDaysContainer = document.getElementById("main-page-streak-days-container");
            mainPageStreakDaysContainer.innerHTML = "";
            await fetchSessionsDataAndHandleSessionsContainers();
        }, 500);
    }
});


let loginOverlayUserIdSubmitButton = document.getElementById("login-overlay-user-id-submit-button");
loginOverlayUserIdSubmitButton.addEventListener('click', async () => {
    let loginOverlayUserIdInput = document.getElementById("login-overlay-user-id-input");
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
        await fetchSessionsDataAndHandleSessionsContainers();
        await fetchTasksDataAndHandleSubmitSession();
        $("#login-overlay").hide();
        if (sessionStorage.getItem('visitedWelcomePage')) 
        {
            $('#onboarding-overlay').show();
            renderOnboardingLines();
            setTimeout(function() 
            {
                $('#onboarding-overlay').hide();
                $(".leader-line").hide();
            }, 5000);
            sessionStorage.removeItem('visitedWelcomePage');
        }
    }
});


let mainPageAchievementsLink = $("#main-page-achievements-link");
let mainPageTasksLink = $("#main-page-tasks-link");
let mainPageSettingsLink = $("#main-page-settings-link");

mainPageAchievementsLink.click(function() {
    didUserTriedToGoToOtherPageOrSubmittedSession = true;
});

mainPageTasksLink.click(function() {
    didUserTriedToGoToOtherPageOrSubmittedSession = true;
});

mainPageSettingsLink.click(function() {
    didUserTriedToGoToOtherPageOrSubmittedSession = true;
});


$('#submit-session-overlay').hide();
$('#onboarding-overlay').hide();

window.onload = async function() 
{  
    clearDailyGoalAndPausesAndDistractions();
    didUserTriedToGoToOtherPageOrSubmittedSession = false;
    $("#login-overlay").hide();
    $('#onboarding-overlay').hide();
    if (sessionStorage.getItem('userId')) 
    {
        userId = sessionStorage.getItem('userId');
        if (getCookie("user_id") !== userId)
        {
            setCookie("user_id", userId, 1);
        }
        await fetchSessionsDataAndHandleSessionsContainers();
        await fetchTasksDataAndHandleSubmitSession();
    }
    else
    {
        $("#login-overlay").show();
    }
    resetInputs();
    validateInputsValues();
}


let timerCondition = "initial";
let timerButton = $(".button");

timerButton.click(function() 
{
    let timerFinishSession = document.getElementById("main-page-timer-finish-session");
    let mainPageTimerDailyGoalInputsContainer = document.getElementById("main-page-timer-daily-goal-inputs-container");
    if (timerCondition === "initial")
    {   
        clearPausesAndDistractions();
        updateDailyGoal();
        mainPageTimerDailyGoalInputsContainer.innerHTML = "";
        let mainPageTimerDailyGoalBakedText = createMainPageTimerDailyGoalBakedText();
        mainPageTimerDailyGoalInputsContainer.appendChild(mainPageTimerDailyGoalBakedText);
        // enableLinks();
    }
    if (timerCondition === "initial" || timerCondition === "paused")
    {
        disableLinks();
        timerButton.toggleClass("paused");
        for (let i = 0; i < recordedDays.length; i++)
        {
            recordedDays[i].streakDayContainer.style.opacity = 0.3;
        }
        timer.start();
        setInterval(() => {
            const timeInSeconds = Math.round(timer.getTime() / 1000);
            renderDailyGoalProgressBar(timeInSeconds);
            document.getElementById('main-page-timer-text').innerText = formatTimeForTimer(timeInSeconds);
        }, 100);
        timerCondition = "started";
        timerFinishSession.style.display = "none";
    }
    else
    {
        timerButton.toggleClass("paused");
        timer.stop();
        timerCondition = "paused";
        timerFinishSession.style.display = "inline";
        pauses++;
    }
});



window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden")
    {
        distractions++;
        updateDistractions();
    }
});


let submitSessionOverlayClosingCross = document.getElementById("submit-session-overlay-cross");
submitSessionOverlayClosingCross.addEventListener("click", () => {
    $('#submit-session-overlay').hide();
});

window.onbeforeunload = function(e) {
    if (didUserTriedToGoToOtherPageOrSubmittedSession)
    {
        return;
    }
    didUserTriedToUnloadPage = true;
    return 'Please double check your actions.';
};
