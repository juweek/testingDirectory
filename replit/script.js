import { createCountryDivs, sidePanelButtonHandler } from './helperFunctions/sidePanel.js';
import { showClicked, createSearchResults } from './helperFunctions/searchFilter.js';
import { sortList, sortDropdownHandler } from './helperFunctions/sort.js';
import { toTitleCase } from './helperFunctions/random.js';

/*
------------------------
METHOD: set the dimensions of the graph
------------------------
*/
var margin = { top: 10, right: 100, bottom: 0, left: 140 },
  width = 740 - margin.left - margin.right,
  height = 900 - margin.top - margin.bottom;

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

/*
------------------------
METHOD: create the d3 chart. set the y axis to the countries
------------------------
*/
function createChart(svg, data) {

  //clear out the svg,  set the height relative to the length of the data
  var width = svg.attr("width")
  var height = data.length * 20;
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
    .call(d3.axisLeft(y))
    .selectAll("text")
    .style("text-anchor", "end")

  //create a loop that creates a vertical zebra background for the chart that alternates between grey and white every 10 points on the x axis
  var zebra = 0;
  for (var i = 0; i < 100; i++) {
    svg.append("rect")
      .attr("x", x(i))
      .attr("y", 0)
      .attr("width", x(10))
      .attr("height", height)
      .attr("fill", function() {
        if (zebra == 0) {
          zebra = 1;
          return "#f2f2f2";
        } else {
          zebra = 0;
          return "#ffffff";
        }
      });
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
    .attr("stroke", "grey")
    .attr("stroke-width", "1.4px")
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
      //remove 'active' from all line elements, then add 'active' to the current line element not using classed
      svg.selectAll(".lineChartElement").classed("active", false);
      let currentLine = event.target;
      currentLine.classList.add("active");
    })
    .on("mouseleave", function() {
      //remove 'active' from all line elements
      svg.selectAll(".lineChartElement").classed("active", false);
    })

  // Circles of variable 1
  svg.selectAll("mycircle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function(d) { return x(d.advanced); })
    .attr("cy", function(d) { return y(d.Country); })
    .attr("r", "6")
    .style("fill", "#010101")

  // Circles of the high variable
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

  // Circles of the intermediate variable
  svg.selectAll("mycircle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function(d) { return x(d.intermediate); })
    .attr("cy", function(d) { return y(d.Country); })
    .attr("r", "6")
    .style("fill", "#E85A56")

  // Circles of the low variable
  svg.selectAll("mycircle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function(d) { return x(d.low); })
    .attr("cy", function(d) { return y(d.Country); })
    .attr("r", "6")
    .style("fill", "#F2A9A4")

  //change the height of dataChart to match the height of the svg
  let dataChart = d3.select("#my_dataviz")
  var holderSVG = d3.select("#my_dataviz").select("svg");
  dataChart.attr("height", height)
  dataChart.style("overflow", "scroll-x")
  holderSVG.attr("height", height + 10);
  holderSVG.attr("width", width);

  dataChart.on("mouseleave", function() {
    //remove 'active' from all line elements
    let tooltip = d3.select("#tooltip");
    tooltip.style("display", "none");
  })
  createCountryDivs(data)
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
  var globalDataSet = [];
  globalDataSet = data
  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 100])
    .range([0, width]);

  /*
  ------------------------
  METHOD: create the dropdowns that determine if we will sort asc or desc
  ------------------------
  */
  d3.selectAll(".dropdownMenu").on("change", function() {
    let newData = sortDropdownHandler(orderDropdown, globalDataSet, svg)
    console.log('//////////////')
    console.log(globalDataSet)
    globalDataSet = newData
    createChart(svg, newData);
    createCountryDivs(newData);
  })

  /*
  ------------------------
  METHOD: populate the search input with the list of countries and called createSearchResulta whenever an input event is fired
  ------------------------
  */
  //push the lowercase version of the country into the array
  let countries = []
  data.forEach(country => {
    countries.push(country.Country.toLowerCase())
  })

  // Get references to the search input and the results dropdown
  const searchInput = document.querySelector('#searchBarSelector');
  const resultsDropdown = document.querySelector('#resultsSelector');
  let currentClickedButtons = [];

  // Add an event listener to the search input that filters the results whenever the input value changes
  searchInput.addEventListener('input', event => {
    const inputValue = event.target.value;
    createSearchResults(data, inputValue, countries, resultsDropdown);

    /*
    ------------------------
    SEARCH RESULTS BUTTONS: Select all buttons in the searchResults area. attach a click event listener to each button so, when clicked, it adds the country to the currentlySelectedCountries section, then redraws the chart
    ------------------------
    */
    const searchResultsButtons = d3.selectAll('.resultButton');
    searchResultsButtons.on('click', function() {
      let currentlySelectedCountriesDataset = []
      let button = d3.select(this);

      currentClickedButtons.push(button._groups[0][0].innerHTML);
      button.classed("resultButtonSelected", true);

      // For each country in currentClickedButtons, go through the data array and find the entry where its Country property matches country
      currentClickedButtons.forEach(function(country) {
        let index = data.findIndex(d => d.Country === country);
        currentlySelectedCountriesDataset.push(data[index])
      })

      //call the function to filter the buttons that have been clicked, then call the createChart function
      showClicked(currentClickedButtons, data);
      createChart(svg, currentlySelectedCountriesDataset);
      globalDataSet = currentlySelectedCountriesDataset;
      /*
       ------------------------
       SELECTED COUNTRIES BUTTONS: Select all buttons in the selectedCountries area. attach a click event listener to each button so, when clicked, it removes the country from the currentlySelectedCountries section, then redraws the chart
       ------------------------
       */
      const selectedResultsButtons = d3.selectAll('.selectedCountry');
      selectedResultsButtons.on('click', function() {

        //get the name of the current button clicked
        let currentCountryButton = d3.select(this);
        let currentCountryButtonName = currentCountryButton._groups[0][0].innerHTML;

        // Remove the currently selected country from the currentClickedButtons list
        let index = currentClickedButtons.indexOf(currentCountryButtonName);
        if (index > -1) {
          currentClickedButtons.splice(index, 1);
        }

        //Remove the country that was clicked from the currentlySelectedCountriesDataset 
        let currentlySelectedCountriesDataset = [];
        currentClickedButtons.forEach(function(country) {
          let index = data.findIndex(d => d.Country === country);
          currentlySelectedCountriesDataset.push(data[index]);
        })

        //Remove the currently selected country from the currentlySelectedCountries section
        const selectedElements = document.querySelectorAll('.selectedCountry');
        selectedElements.forEach(element => {
        if (element.id.includes(currentCountryButtonName)) {
            element.remove();
        }
      });

        //remove '.resultButtonSelected' class from the button in the results div'
        let searchBarResults = document.querySelectorAll('.resultButton');
        for (let i = 0; i < searchBarResults.length; i++) {
          if (searchBarResults[i].id == currentCountryButtonName) {
            searchBarResults[i].classList.remove('resultButtonSelected');
          }
        }

        //if currentlySelectedCountries is empty, redraw createChart with the data from the data array
        if (currentlySelectedCountriesDataset.length != 0) {
           createChart(svg, currentlySelectedCountriesDataset);
           globalDataSet = currentlySelectedCountriesDataset;
        } else {
            createChart(svg, data);
            globalDataSet = data;
            console.log('this just fired')
        }
      })
    })
  })

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
    //set the new width and height of the svg, set the new width and height of the x-axis
    svg.attr("width", width)
    svg.attr("height", height);
    xAxisDiv.attr("width", width)
    xAxisDiv.attr("height", 100);
    createChart(svg, globalDataSet);
    createCountryDivs(globalDataSet);
  }

  window.onresize = reportWindowSize;
  //fire resize event on load
  reportWindowSize();
});