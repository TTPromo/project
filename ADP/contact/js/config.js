/**
 * Configuration for the FAQ Accordion
 * Replace the placeholder values with your actual Google API Key and Sheet ID
 */

const CONFIG = {
    // Google Sheets API Key - obtain from Google Cloud Console
    apiKey: 'AIzaSyCIGkRFVPx4V_wzA3MtPzQG4HU0hUnGTKU',
    
    // Google Sheet ID - found in the URL of your Google Sheet
    // e.g., https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit
    sheetId: '1nTWoqR_UdDHCIkLQLZKxo-6YoK0RTIlI0zK9s65WLHY',
    
    // Range of data to fetch - A:C covers Main Category, Question, and Answer columns
    range: 'A:C',
    
    // Prefix for HTML IDs to ensure uniqueness
    idPrefix: 'faq',
    
    // Optional settings
    options: {
        // Animation speed in milliseconds
        animationSpeed: 300
    }
};
