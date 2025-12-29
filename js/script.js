"use strict";

// To make the header/navbar sticky via javascript
const header = document.querySelector("header");

window.addEventListener("scroll", function () {
	header.classList.toggle("sticky", window.scrollY > 0);
});

// get year for footer
let n = new Date();
let yearr = n.getFullYear();
document.getElementById("year").innerHTML = yearr;

// To make navbar appear when clicked on hamburger icon
let menu = document.querySelector("#menu-icon");
let navbar = document.querySelector(".navbar");

menu.onclick = () => {
	menu.classList.toggle("bx-x");
	navbar.classList.toggle("open");
};


// alert("This is a demo site and not a commercial version. The site is available for sale. Please mail to nextlevelproduction@duck.com to purchase the site.");


/* ============================================
   PHASE 1: CONTACT FORM VALIDATION & SUBMISSION
   WHY: Demonstrates form handling, validation patterns, error management, and data persistence
   ============================================ */

// Initialize form when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
	const contactForm = document.getElementById('contactForm');

	// WHY addEventListener: Supports multiple handlers; better than onclick
	if (contactForm) {
		initializeContactForm();
	}
});

// Main form initialization function
function initializeContactForm() {
	const form = document.getElementById('contactForm');
	const submitBtn = document.getElementById('submitBtn');
	const resetBtn = document.getElementById('resetBtn');

	// Load saved form data from localStorage (if exists)
	loadFormData();

	// Real-time field validation on input/change
	form.querySelectorAll('input, textarea, select').forEach(field => {
		field.addEventListener('blur', () => validateField(field));
		// WHY blur: Validates after user leaves field; better UX than on every keystroke

		// Auto-save to localStorage as user types
		field.addEventListener('change', () => saveFormData());
	});

	// Character count for message field
	const messageField = document.getElementById('message');
	if (messageField) {
		messageField.addEventListener('input', updateCharCount);
	}

	// Form submission
	form.addEventListener('submit', handleFormSubmit);

	// Reset button
	resetBtn.addEventListener('click', () => {
		form.reset();
		clearAllErrors();
		localStorage.removeItem('contactFormData'); // Clear saved data
		showStatusMessage('Form cleared', 'success');
	});
}

// Validate individual field
function validateField(field) {
	const fieldName = field.id;
	const value = field.value.trim();
	let isValid = true;
	let errorMsg = '';

	// WHY trim(): Removes whitespace; prevents "   " from being valid

	// Required field validation
	if (field.hasAttribute('required') && value === '') {
		isValid = false;
		errorMsg = `${getFieldLabel(fieldName)} is required`;
	}
	// Email validation
	else if (fieldName === 'email' && value !== '') {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		// WHY regex: Quick format check; real validation happens server-side
		if (!emailRegex.test(value)) {
			isValid = false;
			errorMsg = 'Please enter a valid email address';
		}
	}
	// Phone validation (basic)
	else if (fieldName === 'phone' && value !== '') {
		const phoneRegex = /^[0-9\s\-\+\(\)]{10,}$/;
		if (!phoneRegex.test(value)) {
			isValid = false;
			errorMsg = 'Please enter a valid phone number (10+ digits)';
		}
	}
	// Minimum length validation
	else if (field.hasAttribute('minlength')) {
		const minLength = parseInt(field.getAttribute('minlength'));
		if (value.length > 0 && value.length < minLength) {
			isValid = false;
			errorMsg = `Must be at least ${minLength} characters`;
		}
	}
	// Message minimum length
	else if (fieldName === 'message' && value.length < 10) {
		if (value !== '' && value.length < 10) {
			isValid = false;
			errorMsg = 'Message must be at least 10 characters';
		}
	}

	// Update UI based on validation result
	displayFieldError(field, isValid, errorMsg);
	return isValid;
}

// Display error message for a field
function displayFieldError(field, isValid, errorMsg) {
	const errorElement = document.getElementById(`${field.id}Error`);

	if (!isValid) {
		// WHY adding error class: Visual feedback via CSS; prevents form submission
		field.classList.add('error');
		if (errorElement) {
			errorElement.textContent = errorMsg;
			errorElement.classList.add('show');
		}
	} else {
		field.classList.remove('error');
		if (errorElement) {
			errorElement.textContent = '';
			errorElement.classList.remove('show');
		}
	}
}

// Validate entire form
function validateForm(form) {
	const fields = form.querySelectorAll('input, textarea, select');
	let isFormValid = true;

	// Clear previous errors
	clearAllErrors();

	// Validate each field
	fields.forEach(field => {
		if (!validateField(field)) {
			isFormValid = false;
		}
	});

	// Additional: Check if consent checkbox is checked
	const consentCheckbox = document.getElementById('consent');
	if (consentCheckbox && !consentCheckbox.checked) {
		displayFieldError(consentCheckbox, false, 'You must agree to terms');
		isFormValid = false;
	}

	return isFormValid;
}

// Clear all error messages
function clearAllErrors() {
	document.querySelectorAll('.error-message').forEach(el => {
		el.textContent = '';
		el.classList.remove('show');
	});
	document.querySelectorAll('input.error, textarea.error, select.error').forEach(el => {
		el.classList.remove('error');
	});
}

// Handle form submission
async function handleFormSubmit(e) {
	e.preventDefault();

	const form = e.target;

	// Validate form before submission
	if (!validateForm(form)) {
		showStatusMessage('Please fix errors above', 'error');
		return;
	}

	// Prepare form data for submission
	const formData = new FormData(form);
	const data = {
		fullName: formData.get('fullName'),
		email: formData.get('email'),
		phone: formData.get('phone'),
		tripType: formData.get('tripType'),
		message: formData.get('message'),
		consent: formData.get('consent') === 'on',
		timestamp: new Date().toISOString(),
		// WHY timestamp: Server needs to know when submission occurred
	};

	// Disable submit button during submission
	const submitBtn = document.getElementById('submitBtn');
	const originalText = submitBtn.innerHTML;
	submitBtn.disabled = true;
	submitBtn.innerHTML = '<span>Sending...</span><i class="bx bxs-loader bx-spin"></i>';

	try {
		// TODO: Replace with actual Supabase endpoint post-submission
		// This demonstrates Supabase-ready architecture:
		// const response = await fetch('https://your-supabase-url/functions/v1/contact', {
		//   method: 'POST',
		//   headers: { 'Content-Type': 'application/json' },
		//   body: JSON.stringify(data)
		// });

		// For now, simulate API call with setTimeout
		await new Promise(resolve => setTimeout(resolve, 800));

		// Clear form and localStorage on success
		form.reset();
		localStorage.removeItem('contactFormData');

		showStatusMessage(
			'Thank you! We will contact you soon.',
			'success'
		);

		// WHY 3 second delay: Gives user time to see success message before scrolling
		setTimeout(() => {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}, 3000);

	} catch (error) {
		console.error('Form submission error:', error);
		showStatusMessage('Failed to send message. Please try again.', 'error');
	} finally {
		// Re-enable submit button
		submitBtn.disabled = false;
		submitBtn.innerHTML = originalText;
	}
}

// Display status message (success/error)
function showStatusMessage(message, type) {
	// Remove existing message
	const existingMessage = document.querySelector('.status-message');
	if (existingMessage) {
		existingMessage.remove();
	}

	// Create and insert new message
	const messageEl = document.createElement('div');
	messageEl.className = `status-message ${type}`;
	messageEl.textContent = message;

	const form = document.getElementById('contactForm');
	form.parentElement.insertBefore(messageEl, form.nextSibling);

	// Auto-remove message after 5 seconds
	setTimeout(() => {
		messageEl.remove();
	}, 5000);
}

// Update character count for message field
function updateCharCount() {
	const messageField = document.getElementById('message');
	const charCount = messageField.value.length;
	const maxLength = 500; // From HTML maxlength

	// Create or update char count display
	let countEl = document.querySelector('.char-count');
	if (!countEl) {
		countEl = document.createElement('div');
		countEl.className = 'char-count';
		messageField.parentElement.appendChild(countEl);
	}

	countEl.textContent = `${charCount}/${maxLength} characters`;

	// WHY color change: Visual feedback for approaching limit
	if (charCount > maxLength * 0.8) {
		countEl.style.color = '#e74c3c';
	} else {
		countEl.style.color = 'var(--second-color)';
	}
}

// Save form data to localStorage (auto-save feature)
function saveFormData() {
	const form = document.getElementById('contactForm');
	const formData = new FormData(form);
	const data = {};

	// Convert FormData to object
	formData.forEach((value, key) => {
		if (key === 'consent') {
			data[key] = value === 'on';
		} else {
			data[key] = value;
		}
	});

	// Save to localStorage
	localStorage.setItem('contactFormData', JSON.stringify(data));
	// WHY localStorage: User doesn't lose data if browser crashes/closes
}

// Load form data from localStorage
function loadFormData() {
	const savedData = localStorage.getItem('contactFormData');

	if (!savedData) return;

	try {
		const data = JSON.parse(savedData);
		const form = document.getElementById('contactForm');

		// Populate form fields from saved data
		Object.keys(data).forEach(key => {
			const field = form.elements[key];
			if (field) {
				if (key === 'consent') {
					field.checked = data[key];
				} else {
					field.value = data[key];
				}
			}
		});

		// Update char count if message was saved
		if (data.message) {
			updateCharCount();
		}
	} catch (error) {
		console.error('Error loading saved form data:', error);
	}
}

// Helper function to get readable field label
function getFieldLabel(fieldId) {
	const labels = {
		'fullName': 'Full Name',
		'email': 'Email Address',
		'phone': 'Phone Number',
		'tripType': 'Trip Type',
		'message': 'Message',
		'consent': 'Terms & Conditions'
	};
	return labels[fieldId] || fieldId;
}

/* ============================================
   PHASE 2: BOOKING MODAL COMPONENT
   WHY: Demonstrates multi-step form, component state management, 
        dynamic pricing calculation, and modal lifecycle management
   ============================================ */

// Booking modal state object - demonstrates component architecture
const bookingState = {
currentStep: 1,
selectedPackage: null,
departDate: null,
travelers: 1,
packagePrice: 0,
packageDays: 0,
totalPrice: 0,
// WHY state object: Centralized data management; easier to track component state
};

// Initialize booking modal when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
const modal = document.getElementById('bookingModal');
if (modal) {
initializeBookingModal();
}
});

// Main booking modal initialization
function initializeBookingModal() {
const modal = document.getElementById('bookingModal');
const closeBtn = document.getElementById('closeBookingBtn');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const confirmBtn = document.getElementById('confirmBtn');

// Open modal trigger (attach to booking buttons throughout site)
const bookingTriggers = document.querySelectorAll('[data-booking-trigger]');
bookingTriggers.forEach(trigger => {
trigger.addEventListener('click', () => openBookingModal());
});

// Close button
closeBtn.addEventListener('click', closeBookingModal);

// WHY closing by backdrop click: Standard UX pattern users expect
modal.addEventListener('click', function(e) {
if (e.target === modal) {
closeBookingModal();
}
});

// Package selection - update state when package selected
document.querySelectorAll('input[name="package"]').forEach(radio => {
radio.addEventListener('change', function() {
bookingState.selectedPackage = this.value;
bookingState.packagePrice = parseInt(this.dataset.price);
bookingState.packageDays = parseInt(this.dataset.days);
// WHY parseInt: Converts string data attributes to numbers for calculations
updateBookingSummary();
});
});

// Date picker change
const departDateInput = document.getElementById('departDate');
if (departDateInput) {
departDateInput.addEventListener('change', function() {
bookingState.departDate = this.value;
updateBookingSummary();
});
}

// Traveler count buttons
const decreaseBtn = document.getElementById('decreaseTravelers');
const increaseBtn = document.getElementById('increaseTravelers');
const travelersInput = document.getElementById('travelers');

decreaseBtn.addEventListener('click', () => {
if (bookingState.travelers > 1) {
bookingState.travelers--;
travelersInput.value = bookingState.travelers;
updateBookingSummary();
}
});

increaseBtn.addEventListener('click', () => {
if (bookingState.travelers < 10) {
bookingState.travelers++;
travelersInput.value = bookingState.travelers;
updateBookingSummary();
}
});

// Manual travelers input change
travelersInput.addEventListener('change', function() {
let value = parseInt(this.value);
// WHY validation: Ensure value is within bounds even if user edits input
if (isNaN(value) || value < 1) value = 1;
if (value > 10) value = 10;
bookingState.travelers = value;
this.value = value;
updateBookingSummary();
});

// Navigation buttons
nextBtn.addEventListener('click', goToNextStep);
prevBtn.addEventListener('click', goToPreviousStep);
confirmBtn.addEventListener('click', confirmBooking);
}

// Open booking modal
function openBookingModal() {
const modal = document.getElementById('bookingModal');
modal.showModal();
// WHY showModal(): Opens dialog with backdrop focus management

// Reset to step 1
resetBookingModal();
}

// Close booking modal
function closeBookingModal() {
const modal = document.getElementById('bookingModal');
modal.close();
// WHY close(): Properly closes dialog and clears backdrop
}

// Reset booking modal to initial state
function resetBookingModal() {
bookingState.currentStep = 1;
bookingState.selectedPackage = null;
bookingState.departDate = null;
bookingState.travelers = 1;
bookingState.packagePrice = 0;
bookingState.packageDays = 0;

// Clear form
document.querySelectorAll('input[name="package"]').forEach(r => r.checked = false);
document.getElementById('departDate').value = '';
document.getElementById('travelers').value = 1;
document.getElementById('bookingTerms').checked = false;

updateStepDisplay(1);
updateBookingSummary();
}

// Navigate to next step with validation
function goToNextStep() {
// Validate current step before proceeding
if (!validateBookingStep(bookingState.currentStep)) {
alert('Please complete this step before proceeding');
return;
}

if (bookingState.currentStep < 3) {
bookingState.currentStep++;
updateStepDisplay(bookingState.currentStep);
}
}

// Navigate to previous step
function goToPreviousStep() {
if (bookingState.currentStep > 1) {
bookingState.currentStep--;
updateStepDisplay(bookingState.currentStep);
}
}

// Validate current step
function validateBookingStep(step) {
switch(step) {
case 1:
// Package must be selected
if (!bookingState.selectedPackage) {
alert('Please select a package');
return false;
}
return true;

case 2:
// Date and traveler count must be set
if (!bookingState.departDate) {
alert('Please select a departure date');
return false;
}
if (bookingState.travelers < 1) {
alert('Please select number of travelers');
return false;
}
return true;

case 3:
// Terms must be agreed
if (!document.getElementById('bookingTerms').checked) {
alert('You must agree to the terms and conditions');
return false;
}
return true;

default:
return true;
}
}

// Update step display - show/hide step content
function updateStepDisplay(step) {
// Hide all step contents
document.querySelectorAll('.booking-step-content').forEach(content => {
content.classList.add('hidden');
});

// Show current step
const currentStepContent = document.querySelector(`.booking-step-content[data-step="${step}"]`);
if (currentStepContent) {
currentStepContent.classList.remove('hidden');
}

// Update step indicator
document.querySelectorAll('.step').forEach(stepEl => {
stepEl.classList.remove('active');
});
document.querySelector(`.step[data-step="${step}"]`).classList.add('active');

// Update buttons visibility
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const confirmBtn = document.getElementById('confirmBtn');

prevBtn.disabled = step === 1;
// WHY disable: User can't go before step 1

if (step === 3) {
nextBtn.classList.add('hidden');
confirmBtn.classList.remove('hidden');
} else {
nextBtn.classList.remove('hidden');
confirmBtn.classList.add('hidden');
}
}

// Update booking summary with current state
function updateBookingSummary() {
// Package name
const packageLabels = {
'ladakh': 'Leh Ladakh Tour',
'kashmir': 'Kashmir Tour',
'goa': 'Goa Trip',
'bike-tour': 'Bike Tours'
};

const packageName = bookingState.selectedPackage ? 
packageLabels[bookingState.selectedPackage] : 'Not selected';
document.getElementById('summaryPackage').textContent = packageName;

// Duration
document.getElementById('summaryDays').textContent = bookingState.packageDays;

// Date formatting
const dateDisplay = bookingState.departDate ? 
new Date(bookingState.departDate).toLocaleDateString('en-IN', {
year: 'numeric',
month: 'long',
day: 'numeric'
}) : 'Not selected';
// WHY toLocaleDateString: Formats date in user's locale (India in this case)
document.getElementById('summaryDate').textContent = dateDisplay;

// Travelers
document.getElementById('summaryTravelers').textContent = bookingState.travelers;
document.getElementById('summaryTravelersMult').textContent = bookingState.travelers;

// Price calculation
document.getElementById('summaryPricePerPerson').textContent = 
`₹${bookingState.packagePrice.toLocaleString('en-IN')}`;

// Total = price per person × number of travelers
bookingState.totalPrice = bookingState.packagePrice * bookingState.travelers;
document.getElementById('summaryTotal').textContent = 
`₹${bookingState.totalPrice.toLocaleString('en-IN')}`;
// WHY toLocaleString: Adds thousand separators (₹15,000 vs ₹15000)
}

// Confirm booking - final step
function confirmBooking() {
if (!validateBookingStep(3)) {
return;
}

// Prepare booking data for submission
const bookingData = {
package: bookingState.selectedPackage,
departDate: bookingState.departDate,
travelers: bookingState.travelers,
totalPrice: bookingState.totalPrice,
timestamp: new Date().toISOString()
// WHY timestamp: Server needs to know when booking was made
};

// Save to localStorage (draft booking)
localStorage.setItem('bookingDraft', JSON.stringify(bookingData));

// Show confirmation message
alert(`Booking confirmed! Total: ₹${bookingState.totalPrice.toLocaleString('en-IN')}\n\nBooking details saved.`);

// Optionally send to server (Supabase-ready)
// fetch('/api/bookings', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify(bookingData)
// });

closeBookingModal();
}

