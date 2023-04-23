// This file is used to create the map and the country labels

// initialize the counter
let k = 0;

// initialize the dimensions of the map
const width = 1700;
const height = 1100;

// create the svg element and append it to the div with id map
const svg = d3.select('#map').append('svg').attr('width', width).attr('height', height);

// create the g element and append it to the svg element
const g = svg.append('g');

// create the projection and the path
const projection = d3.geoMercator().scale(180)
    .translate([width / 2, height / 1.9]);
const path = d3.geoPath(projection);

// load the data from the json file
d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
    .then(data => {
        // create the countries variable
        const countries = topojson.feature(data, data.objects.countries);
        let array = [];
        // create the path for each country
        g.selectAll('path').data(countries.features)
            .enter().append('path').attr('class', 'country').attr('d', path)

        // create the country labels
        g.selectAll("text")
            .data(countries.features)
            .enter()
            .append("text")
            .attr("class", "country-label")
            .attr("style", "display:none")
            .attr("id", function (d) {
                return d.properties.name;
            })
            .attr("transform", function (d) {
                return "translate(" + path.centroid(d) + ")";
            })
            .attr("dy", ".35em")
            .text(function (d) {
                return d.properties.name;
            });

        // creating the array of country class elements
        let arr = document.getElementsByClassName('country');

        Array.from(countries.features).forEach((country) => {
            array.push(country.properties.name);
        })
        Array.from(arr).forEach((country) => {
            country.innerHTML = array[k];
            k++;
        });

        // adding the event listeners
        Array.from(arr).forEach((country) => {
            country.addEventListener('mouseover', (e) => {
                document.getElementById(e.target.innerHTML).style.display = "block";
            })
        })
        Array.from(arr).forEach((country) => {
            country.addEventListener('mouseout', (e) => {
                document.getElementById(e.target.innerHTML).style.display = "none";
            })
        })
        Array.from(arr).forEach((country) => {
            country.addEventListener('click', (e) => {
                console.log(e.target.innerHTML);
            })
        })
        svg.append("rect")
            .attr("x", 10)
            .attr("y", 150)
            .attr("width", 20)
            .attr("height", 20)
            .style("fill", "green");

        svg.append("text")
            .attr("x", 35)
            .attr("y", 170)
            .attr("class", "legend")
            .text("Selected Countries");

    });