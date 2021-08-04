let totalTime, count, sessTime, breakTime, sessType;
const timeSettings = {};
let breakFlag = false;
let startStop = document.querySelector('#startStop');
let reset = document.querySelector('#reset');
let option1 = document.querySelector('#option1');
let option2 = document.querySelector('#option2');

option1.addEventListener('click', function() {
    initialSettings(1500, 300);
});

option2.addEventListener('click', () => {
    initialSettings(3000, 600);
});

reset.addEventListener('click', () => {
    getInitialTime();
    document.getElementById("startStop").innerHTML = 'Start';
    chrome.runtime.sendMessage({msg: 'reset'});
    clearInterval(count);
})

function initialSettings(sessTime, brkTime){
    timeSettings.sessionTime = sessTime;
    timeSettings.brTime = brkTime;
    totalTime = sessTime;
    storeTime();
    getInitialTime();
}

function storeTime(){
    chrome.storage.sync.set({key: timeSettings}); 
}

function getInitialTime(){
    chrome.storage.sync.get(['key'], result => {
        let min = Math.floor(result.key.sessionTime/60);
        totalTime = result.key.sessionTime;
        breakTime = result.key.brTime;
        sessTime = totalTime;
        document.getElementById("timer").innerHTML = `${min}:00`;
        document.getElementById("label").innerHTML = 'Study Period';
    });
}

chrome.runtime.sendMessage({msg: 'get-time'}, response => {
    if (response.num){
        timer(response.num);
        document.getElementById("startStop").innerHTML = "Stop";
        sessType = response.period;
        document.getElementById("label").innerHTML = `${sessType}`;
    }
    else {
        getInitialTime();
    }
});

function begin(time){
    chrome.runtime.sendMessage({msg: 'start-timer', num: time});
    timer(time);
}

startStop.addEventListener('click', startStopHandler);

function startStopHandler(){
    let temp = document.getElementById("startStop").innerHTML;
    if (temp === "Start"){
        begin(totalTime);
        document.getElementById("startStop").innerHTML = 'Stop';
    }
    else if (temp === "Stop"){
        document.getElementById("startStop").innerHTML = 'Resume';
        clearInterval(count);
        chrome.runtime.sendMessage({msg: 'stop-timer'});
    }
    else if (temp === "Resume"){
        chrome.runtime.sendMessage({msg: 'resume-timer', num: totalTime});
        timer(totalTime);
        document.getElementById("startStop").innerHTML = 'Stop';
    }
    else {
        return null;
    }
}

function timer(time){
    if (time > 0){
        count = setInterval(() => {
            let minutesLeft = Math.floor(time/60);
            let secondsLeft = Math.floor(time%60);
            totalTime = time;
            time--;
            if (minutesLeft < 0 && secondsLeft < 0){
                clearInterval(count);
                if (!breakFlag){
                    sessType = 'Break Period';
                    document.getElementById("label").innerHTML = `${sessType}`;
                    setTimeout(() => {begin(breakTime)}, 1000);
                    breakFlag = true;
                }
                else {
                    sessType = 'Study Period';
                    document.getElementById("label").innerHTML = `${sessType}`;
                    setTimeout(() => {begin(sessTime)}, 1000);
                    breakFlag = false;
                }  
            }
            else if (secondsLeft < 10){
                document.getElementById("timer").innerHTML = `${minutesLeft}:0${secondsLeft}`;
            }
            else {
                document.getElementById("timer").innerHTML = `${minutesLeft}:${secondsLeft}`;
            }
        }, 1000)
    }
}