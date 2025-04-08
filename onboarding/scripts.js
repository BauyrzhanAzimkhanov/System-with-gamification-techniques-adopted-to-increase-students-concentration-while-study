$(document).ready(function() 
{
    $('#onboarding-overlay').show();
    setTimeout(function() 
    {
        $('#onboarding-overlay').hide();
        $(".leader-line").hide();
    }, 5000);
    
});
var upperHintsAchivementsLineStart = document.getElementById('upper-hints-achivements-container');
var upperHintsAchivementsLineEnd = document.getElementById('main-page-achivements-link');
new LeaderLine(
    LeaderLine.pointAnchor(upperHintsAchivementsLineStart,
        {
            x: "30%", 
            y: "-10%"
        }
    ),
    LeaderLine.pointAnchor(upperHintsAchivementsLineEnd,
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


var upperHintsProgresssLineStart = document.getElementById('upper-hints-progress-container');
var upperHintsProgressLineEnd = document.getElementById('main-page-progress-link');
new LeaderLine(
    LeaderLine.pointAnchor(upperHintsProgresssLineStart,
        {
            x: "50%", 
            y: "-10%"
        }
    ),
    LeaderLine.pointAnchor(upperHintsProgressLineEnd,
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


var upperHintsSettingsLineStart = document.getElementById('upper-hints-settings-container');
var upperHintsSettingsLineEnd = document.getElementById('main-page-settings-link');
new LeaderLine(
    LeaderLine.pointAnchor(upperHintsSettingsLineStart,
        {
            x: "70%", 
            y: "-10%"
        }
    ),
    LeaderLine.pointAnchor(upperHintsSettingsLineEnd,
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


var lowerHintsStreakDayLineStart = document.getElementById('lower-hints-streak-day-container');
var lowerHintsStreakDayLineEnd = document.getElementById('main-page-streak-day-first');
new LeaderLine(
    LeaderLine.pointAnchor(lowerHintsStreakDayLineStart,
        {
            x: "30%", 
            y: "120%"
        }
    ),
    LeaderLine.pointAnchor(lowerHintsStreakDayLineEnd,
        {
            x: "50%", 
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


var lowerHintsTimerLineStart = document.getElementById('lower-hints-timer-container');
var lowerHintsTimerLineEnd = document.getElementById('main-page-timer-button');
new LeaderLine(
    LeaderLine.pointAnchor(lowerHintsTimerLineStart,
        {
            x: "7%", 
            y: "50%"
        }
    ),
    LeaderLine.pointAnchor(lowerHintsTimerLineEnd,
        {
            x: "110%", 
            y: "50%"
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

