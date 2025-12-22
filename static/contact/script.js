const regularWidth = 1920;
const regularHeight = 995;
let currentWidth;
let currentHeight;

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

function contact() {
    fetch("keys.json")
        .then(response => response.json())
        .then(data => {
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${data.sheet_id}/values/Contact!A:B?key=${data.key}`;
            fetch(url)
                .then(res => res.json())
                .then(cells => {
                    const textBox = document.querySelector(".content div");
                    let text = "<h1>Contact Info</h1>";
                    let rows = cells.values.splice(1);

                    for (let row of rows) {
                        text += `<br>${row[0]}:<br>${row[1]}<br><br>`
                    }
                    textBox.innerHTML = text;
                })
                .catch(err => console.error(err));
        })
        .catch(error => {
            console.error(error);
        });
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
    contact();
}