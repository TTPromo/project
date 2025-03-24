// A simple Node.js proxy server to fetch Google Sheets data
const http = require('http');
const https = require('https');
const url = require('url');

const PORT = 3000;

// Create a simple HTTP server
const server = http.createServer((req, res) => {
    // Set CORS headers to allow requests from any origin
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // Parse the request URL
    const parsedUrl = url.parse(req.url, true);
    console.log('Received request:', parsedUrl.pathname, parsedUrl.query);
    
    // Only handle requests to /fetch-sheet
    if (parsedUrl.pathname === '/fetch-sheet' && req.method === 'GET') {
        // Get the spreadsheet ID from the query parameters
        const spreadsheetId = parsedUrl.query.id;
        
        if (!spreadsheetId) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing spreadsheet ID' }));
            return;
        }
        
        // Construct the URL for the Google Sheets CSV export
        const googleSheetsUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv`;
        
        console.log(`Fetching data from Google Sheets: ${googleSheetsUrl}`);
        
        // Make a request to Google Sheets
        https.get(googleSheetsUrl, (sheetRes) => {
            let data = '';
            
            // A chunk of data has been received
            sheetRes.on('data', (chunk) => {
                data += chunk;
            });
            
            // The whole response has been received
            sheetRes.on('end', () => {
                console.log(`Google Sheets response status: ${sheetRes.statusCode}`);
                
                if (sheetRes.statusCode === 200) {
                    // Log the first 100 characters of the response
                    console.log(`Google Sheets data (first 100 chars): ${data.substring(0, 100)}...`);
                    
                    // Set the content type to CSV
                    res.writeHead(200, { 'Content-Type': 'text/csv' });
                    res.end(data);
                } else {
                    // Log the error response
                    console.error(`Google Sheets error response: ${data}`);
                    
                    // Forward the error status code and message
                    res.writeHead(sheetRes.statusCode, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                        error: 'Error fetching Google Sheets data',
                        status: sheetRes.statusCode,
                        message: data
                    }));
                }
            });
        }).on('error', (err) => {
            // Handle errors
            console.error('Error fetching Google Sheets data:', err.message);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error fetching Google Sheets data', message: err.message }));
        });
    } else {
        // Handle all other requests
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
    }
});

// Start the server
server.listen(PORT, () => {
    console.log(`Proxy server running at http://localhost:${PORT}`);
    console.log(`To fetch Google Sheets data, use: http://localhost:${PORT}/fetch-sheet?id=YOUR_SPREADSHEET_ID`);
});
