/*global document, requestAnimationFrame*/
/*jslint plusplus: true*/

/*
Name: Andy Nguyen
Date: 11/08/2023
Description: Making an interactive dynamic multiplication table. Have a HTML form to accept user inputs and validate the
inputs by using JavaScript. JavaScript is also used to make the table. The formatting and styling is done by CSS.
*/

// function to check if value is an integer
function isInteger(value) {
    
    return Number.isInteger(value);
}

function checkValidInput(fieldName, errorSpan) {
    
    var inputValue = parseInt(document.getElementById(fieldName).value);
    errorSpan.innerHTML = "";
    
    // check for valid integer input
    if (!isInteger(inputValue)) {
        errorSpan.innerHTML = "Error! Invalid input for submission form. Please enter a valid integer value.";
    } 
}

function checkValidRange(fieldName, errorSpan) {
    
    var minValue = parseInt(document.getElementById("min" + fieldName).value);
    var maxValue = parseInt(document.getElementById("max" + fieldName).value);
    errorSpan.innerHTML = "";

    // check for valid range
    if (minValue > maxValue) {
        errorSpan.innerHTML = "Error! The starting number should be less than or equal to the end number.";
    }
}

// this function will make an error message
function displayErrorMessage(fieldName, message, validationType) {
    
    var inputField = document.getElementById(fieldName);
    var errorSpan = document.getElementById("error" + fieldName);
    
    if (!errorSpan) {
        errorSpan = document.createElement("span");
        errorSpan.id = "error" + fieldName;
        errorSpan.className = "errorMessage";
        // append error message span right after the input field
        inputField.parentNode.insertBefore(errorSpan, inputField.nextSibling);
    }

    errorSpan.innerHTML = message;

    if (validationType === "range") {
        var fieldNamePrefix = fieldName.includes("row") ? "row" : "column";
        checkValidRange(fieldNamePrefix, errorSpan);
    } else {
        checkValidInput(fieldName, errorSpan);
    }
}

function generateTable() {
    
    // get the input values
    var minRowValue = parseInt(document.getElementById("minrow").value);
    var maxRowValue = parseInt(document.getElementById("maxrow").value);
    var minColValue = parseInt(document.getElementById("mincolumn").value);
    var maxColValue = parseInt(document.getElementById("maxcolumn").value);
    
    // check for valid integer input
    if (!isInteger(minRowValue) || !isInteger(maxRowValue) || !isInteger(minColValue) || !isInteger(maxColValue)) {
        displayErrorMessage("minrow", "Error! Invalid input(s) for submission form. Please enter valid integer values.");
        displayErrorMessage("maxrow", "Error! Invalid input(s) for submission form. Please enter valid integer values.");
        displayErrorMessage("mincolumn", "Error! Invalid input(s) for submission form. Please enter valid integer values.");
        displayErrorMessage("maxcolumn", "Error! Invalid input(s) for submission form. Please enter valid integer values.");
        return;
    }
    
    // check if starting number is less than or equal to end number
    if (minRowValue > maxRowValue || minColValue > maxColValue) {
        displayErrorMessage("minrow", "The starting number should be less than or equal to the end number.", "range");
        displayErrorMessage("maxrow", "The starting number should be less than or equal to the end number.", "range");
        displayErrorMessage("mincolumn", "The starting number should be less than or equal to the end number.", "range");
        displayErrorMessage("maxcolumn", "The starting number should be less than or equal to the end number.", "range");
        return;
    }
    
    // clear previous errors
    document.querySelectorAll(".errorMessage").forEach(function (element) {
        element.innerHTML = "";
    });
    
    // clear previous table
    document.getElementById("multiplicationTable").innerHTML = "";
    
    // make a new table
    var table = document.getElementById("multiplicationTable");
    
    // add header rows
    var headRow = table.insertRow(0);
    headRow.insertCell().outerHTML = "<th></th>";   // empty corner
    
    for (var i = minRowValue; i <= maxRowValue; i++) {
        headRow.insertCell().outerHTML = "<th>" + i + "</th>";
    }
    
    // function to generate data rows incrementally. More explained below.
    function generateRows (minColValue, maxColValue) {
        for (var j = minColValue; j<= maxColValue; j++) {
            var row = table.insertRow(-1);
            row.insertCell().outerHTML = "<th>" + j + "</th>";
            for (var h = minRowValue; h <= maxRowValue; h++) {
                row.insertCell().innerHTML = j * h;
            }
        }
    }
    
    /*The following code generates portions/chunks of the table (incrementally) when there is a large number.
        This is to prevent the page from becoming unresponsive and displaying the error. Still, entering large numbers
        may cause some lag and the creation of the table will take some time but not too long.*/ 
    
    // set the chunk size based on the number of columns
    var chunkSize = 20;
    var totalColumns = maxColValue - minColValue + 1;
    var chunks = Math.ceil(totalColumns / chunkSize);

    // function to generate each chunk
    function generateChunk(chunkIndex) {
        var startCol = minColValue + chunkIndex * chunkSize;
        var endCol = Math.min(minColValue + (chunkIndex + 1) * chunkSize - 1, maxColValue);
        generateRows(startCol, endCol);

        // request the next chunk
        if (chunkIndex < chunks - 1) {
            requestAnimationFrame(function () {
                generateChunk(chunkIndex + 1);
            });
        }
    }

    // generate first chunk
    generateChunk(0);
}

// event listener for the form submission
document.getElementById("form").addEventListener("submit", function(event) {
    
    event.preventDefault();
    generateTable();
});

// initial check for valid input
var initialValidation = function () {
    
    // check for valid input value
    checkValidInput("minrow", document.getElementById("errorminrow"));
    checkValidInput("maxrow", document.getElementById("errormaxrow"));
    checkValidInput("mincolumn", document.getElementById("errormincolumn"));
    checkValidInput("maxcolumn", document.getElementById("errormaxcolumn"));

    // check for valid range
    checkValidRange("row", document.getElementById("errorMinRow"));
    checkValidRange("row", document.getElementById("errorMaxRow"));
    checkValidRange("column", document.getElementById("errorMinColumn"));
    checkValidRange("column", document.getElementById("errorMaxColumn"));

    // continue checking for valid input
    requestAnimationFrame(initialValidation);
    
};

// start checking for valid input
initialValidation();