let timerTime, fixedTime, fixedBreak, periodType, counter;
let flag = false;

chrome.storage.sync.get(['key'], result => {
    fixedTime = result.key.sessionTime;
    fixedBreak = result.key.brTime;
    console.log(`${fixedTime} and ${fixedBreak}`);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.msg === 'start-timer'){
        timerTime = message.num;
        periodType = 'Study Period';
        notif(timerTime);
    }
    else if (message.msg === 'reset'){
        timerTime = null;
        counter = null;
        clearInterval(counter);
        periodType = '';
        console.log('reset');
    }
    else if (message.msg === 'get-time'){
        sendResponse({num: timerTime, period: periodType});
    }
    else if (message.msg === 'stop-timer'){
        clearInterval(counter);
        console.log('stop');
    }
    else if (message.msg === 'resume-timer'){
        timerTime = message.num;
        notif(timerTime);
    }
    return true;
});

function notif(time){
    clearInterval(counter);
    if (time > 0){
        counter = setInterval(() => {
            timerTime = time;
            time--;
            if (time === 0){
                clearInterval(counter);
                if (!flag){
                    chrome.notifications.create({
                        type: 'basic',
                        iconUrl: '/icons/icon-128.png',
                        title: 'Break Time',
                        message: 'Break coming up!'
                    });
                    flag = true;
                    periodType = 'Break Period';
                    setTimeout(() => {notif(fixedBreak)}, 1000);
                    console.log(`${fixedBreak}`);
                }
                else {
                    chrome.notifications.create({
                        type: 'basic',
                        iconUrl: '/icons/icon-128.png',
                        title: 'Study Time',
                        message: 'Another session coming up!'
                    });
                    flag = false;
                    periodType = 'Study Period';
                    setTimeout(() => {notif(fixedTime)}, 1000);
                    console.log(`${fixedTime}`);
                }
                timerTime = null;
            }
        }, 1000)
    }
}