let timerTime;
let counter;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.msg === 'start-timer'){
        timerTime = message.num;
        timer2(timerTime);
    }
    else if (message.msg === 'get-time'){
        sendResponse({num: timerTime});
    }
    else if (message.msg === 'stop-timer'){
        clearInterval(counter);
    }
    else if (message.msg === 'resume-timer'){
        timer2(timerTime);
    }
    else {
        return null;
    }
    return true;
});

function timer2(time){
    if (time > 0){
        counter = setInterval(() => {
            timerTime = time;
            time--;
            if (time === 0){
                clearInterval(counter);
                timerTime = null;
            }
        }, 1000)
    }
}