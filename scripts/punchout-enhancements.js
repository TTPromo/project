// Enhanced JavaScript for ADP Punchout Catalog
$(document).ready(function() {
    // Enhance the punchout catalog without modifying HTML structure
    
    // 1. Move the back button and breadcrumbs into a flex container to align with sort options
    $('.backButton, .youAreHere').wrapAll('<div class="nav-row"></div>');
    $('.nav-row, .sortOptions').wrapAll('<div class="control-bar"></div>');
    
    // 2. Add icon to category header
    if ($('.categoryHeader h2').length > 0 && !$('.categoryHeader h2 i').length) {
        $('.categoryHeader h2').prepend('<i class="fa fa-leaf category-icon"></i> ');
    }
    
    // 3. Ensure product SKU is above product name
    $('.productRow').each(function() {
        // Get the product details cell (second cell)
        var $detailsCell = $(this).find('td:nth-child(2)');
        
        // Extract SKU and Name if they exist in the correct structure
        var productSKU = $detailsCell.find('.productSKU').text();
        var productName = $detailsCell.find('.productName').text();
        var productLink = $detailsCell.find('.productName').attr('href');
        
        // Only restructure if we need to (prevents multiple reorganizations)
        if (productSKU && productName && !$detailsCell.find('.productSKU:first-child').length) {
            // Clear the cell and rebuild with correct structure
            $detailsCell.empty();
            $detailsCell.append('<div class="productSKU">' + productSKU + '</div>');
            $detailsCell.append('<a href="' + productLink + '" class="productName">' + productName + '</a>');
        }
    });
    
    // 4. Create image placeholders for empty images
    $('.productImage img').each(function() {
        if ($(this).attr('src') === '' || !$(this).attr('src') || 
            $(this).width() === 0 || $(this).height() === 0) {
            $(this).addClass('empty-image');
            $(this).after('<div class="placeholder-image">Product Image</div>');
        }
    });
    
    // 5. Fix table header alignment by ensuring width consistency
    $('.productTable').addClass('fixed-table-layout');
    
    // 6. Style the Add to Cart buttons
    $('input[type="button"], input[type="submit"], button').addClass('styled-button');
    
    // 7. Make sure the back button is gray
    $('.backButton').css({
        'background-color': '#777777',
        'color': 'white'
    });
    
    // 8. Create clean pagination
    $('.paginationControl a').each(function() {
        if ($(this).text() === $(this).parent().find('.current').text()) {
            $(this).addClass('current');
        }
    });

    // Add slide animation to cart badge when item added
    function animateCartBadge() {
        $('.cart-badge').addClass('pulse');
        setTimeout(function() {
            $('.cart-badge').removeClass('pulse');
        }, 1000);
    }

    // Intercept form submissions that add products to cart
    $('form').on('submit', function(e) {
        if ($(this).find('[name="btnAddToCart"]').length) {
            // Just add animation - don't interfere with Ariba functionality
            setTimeout(animateCartBadge, 500);
        }
    });

    // Inject responsive meta tag if missing
    if (!$('meta[name="viewport"]').length) {
        $('head').append('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
    }
});

// Google Sheets Integration Enhancements
$(document).ready(function() {
    // Initialize product carousels if they exist on the page
    if ($('.product-carousel, .featured-product-slider').length > 0) {
        // Configuration for product carousels
        const carouselConfig = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 4000,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1,
                        infinite: true,
                        dots: true
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        };

        // Configuration for featured product slider
        const featuredConfig = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 5000
        };

        // Initialize carousels after products are loaded
        function initCarousels() {
            // Regular product carousel
            if ($('.product-carousel').length > 0) {
                $('.product-carousel').slick(carouselConfig);
            }
            
            // Featured product slider
            if ($('.featured-product-slider').length > 0) {
                $('.featured-product-slider').slick(featuredConfig);
            }
        }

        // Handle window resize for responsive carousels
        $(window).on('resize', function() {
            // Check if carousels are initialized
            if ($('.product-carousel, .featured-product-slider').hasClass('slick-initialized')) {
                // Destroy and reinitialize for proper responsiveness
                $('.product-carousel, .featured-product-slider').slick('unslick');
                initCarousels();
            }
        });

        // If the carousel script is included after DOM is loaded, initialize immediately
        if ($.fn.slick) {
            initCarousels();
        } else {
            // Otherwise, wait for slick to be available
            var checkSlick = setInterval(function() {
                if ($.fn.slick) {
                    clearInterval(checkSlick);
                    initCarousels();
                }
            }, 100);
        }
    }

    // Add scrolling banner animation if it exists
    if ($('.scroll-banner').length > 0) {
        // Ensure text continuously scrolls
        var bannerWidth = $('.scroll-banner').width();
        var textWidth = $('.scroll-text').width();
        
        // Adjust animation duration based on text length
        var scrollDuration = textWidth / 50; // pixels per second
        $('.scroll-text').css('animation-duration', scrollDuration + 's');
    }
});
