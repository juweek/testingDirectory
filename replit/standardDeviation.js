/*
------------------------
METHOD: set the dimensions of the graph
------------------------
*/
var margin = { top: 10, right: 30, bottom: 0, left: 140 },
  width = 760 - margin.left - margin.right,
  height = 1500 - margin.top - margin.bottom;

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
METHOD: create an event handler and listener for the search bar. this event handler will take in the string read in by the search and will rewrite the d3 function to filter out all the entrries that do not contain the string
------------------------
*/
var searchBar = d3.select("#searchBar");
searchBar.on("input", function () {
})

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
METHOD: create something for camelCase
------------------------
  */
function toTitleCase(str) {
  // Convert the string to Title Case using a regular expression
  return str.replace(/\b[a-z]/g, char => char.toUpperCase());
}


/*
------------------------
METHOD: show all of the clicked buttons in a div
------------------------
  */
function showClicked(currentClickedButtons, data) {
  //clear out the div
  d3.select("#searchBarResults").selectAll("*").remove();
  //add the new divs
  d3.select("#searchBarResults")
    .selectAll("div")
    .data(currentClickedButtons)
    .enter()
    .append("div")
    .text(function (d) {
      //get the name of the country from d
      return d;
    })
    .on("click", function (d) {
      //remove the current clicked button from the list
      let index = clickedButtons.indexOf(d);
      if (index > -1) {
        clickedButtons.splice(index, 1);
      }
      //if there are no more clicked buttons, you set the data to the master data set
      showClicked(clickedButtons, data);
      //show the clicked buttons
    })
  //if there are no more clicked buttons, you set the data to the master data set
  var tempfilteredData = [];
  if (currentClickedButtons.length == 0) {
    globalDataSet = masterDataSet;
  } else {
    tempfilteredData = masterDataSet.filter(item => currentClickedButtons.includes(item.Country));
    //console.log(tempfilteredData)
    globalDataSet = tempfilteredData;
  }
  if (tempfilteredData.length == 0) {
    createChart(svg, masterDataSet);
  }
  else {
    createChart(svg, tempfilteredData);
  }

  //filter down data to only the countries that are in the list of clicked buttons
}

/*
------------------------
METHOD: sort data to use after a dropdown is selected
------------------------
  */
function sortList(data, property, order) {
  // Sort the list of objects based on the specified property and sort order
  if (order !== 'asc' && order !== 'desc') {
    throw new Error('Invalid sort order. Must be "asc" or "desc"');
  }
  const sortedList = data.sort((a, b) => {
    // If the sort order is 'asc', return -1 if a comes before b,
    // 0 if a and b are equal, and 1 if a comes after b
    if (order === 'asc') {
      if (a[property] < b[property]) return -1;
      if (a[property] > b[property]) return 1;
      return 0;
    }
    // If the sort order is 'desc', return 1 if a comes before b,
    // 0 if a and b are equal, and -1 if a comes after b
    if (order === 'desc') {
      if (a[property] < b[property]) return 1;
      if (a[property] > b[property]) return -1;
      return 0;
    }
  });
  return sortedList;
}

/*
------------------------
METHOD: create the d3 chart. set the y axis to the countries
------------------------
*/
function createChart(svg, data) {
  var width = svg.attr("width")
  //set the height relative to the length of the data
  var height = data.length * 30;
  //clear out the svg 
  //get the height of the svg
  svg.selectAll("*").remove();
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

  //create a loop that creates a vertical zebra background for the chart that alternates between grey and white every 10  points on the x axis
    var zebra = 0;
    for (var i = 200; i < 800; i++) {
      if (zebra == 0) { 
        svg.append("rect")
          .attr("x", x(i))
          .attr("y", 0)
          .attr("width", x(200))
          .attr("height", height)
          .attr("fill", "#f2f2f2");
        zebra = 1;
      }
      else {
        svg.append("rect")
          .attr("x", x(i))
          .attr("y", 0)
          .attr("width", x(200))
          .attr("height", height)
          .attr("fill", "#ffffff");
        zebra = 0;
      }
      i = i + 99;
    }

  // Y axis
  var y = d3.scaleBand()
    .range([0, height])
    .domain(data.map(function (d) { return d.Country; }))
    .padding(1);
  svg.append("g")
    .attr("id", "yAxis")
    .call(d3.axisLeft(y))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr('class', 'yAxisText')

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
    .attr("x", function (d) {
      return x(d.fifth_percentile);
    })
    .attr("y", function (d) { return y(d.Country); })
    //the width will be the total distribution of scores
    .attr("class", "firstRect")
    .attr("width", function (d) {
      let fifth = x(d.fifth_percentile)
      let nintey_fifth = x(d.nintey_fifth)
      return (nintey_fifth - fifth) + 20
    })
    .attr("height", 15)
    .attr("z-index", 1)
    .attr("stroke", "black")
    .style("fill", "#E85955")
    .on("mouseenter", function (d) {
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
    .attr("x", function (d) { return x(d.twenty_fifth); })
    .attr("y", function (d) { return y(d.Country); })
    .attr("class", "secondRect")
    .attr("width", function (d) {
      let twentyFifth = x(d.twenty_fifth)
      let seventy_fifth = x(d.seventy_fifth)
      return (seventy_fifth - twentyFifth) + 20
    })
    .attr("height", 15)
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
    .attr("x", function (d) { return x(d.nintey_fifth_confidence); })
    .attr("y", function (d) { return y(d.Country); })
    .attr("width", function (d) {
      let fifth = x(d.seventy_fifth)
      let twenthyFifth = x(d.nintey_fifth)
      return 3
    })
    .attr("height", 15)
    .attr("z-index", 4)
    .attr("stroke", "black")
    .style("fill", "black")


  let dataChart = d3.select("#my_dataviz")

  dataChart.on("mouseleave", function () {
    //remove 'active' from all line elements
    let tooltip = d3.select("#tooltip");
    tooltip.style("display", "none");
  })
}

/*
------------------------
METHOD: read in the data and create the axes
------------------------
*/
d3.csv("https://html-css-js.jadesign.repl.co/data/standardDeviation2.csv", function (data) {
  var currentDataSet = data
  globalDataSet = data
  masterDataSet = data
  // Add X axis
  var x = d3.scaleLinear()
    .domain([100, 800])
    .range([0, width]);
  // Create the second x-axis generator
  var xAxis2 = d3.axisBottom(x);

  d3.select("#xAxisDiv")
    .append("g")
    .attr("id", "xAxis2")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis2);

  // Append the main vertical line
  /*
  ------------------------
  METHOD: create the dropdowns that determine if we will sort or search
  ------------------------
  */
  d3.selectAll(".dropdownMenu").on("change", function () {
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
  });

  /*
------------------------
METHOD: create the search bar that will take in the string and filter out all the countries that don't include it
------------------------
*/
  d3.selectAll("#searchBar").on("keyup", function () {
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
    createChart(svg, newData);
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
    const inputValue = event.target.value;
    let html = '';

    const filteredResults = countries.filter(result => result.includes(inputValue.toLowerCase()));

    //if the search inputValue is empty, then don't show the results and instead show 'no results'
    if (inputValue === '') {
      resultsDropdown.innerHTML = '';
      return;
    }
    else if (filteredResults == '') {
      resultsDropdown.innerHTML = 'No results';
      return;
    }
    else {
      //change string to titleCase
      filteredResults.forEach(result => {
        html += `<button class="resultButton">${toTitleCase(result)}</button>`;
      });
      // Update the results dropdown with the new HTML
      resultsDropdown.innerHTML = html;
    }
    // Select all buttons with the class "resultButton"
    const buttons = d3.selectAll('.resultButton');

    // Attach a click event listener to each button
    buttons.on('click', function () {
      let button = d3.select(this);
      //print out the innerhtml or the country name of the button
      clickedButtons.push(button._groups[0][0].innerHTML);
      //hide the results dropdown
      resultsDropdown.innerHTML = '';
      //call the function to filter the buttons that have been clicked
      showClicked(clickedButtons, globalDataSet);
    });
  });

  /*
------------------------
METHOD: make width the half the size of the viewport width, until it gets down to mobile, where it should be 100% of the width
------------------------
*/

  function reportWindowSize() {
    if (window.innerWidth > 768) {
      width = 760;
      height = 1500;
    }
    else {
      width = window.innerWidth - 60;
      height = 1500;
    }
    //set the new width and height of the svg
    svg.attr("width", width)
    svg.attr("height", height);
    //set the new width and height of the x-axis
    createChart(svg, globalDataSet);
  }

  window.onresize = reportWindowSize;
  //fire resize event on load
  reportWindowSize();

});