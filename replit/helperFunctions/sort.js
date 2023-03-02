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
METHOD: add the button handler to the side panel button
------------------------
*/
function sortDropdownHandler(orderDropdown, globalDataSet, svg) {
  var sortDropdown = d3.select("#sortDropdown");
    let value = sortDropdown.property("value")
    let newData = []
    //first, check if the orderDropdown is set to asc or desc, then call the sort function you created above
    if (orderDropdown.property("value") === "asc") {
      newData = sortList(globalDataSet, value, "asc")
    } else {
      newData = sortList(globalDataSet, value, "desc")
    }
    return newData;
}

// Exporting variables and functions
export { sortList, sortDropdownHandler };