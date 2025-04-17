// Modal functionality for ADP Site
$(document).ready(function() {
    console.log('Modal functionality initialized');
    
    // Make sure the modals are at the end of the body if they don't exist already
    if ($('#privacy-modal, #terms-modal').length < 2) {
        console.log('Creating modals...');
        
        // Create the privacy policy modal if it doesn't exist
        if ($('#privacy-modal').length === 0) {
            var privacyModal = $('<div id="privacy-modal" class="modal"></div>');
            privacyModal.html(`
                <div class="modal-content">
                    <span class="close-modal" data-modal="privacy-modal">×</span>
                    <h2>Privacy Policy</h2>
                    <div class="modal-body">
                        <p>This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.</p>
                        <p>We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.</p>
                        
                        <h3>Interpretation and Definitions</h3>
                        <p>For the purposes of this Privacy Policy:</p>
                        <ul>
                            <li><strong>Account</strong> means a unique account created for You to access our Service or parts of our Service.</li>
                            <li><strong>Company</strong> refers to PromoShop, operating as JR Resources powered by PromoShop.</li>
                            <li><strong>Personal Data</strong> is any information that relates to an identified or identifiable individual.</li>
                            <li><strong>Service</strong> refers to the Website.</li>
                            <li><strong>Website</strong> refers to ADP Store, accessible from https://www.suppliersolutions.com/jrresources/</li>
                            <li><strong>You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</li>
                        </ul>
                        
                        <h3>Collection and Use of Your Personal Data</h3>
                        <p>While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. This information may include, but is not limited to:</p>
                        <ul>
                            <li>Email address</li>
                            <li>First name and last name</li>
                            <li>Company name</li>
                            <li>Address, State, Province, ZIP/Postal code, City</li>
                            <li>Usage Data</li>
                        </ul>
                        
                        <h3>Retention of Your Personal Data</h3>
                        <p>The Company will retain Your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use Your Personal Data to the extent necessary to comply with our legal obligations (for example, if we are required to retain your data to comply with applicable laws), resolve disputes, and enforce our legal agreements and policies.</p>
                        
                        <h3>Contact Us</h3>
                        <p>If you have any questions about this Privacy Policy, You can contact us:</p>
                        <ul>
                            <li>By email: customer.service@promoshop.com</li>
                        </ul>
                    </div>
                    <div class="modal-footer">
                        <button class="close-btn" data-modal="privacy-modal">Close</button>
                    </div>
                </div>
            `);
            $('body').append(privacyModal);
        }
        
        // Create the terms and conditions modal if it doesn't exist
        if ($('#terms-modal').length === 0) {
            var termsModal = $('<div id="terms-modal" class="modal"></div>');
            termsModal.html(`
                <div class="modal-content">
                    <span class="close-modal" data-modal="terms-modal">×</span>
                    <h2>Terms and Conditions</h2>
                    <div class="modal-body">
                        <p>By visiting our site and/or purchasing something from us, you engage in our "Service" and agree to be bound by the following terms and conditions ("Terms of Service", "Terms"), including those additional terms and conditions and policies referenced herein and/or available by hyperlink.</p>
                        
                        <h3>General Conditions</h3>
                        <p>We reserve the right to refuse service to anyone for any reason at any time.</p>
                        <p>You understand that your content (not including credit card information), may be transferred unencrypted and involve:</p>
                        <ul>
                            <li>Transmissions over various networks</li>
                            <li>Changes to conform and adapt to technical requirements of connecting networks or devices</li>
                        </ul>
                        <p>You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service, use of the Service, or access to the Service or any contact on the website through which the service is provided, without express written permission by us.</p>
                        
                        <h3>Accuracy, Completeness and Timeliness of Information</h3>
                        <p>We are not responsible if information made available on this site is not accurate, complete or current. The material on this site is provided for general information only and should not be relied upon or used as the sole basis for making decisions without consulting primary, more accurate, more complete or more timely sources of information.</p>
                        
                        <h3>Modifications to Products and Prices</h3>
                        <p>Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.</p>
                        
                        <h3>Personal Information</h3>
                        <p>Your submission of personal information through the store is governed by our Privacy Policy.</p>
                        
                        <h3>Copyright and Trademark</h3>
                        <p>All content included on the site, such as text, graphics, logos, button icons, images, audio clips, digital downloads, data compilations, and software, is the property of the Company or its content suppliers and protected by international copyright and trademark laws.</p>
                    </div>
                    <div class="modal-footer">
                        <button class="close-btn" data-modal="terms-modal">Close</button>
                    </div>
                </div>
            `);
            $('body').append(termsModal);
        }
    }
    
    // Add click handlers for ALL possible privacy and terms links in the footer
    $(document).on('click', '#privacy-link, .footer-links a[href="#privacy"], .footer-links a:contains("Privacy")', function(e) {
        e.preventDefault();
        console.log('Privacy link clicked');
        openModal('privacy-modal');
    });
    
    $(document).on('click', '#terms-link, .footer-links a[href="#terms"], .footer-links a:contains("Terms")', function(e) {
        e.preventDefault();
        console.log('Terms link clicked');
        openModal('terms-modal');
    });
    
    // Add click handlers for the close buttons
    $(document).on('click', '.close-modal, .close-btn', function() {
        const modalId = $(this).data('modal');
        if (modalId) {
            closeModal(modalId);
        }
    });
    
    // Close the modal when clicking outside of it
    $(document).on('click', '.modal', function(e) {
        if ($(e.target).hasClass('modal')) {
            const modalId = $(this).attr('id');
            closeModal(modalId);
        }
    });
    
    // Close modal with ESC key
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape') {
            $('.modal.show').each(function() {
                closeModal($(this).attr('id'));
            });
        }
    });
    
    // Add debugging to confirm the script loaded
    console.log('Modal setup complete');
    if ($('.footer-links a').length) {
        console.log('Footer links found: ' + $('.footer-links a').length);
    } else {
        console.log('No footer links found. Will use dynamic event binding.');
    }
});

// Functions to open and close modals
function openModal(modalId) {
    console.log('Opening modal: ' + modalId);
    const modal = document.getElementById(modalId);
    if (!modal) {
        console.error('Modal not found: ' + modalId);
        return;
    }
    
    modal.style.display = 'block';
    
    // Use setTimeout to allow the browser to render the modal first
    setTimeout(function() {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent scrolling of the background
    }, 10);
}

function closeModal(modalId) {
    console.log('Closing modal: ' + modalId);
    const modal = document.getElementById(modalId);
    if (!modal) {
        console.error('Modal not found: ' + modalId);
        return;
    }
    
    modal.classList.remove('show');
    
    // Use setTimeout to allow the animation to complete before hiding the modal
    setTimeout(function() {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
    }, 300);
}
