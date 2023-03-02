/*
------------------------
METHOD: create the table that shows the country data
------------------------
*/
function createCountryDivs(data) {
  //remove the existing divs except the first one
  var tableData = document.getElementById('datavizCopy')
  while (tableData.children.length > 1) {
    tableData.removeChild(tableData.lastChild);
  }
  data.forEach(function(d) {
    var div = document.createElement("div");
    //give the div a class of 'country'
    div.classList.add("tableCountry");
    div.innerHTML =
      `<p>${d.Country}</p>
      <p>${d.low}%</p>
      <p>${d.intermediate}%</p>
      <p>${d.high}%</p>
      <p>${d.advanced}%</p>`
    tableData.appendChild(div);
  });
}

/*
------------------------
METHOD: add the button handler to the side panel button
------------------------
*/
function sidePanelButtonHandler(sidePanelButton, sidePanel) {
  let sidePanelHolder = document.getElementById(sidePanelButton)
  sidePanelHolder.addEventListener("click", function() {
    let datavizCopy = document.getElementById(sidePanel)
    if (datavizCopy.style.display === "none") {
      datavizCopy.style.display = "block"
    } else {
      datavizCopy.style.display = "none"
    }
  });
}

// Exporting variables and functions
export { createCountryDivs, sidePanelButtonHandler };