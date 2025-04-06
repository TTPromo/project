// Sticky header functionality
$(window).scroll(function() {
  const scrollPos = $(window).scrollTop();
  if (scrollPos > 30) {
    $('.sticky-header').addClass('scrolled');
  } else {
    $('.sticky-header').removeClass('scrolled');
  }
});

// Improved search animation - icon transforms in place
$("#searchc").click(function(e) {
  e.preventDefault();
  e.stopPropagation();
  
  // Toggle active classes
  $(".search-container").toggleClass("active");
  $(".search-wrapper").toggleClass("active");
  
  // Toggle slide animation for other elements, but NOT the logo
  if($(".search-container").hasClass("active")) {
    $(".top-bar-right").addClass("search-active");
    // Removed .logo-container.addClass("search-active")
    setTimeout(function() {
      $(".searchbox").focus();
    }, 300);
  } else {
    $(".top-bar-right").removeClass("search-active");
    // Removed .logo-container.removeClass("search-active")
  }
});

// Submit search on Enter key
$('.searchbox').on('keypress', function(e) {
  if(e.which == 13) {
    $('#search').submit();
  }
});

// Close search when clicking outside
$(document).click(function(e) {
  if($(".search-container").hasClass("active")) {
    if(!$(e.target).closest('.search-wrapper').length && !$(e.target).closest('.search-icon').length) {
      $(".search-container").removeClass("active");
      $(".search-wrapper").removeClass("active");
      $(".top-bar-right").removeClass("search-active");
      // Removed .logo-container.removeClass("search-active")
    }
  }
});

// Shopping cart functionality
let cartCount = 0;

function updateCartCount(count) {
  cartCount = count;
  $('.cart-badge').text(count);
  // Add pulse animation when cart is updated
  $('.cart-badge').addClass('pulse');
  setTimeout(function() {
    $('.cart-badge').removeClass('pulse');
  }, 500);
}

// Example: Add to cart function
function addToCart(productId, quantity = 1) {
  // This is a placeholder for the actual cart functionality
  // In a real implementation, this would call an API or update local storage
  updateCartCount(cartCount + quantity);
  
  // You can add your cart logic here based on the Ariba punchout requirements
  console.log(`Added product ${productId} to cart, quantity: ${quantity}`);
}

// Mobile menu functionality
function burger() {
  const x = document.getElementById("myLinks");
  if (x.style.display === "block") {
    x.style.display = "none";
    document.getElementById("burger").className = "fa fa-bars fa-2x";
  } else {
    x.style.display = "block";
    document.getElementById("burger").className = "fa fa-times fa-2x";
  }
}

// Example: Initialize with some items in cart (for demo purposes)
$(document).ready(function() {
  // For demo purposes - simulate adding items
  setTimeout(function() {
    addToCart('demo-product-1');
  }, 3000);
  
  setTimeout(function() {
    addToCart('demo-product-2');
  }, 6000);
});
