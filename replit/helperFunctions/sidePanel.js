/*
------------------------
METHOD: create the table that shows the country data
------------------------
*/
function createCountryDivs(data) {
  console.log('this is being called')
  //remove the existing divs except the first one
  var tableData = document.getElementById('datavizCopy')
  while (tableData.children.length > 1) {
    tableData.removeChild(tableData.lastChild);
  }
  data.forEach(function (d) {
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
  let sidePanel = document.getElementById(sidePanelButton)
  sidePanel.addEventListener("click", function () {
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