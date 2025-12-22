const regularWidth = 1920;
const regularHeight = 995;
let currentWidth;
let currentHeight;

function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}

function loadSizes() {
    const content = document.querySelector(".content");

    content.style.width = clamp(currentWidth * 0.5, 0, window.innerWidth) + "px";
    content.style.height = clamp(currentHeight - document.getElementById("top-bar").offsetHeight * 2, 0, window.innerHeight) + "px";
    content.style.top = document.getElementById("top-bar").offsetHeight + "px";
    content.style.left = (window.innerWidth - parseInt(content.style.width))/2 + "px";
}

function members() {
    fetch("keys.json")
        .then(response => response.json())
        .then(data => {
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${data.sheet_id}/values/Members!A:D?key=${data.key}`;
            fetch(url)
                .then(res => res.json())
                .then(cells => {
                    let rows = cells.values.splice(1);
                    const content = document.querySelector(".content");
                    for (let row of rows) {
                        const container = document.createElement("div");
                        container.className = "person-container";

                        const image = document.createElement("img");
                        image.className = "person-image";
                        const id = new URLSearchParams(row[3]).get("https://drive.google.com/open?id");
                        console.log(row[3], id);
                        image.src = `https://drive.google.com/thumbnail?id=${id}&sz=s800`;
                        image.alt = row[1];

                        const name = document.createElement("h4");
                        name.className = "ibm-plex-mono-bold";
                        name.innerText = row[1];

                        const role = document.createElement("h5");
                        role.className = "ibm-plex-mono-extralight";
                        role.innerText = row[2];

                        container.appendChild(image);
                        container.appendChild(name);
                        container.appendChild(role);

                        content.appendChild(container);
                    }
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

    members();
}