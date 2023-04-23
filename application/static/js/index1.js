// This file is used to add the graph to the page

// initialize the counter
let i = 0;
let mySet = new Set();
let option_send;
let url = window.location.href;
let countryDictionary = {};

fetch("https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/index.json")
    .then(response => response.json())
    .then(data => {
        let length = data.length;
        for (let i = 0; i < length; i++) {
            if (data[i].name == "United States") {
                data[i].name = "United States of America";
            }
            countryDictionary[data[i].name] = data[i].emoji;
        }
    })

// fetching the data from the api
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

// fetching the data from the api when a value is selected in select1
document.getElementById("select1").addEventListener("change", function () {
    let value = this.value;
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

// adding the query to fetch when clicked on add button
document.getElementById("button1").addEventListener("click", function () {
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
    removeButton.classList.add("removeButton")
    createDiv.appendChild(removeButton);
    // can be removed

    // can be removed 
    // when clicked on, remove the above data
    removeButton.addEventListener("click", function () {
        createDiv.remove();
    });

    i++;
});

// when clicked on submit button, send the data to the api
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
        .then((result) => {
            // console.log(result);
            // convert json object to array
            let data = Object.values(result);

            // Define the dimensions of the chart
            var margin = { top: 20, right: 20, bottom: 30, left: 40 },
                width = 1900 - margin.left - margin.right,
                height = 1000 - margin.top - margin.bottom;
            // d3.select("div.backend svg").remove();
            d3.select("div.backend").selectAll("svg").remove();
            d3.select("div.backend").append("svg");
            // Create the SVG element
            var svg = d3.select("div.backend svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // Define the x and y scales
            var x = d3.scaleBand()
                .range([0, width])
                .padding(0.1)
                .domain(data.map(function (d) { return d.date; }));

            var y = d3.scaleLinear()
                .range([height, 0])
                .domain([0, d3.max(data, function (d) { return d.count + d.impact + d.intensity; })]);

            var color = d3.scaleOrdinal()
                .domain(["count", "impact", "intensity", "likelihood", "relevance"])
                .range(["red", "blue", "green", "yellow", "orange"]);

            // Add the x and y axes to the chart
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            svg.append("g")
                .call(d3.axisLeft(y));

            // Add the bars to the chart
            var group = svg.selectAll(".group")
                .data(data)
                .enter().append("g")
                .attr("class", "group")
                .attr("transform", function (d) { return "translate(" + x(d.date) + ",0)"; });

            group.append("rect")
                .attr("class", "count")
                .attr("fill", "red")
                .attr("x", 0)
                .attr("y", function (d) { return y(d.count); })
                .attr("width", x.bandwidth() / 4)
                .attr("height", function (d) { return height - y(d.count); });

            group.append("rect")
                .attr("class", "impact")
                .attr("fill", "blue")
                .attr("x", x.bandwidth() / 5)
                .attr("y", function (d) { return y(d.impact); })
                .attr("width", x.bandwidth() / 5)
                .attr("height", function (d) { return height - y(d.impact); });

            group.append("rect")
                .attr("class", "intensity")
                .attr("fill", "green")
                .attr("x", x.bandwidth() * 2 / 5)
                .attr("y", function (d) { return y(d.intensity); })
                .attr("width", x.bandwidth() / 5)
                .attr("height", function (d) { return height - y(d.intensity); });

            group.append("rect")
                .attr("class", "likelihood")
                .attr("fill", "yellow")
                .attr("x", x.bandwidth() * 3 / 5)
                .attr("y", function (d) { return y(d.likelihood); })
                .attr("width", x.bandwidth() / 5)
                .attr("height", function (d) { return height - y(d.likelihood); });

            group.append("rect")
                .attr("class", "relevance")
                .attr("fill", "orange")
                .attr("x", x.bandwidth() * 4 / 5)
                .attr("y", function (d) { return y(d.relevance); })
                .attr("width", x.bandwidth() / 5)
                .attr("height", function (d) { return height - y(d.relevance); });

            // Add a legend to the chart
            var legend = svg.selectAll(".legend")
                .data(["count of documents", "average of impact", "average of intensity", "average of likelihood", "average of relevance"])
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

            legend.append("rect")
                .attr("x", width - 18)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", color)
                .attr("class", function (d, i) { return "value" + (i + 1); });

            legend.append("text")
                .attr("x", width - 24)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function (d) { return d; });

            // delete the below code
            svg.append("text")
                .attr("x", width / 2)
                .attr("y", height + margin.bottom)
                .attr("text-anchor", "middle")
                .text("Dates");

            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("x", 0 - height / 2)
                .attr("y", 0 - margin.left + 15)
                .attr("text-anchor", "middle")
                .text("number");
            // delete the above code
            // })

            // Set the dimensions and margins of the graph
            var margin = { top: 200, right: 80, bottom: 30, left: 50 },
                width = 1800 - margin.left - margin.right,
                height = 700 - margin.top - margin.bottom;

            // Set the ranges
            var x = d3.scaleBand().range([0, width]).padding(0.1);
            var y = d3.scaleLinear().range([height, 0]);

            // Define the line functions
            var countLine = d3.line()
                .x(function (d) { return x(d.date) + x.bandwidth() / 2; })
                .y(function (d) { return y(d.count); });

            var impactLine = d3.line()
                .x(function (d) { return x(d.date) + x.bandwidth() / 2; })
                .y(function (d) { return y(d.impact); });

            var intensityLine = d3.line()
                .x(function (d) { return x(d.date) + x.bandwidth() / 2; })
                .y(function (d) { return y(d.intensity); });

            var likelihoodLine = d3.line()
                .x(function (d) { return x(d.date) + x.bandwidth() / 2; })
                .y(function (d) { return y(d.likelihood); });

            var relevanceLine = d3.line()
                .x(function (d) { return x(d.date) + x.bandwidth() / 2; })
                .y(function (d) { return y(d.relevance); });

            d3.select("#chart-container").selectAll("svg").remove();
            // Define the svg element
            var svg = d3.select("#chart-container").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // Format the data
            data.forEach(function (d) {
                d.count = +d.count;
                d.impact = +d.impact;
                d.intensity = +d.intensity;
                d.likelihood = +d.likelihood;
                d.relevance = +d.relevance;
            });

            // Scale the range of the data
            x.domain(data.map(function (d) { return d.date; }));
            y.domain([0, d3.max(data, function (d) {
                return Math.max(d.count, d.impact, d.intensity, d.likelihood, d.relevance);
            })]);

            // Add the X Axis
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            // Add the Y Axis
            svg.append("g")
                .call(d3.axisLeft(y));

            // Add the count line
            svg.append("path")
                .datum(data)
                .attr("class", "line")
                .style("stroke", " red")
                .attr("stroke-width", 2)
                .attr("d", countLine);

            // Add the impact line
            svg.append("path")
                .datum(data)
                .attr("class", "line")
                .style("stroke", "blue")
                .attr("stroke-width", 2)
                .attr("d", impactLine);

            // Add the intensity line
            svg.append("path")
                .datum(data)
                .attr("class", "line")
                .style("stroke", "green")
                .attr("stroke-width", 2)
                .attr("d", intensityLine);

            // Add the likelihood line
            svg.append("path")
                .datum(data)
                .attr("class", "line")
                .style("stroke", "yellow")
                .attr("stroke-width", 2)
                .attr("d", likelihoodLine);

            // Add the relevance line
            svg.append("path")
                .datum(data)
                .attr("class", "line")
                .style("stroke", "orange")
                .attr("stroke-width", 2)
                .attr("d", relevanceLine);

            // Add the count line label
            svg.append("text")
                .datum(data)
                .attr("x", function (d) { return x(d[d.length - 1].date) + x.bandwidth() / 2; })
                .attr("y", function (d) { return y(d[d.length - 1].count); })
                .attr("dy", "-0.5em")
                .style("text-anchor", "middle")
                .style("fill", "red")
                .text("Count");

            // Add the impact line label
            svg.append("text")
                .datum(data)
                .attr("x", function (d) { return x(d[d.length - 1].date) + x.bandwidth() / 2; })
                .attr("y", function (d) { return y(d[d.length - 1].impact); })
                .attr("dy", "-0.5em")
                .style("text-anchor", "middle")
                .style("fill", "blue")
                .text("Impact");

            // Add the intensity line label
            svg.append("text")
                .datum(data)
                .attr("x", function (d) { return x(d[d.length - 1].date) + x.bandwidth() / 2; })
                .attr("y", function (d) { return y(d[d.length - 1].intensity); })
                .attr("dy", "-0.5em")
                .style("text-anchor", "middle")
                .style("fill", "green")
                .text("Intensity");

            // Add the likelihood line label
            svg.append("text")
                .datum(data)
                .attr("x", function (d) { return x(d[d.length - 1].date) + x.bandwidth() / 2; })
                .attr("y", function (d) { return y(d[d.length - 1].likelihood); })
                .attr("dy", "-0.5em")
                .style("text-anchor", "middle")
                .style("fill", "yellow")
                .text("Likelihood");

            // Add the relevance line label
            svg.append("text")
                .datum(data)
                .attr("x", function (d) { return x(d[d.length - 1].date) + x.bandwidth() / 2; })
                .attr("y", function (d) { return y(d[d.length - 1].relevance); })
                .attr("dy", "-0.5em")
                .style("text-anchor", "middle")
                .style("fill", "orange")
                .text("Relevance");

            // getting the elements with country class
            let resulting = document.getElementsByClassName("country")
            // let emojiList = []
            const mySet = new Set();
            // create an empty set

            let selector = document.getElementById("data")
            let resultingLength = resulting.length
            let dataLength = data.length

            // adding the green class to the elements with the country name
            for (let i = 0; i < resultingLength; i++) {
                let element = resulting[i]
                element.classList.remove("green")
                for (let j = 0; j < dataLength; j++) {
                    if (element.innerHTML == data[j].country) {
                        element.classList.add("green")
                        mySet.add(element.innerHTML + " " + countryDictionary[element.innerHTML])
                    }
                }
            }
            
            // delete the divs of the selector
            while (selector.firstChild) {
                selector.removeChild(selector.firstChild);
            }

            for (let item of mySet) {
                let newDiv = document.createElement("div")
                newDiv.innerHTML = item
                selector.appendChild(newDiv)
            }
        });
})