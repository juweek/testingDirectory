import { createCountryDivs, sidePanelButtonHandler } from './helperFunctions/sidePanel.js';
import { showClicked, createSearchResults } from './helperFunctions/searchFilter.js';
import { sortList, sortDropdownHandler } from './helperFunctions/sort.js';

/*
------------------------
METHOD: set the dimensions of the graph
------------------------
*/
var margin = { top: 10, right: 30, bottom: 0, left: 140 },
  width = 760 - margin.left - margin.right,
  height = 1050 - margin.top - margin.bottom;

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
    .domain([100, 800])
    .range([0, width - 120]);

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

  //create a loop that creates a vertical zebra background for the chart that alternates between grey and white every 10 points on the x axis
  var zebra = 0;
  for (var i = 200; i < 800; i++) {
    svg.append("rect")
      .attr("x", x(i))
      .attr("y", 0)
      .attr("width", x(200))
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
    i = i + 99;
  }

  /*
  ------------------------
  METHOD: draw the first rectangle used to show the 5th and 95th percentile. this will be the green rectangle that is the total distribution of scores
  ------------------------
  */
  svg.selectAll("mycircle")
    .data(data)
    .enter()
    .append("rect")
    //the x will be the start of the rectangle
    .attr("x", function(d) {
      return x(d.fifth_percentile);
    })
    .attr("y", function(d) { return y(d.Country); })
    //the width will be the total distribution of scores
    .attr("class", "firstRect")
    .attr("width", function(d) {
      let fifth = x(d.fifth_percentile)
      let nintey_fifth = x(d.nintey_fifth)
      return (nintey_fifth - fifth) + 20
    })
    .attr("height", 14)
    .attr("z-index", 1)
    .attr("stroke", "black")
    .style("fill", "#E85955")
    .on("mouseenter", function(d) {
      let currentCountry = d.Country
      let currentLow = d.fifth_percentile
      let currentIntermediate = d.nintey_fifth
      let tooltip = d3.select("#tooltip");
      tooltip.style("display", "block");
      //set the text of html to a summary of the data points
      tooltip.html(`<h3>${currentCountry}</h3>
            <p>Percentage reaching low score: ${currentLow}%</p>
            <p>Percentage reaching intermediate score: ${currentIntermediate}%</p>`)
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


  /*
  ------------------------
  METHOD: draw the second rectangle used to show the 25th and 90th percentile
  ------------------------
  */
  svg.selectAll("mycircle")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function(d) { return x(d.twenty_fifth); })
    .attr("y", function(d) { return y(d.Country); })
    .attr("class", "secondRect")
    .attr("width", function(d) {
      let twentyFifth = x(d.twenty_fifth)
      let seventy_fifth = x(d.seventy_fifth)
      return (seventy_fifth - twentyFifth) + 20
    })
    .attr("height", 14)
    .attr("z-index", 2)
    .attr("stroke", "black")
    .style("fill", "#F6C7BC")

  /*
  ------------------------
  METHOD: draw the third rectangle used to show the 75th and 95th percentile
  ------------------------
  */
  svg.selectAll("mycircle")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function(d) { return x(d.nintey_fifth_confidence); })
    .attr("y", function(d) { return y(d.Country); })
    .attr("width", function(d) {
      let fifth = x(d.seventy_fifth)
      let twenthyFifth = x(d.nintey_fifth)
      return 3
    })
    .attr("height", 14)
    .attr("z-index", 4)
    .attr("stroke", "black")
    .style("fill", "black")


  let dataChart = d3.select("#my_dataviz")

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
d3.csv("https://html-css-js.jadesign.repl.co/data/standardDeviation2.csv", function(data) {
  var globalDataSet = [];
  globalDataSet = data
  // Add X axis
  var x = d3.scaleLinear()
    .domain([100, 800])
    .range([0, width]);
  var xAxis2 = d3.axisBottom(x);

  d3.select("#xAxisDiv")
    .append("g")
    .attr("id", "xAxis2")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis2);

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
      width = 760;
      height = 1050;
    }
    else {
      width = window.innerWidth - 60;
      height = 1050;
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