/**
 * Dynamic FAQ Accordion with Google Sheets Integration
 * This script fetches FAQ data from a Google Sheet and builds a nested accordion
 */

document.addEventListener('DOMContentLoaded', () => {
    // Start loading FAQ data when the page loads
    fetchFAQData();
});

/**
 * Fetches FAQ data from Google Sheets API
 */
function fetchFAQData() {
    // Show loading indicator
    document.getElementById('loading').classList.remove('d-none');
    document.getElementById('faq-container').classList.add('d-none');
    document.getElementById('error-message').classList.add('d-none');
    
    const url = buildGoogleSheetsApiUrl();
    console.log("Fetching data from:", url);
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                console.error("Response not OK:", response.status, response.statusText);
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Data received:", data);
            
            // Format of data is different depending on the API version
            const sheetData = data.values || data.feed.entry;
            
            if (!sheetData || sheetData.length < 2) {
                throw new Error('No data found in the Google Sheet or insufficient data rows');
            }
            
            // Process the data
            processSheetData(sheetData);
            
            // Hide loading indicator and show FAQ container
            document.getElementById('loading').classList.add('d-none');
            document.getElementById('faq-container').classList.remove('d-none');
        })
        .catch(error => {
            console.error('Error fetching FAQ data:', error);
            
            // Try alternative API URL format
            const altUrl = buildAlternativeGoogleSheetsApiUrl();
            console.log("Trying alternative API URL:", altUrl);
            
            fetch(altUrl)
                .then(response => {
                    if (!response.ok) {
                        console.error("Alternative API also failed:", response.status, response.statusText);
                        throw new Error(`HTTP error with alternative API! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("Data received from alternative API:", data);
                    
                    // Process the data from alternative format
                    if (data.feed && data.feed.entry) {
                        processAlternativeSheetData(data.feed.entry);
                        // Hide loading indicator and show FAQ container
                        document.getElementById('loading').classList.add('d-none');
                        document.getElementById('faq-container').classList.remove('d-none');
                    } else {
                        throw new Error('Invalid data format from alternative API');
                    }
                })
                .catch(finalError => {
                    console.error('Final error after trying both APIs:', finalError);
                    // Hide loading indicator and show error message
                    document.getElementById('loading').classList.add('d-none');
                    document.getElementById('error-message').classList.remove('d-none');
                    document.getElementById('error-details').textContent = finalError.message;
                    
                    // Load CSV directly as last resort fallback
                    loadCSVFallback();
                });
        });
}

/**
 * Loads the CSV file directly as a fallback
 */
function loadCSVFallback() {
    console.log("Attempting to load CSV file directly as fallback");
    
    fetch('/Users/traviswork/CascadeProjects/merchology_faq.csv')
        .then(response => response.text())
        .then(csvText => {
            const rows = parseCSV(csvText);
            if (rows.length > 0) {
                processSheetData(rows);
                document.getElementById('faq-container').classList.remove('d-none');
            }
        })
        .catch(err => {
            console.error("CSV fallback also failed:", err);
        });
}

/**
 * Parse CSV text into array of rows
 */
function parseCSV(text) {
    const rows = [];
    const lines = text.split('\n');
    
    lines.forEach(line => {
        if (line.trim()) {
            // This is a simple CSV parser - for complex CSVs with quotes, commas in cells, etc.
            // you would need a more robust solution
            const cells = line.split(',');
            rows.push(cells);
        }
    });
    
    return rows;
}

/**
 * Builds the Google Sheets API URL using v4 API
 * @returns {string} The complete API URL
 */
function buildGoogleSheetsApiUrl() {
    return `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.sheetId}/values/${CONFIG.range}?key=${CONFIG.apiKey}`;
}

/**
 * Builds an alternative Google Sheets API URL using v3 API (list-based feed)
 * @returns {string} The alternative API URL
 */
function buildAlternativeGoogleSheetsApiUrl() {
    // This is the older API format that some of your existing components might be using
    return `https://spreadsheets.google.com/feeds/list/${CONFIG.sheetId}/1/public/values?alt=json`;
}

/**
 * Processes data from the alternative API format (list-based feed)
 * @param {Array} entries - Entry array from the feed
 */
function processAlternativeSheetData(entries) {
    const rows = entries.map(entry => {
        // Extract values from the entry object
        // The format is typically gsx$columnname.$t for each column
        const category = entry.gsx$maincategory ? entry.gsx$maincategory.$t : '';
        const question = entry.gsx$question ? entry.gsx$question.$t : '';
        const answer = entry.gsx$answer ? entry.gsx$answer.$t : '';
        
        return [category, question, answer];
    });
    
    // Add header row
    rows.unshift(['Main Category', 'Question', 'Answer']);
    
    // Process using the standard function
    processSheetData(rows);
}

/**
 * Processes the data from Google Sheets and builds the accordion
 * @param {Array} data - The data array from Google Sheets
 */
function processSheetData(data) {
    console.log("Processing data rows:", data.length);
    
    // Skip the header row if it exists
    const dataRows = data[0][0].toLowerCase() === 'main category' ? data.slice(1) : data;
    console.log("Data rows after header check:", dataRows.length);
    
    // Group by main category
    const categorizedData = groupByMainCategory(dataRows);
    
    // Build the accordion structure
    buildAccordion(categorizedData);
}

/**
 * Groups the data rows by main category
 * @param {Array} rows - Data rows from the spreadsheet
 * @returns {Object} An object with categories as keys and arrays of questions as values
 */
function groupByMainCategory(rows) {
    const categories = {};
    
    rows.forEach((row, index) => {
        if (row.length >= 3) {
            const category = row[0].trim();
            const question = row[1].trim();
            const answer = row[2].trim();
            
            if (category && question && answer) {
                if (!categories[category]) {
                    categories[category] = [];
                }
                
                categories[category].push({
                    question: question,
                    answer: answer
                });
            } else {
                console.log(`Skipping row ${index} due to missing data:`, row);
            }
        } else {
            console.log(`Row ${index} has insufficient columns:`, row);
        }
    });
    
    console.log("Categories found:", Object.keys(categories));
    console.log("Total FAQ items:", Object.values(categories).flat().length);
    
    return categories;
}

/**
 * Builds the accordion HTML structure
 * @param {Object} categorizedData - The data grouped by category
 */
function buildAccordion(categorizedData) {
    const container = document.getElementById('faq-container');
    container.innerHTML = '';
    
    let categoryIndex = 0;
    
    // Loop through each category
    for (const category in categorizedData) {
        if (categorizedData.hasOwnProperty(category)) {
            const categoryId = `${CONFIG.idPrefix}-category-${categoryIndex}`;
            const questions = categorizedData[category];
            
            console.log(`Building category: ${category} with ${questions.length} questions`);
            
            // Create category accordion item (parent)
            const categoryItem = document.createElement('article');
            categoryItem.className = 'beefup example-opensingle';
            categoryItem.innerHTML = `
                <h4 class="beefup__head">
                    <button type="button" aria-controls="${categoryId}" aria-expanded="false" id="${categoryId}-head">
                        ${category}
                    </button>
                </h4>
                <div class="beefup__body" aria-labelledby="${categoryId}-head" id="${categoryId}" role="region" hidden="hidden">
                    <div class="mockup mockup-lg" id="${categoryId}-content">
                    </div>
                </div>
            `;
            
            container.appendChild(categoryItem);
            
            // Get the content container for this category
            const contentContainer = document.getElementById(`${categoryId}-content`);
            
            // Loop through each question in this category
            questions.forEach((item, questionIndex) => {
                const questionId = `${categoryId}-q-${questionIndex}`;
                
                // Create question accordion item (child)
                const questionItem = document.createElement('article');
                questionItem.className = 'beefup example-opensingle';
                questionItem.innerHTML = `
                    <h4 class="beefup__head">
                        <button type="button" aria-controls="${questionId}" aria-expanded="false" id="${questionId}-head">
                            ${item.question}
                        </button>
                    </h4>
                    <div class="beefup__body" aria-labelledby="${questionId}-head" id="${questionId}" role="region" hidden="hidden">
                        <div class="mockup mockup-lg">
                            ${renderRawHTML(item.answer)}
                        </div>
                    </div>
                `;
                
                contentContainer.appendChild(questionItem);
            });
            
            categoryIndex++;
        }
    }
    
    // Add click event listeners to all accordion buttons
    setupAccordionListeners();
}

/**
 * Sets up click event listeners for all accordion buttons
 */
function setupAccordionListeners() {
    const allButtons = document.querySelectorAll('.beefup__head button');
    
    allButtons.forEach(button => {
        button.addEventListener('click', function() {
            const expanded = this.getAttribute('aria-expanded') === 'true';
            const targetId = this.getAttribute('aria-controls');
            const targetPanel = document.getElementById(targetId);
            
            // If already expanded, just collapse this one
            if (expanded) {
                // Collapse panel with animation
                collapsePanel(this, targetPanel);
            } else {
                // First close all other expanded panels in the same level
                const parentElement = this.closest('.beefup');
                const siblingElements = parentElement.parentElement.querySelectorAll(':scope > .beefup');
                
                siblingElements.forEach(sibling => {
                    if (sibling !== parentElement) {
                        const siblingButton = sibling.querySelector('.beefup__head button');
                        const siblingIsExpanded = siblingButton.getAttribute('aria-expanded') === 'true';
                        
                        if (siblingIsExpanded) {
                            const siblingPanelId = siblingButton.getAttribute('aria-controls');
                            const siblingPanel = document.getElementById(siblingPanelId);
                            collapsePanel(siblingButton, siblingPanel);
                        }
                    }
                });
                
                // Then expand this panel
                expandPanel(this, targetPanel);
            }
        });
    });
}

/**
 * Expands a panel with animation
 * @param {HTMLElement} button - The button that controls the panel
 * @param {HTMLElement} panel - The panel to expand
 */
function expandPanel(button, panel) {
    // Mark as expanded
    button.setAttribute('aria-expanded', 'true');
    
    // Show panel with animation
    panel.removeAttribute('hidden');
    
    // Get height and set it
    const height = panel.scrollHeight;
    panel.style.height = '0px';
    
    // Force reflow
    panel.offsetHeight;
    
    // Start animation
    panel.style.height = height + 'px';
    
    // Clear inline height after animation completes
    setTimeout(() => {
        panel.style.height = '';
    }, 500); // Match duration with CSS transition
}

/**
 * Collapses a panel with animation
 * @param {HTMLElement} button - The button that controls the panel
 * @param {HTMLElement} panel - The panel to collapse
 */
function collapsePanel(button, panel) {
    // Mark as collapsed
    button.setAttribute('aria-expanded', 'false');
    
    // Collapse panel with animation
    const currentHeight = panel.scrollHeight;
    panel.style.height = currentHeight + 'px';
    
    // Force reflow
    panel.offsetHeight;
    
    // Start animation
    panel.style.height = '0px';
    
    // Set hidden after animation completes
    setTimeout(() => {
        panel.setAttribute('hidden', 'hidden');
        panel.style.height = '';
    }, 500); // Match duration with CSS transition
}

/**
 * Renders HTML content from Google Sheets
 * If the content contains HTML tags, it will be rendered as HTML
 * Otherwise, it will be formatted with proper paragraphs and lists
 * @param {string} content - The raw content from Google Sheets
 * @returns {string} Formatted HTML
 */
function renderRawHTML(content) {
    if (!content) return '';
    
    // Check if content already contains HTML tags
    const containsHTML = /<[a-z][\s\S]*>/i.test(content);
    
    if (containsHTML) {
        // Content already has HTML, return it directly
        return content;
    } else {
        // Format the plain text content
        return formatAnswer(content);
    }
}

/**
 * Formats the answer text with proper HTML
 * @param {string} answerText - The raw answer text
 * @returns {string} Formatted HTML
 */
function formatAnswer(answerText) {
    if (!answerText) return '';
    
    // Handle multi-paragraph content
    let paragraphs = answerText.split(/\n\n+/);
    let formattedContent = '';
    
    paragraphs.forEach(paragraph => {
        paragraph = paragraph.trim();
        if (!paragraph) return;
        
        // Check if paragraph is a list (starts with - or *)
        if (paragraph.match(/^[-*]/m)) {
            // Convert list items
            const listItems = paragraph.split(/\n[-*]\s+/).filter(Boolean);
            if (listItems.length > 0) {
                formattedContent += '<ul>';
                listItems.forEach(item => {
                    formattedContent += `<li>${item.trim()}</li>`;
                });
                formattedContent += '</ul>';
            }
        } else {
            // Regular paragraph with potential single line breaks
            paragraph = paragraph.replace(/\n/g, '<br>');
            formattedContent += `<p>${paragraph}</p>`;
        }
    });
    
    return formattedContent;
}
