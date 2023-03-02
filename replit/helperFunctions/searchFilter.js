import { toTitleCase } from './random.js';

/*
------------------------
METHOD: show all of the clicked buttons in a div. Have data be the master data where you check your data against, and currentlySelectedCountries is the abbreviated data that fits in with the rest of the filters
------------------------
*/
function showClicked(currentlySelectedCountries, data) {
  //clear out the current Search Bar results and populate it with the currentSelectedCountries.
  d3.select("#searchBarResults").selectAll("*").remove();
  d3.select("#searchBarResults")
    .selectAll("div")
    .data(currentlySelectedCountries)
    .enter()
    .append("div")
    .attr("id", function(d) {
      return "selectedCountry" + d;
    })
    .attr("class", "selectedCountry")
    .text(function(d) {
      return d;
    })
}

/*
------------------------
METHOD: create the results for the searchbar menu and handle w hen a button is clicked
------------------------
*/
function createSearchResults(data, searchValue, countriesList, searchBarResultsDiv) {
  //loop through the data and create a new array that only has the countries with the searchValue in them
  const countriesFromSearch = countriesList.filter(result => result.includes(searchValue.toLowerCase()));
  let html = '';

  //if the search inputValue is empty, then don't show the results and instead show 'no results'
  if (searchValue === '') {
    searchBarResultsDiv.innerHTML = '';
    return;
  }
  else if (countriesFromSearch == '') {
    searchBarResultsDiv.innerHTML = 'No results';
    return;
  }
  else {
    //change string to titleCase and create a new button for each matching result
    countriesFromSearch.forEach(result => {
      html += `<button class="resultButton" id="${toTitleCase(result)}">${toTitleCase(result)}</button>`;
    });

    // Update the searchResultsDiv with the new buttons in the html. create variables for the new HTML and the new button list
    searchBarResultsDiv.innerHTML = html;
    let selectedCountriesDiv = document.querySelectorAll('.selectedCountry');
    let currentCountriesInSearchResults = document.querySelectorAll('.resultButton');

    //for every button in searchBarResults, mark it gray if it already appears selected
    for (let i = 0; i < selectedCountriesDiv.length; i++) {
      let currentButtonID = selectedCountriesDiv[i].id.replace('selectedCountry', '');
      for (let j = 0; j < currentCountriesInSearchResults.length; j++) {
        if (currentButtonID == currentCountriesInSearchResults[j].id) {
          currentCountriesInSearchResults[j].classList.add('resultButtonSelected');
        }
      }
    }
  }
}

export { showClicked, createSearchResults };