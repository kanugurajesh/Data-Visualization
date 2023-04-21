let i = 0;
let mySet = new Set();
let option_send;
// console.log(window.location.href);
let url = window.location.href;
// fetch("https://alexanderwar-animated-yodel-9vj4g9w5447377qx-5000.preview.app.github.dev/key_data")
fetch(url + "key_data")
    .then((response) => response.json())
    .then((data) => {
        let select1 = document.getElementById("select1");
        for (let i = 0; i < data.length; i++) {
            let option = document.createElement("option");
            option.value = data[i];
            option.text = data[i];
            select1.appendChild(option);
        }
    })

// when a value is selected in select1, fetch the data from the api and populate select2
let select2 = document.getElementById("select2");

document.getElementById("select1").addEventListener("change", function () {
    let value = this.value;
    // fetch("https://alexanderwar-animated-yodel-9vj4g9w5447377qx-5000.preview.app.github.dev/data", {
    fetch(url + "data", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ selectedValue: value })
    })
        .then((response) => response.json())
        .then((data) => {
            select2.innerHTML = "";
            for (let i = 0; i < data.length; i++) {
                let option = document.createElement("option");
                option.value = data[i];
                option.text = data[i];
                select2.appendChild(option);
            }
        })
})

document.getElementById("button1").addEventListener("click", function () {
    console.log(1);

    let results = document.getElementById("select1").value;
    let results1 = document.getElementById("select2").value;

    // create a div and append the above data to it
    let createDiv = document.createElement("div");
    createDiv.classList.add("myDiv" + i);
    createDiv.innerHTML = results + ":" + results1;

    document.getElementById("header").appendChild(createDiv);

    // create a button and append it to the div
    let removeButton = document.createElement("button");
    removeButton.innerText = "Remove";
    createDiv.appendChild(removeButton);

    // when clicked on, remove the above data
    removeButton.addEventListener("click", function () {
        createDiv.remove();
    });

    i++;
});

// know which option is selected in the select menu

// document.getElementById("sender").addEventListener("change", function () {
//     option_send = this.value;
// })

document.getElementById("button2").addEventListener("click", function () {
    // get all the data from the divs
    // let divs = document.querySelectorAll(".container1 div");
    let div = document.getElementById("header");

    let divs = div.querySelectorAll("div");
    // create an array to store the data

    let arr = [];
    // let arr = new Set();

    for (let i = 0; i < divs.length; i++) {
        let data = divs[i].innerText;
        arr.push(data.slice(0, -6));
        // arr.add(data.slice(0,-6));
    }

    arr = [...new Set(arr)]

    // send the data to the api

    const senderDropdown = document.getElementById('sender');
    const selectedSender = senderDropdown.options[senderDropdown.selectedIndex].value;

    // fetch("https://alexanderwar-animated-yodel-9vj4g9w5447377qx-5000.preview.app.github.dev/submit", {
    fetch(url + "submit", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: arr, option: selectedSender })
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
        })
})