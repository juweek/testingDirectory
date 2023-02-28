/*
------------------------
METHOD: set the dimensions of the graph
------------------------
*/
var margin = { top: 10, right: 20, bottom: 10, left: 10 },
  width = 300 - margin.left - margin.right,
  height = 200 - margin.top - margin.bottom;

let allGroup = ["Average"]
let currentCountry = 'belgium'

//create a dictionary of countries that we can use later in a dropdown selector to change the d3 graph
let countries = {
  "Belgium": "belgium",
  "China": "china",
  "India": "india",
  "Kenya": "kenya"
};

/*
------------------------------
METHOD: create an event listener to attach to #checkbox that detects when it is checked. when it is checked, we will switch out the entries that make up the "AllGroup array"
------------------------------
*/
d3.select("#checkbox").on("change", function () {
  if (this.checked) {
    allGroup = ["Boys", "Girls"]
  } else {
    allGroup = ["Average"]
  }
  d3.csv('https://html-css-js.jadesign.repl.co/data/' + currentCountry + ".csv").then(function (us) {
    createChart(svg, us, allGroup);
  })
    .catch(function (error) {
      console.log(error);
    })
});


/*
------------------------------
METHOD: create a dropdown selector that calls the update method. This dropdown will redraw the d3 graph whenever a new country is selected
------------------------------
*/
let dropdown = d3.select("#dropdown");
dropdown
  .selectAll("option")
  .data(Object.keys(countries))
  .enter()
  .append("option")
  .attr("value", function (d) {
    return d;
  })
  .text(function (d) {
    return d;
  });

dropdown.on("change", function () {
  let selectedCountry = d3.select(this).property("value");
  currentCountry = countries[selectedCountry]
  d3.csv("https://html-css-js.jadesign.repl.co/data/" + currentCountry + ".csv").then(function (data) {
    createChart(svg, data, allGroup);
  })
    .catch(function (error) {
      console.log(error);
    })
});


/*
------------------------
METHOD: create the line graphs using the filters and search bars
------------------------
  */
function createChart(svg, data, currentFilter) {

  console.log(data)
  //d3.select("#svganchor svg").selectAll("*").remove();

  //set width and height to the svg parameters
  let width = svg.attr("width") - margin.right;
  let height = svg.attr("height") - margin.top - margin.bottom;

  console.log(data)


  // Reformat the data: we need an array of arrays of {x, y} tuples
  var dataReady = allGroup.map(function (grpName) { // .map allows to do something for each element of the list
    //go through every element in grpName and create an array of {x, y} tuples
    return {
      name: grpName,
      values: data.map(function (d) {
        return { time: d.time, value: +d[grpName] };
      })
    };
  });

  console.log(dataReady)
  console.log('//////')

  // A color scale: one color for each group
  var myColor = d3.scaleOrdinal()
    .domain(allGroup)
    .range(d3.schemeSet2);

  var currentSVG = svg;

  // Add X axis --> it is a date format
  var x = d3.scaleLinear()
    .domain([1998, 2024])
    .range([0, width]);
  currentSVG.append("g")
    .attr("transform", "translate(-3," + (height) + ")")
    .attr("class", "x-axis1")
    .attr('width', width)
    .call(d3.axisBottom(x)
      .tickFormat(function (d) { return d.toString().replace(/,/g, ''); }) // remove commas from tick labels
      .tickValues([2001, 2006, 2011, 2016, 2021])
    );

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([500, 630])
    .range([height, 0])
  currentSVG.append("g")
    //translate the y axis to the left side of the graph
    .attr("transform", "translate(35, 0)")
    .attr("class", "y-axis1")
    .call(d3.axisLeft(y));

  // Add the lines
  var line = d3.line()
    .x(function (d) { return x(+d.time) })
    .y(function (d) { return y(+d.value) })

  currentSVG.selectAll("myLines")
    .data(dataReady)
    .enter()
    .append("path")
    .attr("d", function (d) {
      return line(d.values)
    })
    .attr("stroke", function (d) { return myColor(d.name) })
    .style("stroke-width", 4)
    .style("fill", "none")

  // Add the points
  currentSVG
    // First we need to enter in a group
    .selectAll("myDots")
    .data(dataReady)
    .enter()
    .append('g')
    .style("fill", function (d) { return myColor(d.name) })
    // Second we need to enter in the 'values' part of this group
    .selectAll("myPoints")
    .data(function (d) {
      return d.values
    })
    .enter()
    .append("circle")
    .attr("cx", function (d) { return x(d.time) })
    .attr("cy", function (d) { return y(d.value) })
    .attr("r", 6)
    .attr("stroke", "white")
    .attr("data-value", function (d) { return d.value })

    //for each circle point, display a text element 
     // Add the points
  currentSVG
  // First we need to enter in a group
  .selectAll("myText")
  .data(dataReady)
  .enter()
  .append('g')
  // Second we need to enter in the 'values' part of this group
  .selectAll("myPoints")
  .data(function (d) {
    return d.values
  })
  .enter()
  //for each circle point, display a text element with the value of the point, and display a circle
  .append("text")
  .attr("x", function (d) { return (x(d.time) + 7) })
  .attr("y", function (d) { return y(d.value) - 5 })
  .text(function (d) { return d.value })
  .attr("text-anchor", "middle")
  .attr("font-size", "12px")
  .attr("fill", "black")
  .attr("class", "textLine")
  .attr("data-value", function (d) { return d.value })
  .attr("data-time", function (d) { return d.time })
  .attr("data-name", function (d) { return d.name })
  .attr("transform", "translate(0, -10)")



  // Add a legend at the end of each line
  currentSVG
    .selectAll("myLabels")
    .data(dataReady)
    .enter()
    .append('g')
    .append("text")
    .datum(function (d) { return { name: d.name, value: d.values[d.values.length - 1] }; }) // keep only the last value of each time series
    .attr("transform", function (d) { return "translate(" + x(d.value.time) + "," + y(d.value.value) + ")"; }) // Put the text at the position of the last point
    .attr("x", - 120) // shift the text a bit more right
    .attr("y", - 40) // shift the text a bit higher
    .text(function (d) { return d.name; })
    .style("fill", function (d) { return myColor(d.name) })
    .style("font-size", 18);

  /*
  ------------------------------
  Section: add a tooltip for each circle in the graph
  ------------------------------
  */
  var tooltip = d3.select("#svganchor")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function (d) {
    tooltip.style("opacity", 1)
    d3.select(this).style("fill", "red")
  }
  var mousemove = function (d) {
    //show the score in a two decimal format
    let currentScore = d3.select(this).attr("data-value")
    let roundedScore = Math.round(currentScore * 100) / 100
    tooltip
      .html("The average score for <br>this cell is: <b>" + roundedScore + "</b>")
      .style("left", ((d.pageX - 40) + "px"))
      .style("top", ((d.pageY - 40) + "px"))
  }

  var mouseleave = function (d) {
    tooltip
      .style("opacity", 0)
    d3.select(this).style("fill", null)
  }

  //attach the event listeners to the circles
  currentSVG.selectAll("circle")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)

  // Add X axis --> it is a date format
  var x = d3.scaleTime()
}


var masterCountryList = ['belgium', 'china', 'india', 'kenya'];

async function getCountriesData() {
  var countriesData = {};

  for (var i = 0; i < masterCountryList.length; i++) {
    var country = masterCountryList[i];

    // Get the data for the current country
    var data = await d3.csv('https://html-css-js.jadesign.repl.co/data/' + country + '.csv');
    countriesData[country] = data;
  }
  console.log(countriesData)
  return countriesData;
}

getCountriesData().then(function (countriesData) {
  for (var country in countriesData) {
    var data = countriesData[country];
    var chart = d3.select('#svganchor').append('div')
      .attr('class', 'chart')
      .attr('id', country + '-chart');
    var chartSVG = chart.append('svg')
      //set width to just half the width of the window
      .attr('width', 360)
      .attr('height', 300);

    //give each chart a title before the chart

    chart.append('div')
      .attr('class', 'chartTitleBackground')
      .append('h3')
      .attr('class', 'chartTitle')
      .text(country);


      console.log('loading createChart')
      console.log(data)

    createChart(chartSVG, data, ['Average']);
  }
});


/*

      //give each chart an x and y axis
      chart.append('g')
        .attr('class', 'x-axis')
        .attr('transform', 'translate(0, 300)')
        .call(d3.axisBottom(xScale));
      chartSVG.append('g')
        .attr('class', 'y-axis')
        .attr('transform', 'translate(50, 0)')
        .call(d3.axisLeft(yScale));

        */