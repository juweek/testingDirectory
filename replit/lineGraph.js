import { createCountryDivs, sidePanelButtonHandler } from './helperFunctions/sidePanel.js';
import { showClicked, createSearchResults } from './helperFunctions/searchFilter.js';
import { sortList, sortDropdownHandler } from './helperFunctions/sort.js';

/*
------------------------
METHOD: set the dimensions of the graph
------------------------
*/
var margin = { top: 10, right: 20, bottom: 10, left: 10 },
  width = 300 - margin.left - margin.right,
  height = 200 - margin.top - margin.bottom;


//create an array of all the countries
let countries = []

/*
------------------------
METHOD: //select all the dropdowns 
------------------------
*/
var sortDropdown = d3.select("#sortDropdown");
var orderDropdown = d3.select("#orderDropdown");
let clickedButtons = [];

/*
------------------------
METHOD: create the line graphs using the filters and search bars
------------------------
  */
function createChart(svg, data) {
  console.log('createChart is being called')
  //set width and height to the svg parameters
  let width = svg.attr("width") - margin.right;
  let height = svg.attr("height") - margin.top - margin.bottom;

  var dataReady = [{
    name: 'Average',
    values: data.map(d => ({ time: d.time, value: d.Average }))
  }
  ];

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
      .tickFormat(function(d) { return d.toString().replace(/,/g, ''); }) // remove commas from tick labels
      .tickValues([2001, 2006, 2011, 2016, 2021])
    );

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([250, 680])
    .range([height, 0])
  currentSVG.append("g")
    //translate the y axis to the left side of the graph
    .attr("transform", "translate(35, 0)")
    .attr("class", "y-axis1")
    .call(d3.axisLeft(y));

  // Add the lines
  var line = d3.line()
    .x(function(d) { return x(+d.time) })
    .y(function(d) {
      if (d.value == 0) {
        return y(+500)
      }
      //check if d.value is not a number
      else if (isNaN(d.value)) {
        return y(+500)
      }
      else {
        return y(+d.value)
      }
    })

  currentSVG.selectAll("myLines")
    .data(dataReady)
    .enter()
    .append("path")
    .attr("d", function(d) {
      return line(d.values)
    })
    .attr("stroke", function(d) { return 'black' })
    .style("stroke-width", 4)
    .style("fill", "none")

  // Add the points
  currentSVG
    // First we need to enter in a group
    .selectAll("myDots")
    .data(dataReady)
    .enter()
    .append('g')
    .style("fill", function(d) { return 'black' })
    // Second we need to enter in the 'values' part of this group
    .selectAll("myPoints")
    .data(function(d) {
      if (d) {
        return d.values
      }
      else {
        return 0
      }
    })
    .enter()
    .append("circle")
    .attr("cx", function(d) { return x(d.time) })
    .attr("cy", function(d) {
      if (d.value == 0) {
        return y(500)
      }
      //check if d.value is not a number
      else if (isNaN(d.value)) {
        return y(500)
      }
      else {
        return y(d.value)
      }
    })
    .attr("r", 6)
    .attr("stroke", "white")
    .attr("data-value", function(d) { return d.value })

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
    .data(function(d) {
      if (d) {
        return d.values
      }
      else {
        return 0
      }
    })
    .enter()
    //for each circle point, display a text element with the value of the point, and display a circle
    .append("text")
    .attr("x", function(d) { return (x(d.time) + 7) })
    .attr("y", function(d) { return y(d.value) - 5 })
    .text(function(d) { return d.value })
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("fill", "black")
    .attr("class", "textLine")
    .attr("data-value", function(d) { return d.value })
    .attr("data-time", function(d) { return d.time })
    .attr("data-name", function(d) { return d.name })
    .attr("transform", "translate(0, -10)")

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
  var mouseover = function(d) {
    tooltip.style("opacity", 1)
    d3.select(this).style("fill", "red")
  }
  var mousemove = function(d) {
    //show the score in a two decimal format
    let currentScore = d3.select(this).attr("data-value")
    let roundedScore = Math.round(currentScore * 100) / 100
    tooltip
      .html("The average score for <br>this cell is: <b>" + roundedScore + "</b>")
      .style("left", ((d.pageX - 40) + "px"))
      .style("top", ((d.pageY - 40) + "px"))
  }

  var mouseleave = function(d) {
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


async function getCountriesData() {
  var transformedData = {};

  d3.csv("https://html-css-js.jadesign.repl.co/data/averageAchievement.csv", function(error, data) {
    var globalDataSet
    globalDataSet
    if (error) throw error;

    // remove the first header "Country"
    var headers = Object.keys(data[0]);
    headers.shift();

    // transform the data
    data.forEach(function(row) {
      var country = row["Country"];
      transformedData[country] = [];
      headers.forEach(function(header, index) {
        transformedData[country].push({ time: header, Average: row[header] });
      });
    });
    globalDataSet = transformedData

    //push the lowercase version of the country into the array
    data.forEach(country => {
      countries.push(country.Country.toLowerCase())
    })

    /*
------------------------
METHOD: create the dropdowns that determine if we will sort or search
------------------------
*/
    d3.selectAll(".dropdownMenu").on("change", function() {
      let newData = sortDropdownHandler(orderDropdown, globalDataSet, svg)
      //globalDataSet = newData
      // For each country, create a chart and display it
      for (var country in transformedData) {
        var data = transformedData[country];
        var chart = d3.select('#svganchor').append('div')
          .attr('class', 'chart')
          .attr('id', country + '-chart');
        var chartSVG = chart.append('svg')
          //set width to just half the width of the window
          .attr('width', 240)
          .attr('height', 200);

        // Give each chart a title before the chart
        chart.append('div')
          .attr('class', 'chartTitleBackground')
          .append('h3')
          .attr('class', 'chartTitle')
          .text(country);

        createChart(chartSVG, data);
      }
      createCountryDivs(newData);
    })

    // For each country, create a chart and display it
    console.log(transformedData)
    for (var country in transformedData) {
      var data = transformedData[country];
      var chart = d3.select('#svganchor').append('div')
        .attr('class', 'chart')
        .attr('id', country + '-chart');
      var chartSVG = chart.append('svg')
        //set width to just half the width of the window
        .attr('width', 240)
        .attr('height', 200);

      // Give each chart a title before the chart
      chart.append('div')
        .attr('class', 'chartTitleBackground')
        .append('h3')
        .attr('class', 'chartTitle')
        .text(country);

      createChart(chartSVG, data);
    }



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
          //let index = data.findIndex(d => d.Country === country);
          let index = transformedData[country]
          currentlySelectedCountriesDataset.push(index)
        })

        //call the function to filter the buttons that have been clicked, then call the createChart function
        showClicked(currentClickedButtons, data);

        //clear out the current svg
        let svgContainer = d3.select('#svganchor');
        svgContainer.selectAll('*').remove();

        for (var country in currentlySelectedCountriesDataset) {
          var data = currentlySelectedCountriesDataset[country];
          var chart = d3.select('#svganchor').append('div')
            .attr('class', 'chart')
            .attr('id', country + '-chart');
          var chartSVG = chart.append('svg')
            //set width to just half the width of the window
            .attr('width', 240)
            .attr('height', 200);

          // Give each chart a title before the chart
          chart.append('div')
            .attr('class', 'chartTitleBackground')
            .append('h3')
            .attr('class', 'chartTitle')
            .text(country);

          //call the function to create the chart
          createChart(chartSVG, data);
        }
        globalDataSet = currentlySelectedCountriesDataset;
        /*
         ------------------------
         SELECTED COUNTRIES BUTTONS: Select all buttons in the selectedCountries area. attach a click event listener to each button so, when clicked, it removes the country from the currentlySelectedCountries section, then redraws the chart
         ------------------------
         */
        const selectedResultsButtons = d3.selectAll('.selectedCountry');
        selectedResultsButtons.on('click', function() {

          //clear out the current svg
          let svgContainer = d3.select('#svganchor');
          svgContainer.selectAll('*').remove();

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
            let index = transformedData[country]
            currentlySelectedCountriesDataset.push(index)
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
            //createChart(svg, currentlySelectedCountriesDataset);
            for (var country in currentlySelectedCountriesDataset) {
              var data = currentlySelectedCountriesDataset[country];
              var chart = d3.select('#svganchor').append('div')
                .attr('class', 'chart')
                .attr('id', country + '-chart');
              var chartSVG = chart.append('svg')
                //set width to just half the width of the window
                .attr('width', 240)
                .attr('height', 200);

              // Give each chart a title before the chart
              chart.append('div')
                .attr('class', 'chartTitleBackground')
                .append('h3')
                .attr('class', 'chartTitle')
                .text(country);

              //call the function to create the chart
              createChart(chartSVG, data);
            }
            globalDataSet = currentlySelectedCountriesDataset;
          } else {
            for (var country in transformedData) {
              var data = transformedData[country];
              var chart = d3.select('#svganchor').append('div')
                .attr('class', 'chart')
                .attr('id', country + '-chart');
              var chartSVG = chart.append('svg')
                //set width to just half the width of the window
                .attr('width', 240)
                .attr('height', 200);

              // Give each chart a title before the chart
              chart.append('div')
                .attr('class', 'chartTitleBackground')
                .append('h3')
                .attr('class', 'chartTitle')
                .text(country);

              //call the function to create the chart
              createChart(chartSVG, data);
            }
            globalDataSet = data;
          }
        })
      })
    })
  })
}
getCountriesData();
