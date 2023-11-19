const CLIENT_ID = '630899353705-198k8nkn8mocnnaab3fu6hm86gn2esr4.apps.googleusercontent.com';
const API_KEY = 'AIzaSyDqajjapZSMnbLCkhmAxPppQFjO3Cg5aI4';
// Replace with your own Google Sheets API key and client ID

// Array to store the retrieved data
let sheetData = [];

// Client ID and API key from the Developer Console
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
const SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";

// Function to load the API client library
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

// Function to initialize the API client library and set up sign-in state
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    }).catch(function (error) {
        console.error('Error initializing the Google Sheets API client: ', error);
    });
}

// Function to handle changes in the sign-in state
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        // API is authorized and the user is signed in
        fetchDataFromSheet();
    } else {
        // User is not signed in. Start the sign-in process.
        gapi.auth2.getAuthInstance().signIn();
    }
}

// Function to fetch data from the Google Sheet
function fetchDataFromSheet() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: '1bNpIplWusqEn1CmvHD6s-XBIHmtG0_3boeeB5bvJU1A',
        range: 'Sheet1' // Change to your sheet name or range
    }).then(function(response) {
        const values = response.result.values;

        if (values.length > 0) {
            // Process the data (for simplicity, just log it to console here)
            sheetData = values;
            console.log(sheetData);

            // Display the data on the HTML page
            displayDataOnPage();
        } else {
            console.log('No data found.');
        }
    }).catch(function(error) {
        console.error('Error fetching data from Google Sheet: ', error);
    });
}

// Function to display data on the HTML page
function displayDataOnPage() {
    const outputDiv = document.getElementById('output');

    // Create a simple table for demonstration purposes
    const table = document.createElement('table');
    sheetData.forEach(function(row) {
        const tr = document.createElement('tr');
        row.forEach(function(cell) {
            const td = document.createElement('td');
            td.appendChild(document.createTextNode(cell));
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });

    outputDiv.appendChild(table);
}

// Load the API client library and set up the sign-in state
handleClientLoad();
