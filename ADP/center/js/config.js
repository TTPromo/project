// Configuration for the e-commerce product slider

// Google Sheets API configuration
const CONFIG = {
    // Google Sheets API key (not needed for public sheets)
    apiKey: 'AIzaSyAKYsUgLMi8RT7j1uKmkUIQgfNZvwHkLZ4',
    
    // Google Sheet ID
    // This is the ID from your Google Sheet URL:
    // https://docs.google.com/spreadsheets/d/[THIS_IS_THE_ID]/edit
    spreadsheetId: '14Q1wI4epoGjq9iXBlRbJ0d8UVXrm_s76J4n9KgsqKok',
    
    // Sheet name and range
    // Format: 'SheetName!StartCell:EndCell'
    // Example: 'Sheet1!A2:E50' (columns A-E, rows 2-50)
    range: 'Sheet1!A2:F50',
    
    // Slick Carousel settings for the main product carousel
    carouselSettings: {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        adaptiveHeight: false, // Disable adaptive height to keep consistent card sizes
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    },
    
    // Slick Carousel settings for the featured product slider
    featuredSliderSettings: {
        dots: true,
        arrows: false,
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        fade: true,
        cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)'
    }
};
