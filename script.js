const html = document.querySelector("html");
const focusBt = document.querySelector(".task-timer-button-focus");
const shortBt = document.querySelector(".task-timer-button-short");
const longBt = document.querySelector(".task-timer-button-long");
const imgBanner = document.querySelector(".banner__img");
const bannerTitle = document.querySelector(".banner__text");
const timer = document.querySelector(".task_focus-timer");
const buttons = document.querySelectorAll(".task__option__buttons");
const musicFocusInput = document.querySelector("#task__switch-button");
const startPauseBt = document.querySelector('#button__start-pause');
const startPauseImg = document.querySelector('#button-start-pause-img');
const startPauseLb = document.querySelector('#button-start-pause-bt');

let contextGlobal = "focus";
let contextflag = "F";
//MUSIC
const music = new Audio("../assets/music/luna-rise-part-one.mp3");//guarda o arquivo em variaveis - recomendado
const audioPlay = new Audio("../assets/music/Play.wav");
const audioStop = new Audio("../assets/music/Stop.mp3");
const audioBeep = new Audio("../assets/music/Beep.mp3");
const audioCount = new Audio("../assets/music/Countdown.mp3");
music.loop = true; //mantem a musica em loop infinito
const btMinus = document.querySelector("#bt-minus");
const btPlus = document.querySelector("#bt-plus");
let vol = 0.2;
let beepVol = 1;
const valVol = 0.1;
//TIMER
let countDownSec = 60;
let focusTimerMin = 24;
let shortTimerMin = 4;
let longTimerMin = 14;
let intervalId = null;
let startFlag = true;



// TREAT CONTEXT APP
focusBt.addEventListener("click", () => {
    contextGlobal = "focus";
    changeContext(contextGlobal, "focus-bubbles", "img_focus", "normal");
    focusBt.classList.add("active");
    
});

shortBt.addEventListener("click", () => {
    contextGlobal = "short";
    changeContext(contextGlobal, "short-bubbles", "img_short_rest", "screen");
    shortBt.classList.add("active");
});

longBt.addEventListener("click", () => {
    contextGlobal = "long";
    changeContext(contextGlobal, "img_long_rest", "long-bubbles", "screen");
    longBt.classList.add("active");
});

function changeContext(context, imgContext, bgContext, mode){
    html.setAttribute("data-context", context);
    imgBanner.setAttribute("src", `../assets/img/images/${imgContext}.svg`)
    imgBanner.style.backgroundImage = `url("../assets/img/images/${bgContext}.png")`;
    imgBanner.style.mixBlendMode = mode;
    
    buttons.forEach(function(context){
        context.classList.remove("active");
    });
    
    switch(context){
        case "focus":
            bannerTitle.innerHTML = "<p>Optimize your productivity,<strong> immerse yourself in what matters</strong></p>";
            focusBt.setAttribute("id", "active");
            if (focusTimerMin == 24 && countDownSec == 60){
                timer.innerHTML = "<h2>25:00</h2>";
            }else if ((focusTimerMin != 0 || countDownSec != 0) && contextflag != "F"){
                focusTimerMin = 24;
                countDownSec = 60;
                contextflag = "F";
                timer.innerHTML = "<h2>25:00</h2>";
            }else{
                countDownTimer(focusTimerMin, countDownSec);
            };
            break;
        case "short":
            bannerTitle.innerHTML = "<p>How about taking a short break?<strong> Take a short break to relax!</strong></p>";
            shortBt.setAttribute("id", "active");
            if (shortTimerMin == 4 && countDownSec == 60){
                timer.innerHTML = "<h2>05:00</h2>";
            }else if ((shortTimerMin != 0 || countDownSec != 0) && contextflag != "S"){
                shortTimerMin = 4;
                countDownSec = 60;
                contextflag = "S";
                timer.innerHTML = "<h2>05:00</h2>";
            }else{
                countDownTimer(shortTimerMin, countDownSec);
            };
            break;
        case "long":
            bannerTitle.innerHTML = "<p>Time to return to the surface.<br><strong> Take a long break and enjoy!</strong></p>";
            longBt.setAttribute("id", "active");
            if (longTimerMin == 14 && countDownSec == 60){
                timer.innerHTML = "<h2>15:00</h2>";
            }else if ((longTimerMin != 0 || countDownSec != 0) && contextflag != "L"){
                longTimerMin = 14;
                countDownSec = 60;
                contextflag = "L";
                timer.innerHTML = "<h2>15:00</h2>";
            }else{
                countDownTimer(longTimerMin, countDownSec);
            };
            break;
        default:
            break;
    };
};

// TREAT MUSIC EVENT
musicFocusInput.addEventListener("change", () => {
    if(music.paused){
        music.play();
        music.volume = vol; // define volume de 0 a 1 onde 0.5 e igual a 50% e 1 igual 100%
    }else{
        music.pause();
    }
});

//TREAT VOLUME
btMinus.addEventListener("click", () => {
   if(vol >= 0.1){
        vol = vol - valVol;
        music.volume = vol.toFixed(1);
    } 
});

btPlus.addEventListener("click", () => {
    if(vol <= 0.9){
        vol = vol + valVol;
        music.volume = vol.toFixed(1);
    }
});

//TREAT TIMER
function countDownTimer(minutes, seconds){
    
    if (minutes == 0 && seconds == 0) {
        timer.innerHTML = `<h2>0${minutes}:0${seconds}</h2>`;
        pauseTimer();
        seconds = 60;
        if(contextGlobal == "focus"){
            minutes = 24;
        }else if (contextGlobal == "short"){
            minutes = 4;
        }else{
            minutes = 14;
        }
        audioCount.pause();
        audioCount.currentTime = 0; // restart from 0 sec the audio
        audioBeep.play();
        audioBeep.volume = beepVol;
        startPauseImg.setAttribute("src", "./assets/img/icones/play_arrow.png");
        startPauseLb.textContent = 'Start';
        startFlag = true;

    }else if (minutes > 9 && seconds > 9){
        timer.innerHTML = `<p>${minutes}:${seconds}</p>`;

    }else if (minutes > 9 && seconds < 10 && seconds > 0){
        timer.innerHTML = `<p>${minutes}:0${seconds}</p>`;

    }else if (minutes < 10 && seconds > 9){
        timer.innerHTML = `<p>0${minutes}:${seconds}</p>`;
        if (minutes == 0 && seconds == 10){
            audioCount.play();
        };
    }else if (minutes < 10 && seconds < 10 && seconds > 0){
        timer.innerHTML = `<p>0${minutes}:0${seconds}</p>`;

    }else if (minutes > 9 && seconds == 0){
        timer.innerHTML = `<p>${minutes}:0${seconds}</p>`;
        minutes -= 1;

    }else if (minutes < 10 && seconds == 0){
        timer.innerHTML = `<p>0${minutes}:0${seconds}</p>`;
        minutes -= 1;
    };

    return minutes;

};

const countDown = () => {
    countDownSec -= 1;
    
    switch(contextGlobal){
        case 'focus':
            if (countDownSec != 0){
                focusTimerMin = countDownTimer(focusTimerMin, countDownSec);
            }else{
                focusTimerMin = countDownTimer(focusTimerMin, countDownSec);
                countDownSec = 60;
            };
            
            break;
        case 'short':
            if (countDownSec != 0){
                shortTimerMin = countDownTimer(shortTimerMin, countDownSec);
            }else{
                shortTimerMin = countDownTimer(shortTimerMin, countDownSec);
                countDownSec = 60;
            };

            break;
        case 'long':
            if (countDownSec != 0){
                longTimerMin = countDownTimer(longTimerMin, countDownSec);
            }else{
                longTimerMin = countDownTimer(longTimerMin, countDownSec);
                countDownSec = 60;
            };

            break;
        default:
            break;
    };
};


startPauseBt.addEventListener('click', () => {
    if (startFlag){
        startPauseImg.setAttribute("src", "../assets/img/icones/pause.png");
        startPauseLb.textContent = 'Pause';
        audioPlay.play();
        startTimer();
        startFlag = false;
    }else{
        startPauseImg.setAttribute("src", "../assets/img/icones/play_arrow.png");
        startPauseLb.textContent = 'Start';
        audioStop.play();
        pauseTimer();
        startFlag = true;
    }
});

function startTimer(){
    intervalId = setInterval(countDown, 1000);
};

function pauseTimer(){
    clearInterval(intervalId);
};
