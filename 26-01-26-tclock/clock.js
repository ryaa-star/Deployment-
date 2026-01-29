let currentTime = null;
let intervalId = null;
let is24Hour = true;
let timezone = 'Asia/Kolkata';
let alarms = [];

window.onload = () => {
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
            const alarmTime = hours + ":" + minutes + " " + ampm;
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
        }
        if (currentTime.minutes >= 60) { 
            currentTime.minutes = 0; 
            currentTime.hours++; 
        }
        if (currentTime.hours >= 24) { 
            currentTime.hours = 0; 
        }
        updateDisplay();
    }, 1000);
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