import { createCountryDivs, sidePanelButtonHandler } from './helperFunctions/sidePanel.js';
import { showClicked, createSearchResults } from './helperFunctions/searchFilter.js';
import { sortList } from './helperFunctions/sort.js';
import { toTitleCase } from './helperFunctions/random.js';

/*
------------------------
METHOD: set the dimensions of the graph
------------------------
*/
var margin = { top: 10, right: 100, bottom: 0, left: 140 },
  width = 740 - margin.left - margin.right,
  height = 900 - margin.top - margin.bottom;

var globalDataSet = [];
var masterDataSet = [];

/*
------------------------
METHOD: append the svg to the body
------------------------
  */
var svg = d3.select("#my_dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

//select xAxisDiv element from the html page
var xAxisDiv = d3.select("#xAxisDiv");

/*
------------------------
METHOD: //select all the dropdowns 
------------------------
*/
var sortDropdown = d3.select("#sortDropdown");
var orderDropdown = d3.select("#orderDropdown");
var listOfDropdowns = sortDropdown.selectAll(".dropdown")
let clickedButtons = [];

/*
------------------------
METHOD: create the d3 chart. set the y axis to the countries
------------------------
*/
function createChart(svg, data) {

  //clear out the svg 
  var width = svg.attr("width")
  //set the height relative to the length of the data
  var height = data.length * 20;

  /*reset the height of the svg if the data is less than the original height
  if (height < 400) {
    document.getElementById("my_dataviz").style.height = height + 20 + "px";
  }
  */

  svg.selectAll("*").remove();

  // Remove the current x-axis element
  svg.select("#xAxis").remove();
  xAxisDiv.select("#xAxis2").remove();


  // Create a new x-axis element
  var x = d3.scaleLinear()
    .domain([0, 100])
    .range([0, width - 150]);

  // Append the second x-axis to the div element with id "xAxisDiv". make sure it matches the x and y of the first x-axis
  var xAxis2 = d3.axisBottom(x);
  xAxisDiv.append("g")
    .attr("id", "xAxis2")
    .attr("transform", "translate(" + 140 + ",0)")
    .call(xAxis2);

  // Y axis
  var y = d3.scaleBand()
    .range([0, height])
    .domain(data.map(function(d) { return d.Country; }))
    .padding(1);
  svg.append("g")
    .attr("id", "yAxis")
    .call(d3.axisLeft(y))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr('class', 'yAxisText')
  //clear out all the current svg elements so you can redraw the map from scratch everytime this is called

  //create a loop that creates a vertical zebra background for the chart that alternates between grey and white every 10  points on the x axis
  var zebra = 0;
  for (var i = 0; i < 100; i++) {
    if (zebra == 0) {
      svg.append("rect")
        .attr("x", x(i))
        .attr("y", 0)
        .attr("width", x(10))
        .attr("height", height)
        .attr("fill", "#f2f2f2");
      zebra = 1;
    }
    else {
      svg.append("rect")
        .attr("x", x(i))
        .attr("y", 0)
        .attr("width", x(10))
        .attr("height", height)
        .attr("fill", "#ffffff");
      zebra = 0;
    }
    i = i + 9;
  }

  //give each line a tooltip
  svg.selectAll("myline")
    .data(data)
    .enter()
    .append("line")
    .attr("x1", function(d) { return x(d.advanced); })
    .attr("x2", function(d) { return x(d.low); })
    .attr("y1", function(d) { return y(d.Country); })
    .attr("y2", function(d) { return y(d.Country); })
    .attr("class", "lineChartElement")
    .on("mouseenter", function(d) {
      let currentCountry = d.Country
      let currentLow = d.low
      let currentIntermediate = d.intermediate
      let currentAdvanced = d.advanced
      let currentHigh = d.high
      let tooltip = d3.select("#tooltip");
      tooltip.style("display", "block");
      //set the text of html to a summary of the data points
      tooltip.html(`<h3>${currentCountry}</h3>
            <p>Percentage reaching low score: ${currentLow}%</p>
            <p>Percentage reaching intermediate score: ${currentIntermediate}%</p>
            <p>Percentage reaching advanced score: ${currentAdvanced}%</p>
            <p>Percentage reaching high score: ${currentHigh}%</p>`)
      tooltip.style("left", (d3.event.pageX + 10) + "px")
      tooltip.style("top", (d3.event.pageY - 40) + "px")
      tooltip.style("opacity", 1);
      //remove 'active' from all line elements
      svg.selectAll(".lineChartElement").classed("active", false);
      //add 'active' to the current line element not using classed
      let currentLine = event.target;
      currentLine.classList.add("active");
      // do something when the mouse enters the line
    })
    .on("mouseleave", function() {
      //remove 'active' from all line elements
      svg.selectAll(".lineChartElement").classed("active", false);
      let tooltip = d3.select("#tooltip");

    })
    .attr("stroke", "grey")
    .attr("stroke-width", "1.4px")

  // Circles of variable 1
  svg.selectAll("mycircle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function(d) { return x(d.advanced); })
    .attr("cy", function(d) { return y(d.Country); })
    .attr("r", "6")
    .style("fill", "#010101")

  // Circles of variable 2
  svg.selectAll("mycircle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function(d) { return x(d.high); })
    .attr("cy", function(d) { return y(d.Country); })
    .attr("r", "6")
    .style("fill", "#ffffff")
    .attr("stroke", "#010101")
    .attr("stroke-width", "1.4px")

  svg.selectAll("mycircle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function(d) { return x(d.intermediate); })
    .attr("cy", function(d) { return y(d.Country); })
    .attr("r", "6")
    .style("fill", "#E85A56")


  svg.selectAll("mycircle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function(d) { return x(d.low); })
    .attr("cy", function(d) { return y(d.Country); })
    .attr("r", "6")
    .style("fill", "#F2A9A4")

  let dataChart = d3.select("#my_dataviz")
  //change the height of dataChart to match the height of the svg
  dataChart.attr("height", height)
  //change the height of the sv

  var holderSVG = d3.select("#my_dataviz").select("svg");

  holderSVG.attr("height", height + 10);
  holderSVG.attr("width", width);
  //set the overflow to vertical scroll
  dataChart.style("overflow", "scroll-x")

  dataChart.on("mouseleave", function() {
    //remove 'active' from all line elements
    let tooltip = d3.select("#tooltip");
    tooltip.style("display", "none");
  })
}

/*
------------------------
METHOD: Set up event listeners on both divs to update the scroll position of the other when it's scrolled
------------------------
*/
var myDataviz = document.getElementById("my_dataviz");
var datavizCopy = document.getElementById("datavizCopy");

myDataviz.addEventListener("scroll", function() {
  datavizCopy.scrollTop = myDataviz.scrollTop;
});

datavizCopy.addEventListener("scroll", function() {
  myDataviz.scrollTop = datavizCopy.scrollTop;
});

/*
------------------------
METHOD: create a click event listener for datavizCopy that toggles the display of the div
------------------------
*/
sidePanelButtonHandler('sidePanelButton', 'datavizCopy')

/*
------------------------
METHOD: read in the data and create the axes
------------------------
*/
d3.csv("https://html-css-js.jadesign.repl.co/data/percentages.csv", function(data) {
  var currentDataSet = data
  globalDataSet = data
  masterDataSet = data
  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 100])
    .range([0, width]);
  // Create the second x-axis generator

  /*
  ------------------------
  METHOD: create the dropdowns that determine if we will sort asc or desc
  ------------------------
  */
  d3.selectAll(".dropdownMenu").on("change", function() {
    let value = sortDropdown.property("value")
    let newData = []
    //first, check if the orderDropdown is set to asc or desc
    if (orderDropdown.property("value") === "asc") {
      //call the sort function you created above
      newData = sortList(globalDataSet, value, "asc")
    } else {
      newData = sortList(globalDataSet, value, "desc")
    }
    globalDataSet = newData
    //let searchValue = searchBar.property("value")
    //newData = globalDataSet.filter(country => country.Country.toLowerCase().includes(searchValue.toLowerCase()));
    //currentDataSet = newData
    //update the svg
    createChart(svg, newData);
    console.log('createCountryDivs is being called')
    createCountryDivs(newData);
  });

  /*
------------------------
METHOD: create the search bar that will take in the string and filter out all the countries that don't include it
------------------------
*/
  d3.selectAll("#searchBar").on("keyup", function() {
    let value = searchBar.property("value")
    let newData = []
    newData = data.filter(country => country.Country.toLowerCase().includes(value.toLowerCase()));
    currentDataSet = newData
    //update the svg
    if (value == "") {
      height = 300 - margin.top - margin.bottom;
    }
    else {
      height = newData.length * 50
    }
    console.log('the search bar is being called')
    createChart(svg, newData);
    createCountryDivs(newData);
  })

  /*
  ------------------------
  METHOD: populate the search input with the list of countries
  ------------------------
  */
  //create an array of all the countries
  let countries = []
  data.forEach(country => {
    //push the lowercase version of the country into the array
    countries.push(country.Country.toLowerCase())
  })

  // Get references to the search input and the results dropdown
  const searchInput = document.querySelector('#searchBarSelector');
  const resultsDropdown = document.querySelector('#resultsSelector');

  // Add an event listener to the search input that filters the results
  // whenever the input value changes
  searchInput.addEventListener('input', event => {
    console.log('hello')
    const inputValue = event.target.value;
    createSearchResults(inputValue, countries, resultsDropdown);
  });

  /*
  ------------------------
  METHOD: make width the half the size of the viewport width, until it gets down to mobile, where it should be 100% of the width
  ------------------------
  */
  function reportWindowSize() {
    if (window.innerWidth > 768) {
      width = 740;
      height = 900;
    }
    else {
      width = window.innerWidth - 60;
      height = 900;
    }
    //set the new width and height of the svg
    svg.attr("width", width)
    svg.attr("height", height);
    //set the new width and height of the x-axis
    xAxisDiv.attr("width", width)
    xAxisDiv.attr("height", 100);
    createChart(svg, globalDataSet);
    createCountryDivs(globalDataSet);
  }

  window.onresize = reportWindowSize;
  //fire resize event on load
  reportWindowSize();
});