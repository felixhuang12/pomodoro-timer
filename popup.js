let startStop = document.querySelector('#startStop');
let reset = document.querySelector('#reset');
let option1 = document.querySelector('#option1');
let option2 = document.querySelector('#option2');
option1.addEventListener('click', () => initialDisplay(5));
option2.addEventListener('click', () => initialDisplay(60));
let min;
let sec;
let count;

chrome.runtime.sendMessage({msg: 'get-time'}, response => {
    if (response.num){
        timer(response.num);
        document.getElementById("startStop").innerHTML = "Stop";
    }
});

function initialDisplay(time){
    min = Math.floor((time/60));
    sec = time;
    document.getElementById("timer").innerHTML = `${min}:00`;
}

function begin(time){
    chrome.runtime.sendMessage({msg: 'start-timer', num: time});
    timer(time);
}

startStop.addEventListener('click', startStopHandler);

function startStopHandler(){
    let temp = document.getElementById("startStop").innerHTML;
    if (temp === "Start"){
        begin(sec);
        document.getElementById("startStop").innerHTML = 'Stop';
    }
    else if (temp === "Stop"){
        document.getElementById("startStop").innerHTML = 'Resume';
        clearInterval(count);
        chrome.runtime.sendMessage({msg: 'stop-timer'});
    }
    else if (temp === "Resume"){
        timer(sec);
        document.getElementById("startStop").innerHTML = 'Stop';
        chrome.runtime.sendMessage({msg: 'resume-timer'});
    }
    else {
        return null;
    }
}
reset.addEventListener('click', () => {
    initialDisplay(1500);
    document.getElementById("startStop").innerHTML = 'Start';
})

function timer(time){
    if (time > 0){
        count = setInterval(() => {
            let minutesLeft = Math.floor(time/60);
            let secondsLeft = Math.floor(time%60);
            min = minutesLeft;
            sec = secondsLeft;
            time--;
            if (minutesLeft < 0 && secondsLeft < 0){
                clearInterval(count);
                setTimeout(() => {
                    alert('Break time! Click');
                }, 500);
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