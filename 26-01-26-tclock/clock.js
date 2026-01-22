let currentTime = null;
let intervalId = null;

window.onload = () => {
    fetchRealTime();
    
    // Re-sync every 5 minutes to prevent drift
    setInterval(fetchRealTime, 300000);
}
                                                                                                                  // one toggle button 12 and 24 hrs 
async function fetchRealTime() {                                                                                    //
    try {
        // Source - https://stackoverflow.com/a
// Posted by PD81, modified by community. See post 'Timeline' for change history
// Retrieved 2026-01-21, License - CC BY-SA 4.0

       const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const response = await fetch('https://worldtimeapi.org/api/timezone/Etc/UTC');
        if (!response.ok) throw new Error('Time API failed');

        const data = await response.json();

        // API-provided UTC time
        const utcDate = new Date(data.utc_datetime);

        // Convert to user's timezone
        const userDate = new Intl.DateTimeFormat('en-US', {
        timeZone: userTimeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
        }).format(utcDate);

        console.log('User local time (API-based):', userDate);

        
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
        
        console.log("Synced with real time!");
        
    } catch (error) {
        console.error('Failed to fetch time, using system time:', error);
        console.log("msg", error.message);
        
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