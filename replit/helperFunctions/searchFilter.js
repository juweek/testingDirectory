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
      //set the font size
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
        //check the text in the search bar and see if the substring is in the text of the button you just clicked
        let currentSearchText = d3.select("#searchBarSelector").property("value").toLowerCase();
        console.log(d)
        console.log(currentSearchText)
        //check if currentSearchText is a substring of d
        if (d.toLowerCase().includes(currentSearchText)) {
          //if it is, add the button to resultsDropdown 
          let resultsDropdown = d3.select("#searchBarResults")._groups[0][0];
          let html = `<button class="resultButton">${toTitleCase(d)}</button>`;
          resultsDropdown.innerHTML += html;
      }
  
  
        //recall the method to show the buttons in the search bar
        let searchValue = d3.select("#searchBarSelector").property("value");
        let countriesList = data.map(d => d.Country.toLowerCase());
        let resultsDropdown = d3.select("#searchBarResults")._groups[0][0];
  
        //create an array of all the countries
        let countries = []
        data.forEach(country => {
          //push the lowercase version of the country into the array
          countries.push(country.Country.toLowerCase())
        })
  
        //check to see if the button you just clicked matches the search bar
        const filteredResults = countriesList.filter(result => result.includes(searchValue.toLowerCase()));
        createSearchResults(searchValue, countriesList, resultsDropdown);
  
        //if there are no moe clicked buttons, you set the data to the master data set
        showClicked(clickedButtons, data);
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
      createCountryDivs(masterDataSet);
    }
    else {
      createChart(svg, tempfilteredData);
      createCountryDivs(tempfilteredData);
    }
  }



  /*
------------------------
METHOD: create the results for the searchbar menu
------------------------
  */
function createSearchResults(searchValue, countriesList, resultsDropdown) {
    const inputValue = searchValue;
  
    let html = '';
  
    const filteredResults = countriesList.filter(result => result.includes(inputValue.toLowerCase()));
  
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
        // Create a new button for each result
        html += `<button class="resultButton" id="${toTitleCase(result)}">${toTitleCase(result)}</button>`;
      });
      // Update the results dropdown with the new HTML
      resultsDropdown.innerHTML = html;
    }
    // Select all buttons with the class "resultButton"
    const buttons = d3.selectAll('.resultButton');
  
    // Attach a click event listener to each button
    buttons.on('click', function () {
      let button = d3.select(this);
      //add the current clicked button to the list of clicked buttons
      clickedButtons.push(button._groups[0][0].innerHTML);
      //hide the current clicked button
      button.style("display", "none");
      //call the function to filter the buttons that have been clicked
      showClicked(clickedButtons, globalDataSet);
    });
  }
  


  export {showClicked, createSearchResults};