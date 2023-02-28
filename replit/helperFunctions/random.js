/*
------------------------
METHOD: create something for camelCase
------------------------
  */
function toTitleCase(str) {
    // Convert the string to Title Case using a regular expression
    return str.replace(/\b[a-z]/g, char => char.toUpperCase());
  }

  export {toTitleCase};