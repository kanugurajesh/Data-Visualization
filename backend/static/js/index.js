
// // fetch('https://alexanderwar-animated-yodel-9vj4g9w5447377qx-5000.preview.app.github.dev/data')
// //     .then(response => response.json())
// //     .then(data => console.log(data));

let k = 0;

// console.log(window.location.href)

const width = 1600;
const height = 1000;

const svg = d3.select('#map').append('svg').attr('width', width).attr('height', height);

const g = svg.append('g');
const projection = d3.geoMercator().scale(190)
    .translate([width / 2, height / 2]);
const path = d3.geoPath(projection);

d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
    .then(data => {
        const countries = topojson.feature(data, data.objects.countries);
        let array = [];
        g.selectAll('path').data(countries.features)
            .enter().append('path').attr('class', 'country').attr('d', path)

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
        let arr = document.getElementsByClassName('country');

        Array.from(countries.features).forEach((country) => {
            array.push(country.properties.name);
        })
        Array.from(arr).forEach((country) => {
            country.innerHTML = array[k];
            k++;
        });
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
    });

// the below code can be deleted

// fetch('https://alexanderwar-animated-yodel-9vj4g9w5447377qx-5000.preview.app.github.dev/data')
//     .then(response => response.json())
//     .then(data => console.log(data));


// let k = 0;

// // console.log(window.location.href)

// const width = 1600;
// const height = 1000;

// const svg = d3.select('#map').append('svg').attr('width', width).attr('height', height);

// const g = svg.append('g');
// const projection = d3.geoMercator().scale(190)
//     .translate([width / 2, height / 2]);
// const path = d3.geoPath(projection);

// const targetCountry = "United States of America"; // the country name to target

// d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
//     .then(data => {
//         const countries = topojson.feature(data, data.objects.countries);
//         let array = [];
//         g.selectAll('path').data(countries.features)
//             .enter().append('path')
//             .attr('class', 'country')
//             .attr('d', path)
//             // .style("fill", d => d.properties.name === targetCountry ? "green" : null); // fill country green if name matches targetCountry

//         g.selectAll("text")
//             .data(countries.features)
//             .enter()
//             .append("text")
//             .attr("class", "country-label")
//             .attr("style", "display:none")
//             .attr("id", function (d) {
//                 return d.properties.name;
//             })
//             .attr("transform", function (d) {
//                 return "translate(" + path.centroid(d) + ")";
//             })
//             .attr("dy", ".35em")
//             .text(function (d) {
//                 return d.properties.name;
//             });
//         let arr = document.getElementsByClassName('country');

//         Array.from(countries.features).forEach((country) => {
//             array.push(country.properties.name);
//         })
//         Array.from(arr).forEach((country) => {
//             country.innerHTML = array[k];
//             k++;
//         });
//         Array.from(arr).forEach((country) => {
//             country.addEventListener('mouseover', (e) => {
//                 document.getElementById(e.target.innerHTML).style.display = "block";
//             })
//         })
//         Array.from(arr).forEach((country) => {
//             country.addEventListener('mouseout', (e) => {
//                 document.getElementById(e.target.innerHTML).style.display = "none";
//             })
//         })
//         Array.from(arr).forEach((country) => {
//             country.addEventListener('click', (e) => {
//                 console.log(e.target.innerHTML);
//             })
//         })
//     });