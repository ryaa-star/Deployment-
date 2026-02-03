let currentTime = null;
let intervalId = null;
let is24Hour = true;
let timezone = 'Asia/Kolkata';
let alarms = [];
let alarmAudio = null;
let wishShown = false;

window.onload = () => {

    alarmAudio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    alarmAudio.loop = true;

    const saved = localStorage.getItem("alarms");
    if (saved) {
        alarms = JSON.parse(saved);
        showAlarms();
    }

    document.getElementById("addAlarmBtn").onclick = () => {
        document.getElementById("alarmForm").style.display = "block";
    };

    document.getElementById("cancelAlarm").onclick = () => {
        document.getElementById("alarmForm").style.display = "none";
    };

    document.getElementById("saveAlarm").onclick = () => {

        const hours = document.getElementById("alarmHours").value;
        const minutes = document.getElementById("alarmMinutes").value;
        const ampm = document.getElementById("alarmAMPM").value;

        if (hours && minutes) {

            const alarmTime =
                String(hours).padStart(2, '0') + ":" +
                String(minutes).padStart(2, '0') +
                " " + ampm;

            alarms.push(alarmTime);
            localStorage.setItem("alarms", JSON.stringify(alarms));

            showAlarms();

            document.getElementById("alarmForm").style.display = "none";
            document.getElementById("alarmHours").value = "";
            document.getElementById("alarmMinutes").value = "";
        } else {
            alert("Please enter time");
        }
    };

    updateTimeForTimezone();
    setInterval(updateTimeForTimezone, 60000);

    document.getElementById('toggle-format').onclick = () => {
        is24Hour = !is24Hour;
        document.getElementById('toggle-format').innerText = is24Hour ? '24 HR' : '12 HR';
        updateDisplay();
    };

    document.getElementById('timezone').onchange = (e) => {
        timezone = e.target.value;
        updateTimeForTimezone();
    };
};


function showAlarms() {

    const list = document.getElementById("alarmList");
    list.innerHTML = "";

    if (alarms.length === 0) {
        list.innerHTML = "<p>No alarms set</p>";
        return;
    }

    alarms.forEach((alarm, index) => {
        const div = document.createElement("div");
        div.className = "alarm-item";
        div.innerHTML = `
            <span>${alarm}</span>
            <button onclick="deleteAlarm(${index})">Delete</button>
        `;
        list.appendChild(div);
    });
}

function deleteAlarm(index) {
    alarms.splice(index, 1);
    localStorage.setItem("alarms", JSON.stringify(alarms));
    showAlarms();
}


function updateTimeForTimezone() {

    if (intervalId) clearInterval(intervalId);

    const now = new Date();

    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false
    });

    const parts = formatter.formatToParts(now);

    currentTime = {
        hours: parseInt(parts.find(p => p.type === 'hour').value),
        minutes: parseInt(parts.find(p => p.type === 'minute').value),
        seconds: parseInt(parts.find(p => p.type === 'second').value)
    };

    updateDisplay();
    startTicking();
}

function startTicking() {

    if (intervalId) clearInterval(intervalId);

    intervalId = setInterval(() => {

        currentTime.seconds++;

        if (currentTime.seconds >= 60) {
            currentTime.seconds = 0;
            currentTime.minutes++;
            wishShown = false;
        }

        if (currentTime.minutes >= 60) {
            currentTime.minutes = 0;
            currentTime.hours++;
        }

        if (currentTime.hours >= 24) {
            currentTime.hours = 0;
        }

        updateDisplay();
        checkAlarms();
        check1111();

    }, 1000);
}


function checkAlarms() {

    let h = currentTime.hours;
    let ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;

    const currentTimeString =
        String(h).padStart(2, '0') + ":" +
        String(currentTime.minutes).padStart(2, '0') +
        " " + ampm;

    alarms.forEach((alarm, index) => {
        if (alarm === currentTimeString) {
            ringAlarm(alarm, index);
        }
    });
}

function ringAlarm(alarmTime, index) {

    alarmAudio.play().catch(() => {});

    showAlarmPopup(alarmTime);

    alarms.splice(index, 1);
    localStorage.setItem("alarms", JSON.stringify(alarms));
    showAlarms();
}

function showAlarmPopup(alarmTime) {

    const overlay = document.createElement('div');
    overlay.id = "alarmOverlay";

    const popup = document.createElement('div');
    popup.className = "alarm-popup ringing"; 

    popup.innerHTML = `
        <h2>ALARM!</h2>
        <p>${alarmTime}</p>
        <button id="stopAlarmBtn">STOP ALARM</button>
    `;

    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    document.getElementById('stopAlarmBtn').onclick = () => {
        alarmAudio.pause();
        alarmAudio.currentTime = 0;
        overlay.remove();
    };
}


function updateDisplay() {

    if (!currentTime) return;

    let h = currentTime.hours;
    let ampm = '';

    if (!is24Hour) {
        ampm = h >= 12 ? 'PM' : 'AM';
        h = h % 12 || 12;

        document.getElementById('ampm').style.display = 'block';
        document.getElementById('ampm').innerText = ampm;
    } else {
        document.getElementById('ampm').style.display = 'none';
    }

    const hh = String(h).padStart(2, '0');
    const mm = String(currentTime.minutes).padStart(2, '0');
    const ss = String(currentTime.seconds).padStart(2, '0');

    document.getElementById('clock-hours').innerText = hh;
    document.getElementById('clock-min').innerText = mm;
    document.getElementById('clock-sec').innerText = ss;
}

function test1111() {
    show1111Wish();
}

function setTime1110() {
    currentTime = { hours: 11, minutes: 10, seconds: 55 };
    wishShown = false;
    updateDisplay();
}

function check1111() {
    if ((currentTime.hours === 11 || currentTime.hours === 23) && 
        currentTime.minutes === 11 && 
        currentTime.seconds === 0 &&
        !wishShown) {
        wishShown = true;
        show1111Wish();
    }
}

function show1111Wish() {
    playMagicalChime();
    
    const overlay = document.createElement('div');
    overlay.id = 'wishOverlay';
    
    for (let i = 0; i < 30; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.width = `${Math.random() * 2 + 1}px`;
        star.style.height = `${Math.random() * 2 + 1}px`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        overlay.appendChild(star);
    }
    
    const container = document.createElement('div');
    container.className = 'wish-container';
    
    const bigTime = document.createElement('div');
    bigTime.className = 'wish-time';
    bigTime.innerHTML = '11:11';
    
    const quote = document.createElement('div');
    quote.className = 'wish-quote';
    quote.innerHTML = '"In the darkest hour, when hope seems lost,<br>the universe whispers... Make your wish."';
    
    const button = document.createElement('button');
    button.className = 'wish-button';
    button.innerHTML = 'Make a Wish';
    button.onclick = () => wishGranted(overlay);
    
    container.appendChild(bigTime);
    container.appendChild(quote);
    container.appendChild(button);
    overlay.appendChild(container);
    document.body.appendChild(overlay);
}

function wishGranted(overlay) {
    playWishSound();
    
    for (let i = 0; i < 30; i++) {
        setTimeout(() => createWishParticle(overlay), i * 50);
    }
    
    const container = overlay.querySelector('.wish-container');
    container.innerHTML = `
        <div class="wish-granted">
            Your wish has been heard...
            <span>The universe is working on it.</span>
        </div>
    `;
    
    setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => document.body.removeChild(overlay), 1000);
    }, 3000);
}

function createWishParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'wish-particle';
    particle.innerHTML = '★';
    particle.style.fontSize = `${Math.random() * 25 + 15}px`;
    
    const x = (Math.random() - 0.5) * 400;
    const y = -Math.random() * 400 - 100;
    particle.style.setProperty('--x', `${x}px`);
    particle.style.setProperty('--y', `${y}px`);
    particle.style.animation = `particleFloat ${Math.random() * 2 + 2}s ease-out forwards`;
    
    container.appendChild(particle);
    setTimeout(() => container.removeChild(particle), 4000);
}

function playMagicalChime() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    [523.25, 659.25, 783.99].forEach((freq, i) => {
        setTimeout(() => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.frequency.value = freq;
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.8);
        }, i * 200);
    });
}

function playWishSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    [880, 1046.5, 1318.5].forEach((freq, i) => {
        setTimeout(() => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.frequency.value = freq;
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        }, i * 100);
    });
}