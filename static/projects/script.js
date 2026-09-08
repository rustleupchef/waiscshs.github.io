const regularWidth = 1920;
const regularHeight = 995;
let currentWidth;
let currentHeight;

let _projects = [];
let counter = 0;

function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}

function loadSizes() {
    const content = document.querySelector(".content");

    content.style.width = clamp(currentWidth * 0.625, 0, window.innerWidth) + "px";
    content.style.height = clamp(currentHeight * 0.625, 0, window.innerHeight) + "px";
    content.style.top = ((window.innerHeight - document.getElementById("top-bar").offsetHeight) - parseInt(content.style.height)) / 2 + document.getElementById("top-bar").offsetHeight + "px";
    content.style.left = (window.innerWidth - parseInt(content.style.width)) / 2 + "px";
}

function projects() {
    const url = `https://sheets.wais-cshs.workers.dev/Projects`;
    fetch(url)
        .then(res => res.json())
        .then(cells => {
            let rows = cells.values.splice(1);
            console.log(rows);
            _projects = rows;
            if (_projects.length > 0) {
                const id = new URLSearchParams(rows[0][3]).get("https://drive.google.com/open?id");

                const div = document.querySelector(".content div");
                const img = document.querySelector(".content img");
                const p = document.querySelector(".content p");

                div.innerHTML = `<h1>${rows[0][1]}</h1>${rows[0][2]}${rows[0][4]}`;
                img.src = `https://drive.google.com/thumbnail?id=${id}&sz=s800` || "images/Frame 31.png";
                p.innerHTML = `${counter + 1}/${rows.length}`;

                img.addEventListener("load", function () {
                    const loading = document.querySelector(".loading");
                    loading.style.animation = "fadeOut 2s ease-out";
                    loading.addEventListener("animationend", function () {
                        loading.remove();
                    });
                });
            }
        })
        .catch(err => console.error(err));
}

function changeCounter() {
    counter += 1;
    counter %= _projects.length;

    const point = _projects[counter];
    const id = new URLSearchParams(point[3]).get("https://drive.google.com/open?id");

    const div = document.querySelector(".content div");
    const img = document.querySelector(".content img");
    const p = document.querySelector(".content p");

    div.innerHTML = `<h1>${point[1]}</h1>${point[2]}<br>${point[4]}`;
    img.src = `https://drive.google.com/thumbnail?id=${id}&sz=s800` || "images/Frame 31.png";
    p.innerHTML = `${counter + 1}/${_projects.length}`;
}

window.onload = function () {

    currentWidth = window.innerWidth;
    currentHeight = window.innerHeight;
    if (currentHeight / regularHeight < currentWidth / regularWidth) {
        currentHeight = currentWidth / regularWidth * regularHeight;
    } else {
        currentWidth = currentHeight / regularHeight * regularWidth;
    }
    currentHeight = parseInt(currentHeight);
    currentWidth = parseInt(currentWidth);

    window.addEventListener("resize", function () {
        currentWidth = window.innerWidth;
        currentHeight = window.innerHeight;
        if (currentHeight / regularHeight < currentWidth / regularWidth) {
            currentHeight = currentWidth / regularWidth * regularHeight;
        } else {
            currentWidth = currentHeight / regularHeight * regularWidth;
        }
        currentHeight = parseInt(currentHeight);
        currentWidth = parseInt(currentWidth);
        loadSizes();
    });

    setTimeout(loadSizes, 100);
    const textBox = document.querySelector(".content div");
    document.querySelector(".content").addEventListener('click', changeCounter);
    textBox.innerHTML = "<h1>Projects</h1><br>Projects are soon to come!";

    projects();
}