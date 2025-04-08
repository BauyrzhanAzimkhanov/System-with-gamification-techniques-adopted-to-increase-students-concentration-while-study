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

export function createAchievementContainer(id, achievementRarity)
{
    let achievementContainer = document.createElement("div");
    achievementContainer.id = "achievement-container-" + id;
    achievementContainer.className = `achievement-container ${achievementRarity}`;
    return achievementContainer;
}

export function createAchievementTextContainer(id)
{
    let achievementTextContainer = document.createElement("div");
    achievementTextContainer.id = "achievement-text-container-" + id;
    achievementTextContainer.className = "achievement-text-container";
    return achievementTextContainer;
}

export function createAchievementName(id, achievementNameText)
{
    let achievementName = document.createElement("div");
    achievementName.id = "achievement-name-" + id;
    achievementName.className = "achievement-name";
    achievementName.innerHTML = achievementNameText;
    return achievementName;
}

export function createAchievementDescription(id, achievementDescriptionText)
{
    let achievementDescription = document.createElement("div");
    achievementDescription.id = "achievement-description-" + id;
    achievementDescription.className = "achievement-description";
    achievementDescription.innerHTML = achievementDescriptionText;
    return achievementDescription;
}

export function createAchievementIcon(id, achievementRarity)
{
    let achievementIcon = document.createElement("div");
    achievementIcon.id = "achievement-icon-" + id;
    achievementIcon.className = "achievement-icon";
    achievementIcon.classList.add(achievementRarity);
    return achievementIcon;
}

export function getHasUserEarnedAllAchievements(data, achievementsLength)
{
    const achievements = data.achievements;
    
    for (let i = 0; i < achievementsLength - 1; i++)
    {
        if (achievements[i].status !== "finished")
        {
            return false;
        }
    }
    return true;
}

export function getIsThereAtLeastThreeCoveredTopicsDuringSesssion(data, sessionsLength)
{
    const sessions = data.sessions;

    for (let i = 0; i < sessionsLength; i++)
    {
        if (sessions[i].covered_topics.length >= 3)
        {
            return true;
        }
    }
    return false;
}

export function getDidUserCompleteAllTasks(data, tasksLength)
{
    const tasks = data.tasks.topics;
    let completedTasksNumber = 0;

    for (let i = 0; i < tasksLength; i++)
    {
        if (tasks[i].is_finished)
        {
            completedTasksNumber++;
            continue;
        }
    }

    if (completedTasksNumber === tasksLength)
    {
        return true;
    }
    
    return false;
}

export function getDidUserAddFirstTaskToList(data, tasksLength)
{
    const tasks = data.tasks.topics;

    if (tasksLength >= 1 && tasks[0].task_name !== "Edit me" && tasks[0].task_name !== "")
    {
        return true;
    }

    return false;
}

export function getIsThereAnyAtLeastFourHoursDailyGoalSession(data, sessionsLength)
{
    const sessions = data.sessions;
    
    for (let i = 0; i < sessionsLength; i++) 
    {
        if (sessions[i].daily_goal >= (3600 * 4)) 
        {
            return true;
        }
    }
    
    return false;   
}

export function getIsThereAnyAtLeastThreeHourSessionWithNoDistractionsAndPausesBelowThree(data, sessionsLength)
{
    const sessions = data.sessions;
    
    for (let i = 0; i < sessionsLength; i++) 
    {
        if (sessions[i].duration >= (3600 * 3) && sessions[i].distractions === 0 && sessions[i].pauses < 3) 
        {
            return true;
        }
    }
    
    return false;
}

export function getIsThereAnySessionWithNoPausesAndDistractions(data, sessionsLength)
{
    const sessions = data.sessions;
    
    for (let i = 0; i < sessionsLength; i++) 
    {
        if (sessions[i].distractions + sessions[i].pauses === 0) 
        {
            return true;
        }
    }
    
    return false;
}

export function getIsThereAnySessionWithTotalNumberOfPausesAndDistractionsBelowThree(data, sessionsLength)
{
    const sessions = data.sessions;
    
    for (let i = 0; i < sessionsLength; i++) 
    {
        if (parseInt(sessions[i].distractions) + parseInt(sessions[i].pauses) < 3) 
        {
            return true;
        }
    }
    
    return false;
}

export function getIsThereNSessionsWithReachedDailyGoals(data, sessionsLength, n) 
{
    const sessions = data.sessions;
    let reachedCount = 0;
    
    for (let i = 0; i < sessionsLength; i++) 
    {
        if (sessions[i].duration >= sessions[i].daily_goal) 
        {
            reachedCount++;
            if (reachedCount === n) 
            {
                return true;
            }
        }
    }
    
    return false;
}

export function getIsThereStreakOfFiveSessionsWithoutDistractions(data, sessionsLength) 
{
    const sessions = data.sessions;
    let currentStreak = 0;
    
    for (let i = sessionsLength - 1; i >= 0; i--) 
    {
        if (sessions[i].distractions !== 0) 
        {
            currentStreak = 0;
            continue;
        }
        
        if (i === sessionsLength - 1) 
        {
            currentStreak = 1;
        } 
        else 
        {
            const currentSessionDate = new Date(sessions[i].date);
            const nextSessionDate = new Date(sessions[i + 1].date);
            const diffDays = (nextSessionDate - currentSessionDate) / (1000 * 3600 * 24);

            if (diffDays === 1) 
            {
                currentStreak++;
            } 
            else 
            {
                currentStreak = 1;
            }
        }
        
        if (currentStreak === 5)
        {
            return true;
        }
    }
    
    return false;
}

export function getLongestSessionsStreakInfo(data, sessionsLength) 
{
    if (sessionsLength === 0) 
    {
        return {
            longestStreak: 0,
            cumulativeDistractions: 0,
            cumulativePauses: 0,
            reachedDailyGoalCount: 0
        };
    }
    
    const sessions = data.sessions;

    let bestStreak = 1;
    let bestDistractions = sessions[sessionsLength - 1].distractions;
    let bestPauses = sessions[sessionsLength - 1].pauses;
    let bestDailyGoals = sessions[sessionsLength - 1].duration >= sessions[sessionsLength - 1].daily_goal ? 1 : 0;
    
    let currentStreak = 1;
    let currentDistractions = sessions[sessionsLength - 1].distractions;
    let currentPauses = sessions[sessionsLength - 1].pauses;
    let currentDailyGoals = sessions[sessionsLength - 1].duration >= sessions[sessionsLength - 1].daily_goal ? 1 : 0;
    
    for (let i = sessionsLength - 2; i >= 0; i--) 
    {
        const currentSessionDate = new Date(sessions[i].date);
        const nextSessionDate = new Date(sessions[i + 1].date);
        
        const diffDays = (nextSessionDate - currentSessionDate) / (1000 * 3600 * 24);
        
        if (diffDays === 1)
        {
            currentStreak++;
            currentDistractions += sessions[i].distractions;
            currentPauses += sessions[i].pauses;
            if (sessions[i].duration >= sessions[i].daily_goal)
            {
                currentDailyGoals++;
            }
        } 
        else 
        {
            if (currentStreak > bestStreak) 
            {
                bestStreak = currentStreak;
                bestDistractions = currentDistractions;
                bestPauses = currentPauses;
                bestDailyGoals = currentDailyGoals;
            }
            currentStreak = 1;
            currentDistractions = sessions[i].distractions;
            currentPauses = sessions[i].pauses;
            currentDailyGoals = sessions[i].duration >= sessions[i].daily_goal ? 1 : 0;
        }
    }
    
    if (currentStreak > bestStreak) 
    {
        bestStreak = currentStreak;
        bestDistractions = currentDistractions;
        bestPauses = currentPauses;
        bestDailyGoals = currentDailyGoals;
    }
    
    return {
        "longestStreak": bestStreak,
        "cummulativeDistractionsForLongestStreak": bestDistractions,
        "cumulativePausesForLongestStreak": bestPauses,
        "reachedDailyGoalCount": bestDailyGoals
    };
}

export async function launchAchivementFullLifeCyle(achievementId, achievementsData)
{
    achievementsData.achievements[achievementId].status = "finished";
    achievementsData.achievements[achievementId].finish_time = Date.now();
    await postData(`/update/achievements?s=${getCookie("user_id")}`, JSON.stringify(achievementsData));

    let achievementsOverlayMainContainer = document.getElementById("achievements-overlay-main-container");

    let id = achievementsOverlayMainContainer.children.length;
    let achievementRarity = achievementsData.achievements[achievementId].rarity;
    let achievementNameText = achievementsData.achievements[achievementId].name;
    let achievementDescriptionText = achievementsData.achievements[achievementId].description;

    let achievementContainer = createAchievementContainer(id, achievementRarity);
    let achievementTextContainer = createAchievementTextContainer(id);
    let achievementName = createAchievementName(id, achievementNameText);
    let achievementDescription = createAchievementDescription(id, achievementDescriptionText);
    let achievementIcon = createAchievementIcon(id, achievementRarity);

    achievementTextContainer.appendChild(achievementName);
    achievementTextContainer.appendChild(achievementDescription);
    achievementContainer.appendChild(achievementTextContainer);
    achievementContainer.appendChild(achievementIcon);

    achievementsOverlayMainContainer.appendChild(achievementContainer);
    $(`#achievement-container-${id}`).fadeOut(4000);
    setTimeout(function()
    {
        achievementsOverlayMainContainer.removeChild(achievementContainer);
    }, 4000);
}

export async function fetchDataAndCheckAchievementsStatuses()
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
        let sessionData = await response.json();

        response = await fetch(`/data/achievements?s=${getCookie("user_id")}`, {
            method: 'get',
            headers: new Headers({
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache, no-store, max-age=0'
            })
        });
        let achievementsData = await response.json();

        response = await fetch(`/data/tasks?s=${getCookie("user_id")}`, {
            method: 'get',
            headers: new Headers({
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache, no-store, max-age=0'
            })
        });
        let tasksData = await response.json();

        const sessionsLength = sessionData.sessions.length;
        const tasksLength = tasksData.tasks.topics.length;
        const achievementsLength = achievementsData.achievements.length;

        let longestStreak = getLongestSessionsStreakInfo(sessionData, sessionsLength).longestStreak;
        let isThereStreakOfFiveSessionsWithoutDistractions = getIsThereStreakOfFiveSessionsWithoutDistractions(sessionData, sessionsLength);
        let isThereFifteenSessionsWithReachedDailyGoals = getIsThereNSessionsWithReachedDailyGoals(sessionData, sessionsLength, 15);
        let isThereThirtySessionsWithReachedDailyGoals = getIsThereNSessionsWithReachedDailyGoals(sessionData, sessionsLength, 30);
        let isThereAnySessionWithTotalNumberOfPausesAndDistractionsBelowThree = getIsThereAnySessionWithTotalNumberOfPausesAndDistractionsBelowThree(sessionData, sessionsLength);
        let isThereAnySessionWithNoPausesAndDistractions = getIsThereAnySessionWithNoPausesAndDistractions(sessionData, sessionsLength);
        let isThereAnyAtLeastThreeHourSessionWithNoDistractionsAndPausesBelowThree = getIsThereAnyAtLeastThreeHourSessionWithNoDistractionsAndPausesBelowThree(sessionData, sessionsLength);
        let isThereAnyAtLeastFourHoursDailyGoalSession = getIsThereAnyAtLeastFourHoursDailyGoalSession(sessionData, sessionsLength);
        let didUserAddFirstTaskToList = getDidUserAddFirstTaskToList(tasksData, tasksLength);
        let didUserCompleteAllTasks = getDidUserCompleteAllTasks(tasksData, tasksLength);
        let isThereAtLeastThreeCoveredTopicsDuringSesssion = getIsThereAtLeastThreeCoveredTopicsDuringSesssion(sessionData, sessionsLength);
        let hasUserEarnedAllAchievements = getHasUserEarnedAllAchievements(achievementsData, achievementsLength);

        if (sessionsLength >= 1 && achievementsData.achievements[0].status !== "finished")
        {
            await launchAchivementFullLifeCyle(0, achievementsData);
        }
        if (sessionsLength >= 2 && longestStreak >= 2 && achievementsData.achievements[1].status !== "finished")
        {
            await launchAchivementFullLifeCyle(1, achievementsData);
        }
        if (sessionsLength >= 5 && isThereStreakOfFiveSessionsWithoutDistractions && achievementsData.achievements[2].status !== "finished")
        {
            await launchAchivementFullLifeCyle(2, achievementsData);
        }
        if (sessionsLength >= 15 && isThereFifteenSessionsWithReachedDailyGoals && achievementsData.achievements[3].status !== "finished")
        {
            await launchAchivementFullLifeCyle(3, achievementsData);
        }
        if (sessionsLength >= 30 && isThereThirtySessionsWithReachedDailyGoals && achievementsData.achievements[4].status !== "finished")
        {
            await launchAchivementFullLifeCyle(4, achievementsData);
        }
        if (sessionsLength >= 1 && isThereAnySessionWithTotalNumberOfPausesAndDistractionsBelowThree && achievementsData.achievements[5].status !== "finished")
        {
            await launchAchivementFullLifeCyle(5, achievementsData);
        }
        if (sessionsLength >= 1 && isThereAnySessionWithNoPausesAndDistractions && achievementsData.achievements[6].status !== "finished")
        {
            await launchAchivementFullLifeCyle(6, achievementsData);
        }
        if (sessionsLength >= 1 && isThereAnyAtLeastThreeHourSessionWithNoDistractionsAndPausesBelowThree && achievementsData.achievements[7].status !== "finished")
        {
            await launchAchivementFullLifeCyle(7, achievementsData);
        }
        if (sessionsLength >= 1 && isThereAnyAtLeastFourHoursDailyGoalSession && achievementsData.achievements[8].status !== "finished")
        {
            await launchAchivementFullLifeCyle(8, achievementsData);
        }
        if (tasksLength >= 1 && didUserAddFirstTaskToList && achievementsData.achievements[9].status !== "finished")
        {
            await launchAchivementFullLifeCyle(9, achievementsData);
        }
        if (tasksLength >= 1 && didUserCompleteAllTasks && achievementsData.achievements[10].status !== "finished")
        {
            await launchAchivementFullLifeCyle(10, achievementsData);
        }
        if (sessionsLength >= 1 && isThereAtLeastThreeCoveredTopicsDuringSesssion && achievementsData.achievements[11].status !== "finished")
        {
            await launchAchivementFullLifeCyle(11, achievementsData);
        }
        if (sessionsLength >= 1 && tasksLength >= 1 && hasUserEarnedAllAchievements && achievementsData.achievements[12].status !== "finished")
        {
            await launchAchivementFullLifeCyle(12, achievementsData);
        }
    } 
    catch (error) 
    {
        console.log('Error fetching the JSON:', error);
    }
}