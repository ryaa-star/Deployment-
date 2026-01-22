let currentTime = null;
let intervalId = null;

window.onload = () => {
    fetchRealTime();
    
    // Re-sync every 5 minutes to prevent drift
    setInterval(fetchRealTime, 300000);
}

async function fetchRealTime() {
    try {
        const response = await fetch('https://worldtimeapi.org/api/timezone/Asia/Kolkata');
        const data = await response.json();
        const realDate = new Date(data.datetime);
        
        currentTime = {
            hours: realDate.getHours(),
            minutes: realDate.getMinutes(),
            seconds: realDate.getSeconds()
        };
        
        // Clear existing interval if any
        if (intervalId) {
            clearInterval(intervalId);
        }
        
        // Update display immediately
        updateDisplay();
        
        // Start incrementing every second
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
        
        console.log("✅ Synced with real time!");
        
    } catch (error) {
        console.error('❌ Failed to fetch time, using system time:', error);
        // Fallback to system time if API fails
        startSystemTime();
    }
}

function updateDisplay() {
    const h = currentTime.hours < 10 ? "0" + currentTime.hours : currentTime.hours;
    const m = currentTime.minutes < 10 ? "0" + currentTime.minutes : currentTime.minutes;
    const s = currentTime.seconds < 10 ? "0" + currentTime.seconds : currentTime.seconds;
    
    document.querySelector('#clock-hours').innerText = h;
    document.querySelector('#clock-min').innerText = m;
    document.querySelector('#clock-sec').innerText = s;
}

function startSystemTime() {
    intervalId = setInterval(() => {
        const date = new Date();
        
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();

        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        document.querySelector('#clock-hours').innerText = hours;
        document.querySelector('#clock-min').innerText = minutes;
        document.querySelector('#clock-sec').innerText = seconds;
    }, 1000);
}