// Initialize the application when the document is ready
$(document).ready(function() {
    // Try to load from Google Sheets first, but use sample data as fallback
    try {
        console.log('Attempting to load data from Google Sheets...');
        $('.loading-status').text('Connecting to Google Sheets...');
        
        // Use a direct approach to fetch public Google Sheets data
        fetchPublicGoogleSheet();
        
        // Set a timeout to use sample data if Google Sheets doesn't load or fails
        setTimeout(function() {
            if ($('.product-carousel').children().length <= 1) { // Only loading message exists
                console.log('Google Sheets connection timed out, using sample data as fallback');
                $('.loading-status').text('Using sample data (Google Sheets connection timed out)');
                useSampleData();
            }
        }, 8000); // Wait 8 seconds before falling back to sample data
    } catch (error) {
        console.error('Error loading Google Sheets data, using sample data instead:', error);
        $('.loading-status').text('Using sample data (Error: ' + error.message + ')');
        useSampleData();
    }
});

// Use sample data instead of Google Sheets
function useSampleData() {
    if (typeof SAMPLE_PRODUCTS !== 'undefined') {
        console.log('Loading sample product data...');
        $('.loading-status').text('Using sample product data');
        // Convert sample data to the format expected by renderProducts
        const formattedData = SAMPLE_PRODUCTS.map(product => [
            product.imageUrl,
            product.title,
            product.description,
            product.price,
            product.productLink
        ]);
        
        // Render products using sample data
        renderProducts(formattedData);
        
        // Render featured products
        renderFeaturedProducts(formattedData);
        
        // Also populate the scrolling banner
        populateScrollingBanner(formattedData);
    } else {
        $('.loading').text('Error: Sample data not found.');
        $('.loading-status').text('Error: Sample data not found');
    }
}

// Fetch data from a public Google Sheet using a different approach
function fetchPublicGoogleSheet() {
    const sheetId = CONFIG.spreadsheetId;
    
    // Use the public Google Sheets JSON feed
    const url = `https://opensheet.elk.sh/${sheetId}/Sheet1`;
    
    console.log('Fetching Google Sheets data using public API:', url);
    $('.loading-status').text('Fetching data from Google Sheets (public API)...');
    
    // Fetch the data using jQuery AJAX
    $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            console.log('Successfully received data from Google Sheets:', data);
            
            if (data && data.length > 0) {
                // Convert the data format to match what our renderProducts function expects
                const formattedData = data.map(row => [
                    row['Image URL'] || row['Image'] || row['ImageURL'] || row['imageUrl'] || '',
                    row['Title'] || row['Product'] || row['Name'] || row['title'] || '',
                    row['Description'] || row['Desc'] || row['description'] || '',
                    row['Price'] || row['price'] || '',
                    row['Product Link'] || row['Link'] || row['URL'] || row['productLink'] || ''
                ]);
                
                console.log('Found', formattedData.length, 'products in the spreadsheet');
                $('.loading-status').text('Successfully loaded ' + formattedData.length + ' products from Google Sheets');
                
                // Process the data and render the products
                renderProducts(formattedData);
                
                // Render featured products
                renderFeaturedProducts(formattedData);
                
                // Also populate the scrolling banner
                populateScrollingBanner(formattedData);
            } else {
                console.warn('No products found in the spreadsheet, using sample data instead.');
                $('.loading-status').text('No products found in Google Sheets, using sample data');
                useSampleData();
            }
        },
        error: function(xhr, status, error) {
            console.error('Error fetching data from Google Sheets:', error);
            console.error('Response:', xhr.responseText);
            $('.loading-status').text('Using sample data (Error fetching from Google Sheets: ' + error + ')');
            useSampleData(); // Fall back to sample data
        }
    });
}

// Render products in the carousel
function renderProducts(data) {
    const $carousel = $('.product-carousel');
    $carousel.empty(); // Clear the loading message
    
    // Process each row of data from the spreadsheet
    data.forEach(row => {
        // Expected columns: Image URL, Title, Description, Price, Product Link
        if (row.length >= 5) {
            const [imageUrl, title, description, price, productLink] = row;
            
            // Create a product slide
            const $slide = $('<div class="product-slide"></div>');
            
            // Add product image
            $slide.append(`<img src="${imageUrl}" alt="${title}" class="product-image">`);
            
            // Add product info
            const $info = $('<div class="product-info"></div>');
            $info.append(`<h3 class="product-title">${title}</h3>`);
            $info.append(`<p class="product-description">${description}</p>`);
            $info.append(`<div class="product-price">${price}</div>`);
            $info.append(`<a href="${productLink}" class="product-link" target="_blank">View Product</a>`);
            
            $slide.append($info);
            $carousel.append($slide);
        }
    });
    
    // Initialize the Slick Carousel
    $carousel.slick(CONFIG.carouselSettings);
}

// Render featured products in the featured slider with background image
function renderFeaturedProducts(data) {
    const $featuredSlider = $('.featured-product-slider');
    $featuredSlider.empty(); // Clear the loading message
    
    // Process each row of data from the spreadsheet
    data.forEach(row => {
        // Expected columns: Image URL, Title, Description, Price, Product Link
        if (row.length >= 5) {
            const [imageUrl, title, description, price, productLink] = row;
            
            // Create a featured product slide with background image
            const $slide = $('<div class="featured-product-slide"></div>');
            
            // Add product image as img element
            $slide.append(`<img src="${imageUrl}" alt="${title}" class="featured-product-image">`);
            
            // Add product info as an overlay
            const $info = $('<div class="featured-product-info"></div>');
            $info.append(`<h2 class="featured-product-title">${title}</h2>`);
            
            // Truncate description if it's too long
            const truncatedDesc = description.length > 150 ? 
                description.substring(0, 150) + '...' : 
                description;
                
            $info.append(`<p class="featured-product-description">${truncatedDesc}</p>`);
            $info.append(`<div class="featured-product-price">${price}</div>`);
            $info.append(`<a href="${productLink}" class="featured-product-link" target="_blank">Shop Now</a>`);
            
            $slide.append($info);
            $featuredSlider.append($slide);
        }
    });
    
    // Initialize the Featured Slick Carousel
    $featuredSlider.slick(CONFIG.featuredSliderSettings);
}

// Populate the scrolling banner with featured products
function populateScrollingBanner(data) {
    const $bannerContent = $('.banner-content');
    $bannerContent.empty();
    
    // Select a few products for the banner (e.g., first 5 products)
    const featuredProducts = data.slice(0, 5);
    
    featuredProducts.forEach(row => {
        if (row.length >= 5) {
            const [_, title, __, price, productLink] = row; // Using _ for unused variables
            
            // Create a banner item
            const $bannerItem = $(`
                <span class="banner-item">
                    <strong>${title}</strong> - ${price} - 
                    <a href="${productLink}" target="_blank">Shop Now</a>
                </span>
            `);
            
            $bannerContent.append($bannerItem);
        }
    });
    
    // If no products were added to the banner, add a default message
    if ($bannerContent.children().length === 0) {
        $bannerContent.append('<span class="banner-item">Check out our featured products!</span>');
    }
}
