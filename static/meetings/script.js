const regularWidth = 1920;
const regularHeight = 995;
let currentWidth;
let currentHeight;

function getNextMeeting(refDate, today) {
    const msPerDay = 24 * 60 * 60 * 1000;
    const daysInBetween = 14;
    const daysSinceRef = Math.floor((today - refDate) / msPerDay);
    console.log("daysSinceRef", daysSinceRef);

    if (daysSinceRef < 0) {
        const knownNextMeeting = refDate;
        knownNextMeeting.setDate(refDate.getDate() + 1);
        knownNextMeeting.setHours(0, 0, 0, 0);
        return knownNextMeeting;
    }

    const daysUntilNext = daysInBetween - (daysSinceRef % daysInBetween);
    const nextMeeting = new Date(today.getTime() + (daysUntilNext * msPerDay));
    return nextMeeting;
}

function isInTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    return totalMinutes < 990;
}

function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}

function loadSizes() {
    const content = document.querySelector(".content");

    content.style.width = clamp(currentWidth * 0.625, 0, window.innerWidth) + "px";
    content.style.height = clamp(currentHeight * 0.625, 0, window.innerHeight) + "px";
    content.style.top = ((window.innerHeight - document.getElementById("top-bar").offsetHeight) - parseInt(content.style.height))/2 + document.getElementById("top-bar").offsetHeight + "px";
    content.style.left = (window.innerWidth - parseInt(content.style.width))/2 + "px";
}

function schedule() {
    const url = `https://sheets.wais-cshs.workers.dev/Schedule`;
    fetch(url)
        .then(res => res.json())
        .then(cells => {
            const today = new Date(new Date().toDateString());
            const firstMeeting = new Date(cells.values[0][0]);
            const nextMeetingDate = getNextMeeting(firstMeeting, today);
            const daysUntilMeeting = Math.ceil((nextMeetingDate - today) / (1000 * 60 * 60 * 24));

            const isActiveMeeting = daysUntilMeeting == 14 && Math.floor((today - firstMeeting) / (24 * 60 * 60 * 1000)) >= 0;
            const inTimePeriod = isInTime(today);
            const activeText = isActiveMeeting && inTimePeriod ? "We have a meeting today!!!<br><br>" : ""; 

            const textBox = document.querySelector(".content div");
            textBox.innerHTML = 
                `<h1>Meeting Schedule</h1>` +
                activeText + 
                `Our next meeting is on ${nextMeetingDate.toLocaleDateString()}<br>` +
                `<br>${daysUntilMeeting} day(s) till the next meeting<br>` + 
                `<br>We meet in room A125 from 3:30 - 4:30`;
            const loading = document.querySelector(".loading");
            loading.style.animation = "fadeOut 2s ease-out";
            loading.addEventListener("animationend", function() {
                loading.remove();
            });
        })
        .catch(err => console.error(err));
}

window.onload = function() {

    currentWidth = window.innerWidth;
    currentHeight = window.innerHeight;
    if (currentHeight / regularHeight < currentWidth / regularWidth) {
        currentHeight = currentWidth/regularWidth * regularHeight;
    } else {
        currentWidth = currentHeight/regularHeight * regularWidth;
    }
    currentHeight = parseInt(currentHeight);
    currentWidth = parseInt(currentWidth);

    window.addEventListener("resize", function() {
        currentWidth = window.innerWidth;
        currentHeight = window.innerHeight;
        if (currentHeight / regularHeight < currentWidth / regularWidth) {
            currentHeight = currentWidth/regularWidth * regularHeight;
        } else {
            currentWidth = currentHeight/regularHeight * regularWidth;
        }
        currentHeight = parseInt(currentHeight);
        currentWidth = parseInt(currentWidth);
        loadSizes();
    });

    setTimeout(loadSizes, 100);
    schedule();
}