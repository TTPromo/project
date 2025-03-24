# E-commerce Product Slider with Google Sheets Integration

A responsive product carousel and scrolling banner that pulls product data from Google Sheets for your e-commerce landing page.

## Features

- Responsive product carousel using Slick Carousel
- Scrolling banner for featured products
- Integration with Google Sheets API to fetch product data
- Sample data included for immediate testing
- Responsive design for all devices
- Customizable styling
- Featured product flag functionality: mark products as "featured" in your Google Sheet to display them in a special highlighted section
- Featured product flag functionality: use checkboxes in Google Sheets to mark products as featured

## Quick Start

1. Simply open the `index.html` file in your browser to see the product slider in action with sample data
2. The slider will automatically use the included sample product data
3. To use your own Google Sheet data, follow the Google Sheets setup instructions below

## Google Sheets Setup (Optional)

### 1. Google Sheets Setup

1. Create a new Google Spreadsheet or use an existing one
2. Format your spreadsheet with the following columns:
   - Column A: Product Image URL
   - Column B: Product Title
   - Column C: Product Description
   - Column D: Product Price
   - Column E: Product Link (URL to your store)
   - Column F: Featured (use a checkbox column - checked items will appear in the featured slider)
3. Make sure your spreadsheet is publicly accessible (File > Share > Anyone with the link > Viewer)
4. Copy the Spreadsheet ID from the URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`

### 2. Google API Key Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API for your project
4. Create an API key (APIs & Services > Credentials > Create Credentials > API Key)
5. Restrict the API key to only the Google Sheets API for security

### 3. Configure the Application

1. Open the `js/config.js` file
2. Replace the existing API Key with your Google API Key
3. Replace the existing Spreadsheet ID with your Google Spreadsheet ID
4. Update the `range` parameter if your data is in a different sheet or range (default is 'Sheet1!A2:E50')

## Customization

### Carousel Settings

You can customize the carousel behavior by modifying the `carouselSettings` object in the `js/config.js` file:

```javascript
carouselSettings: {
    slidesToShow: 3,       // Number of slides to show at once
    slidesToScroll: 1,     // Number of slides to scroll at a time
    autoplay: true,        // Whether to autoplay the carousel
    autoplaySpeed: 3000,   // Autoplay speed in milliseconds
    dots: true,            // Show navigation dots
    arrows: true,          // Show navigation arrows
    infinite: true,        // Infinite looping
    // Responsive breakpoints
    responsive: [
        {
            breakpoint: 992,
            settings: {
                slidesToShow: 2
            }
        },
        {
            breakpoint: 576,
            settings: {
                slidesToShow: 1
            }
        }
    ]
}
```

### Featured Product Slider

The featured product slider displays products marked as "featured" in your Google Sheet. Use a checkbox column in your Google Sheet - when a product's checkbox is checked, it will appear in the featured slider.

### Styling

You can customize the appearance by modifying the `css/styles.css` file.

### Sample Data

To modify the sample product data, edit the `js/sample-data.js` file.

## Troubleshooting

- **No products showing**: The slider will automatically use sample data if Google Sheets API fails
- **API errors**: Make sure the Google Sheets API is enabled for your project
- **Spreadsheet access issues**: Ensure your spreadsheet is publicly accessible
- **Styling issues**: Check the browser console for any JavaScript errors

## License

MIT License
