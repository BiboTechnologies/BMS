import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getDatabase, ref,remove, push,get, onValue,child,set } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";
import { getAuth, onAuthStateChanged,sendPasswordResetEmail , signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";
const firebaseConfig = {
  apiKey: "AIzaSyCi_hufIZTzsYtdPGQtvtmKmAkkrydmn_A",
authDomain: "abbah-83a7b.firebaseapp.com",
databaseURL: "https://abbah-83a7b-default-rtdb.firebaseio.com",
projectId: "abbah-83a7b",
storageBucket: "abbah-83a7b.appspot.com",
messagingSenderId: "379729759051",
appId: "1:379729759051:web:e75528d61b02d1e4f536ce",
measurementId: "G-H41J2WMR6S"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app); // Initialize Firebase Authentication


    
// Ensure that authToken is defined in the global scope
let authToken;
let tokenExpiryTime;

// Function to generate a token valid for 24 hours
function generateToken() {
authToken = Math.random().toString(36).substring(2);
const currentTime = new Date();
const tokenExpiryTime = new Date(currentTime.getTime() + 24 * 60 * 60 * 1000); // Token valid for 24 hours

// Store token and expiry time in local storage
localStorage.setItem('authToken', authToken);
localStorage.setItem('tokenExpiryTime', tokenExpiryTime.toString());
}


// Function to retrieve token and its expiry time from local storage
function retrieveTokenFromLocalStorage() {
authToken = localStorage.getItem('authToken');
const storedExpiryTime = localStorage.getItem('tokenExpiryTime');
if (authToken && storedExpiryTime) {
  tokenExpiryTime = new Date(storedExpiryTime);
}
}

// Function to check if the token is still valid
function isTokenValid() {
const currentTime = new Date();
return tokenExpiryTime > currentTime;
}

window.addEventListener('load', function() {
  retrieveTokenFromLocalStorage(); // Retrieve token from local storage
  // Check if token is valid, if not, redirect to the login page
  if (!isTokenValid()) {
    window.location.href = 'login.html'; // Replace 'login.html' with the URL of your login page
  }
});


// Rest of your code...


// Disable right-click when the popup is displayed
document.addEventListener('contextmenu', function(event) {
if (document.getElementById('loginpopup').style.display === 'block') {
  event.preventDefault();
}
document.addEventListener('keydown', function(event) {
if (event.keyCode === 123) {
  event.preventDefault();
}
});

});
const allowedEmails = ['biboofficial256@gmail.com']; // Add the allowed email addresses here

// Show a loader inside the submit button when it's clicked
document.getElementById('loginForm').addEventListener('submit', function(event) {
event.preventDefault(); // Prevent default form submission

// Show loader inside the submit button
const submitBtn = document.getElementById('submitBtn');
submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting';

// Get user credentials from the form
const email = document.getElementById('email').value;
const password = document.getElementById('password').value;

// Update the login success block to generate a new token and store it
signInWithEmailAndPassword(auth, email, password)
.then((userCredential) => {
  // Check if the user's email is allowed
  if (allowedEmails.includes(email)) {
    // Login successful, hide the login overlay and popup
    document.getElementById('loginoverlay').style.display = 'none';
    document.getElementById('loginpopup').style.display = 'none';
    generateToken(); // Generate a new token on successful login
    } else {
      // Login not allowed, show an error message
      const errorContainer = document.getElementById('errorContainer');
      errorContainer.textContent = 'Access denied. You are not authorized.';
      errorContainer.style.display = 'block'; // Show the message
      // Log out the user since they are not authorized
      signOut(auth)
        .then(() => {
          // Reset the submit button text after a short delay (e.g., 2 seconds)
          setTimeout(function() {
            submitBtn.innerHTML = 'Submit';
          }, 2000);
        })
        .catch((error) => {
          console.error('Error signing out:', error);
        });
    }
  })
  .catch((error) => {
    // Login failed, display error message
    const errorMessage = error.message;
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.textContent = errorMessage;
    errorContainer.style.display = 'block'; // Show the message

    // Reset the submit button text after a short delay (e.g., 2 seconds)
    setTimeout(function() {
      submitBtn.innerHTML = 'Submit';
    }, 2000);
  });
});



// Event listener for the "Forgot Password" link
document.getElementById('forgotPasswordLink').addEventListener('click', function(event) {
event.preventDefault();

// Get the email entered by the user
const email = document.getElementById('email').value;

// Use Firebase sendPasswordResetEmail method with auth object
sendPasswordResetEmail(auth, email)
  .then(() => {
    // Password reset email sent successfully
    showMessage(' A password reset email has been sent. Please check your inbox.');
  })
  .catch((error) => {
    // Password reset email failed to send
    const errorMessage = error.message;
    alert('Password reset email failed to send. ' + errorMessage);
  });
});
// Function to display a message with optional retry button and success flag
function displayMessage(title, message, isSuccess = false) {
// Clear existing messages
const existingMessages = document.querySelectorAll('.retry-message');
existingMessages.forEach(function (message) {
  message.remove();
});

// Create a div element for the message
const messageDiv = document.createElement('div');
messageDiv.classList.add('retry-message'); // Add the class for styling

// Set background color to green for success message
if (isSuccess) {
  messageDiv.style.backgroundColor = '#4caf50';
}

// Create close button element
const closeButton = document.createElement('button');
closeButton.classList.add('close-btn');
closeButton.innerHTML = '<i class="fa fa-times"></i>';
closeButton.addEventListener('click', function () {
  messageDiv.remove();
});

// Create title element
const titleElement = document.createElement('h2');
titleElement.textContent = title;

// Create message element
const messageElement = document.createElement('p');
messageElement.textContent = message;

// Append title, message, and close button to the message div
messageDiv.appendChild(titleElement);
messageDiv.appendChild(messageElement);
//messageDiv.appendChild(closeButton);

// Append the message div to the document body
document.body.appendChild(messageDiv);

// Automatically remove the message after 5 seconds (5000 milliseconds)
setTimeout(function () {
  messageDiv.remove();
}, 1500);
}
// Function to display user information
function displayUserInformation(user) {
// Set the h2 element text to the user's display name
const profileName = document.querySelector('.profile_info h2');
profileName.textContent = user.displayName;

// Set the profile image source to the user's profile photo URL
const profileImage = document.querySelector('.profile_pic img');
profileImage.src = user.photoURL;

// Set the profile image in the dropdown menu
const dropdownProfileImage = document.querySelector('.user-profile img');
dropdownProfileImage.src = user.photoURL;

// Display success message
displayMessage('', `Welcome, ${user.displayName}.`, true); // Pass true for success message

// Reload the page content or perform any necessary actions for an authenticated user
}

// Function to handle sign-in success
function handleSignInSuccess(user) {
// Display user information
displayUserInformation(user);
}

// Function to handle sign-in error
function handleSignInError(error) {
console.error('Error signing in:', error);
// Display access denied message
displayMessage('Access Denied. Please sign in with a valid email.');
}

// Function to sign in with Google
function signInWithGoogle() {
var provider = new GoogleAuthProvider();
signInWithPopup(auth, provider)
  .then(function (result) {
    const user = result.user;
    handleSignInSuccess(user);
  })
  .catch(function (error) {
    handleSignInError(error);
  });
}

// Display the email sign-in popup on page load
window.addEventListener('load', function() {
auth.onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in
    displayUserInformation(user);
  } else {
    // User is not signed in, display the sign-in popup
    signInWithGoogle();
  }
});
});

// Function to retry the sign-in process
function retryCallback() {
signInWithGoogle();
}






displayMessage('Signing in...', 'Please wait...', false); // Pass false for error message

// Add event listener to all links within the website
document.addEventListener('click', function(event) {
  const target = event.target;

  // Check if the clicked element is a link within the website
  if (target.tagName === 'A' && target.href.startsWith(window.location.origin)) {
    // Store the clicked link's URL in local storage
    localStorage.setItem('clickedLink', target.href);
  }
});

// Get the "Log Out" button element
const logoutButton = document.getElementById("logoutButton");
const overlay = document.getElementById("overlay");

// Add event listener to the "Log Out" button
logoutButton.addEventListener("click", function(event) {
  event.preventDefault();

  // Store the current page URL in local storage
  localStorage.setItem('logoutPage', window.location.href);

  // Store the clicked link's URL in local storage
  const clickedLink = localStorage.getItem('clickedLink');
  if (clickedLink) {
    localStorage.setItem('logoutPage', clickedLink);
  }

  // Display overlay with spinner and text
  displayOverlay();

  // Simulate logout delay (you can replace this with your actual logout logic)
  setTimeout(() => {
    // Perform logout
    logOut();

    // Hide overlay after logout is complete
    hideOverlay();
  }, 2000);
});

function displayOverlay() {
  // Create spinner element
  const spinner = document.createElement('div');
  spinner.id = 'loadingSpinner';
  overlay.appendChild(spinner);

  // Create "Logging Out" text element
  const loggingOutText = document.createElement('div');
  loggingOutText.id = 'loggingOutText';
  loggingOutText.textContent = 'Logging Out...';
  overlay.appendChild(loggingOutText);

  // Display overlay
  overlay.style.display = 'flex';
}

function hideOverlay() {
  // Remove spinner and text elements from overlay
  const spinner = document.getElementById('loadingSpinner');
  const loggingOutText = document.getElementById('loggingOutText');
  overlay.removeChild(spinner);
  overlay.removeChild(loggingOutText);

  // Hide overlay
  overlay.style.display = 'none';
}


// Function to log out
function logOut() {
  auth.signOut()
    .then(function() {
      // Clear the login token and other stored values
      localStorage.removeItem('authToken');
      localStorage.removeItem('tokenExpiryTime');
      localStorage.removeItem('clickedLink');

      // Redirect to the stored page URL (either clicked link or current page)
      const logoutPage = localStorage.getItem('logoutPage') || 'login.html';
      window.location.href = logoutPage;
    })
    .catch(function(error) {
      console.error('Error signing out:', error);
    });
}



const form = document.querySelector('.popup-form');
const submitButton = document.querySelector('.popup-form button');
const patientsContainer = document.getElementById('patients');
let patients = []; // Declare patients variable outside the event listener

form.addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Get form input values
  const name = document.getElementById('name').value;
  const dob = document.getElementById('dob').value;
  const parents = document.getElementById('parents').value;
  const dos = document.getElementById('dos').value;
  const price = document.getElementById('price').value;
  //const pricepergram = document.getElementById('pricepergram').value;
  const measurement = document.querySelector('input[name="measurement"]:checked').value; // Get selected grams per piece value
  const medicineType = document.getElementById('medicineType').value;
  
  // Create medicine data object
  const medicineData = {
      name: name,
      dob: dob,
      parents: parents,
      dos: dos,
      price: price,
     // pricepergram: pricepergram,
      measurement: measurement,
      medicineType: medicineType
  };

  // Upload medicine data to Firebase
  const medicineRef = ref(database, 'medicine');
  const newMedicineRef = child(medicineRef, name); // Use medicine name as the key

  set(newMedicineRef, medicineData)
      .then(() => {
          form.reset();
          showMessage('Medicine details uploaded successfully!');
      })
      .catch(() => {
          showMessage('Error uploading medicine details. Please try again.');
      });
});


// Add event listener to search button
searchButton.addEventListener('click', () => {
const searchTerm = searchInput.value.trim(); // Get the search term

// Show the loader
loaderElement.classList.remove('hidden');

// Clear the patients container
patientsContainer.innerHTML = '';

// Search through Firebase for patient names by key
const patientsRef = ref(database, 'medicine');
onValue(patientsRef, (snapshot) => {
  const patientsData = snapshot.val();
  const searchResults = [];

  if (patientsData) {
    const patients = Object.values(patientsData);

    if (searchTerm !== '') {
      // Filter patients based on the search term
      patients.forEach(patient => {
        if (patient.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          searchResults.push(patient);
        }
      });
    } else {
      // Display all patients if the search term is empty
      searchResults.push(...patients);
    }
  }

  // Hide the loader
  loaderElement.classList.add('hidden');

  // Display search results
  if (searchResults.length > 0) {
    renderPatients(searchResults);
  } else {
    patientsContainer.innerHTML = '<p class="no-results">No medicine found.</p>';
  }
});
});





// Function to filter patients based on the search term
function filterPatients(patients, searchTerm) {
const filteredPatients = patients.filter((patient) => {
  const patientName = patient.name.toLowerCase();
  return patientName.includes(searchTerm.toLowerCase());
});
renderPatients(filteredPatients);
}

// Add event listener to search input for live search
searchInput.addEventListener('input', () => {
const searchTerm = searchInput.value.trim(); // Get the search term
const patientsRef = ref(database, 'medicine');
onValue(patientsRef, (snapshot) => {
  const patientsData = snapshot.val();
  const patients = patientsData ? Object.values(patientsData) : [];
  filterPatients(patients, searchTerm);
});
});

// Define the sellProductForm variable outside the renderPatients function

patientsContainer.innerHTML = '';

const sellProductForm = document.getElementById('sellProductForm2');
// Event listener for form submission
sellProductForm.addEventListener('submit', handleSellProductSubmit);

function renderPatients(patients) {
const table = document.createElement('table');
table.classList.add('patient-table');

// Create table headers
const headers = ['Name','Add', 'Rmg Stock', 'Expiry', 'Stock lvl', 'D.O.S','Price @Piece', 'Initial Stock', 'Est. Revenue', 'Actions'];
const headerRow = document.createElement('tr')
headers.forEach((headerText) => {
  const th = document.createElement('th');
  th.textContent = headerText;
  headerRow.appendChild(th);
});
table.appendChild(headerRow);

const alertMessages = [];
let popupDisplayed = false; // Flag to track if the popup has already been displayed

const alertCategories = [
  { categoryName: 'Almost Expired', messages: [] },
  { categoryName: 'Out of Stock', messages: [] },
  { categoryName: 'Expired', messages: [] }
];

patients.forEach((patient) => {
  const row = document.createElement('tr');

  // Name
  const nameCell = document.createElement('td');
  nameCell.textContent = patient.name;
  row.appendChild(nameCell);
// Remaining Stock
const initialStock = parseInt(patient.parents);
let remainingStock;
if (patient.hasOwnProperty('sales')) {
const salesNode = patient.sales;
let totalSalesQuantity = 0;
for (const saleKey in salesNode) {
  const saleQuantity = parseInt(salesNode[saleKey].quantity);
  if (!isNaN(saleQuantity)) {
    totalSalesQuantity += saleQuantity;
  }
}
remainingStock = initialStock - totalSalesQuantity;
} else {
remainingStock = initialStock;
}
const remainingStockCell = document.createElement('td');
remainingStockCell.textContent = `${remainingStock} pcs`;
remainingStockCell.classList.add('remaining-stock-cell')

// Create the cell for the "Add More Stock" button
const addStockCell = document.createElement('td');

// Create the "Add More Stock" button
const addMoreStockButton = document.createElement('button');
addMoreStockButton.textContent = 'Add';
addMoreStockButton.classList.add('add-stock-button'); // Add a class for styling if needed

// Add click event listener to the button
addMoreStockButton.addEventListener('click', function() {
  // Get the medicine name from the corresponding cell in the same row
  const medicineName = row.querySelector('td:nth-child(1)').textContent; // Adjust the index as needed

    // Set the value of the name input field to the medicine name
    document.getElementById('name').value = medicineName;
  // Log the medicine name to the console
  console.log('Medicine Name:', medicineName);

  // Open the popup
  popupOverlay.style.visibility = 'visible';
  popupOverlay.style.opacity = '1';
});

// Append the button to the cell
addStockCell.appendChild(addMoreStockButton);

// Add click event listener to the popup close button
popupClose.addEventListener('click', function() {
  // Close the popup
  popupOverlay.style.visibility = 'hidden';
  popupOverlay.style.opacity = '0';
});



// Append the button to the cell
addStockCell.appendChild(addMoreStockButton);

// Append the cell to the row
row.appendChild(addStockCell);

row.appendChild(remainingStockCell);

// Expiry
const expiryDate = new Date(patient.dob);
const currentDate = new Date();
const daysRemaining = Math.floor((expiryDate - currentDate) / (1000 * 60 * 60 * 24));
const expiryCell = document.createElement('td');

if (daysRemaining >= 0) {
  expiryCell.textContent = `${daysRemaining}`;
  if (daysRemaining < 5) {
    // Add alert message for medicine almost expiring
    const alertMessage = `${patient.name} is almost expiring! Days remaining: ${daysRemaining}`;
    alertCategories[0].messages.push(alertMessage);
  }
} else {
  expiryCell.textContent = 'Expired';
  expiryCell.style.backgroundColor = 'red'; // Change cell background color to red for expired medicine
  expiryCell.style.color = 'white';
  
  // Show popup alert for expired medicine
  const alertMessage = `${patient.name}`;
  alertCategories[2].messages.push(alertMessage);
}


row.appendChild(expiryCell);


// Out of Stock
if (remainingStock === 0) {
  const outOfStockCell = document.createElement('td');
  outOfStockCell.textContent = 'Out of Stock';
  outOfStockCell.style.backgroundColor = 'red'; // Change cell background color to red for out of stock medicine
  outOfStockCell.style.color = 'white';
  row.appendChild(outOfStockCell);

  // Add alert message for out of stock medicine
  const alertMessage = `${patient.name}`;
  alertMessages.push(alertMessage);
  alertCategories[1].messages.push(alertMessage);
} else {
  const stockLevelCell = document.createElement('td');
  if (remainingStock < 20) {
    stockLevelCell.textContent = 'Low Stock';
    stockLevelCell.style.backgroundColor = 'yellow'; // Change cell background color to yellow for low stock medicine
  } else {
    stockLevelCell.textContent = 'In Stock';
  }
  row.appendChild(stockLevelCell);


  // Only show the alert if there are real messages and if the popup has not been displayed yet
  const hasMessages = alertCategories.some(category => category.messages.length > 0);

  if (hasMessages && !popupDisplayed) {
    showAlert(alertCategories);
    popupDisplayed = true; // Set the flag to indicate the popup has been displayed
  }

}



  // Date of Stock
  const dosCell = document.createElement('td');
  dosCell.textContent = patient.dos;
  row.appendChild(dosCell);

  // Price @pc
  const priceCell = document.createElement('td');
  priceCell.textContent = `${patient.price}.00`;
  priceCell.classList.add('price-per-piece-cell'); // Add this line to set the class
  row.appendChild(priceCell);

  
  

  // Initial Stock
  const initialStockCell = document.createElement('td');
  initialStockCell.textContent = `${patient.parents} pcs`;
  row.appendChild(initialStockCell);

  // Estimated Revenue
  const estimatedRevenue = initialStock * patient.price;
  const formattedRevenue = estimatedRevenue.toLocaleString('en');
  const revenueCell = document.createElement('td');
  revenueCell.textContent = `${formattedRevenue}.00`;
  row.appendChild(revenueCell);

  // Actions
  const actionsCell = document.createElement('td');
  const viewButton = document.createElement('button');
  viewButton.textContent = 'View';
  viewButton.classList.add('view-button');
  viewButton.addEventListener('click', function() {
    currentPatientName = patient.name; // Set the current patient name
    openPatientHistoryPopup(patient);
  });
  actionsCell.appendChild(viewButton);

  const sellButton = document.createElement('button');
sellButton.textContent = 'Sell';
sellButton.classList.add('sell-button');
// Define a variable to store the "Grams Per Piece" value
let gramsPerPieceValue;
// Event listener for opening the sell popup
sellButton.addEventListener('click', function(event) {
if (daysRemaining < 0) {
  // Show alert for expired medicine
  alert(`The medicine ${patient.name} has expired!`);
} else if (remainingStock === 0) {
  // Show alert for out of stock medicine
  alert(`The medicine ${patient.name} is out of stock!`);
} else {
  const sellPopupOverlay = document.getElementById('sellPopupOverlay2');
  sellPopupOverlay.style.display = 'block';
// Capture the price per piece
const pricePerPieceCell = event.target.parentElement.parentElement.querySelector('.price-per-piece-cell');
const pricePerPiece = parseFloat(pricePerPieceCell.textContent.split(' ')[0]);

// Capture the remaining stock
const remainingStockCell = event.target.parentElement.parentElement.querySelector('.remaining-stock-cell');
const remainingStockValue = parseInt(remainingStockCell.textContent.split(' ')[0]);

// Capture the input fields for this specific medicine
const sellFormPatientName = document.getElementById('sellFormPatientName');
const sellPiecesInput = document.getElementById('sellPieces');
const sellTotalInput = document.getElementById('totalCost');

// Set the patient name
sellFormPatientName.value = patient.name;

// Event listener for updating the pieces and total cost input fields
sellPiecesInput.addEventListener('input', function () {
    const pieces = parseFloat(sellPiecesInput.value);

    if (!isNaN(pieces) && pieces > 0) {
        // Calculate the total cost based on the number of pieces and the price per piece
        const total = pieces * pricePerPiece;

        // Update the "totalCost" input field
        sellTotalInput.value = total.toFixed(2);

        // Check if pieces are more than remaining stock
        if (pieces > remainingStockValue) {
            // Disable the "Add to Cart" button
            addToCartButton.disabled = true;
            addToCartButton.style.cursor = "disabled";
            addToCartButton.style.backgroundColor = "lightblue";
            // Show a message in the popup
            const sellPopupMessage = document.getElementById('sellPopupMessage');
            sellPopupMessage.textContent = 'Pieces are more than remaining stock';
        } else {
            // Enable the "Add to Cart" button
            addToCartButton.disabled = false;
            addToCartButton.style.cursor = "pointer";
            addToCartButton.style.backgroundColor = "orange";
            // Clear the message in the popup
            const sellPopupMessage = document.getElementById('sellPopupMessage');
            sellPopupMessage.textContent = '';
        }
    } else {
        // Clear the "totalCost" input field when input values are invalid
        sellTotalInput.value = '';
    }
});


  // Event listener for closing the sell popup
  const sellPopupClose = document.getElementById('sellPopupClose2');
  sellPopupClose.addEventListener('click', function() {
    const sellPopupOverlay = document.getElementById('sellPopupOverlay2');
    sellPopupOverlay.style.display = 'none';
    
    // Reset the "Grams Per Piece" value when the popup is closed
    gramsPerPieceValue = null;
// Clear the message in the popup
    const sellPopupMessage = document.getElementById('sellPopupMessage');
    sellPopupMessage.textContent = '';

    // Clear the input fields for this specific medicine
    sellFormPatientName.value = '';
    sellPiecesInput.value = '';
   // totalCostInput.value = '';
  });
}
});

actionsCell.appendChild(sellButton);

// Get references to the elements
const sellPiecesInput = document.getElementById('sellPieces');

// Get references to cart-related elements
const openCartButton = document.getElementById('openCartButton');
const cartItems = document.getElementById('cartItems');
const itemCount = document.getElementById('itemCount');
const cartTotalElement = document.getElementById('cartTotal');
const cartPopup = document.getElementById('cartPopup');
const closeCartPopupButton = document.getElementById('closeCartPopupButton');

// Initialize cart count and total
let cartCount = 0;
let cartTotal = 0;
// Initialize an array to keep track of cart items
const cartItemsArray = [];
// Add an event listener to the "Open Cart" button
openCartButton.addEventListener('click', function () {
showCartPopup();
});

// Add an event listener to the "Close" button in the cart popup
closeCartPopupButton.addEventListener('click', function () {
closeCartPopup();
});


// Function to close the cart popup
function closeCartPopup() {
cartPopup.style.display = 'none';
}
// Function to generate a receipt and open a print window
function generateAndPrintReceipt(cartItemsArray) {
// Create a receipt HTML content
const receiptContent = generateReceiptContent(cartItemsArray);

// Create a new window for printing
const printWindow = window.open('', '', 'width=700,height=700');
printWindow.document.open();
printWindow.document.write(receiptContent);
printWindow.document.close();

// Print the receipt
printWindow.print();
}
// Function to generate the HTML content for the receipt
function generateReceiptContent(cartItemsArray) {
// Create the receipt header with hospital information
const hospitalInfo = `
<!-- Updated HTML structure with the hospital logo -->
<div class="hospital-info">
  <div class="hospital-logo">
    <img src="sanyu.png" alt="Hospital Logo">
  </div>
  <div class="hospital-details">
    <h1>SANYU HOSPITAL</h1>
    <p>Address: Katooke Wakiso District (Uganda)</p>
    <p>Phone: +256 708 657 717</p>
    <p>Email: sanyuhospital@gmail.com</p>
  </div>
</div>
<div class="watermark">
  <img src="sanyu.png" alt="Watermark" class="watermark-image">
</div>

  <style>
  /* Updated CSS styles for larger receipt content */
  /* Use the "Open Sans" font */
  @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300&display=swap');
  
  /* Updated CSS styles for larger receipt content */
  .receipt {
    font-family: 'Anton', sans-serif;
        max-width: 100%; /* Fit to the paper width */
    margin: 0 auto;
    padding: 20px; /* Increased padding */
    font-weight: 50px
  }
  .hospital-info {
    display: flex;
    align-items: center;
    margin-bottom: 20px; /* Increased margin */
  }
  /* Add styles for the watermark */
  .watermark {
    position: absolute;
    top: 50%; /* Position at the vertical center of the receipt */
    left: 50%; /* Position at the horizontal center of the receipt */
    transform: translate(-50%, -50%); /* Center the watermark */
    z-index: -1; /* Place it behind the receipt content */
    opacity: 0.2; /* Adjust opacity to your preference */
  }
  
  .watermark-image {
    width: 100%; /* Make the watermark cover the entire receipt */
    height: auto;
  }
  
  .hospital-info h1 {
    font-size: 32px; /* Increased font size */
    margin: 0;
  }
  
  .hospital-details {
    flex-grow: 1;
    text-align: right;
  }
  
  .hospital-details p {
    font-size: 20px; /* Increased font size */
    margin: 10px; /* Increased margin */
  }
  
  .receipt-header h2 {
    font-size: 26px; /* Increased font size */
    text-align: center;
    margin: 0;
  }
  
  .receipt-header p {
    font-size: 18px; /* Increased font size */
    text-align: left;
    margin: 10px;
  }
  
  .receipt-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px; /* Increased margin */
  }
  
  .receipt-table th,
   .receipt-table td {
    padding: 15px; /* Increased padding */
    border: none; /* Remove borders */
    font-size: 20px; /* Increased font size */
    text-align: left;
  }
  
  .receipt-footer {
    text-align: right;
    margin-top: 20px; /* Increased margin */
  }
  
  .disclaimer {
    font-size: 18px; /* Increased font size */
    text-align: center;
    margin-top: 30px; /* Increased margin */
    font-style: italic;
  }
  
  /* Updated CSS styles with hospital logo */
  .hospital-info {
    display: flex;
    align-items: center;
    margin-bottom: 20px; /* Increased margin */
  }
  
  .hospital-logo {
    margin-right: 20px; /* Add margin to separate the logo from hospital details */
  }
  
  .hospital-logo img {
    max-width: 180px; /* Adjust the max width as needed */
    height: auto;
  }
  
  .hospital-info h1 {
    font-size: 32px; /* Increased font size */
    margin: 0;
  }
  
  .hospital-details {
    flex-grow: 1;
    text-align: right;
  }
  
  .hospital-details p {
    font-size: 24px; /* Increased font size */
    margin: 10px; /* Increased margin */
  }

  .receipt-table {
    width: 100%;
    border-collapse: collapse;
  }

  .receipt-table th, .receipt-table td {
    padding: 10px; /* Increased padding */
    border: 1px solid #ccc;
    font-size: 16px; /* Increased font size */
  }

  .receipt-footer {
    text-align: right;
  }

  .disclaimer {
    font-size: 14px; /* Increased font size */
    text-align: center;
    margin-top: 20px; /* Increased margin */
    font-style: italic;
  }

  
</style>


`;

// Create a receipt header
const receiptHeader = `
  <div class="receipt-header">
    <h2>Medicine Purchase Receipt</h2>
    <p>Date: ${new Date().toLocaleDateString()}</p>
    <p>Time: ${new Date().toLocaleTimeString()}</p>
  </div>
`;

// Create a table for receipt items
const receiptTable = `
  <table class="receipt-table">
    <thead>
      <tr>
        <th>Medicine</th>
        <th>Pieces</th>
        <th>Cost</th>
      </tr>
    </thead>
    <tbody>
      ${generateReceiptRows(cartItemsArray)}
    </tbody>
  </table>
`;

// Create a receipt footer with a disclaimer
const disclaimer = `
  <div class="disclaimer">
    <p>Goods once sold are not returnable.</p>
  </div>
`;

// Create a receipt footer with the total cost
const totalCost = cartItemsArray.reduce((total, item) => total + item.totalCost, 0);
const receiptFooter = `
  <div class="receipt-footer">
    <p>Total Cost: Ug.shs. ${totalCost}.00</p>
  </div>
`;

// Combine all the receipt sections into the receipt content
const receiptContent = `
  <div class="receipt">
    ${hospitalInfo}
    ${receiptHeader}
    ${receiptTable}
    ${disclaimer}
    ${receiptFooter}
  </div>
`;

return receiptContent;
}

// Function to generate receipt rows from cart items
function generateReceiptRows(cartItemsArray) {
return cartItemsArray.map((item) => `
  <tr>
    <td>${item.patientName}</td>
    <td>${item.pieces}</td>
    <td>${item.totalCost}</td>
  </tr>
`).join('');
}


// Function to show the cart popup and populate it with items
function showCartPopup() {
cartPopup.style.display = 'block';

// Clear the popup items container
popupItems.innerHTML = '';

// Create a title for the cart
const cartTitle = document.createElement('h2');
cartTitle.textContent = 'Cart Items';
popupItems.appendChild(cartTitle);

// Create a table element
const cartTable = document.createElement('table');
cartTable.classList.add('cart-table');

// Create a table header
const tableHeader = document.createElement('thead');
const headerRow = document.createElement('tr');
const headers = ['Medicine','Pieces', 'Total Cost', 'Action'];
headers.forEach((headerText) => {
  const headerCell = document.createElement('th');
  headerCell.textContent = headerText;
  headerRow.appendChild(headerCell);
});
tableHeader.appendChild(headerRow);
cartTable.appendChild(tableHeader);

// Create a table body
const tableBody = document.createElement('tbody');

// Initialize total cost
let cartTotalCost = 0;

// Loop through the cart items and add rows to the table
for (const item of cartItemsArray) {
const row = document.createElement('tr');

// Add columns for item details
const patientNameCell = document.createElement('td');
patientNameCell.textContent = item.patientName;

const piecesCell = document.createElement('td');
piecesCell.textContent = item.pieces;

const totalCostCell = document.createElement('td');
totalCostCell.textContent = item.totalCost;

// Add a "Sell" button column
const sellCell = document.createElement('td');
const sellButton = document.createElement('button');
sellButton.textContent = 'Sell';
sellButton.addEventListener('click', function () {
  handleSellForMedicine(item);
});
// sellCell.appendChild(sellButton);

// Add a "Delete" button column
const deleteCell = document.createElement('td');
const deleteButton = document.createElement('button');
deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>'; 
deleteButton.addEventListener('click', function () {
deleteCartItem(item);
});
sellCell.appendChild(deleteButton);

// Append all cells to the row
row.appendChild(patientNameCell);
row.appendChild(piecesCell);
row.appendChild(totalCostCell);
row.appendChild(sellCell);
// row.appendChild(deleteCell);

// Append the row to the table body
tableBody.appendChild(row);

// Update the total cost
cartTotalCost += item.totalCost;
}

// Append the table body to the table
cartTable.appendChild(tableBody);

// Append the table to the popup items container
popupItems.appendChild(cartTable);

// Create a total row at the end of the table
const totalRow = document.createElement('tr');
const totalCell = document.createElement('td');
totalCell.colSpan = 4;
totalCell.textContent = 'Overall Total Cost:';
totalRow.appendChild(totalCell);

const totalCostCell = document.createElement('td');
totalCostCell.textContent = cartTotalCost;
totalRow.appendChild(totalCostCell);

// Append the total row to the table body
tableBody.appendChild(totalRow);
// Create a "Sell" button below the table
const sellButton = document.createElement('button');
sellButton.classList.add('add-to-cart-button');
sellButton.innerHTML = '<i class="fas fa-receipt"></i> Sell & Print Receipt';
popupItems.appendChild(sellButton);

sellButton.addEventListener('click', function () {
// Disable the button to prevent multiple clicks during the process
sellButton.disabled = true;
sellButton.textContent = 'Selling...';
// Generate and print the receipt
generateAndPrintReceipt(cartItemsArray);
sellMedicinesInCart(cartItemsArray)
  .then(() => {
    // All items have been sold
    sellButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    sellButton.disabled = false;
    itemCount.innerHTML = '0'
  })
  .catch((error) => {
    // Handle errors and restore the button state
    console.error('Error while selling:', error);
    sellButton.textContent = '<i class="fas fa-receipt"></i> Sell & Print Receipt';
    sellButton.disabled = false;
  });
});

popupItems.appendChild(sellButton);


// Update the cart count
cartCount = cartItemsArray.length;
itemCount.textContent = cartCount;
}



// Function to delete a cart item
function deleteCartItem(item) {
// Find the index of the item in the cartItemsArray
const index = cartItemsArray.indexOf(item);
if (index !== -1) {
  // Remove the item from the array
  cartItemsArray.splice(index, 1);

  // Update the cart display
  showCartPopup();
}
}

// Add an event listener to the "Add to Cart" button in the sell popup
addToCartButton.addEventListener('click', function () {
// Get the item details
const patientName = document.getElementById('sellFormPatientName').value;
const pieces = parseFloat(document.getElementById('sellPieces').value);
const totalCost = parseFloat(document.getElementById('totalCost').value);
const sellPopupClose = document.getElementById('sellPopupClose2');
// Check if the values are valid
if (!isNaN(pieces) && !isNaN(totalCost) && pieces > 0) {
  // Create an object to represent the item
  const item = {
    patientName: patientName,
    pieces: pieces,
    totalCost: totalCost,
  };

  // Add the item to the cart
  cartItemsArray.push(item); // Add the item to the cart items collection

  // Display the cart items count
  cartCount = cartItemsArray.length;
  itemCount.textContent = cartCount;
  addToCartButton.innerHTML = '<i class="fas fa-check-circle"></i> Added';
  addToCartButton.style.backgroundColor = 'orange';
  addToCartButton.disabled = true;
  
  
  // Revert the effect after 2 seconds
  setTimeout(() => {
    addToCartButton.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
    addToCartButton.style.backgroundColor = ''; // Revert to the original background color
    addToCartButton.disabled = false;

   // Click the sellPopupClose button
   const sellPopupClose = document.getElementById('sellPopupClose2');
   sellPopupClose.click();
 }, 1000); // 2000 milliseconds = 2 seconds

  // Update cart total
  cartTotal += totalCost;
  cartTotalElement.textContent = `$${cartTotal}`;
} else {
  alert('Please fill in valid values before adding to the cart.');
}
});

row.appendChild(actionsCell);
  table.appendChild(row);
});

patientsContainer.innerHTML = '';
patientsContainer.appendChild(table);


}
function toggleAlert() {
  if (customAlert.style.display === 'block') {
    customAlert.style.display = 'none';
    minimizedIcon.style.display = 'block';
  } else {
    customAlert.style.display = 'block';
    minimizedIcon.style.display = 'none';
  }
}



function showAlert(reportMessages) {
  const customAlert = document.getElementById('customAlert');
  const categoryContainer = document.getElementById('categoryContainer');
  const customAlertButton = document.getElementById('customAlertButton');
  const minimizedIcon = document.getElementById('minimizedIcon');

  // Clear existing content in the categoryContainer
  categoryContainer.innerHTML = '';

  // Create a table element
  const table = document.createElement('table');
  table.classList.add('category-table');

  // Iterate through reportMessages to create table rows
  reportMessages.forEach(category => {
    const row = document.createElement('tr');

    // Create table cells for category name and messages
    const categoryNameCell = document.createElement('td');
    categoryNameCell.textContent = category.categoryName;

    const messagesCell = document.createElement('td');
    messagesCell.classList.add('messages-cell');

    // Populate messages cell with message paragraphs
    category.messages.forEach(message => {
      const messageParagraph = document.createElement('p');
      messageParagraph.textContent = message;
      messagesCell.appendChild(messageParagraph);
    });

    // Append cells to the row
    row.appendChild(categoryNameCell);
    row.appendChild(messagesCell);

    // Append the row to the table
    table.appendChild(row);
  });

  // Append the table to the categoryContainer
  categoryContainer.appendChild(table);

  // Show the popup and hide the minimized icon
  customAlert.style.display = 'block';
  minimizedIcon.style.display = 'none';

  // Add event listener to the customAlertButton to toggle visibility
  customAlertButton.addEventListener('click', toggleAlert);


  // Add event listener to the minimizedIcon to show the popup
  minimizedIcon.addEventListener('click', showPopup);

  function showPopup() {
    customAlert.style.display = 'block';
    minimizedIcon.style.display = 'none';
  }
}







async function sellMedicinesInCart(cart) {
const sellButton = document.querySelector('.add-to-cart-button');
sellButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

if (cart.length === 0) {
  // All items in the cart have been sold
  sellButton.innerHTML = '<i class="fas fa-receipt"></i> Sell & Print Receipt';
  return;
}

// Get the first item from the cart
const item = cart[0];

try {
  await handleSellForMedicine(item);
  // Sale successful, remove the sold item from the cart
  cart.shift();
} catch (error) {
  // Handle errors, e.g., display an error message
  console.error('Error while selling:', error);
}

// Continue selling the remaining items in the cart
sellMedicinesInCart(cart);
}



function handleSellForMedicine(item) {
// Get the input values from the form
const sellFormPatientName = item.patientName;
const piecesSold = item.pieces; // Assuming you want to sell the same number of pieces as in the cart item

// Assuming you already have access to the patients array
const patient = patients.find((p) => p.name === sellFormPatientName);

if (!patient) {
  // Patient not found, handle the error or show a message
  console.error('Medicine not found.');
  return;
}

// Convert patient.parents from string to number (initial stock)
const initialStock = parseInt(patient.parents);

// Check if the patient has a sales node
if (patient.hasOwnProperty('sales')) {
  // Get the sales node of the current patient
  const salesNode = patient.sales;

  // Calculate the total sales quantity for the current patient
  let totalSalesQuantity = 0;

  // Loop through the properties of the sales node
  for (const saleKey in salesNode) {
    // Assuming each saleNode has a "quantity" property representing the sales quantity
    const saleQuantity = parseInt(salesNode[saleKey].quantity);
    if (!isNaN(saleQuantity)) {
      totalSalesQuantity += saleQuantity;
    }
  }

  // Calculate the remaining stock for the current patient
  const remainingStock = initialStock - totalSalesQuantity;

  if (piecesSold > remainingStock) {
    alert('Cannot sell beyond remaining stock.');
    return;
  }
}

// Proceed with adding the sale data to the database
const patientSalesRef = push(ref(database, `medicine/${sellFormPatientName}/sales`));

// Generate a unique sale ID using the `key` method
const saleId = patientSalesRef.key;

// Get the current timestamp
const currentTime = new Date();

// Format the timestamp into MM/DD/YY format
const saleDate = `${(currentTime.getMonth() + 1).toString().padStart(2, '0')}/${currentTime.getDate().toString().padStart(2, '0')}/${currentTime.getFullYear().toString().slice(2)}`;

const saleTime = new Date(currentTime).toLocaleTimeString();

// Set the value of the new sale node including the quantity, date, and time
set(patientSalesRef, { saleId: saleId, quantity: piecesSold, date: saleDate, time: saleTime })
  .then(() => {
    // Success: Sale data added to the database
    //console.log('Sale added successfully with ID:', saleId);

    // Display a success message with the sale details
    const successMessage = document.getElementById('sellSuccessMessage');
    successMessage.textContent = `Sale recorded with successfully!`;
    successMessage.style.display = 'block';

    setTimeout(() => {
      successMessage.style.display = 'none';
      cartPopup.style.display = 'none';
    }, 2000); // Hide the success message after 5 seconds and close the cart popup
  })
  .catch((error) => {
    // Error occurred while adding sale data
    console.error('Failed to add sale data:', error);
    alert('Error adding sale. Please try again.');
  });
}









function handleSellProductSubmit(e) {
e.preventDefault();

// Get the input values from the form
const sellFormPatientName = document.getElementById('sellFormPatientName').value;
const sellPiecesInput = document.getElementById('sellPieces');
const piecesSold = parseInt(sellPiecesInput.value, 10);

if (!isNaN(piecesSold) && piecesSold > 0) {
  // Assuming you already have access to the patients array
  const patient = patients.find((p) => p.name === sellFormPatientName);

  if (!patient) {
    // Patient not found, handle the error or show a message
    console.error('Medicine not found.');
    return;
  }

  // Convert patient.parents from string to number (initial stock)
  const initialStock = parseInt(patient.parents);

  // Check if the patient has a sales node
  if (patient.hasOwnProperty('sales')) {
    // Get the sales node of the current patient
    const salesNode = patient.sales;

    // Calculate the total sales quantity for the current patient
    let totalSalesQuantity = 0;

    // Loop through the properties of the sales node
    for (const saleKey in salesNode) {
      // Assuming each saleNode has a "quantity" property representing the sales quantity
      const saleQuantity = parseInt(salesNode[saleKey].quantity);
      if (!isNaN(saleQuantity)) {
        totalSalesQuantity += saleQuantity;
      }
    }

    // Calculate the remaining stock for the current patient
    const remainingStock = initialStock - totalSalesQuantity;

    if (piecesSold > remainingStock) {
      alert('Cannot sell beyond remaining stock.');
      return;
    }
  }

  // Proceed with adding the sale data to the database
  const patientSalesRef = push(ref(database, `medicine/${sellFormPatientName}/sales`));

// Generate a unique sale ID using the `key` method
const saleId = patientSalesRef.key;

  // Get the current timestamp
  const currentTime = new Date().getTime();

  // Format the timestamp into date and time
  const saleDate = new Date(currentTime).toLocaleDateString();
  const saleTime = new Date(currentTime).toLocaleTimeString();

  // Set the value of the new sale node including the quantity, date, and time
  set(patientSalesRef, {saleId: saleId, quantity: piecesSold, date: saleDate, time: saleTime })
    .then(() => {
      // Success: Sale data added to the database
      console.log('Sale added successfully with ID:', saleId);

      // Display a success message with the sale details
      const successMessage = document.getElementById('sellSuccessMessage');
      successMessage.textContent = `Sale recorded with  id ${saleId} successfully on ${saleDate} at ${saleTime}`;
      successMessage.style.display = 'block';
      setTimeout(() => {
        successMessage.style.display = 'none';
      }, 5000); // Hide the success message after 3 seconds
    })
    .catch((error) => {
      // Error occurred while adding sale data
      console.error('Failed to add sale data:', error);
      alert('Error adding sale. Please try again.');
    });

  // Close the sell popup
  const sellPopupOverlay = document.getElementById('sellPopupOverlay2');
  sellPopupOverlay.style.display = 'none';
} else {
  alert('Please enter a valid number of pieces to sell.');
}
}




// Define the addRecordForm and currentPatientName variables
const addRecordForm = document.getElementById('addRecordForm');
let currentPatientName = '';
function showMessage(message) {
const messageElement = document.getElementById('message');
messageElement.textContent = message;
messageElement.style.display = 'block';

// Hide the message after 4 seconds (4000 milliseconds)
setTimeout(() => {
  messageElement.style.display = 'none';
}, 4000);
}

// Call showMessage with an empty message to hide the message on page load
showMessage('');


// Attach the submit event listener outside the function
addRecordForm.addEventListener('submit', function (e) {
e.preventDefault();

const patientName = currentPatientName;
const testsTaken = document.getElementById('testsTaken').value;
const resultsObtained = document.getElementById('resultsObtained').value;
const medicationTaken = document.getElementById('medicationTaken').value;
const additionalNotes = document.getElementById('additionalNotes').value;

const recordData = {
  testsTaken: testsTaken,
  resultsObtained: resultsObtained,
  medicationTaken: medicationTaken,
  additionalNotes: additionalNotes
};


const patientRef = ref(database, `medicine/${patientName}`);
const newRecordRef = push(child(patientRef, 'history'));
set(newRecordRef, recordData)
  .then(() => {
    addRecordForm.reset();
    showMessage('Record added successfully!');
  })
  .catch((error) => {
    console.error('Error adding record:', error);
    showMessage('Error adding record. Please try again.');
  });
});

function openPatientHistoryPopup(patient) {
  const popupOverlay = document.getElementById('popupOverlay1');
  const popupClose = document.getElementById('popupClose1');
  const patientHistory = document.getElementById('patientHistory');

  // Clear existing patient history
  patientHistory.innerHTML = '';

  // Populate patient history in the popup
  // You can customize the format and content of the patient history here
  const patientHistoryContent = document.createElement('div');
  patientHistoryContent.innerHTML = `
    <p><strong>Name of Medicine:</strong> ${patient.name}</p>
    <p><strong>Date of Expiry:</strong> ${patient.dob}</p>
    <p><strong>Number of Pieces:</strong> ${patient.parents}</p>
    <p><strong>Date of Stock:</strong> ${patient.dos}</p>
    <p><strong>Medical History:</strong> ${patient.medicalHistory}</p>
  `;
  patientHistory.appendChild(patientHistoryContent);

  // Open the popup
  popupOverlay.style.visibility = 'visible';
  popupOverlay.style.opacity = '1';
// Close the add record popup
addRecordPopupOverlay.style.visibility = 'hidden';
addRecordPopupOverlay.style.opacity = '0';

  // Close the popup when the close button is clicked
  popupClose.addEventListener('click', function() {
    popupOverlay.style.visibility = 'hidden';
    popupOverlay.style.opacity = '0';
  });




const patientHistoryElement = document.getElementById('patientHistory');

// Retrieve and display the patient's history
const patientName = patient.name; // Replace this with the patient's name
const patientHistoryRef = ref(database, `medicine/${patientName}/history`);
onValue(patientHistoryRef, (snapshot) => {
patientHistoryElement.innerHTML = ''; // Clear previous records

if (snapshot.exists()) {
  snapshot.forEach((childSnapshot) => {
    const recordKey = childSnapshot.key;
    const record = childSnapshot.val();
    const recordElement = createRecordElement(recordKey, record);
    patientHistoryElement.appendChild(recordElement);
  });
} else {
  const noRecordsElement = document.createElement('p');
  noRecordsElement.textContent = 'No Records Found';
  noRecordsElement.style.fontStyle = 'italic';
  patientHistoryElement.appendChild(noRecordsElement);
}
});


// Function to create a record element
function createRecordElement(recordKey, record) {
const recordElement = document.createElement('div');
recordElement.classList.add('record');

const recordKeyElement = document.createElement('h4');
recordKeyElement.textContent = 'Record Key: ' + recordKey;
recordElement.appendChild(recordKeyElement);

const testsTakenElement = document.createElement('p');
testsTakenElement.textContent = 'Age Range: ' + record.testsTaken;
recordElement.appendChild(testsTakenElement);

const resultsObtainedElement = document.createElement('p');
resultsObtainedElement.textContent = 'Prescription: ' + record.resultsObtained;
recordElement.appendChild(resultsObtainedElement);

const medicationTakenElement = document.createElement('p');
medicationTakenElement.textContent = 'Works on (Treats): ' + record.medicationTaken;
recordElement.appendChild(medicationTakenElement);

const additionalNotesElement = document.createElement('p');
additionalNotesElement.textContent = 'Additional Notes: ' + record.additionalNotes;
recordElement.appendChild(additionalNotesElement);

// Create delete button
const deleteButton = document.createElement('button');
deleteButton.classList.add('delete-button');

// Create bin icon
const binIcon = document.createElement('i');
binIcon.classList.add('fa', 'fa-trash');

// Set the inner HTML of the delete button
deleteButton.innerHTML = '';
deleteButton.appendChild(binIcon);
deleteButton.innerHTML += ' Delete';


// Add click event listener to delete the record
deleteButton.addEventListener('click', () => {
  deleteRecord(recordKey);
});

// Append the delete button to the record element
recordElement.appendChild(deleteButton);

return recordElement;
}
// Function to delete a record from the database
function deleteRecord(recordKey) {
const patientName = patient.name; // Replace this with the patient's name

// Prompt the user for confirmation
const confirmation = confirm('Are you sure you want to delete this record?');

if (confirmation) {
  // Prompt the user for password
  const password = prompt('Please enter your password to confirm the deletion:');
  
  // Check if the password is correct
  if (password === 'mm') { // Replace 'your_password' with the actual password
    // Create a reference to the specific record in the patient's history
    const recordRef = ref(database, `medicine/${patientName}/history/${recordKey}`);

    // Remove the record from the database
    remove(recordRef)
      .then(() => {
        alert('Record deleted successfully!');
      })
      .catch((error) => {
        console.error('Error deleting record:', error);
        alert('Error deleting record. Please try again.');
      });
  } else {
    alert('Wrong password. Deletion cancelled.');
  }
}
}

};





// Open the add record popup
const addMedicationBtn = document.getElementById('addMedicationBtn');
const addRecordPopupOverlay = document.getElementById('addRecordPopupOverlay');
const addRecordPopupClose = document.getElementById('addRecordPopupClose');

addMedicationBtn.addEventListener('click', () => {
addRecordPopupOverlay.style.visibility = 'visible';
addRecordPopupOverlay.style.opacity = '1';
});

// Close the add record popup
addRecordPopupClose.addEventListener('click', () => {
addRecordPopupOverlay.style.visibility = 'hidden';
addRecordPopupOverlay.style.opacity = '0';
});


const loaderElement = document.getElementById('loader');

// Retrieve and render patients
const patientsRef = ref(database, 'medicine');

// Show the loader
loaderElement.classList.remove('hidden');

onValue(patientsRef, (snapshot) => {
const patientsData = snapshot.val();

if (patientsData) {
  patients = Object.values(patientsData); // Update the patients variable
  renderPatients(patients);
}

// Hide the loader
loaderElement.classList.add('hidden');
});

const uploadForm = document.getElementById('addPatientForm');
uploadForm.addEventListener('submit', (e) => {
e.preventDefault();

// Assuming you have already initialized Firebase
const nameInput = document.getElementById('name');
const dobInput = document.getElementById('dob');
const parentsInput = document.getElementById('parents');

const database = getDatabase();

// Save patient data to Firebase
const savePatientData = () => {
const name = nameInput.value;
const dob = dobInput.value;
const parents = parentsInput.value;

const patientsRef = ref(database, 'medicine');
const newPatientRef = child(patientsRef, name); // Use patient name as the key

set(newPatientRef, {
  name: name,
  dob: dob,
  parents: parents
})
  .then(() => {
    nameInput.value = '';
    dobInput.value = '';
    parentsInput.value = '';

    showMessage('Medicine details uploaded successfully!');
  })
  .catch((error) => {
    console.error('Error uploading medicine details:', error);
    showMessage('Error uploading medicine details. Please try again.');
  });
};

const showMessage = (message) => {
const messageElement = document.getElementById('message');
messageElement.textContent = message;
messageElement.style.display = 'block';

setTimeout(() => {
  messageElement.style.display = 'none';
}, 3000);
};



});

// Get the online status element
const onlineStatusElement = document.getElementById('onlineStatus');
const overlayElement = document.getElementById('overlay');

// Function to update the online status indicator
function updateOnlineStatus() {
if (navigator.onLine) {
  onlineStatusElement.innerHTML = '<i class="fa fa-wifi"></i>';
  onlineStatusElement.classList.remove('offline');
  onlineStatusElement.classList.add('online');
  overlayElement.style.display = 'none';
} else {
  onlineStatusElement.innerHTML = '<i class="fa fa-exclamation-triangle"></i>';
  onlineStatusElement.classList.remove('online');
  onlineStatusElement.classList.add('offline');
  overlayElement.style.display = 'block';
}
}


// Initial update of online status
updateOnlineStatus();

// Add event listeners for online and offline events
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
window.addEventListener('load', function () {
    const splashScreen = document.getElementById('splashScreen');
    splashScreen.style.opacity = '0';
    setTimeout(function () {
      splashScreen.style.display = 'none';
    }, 500); // Change this duration to control how long the splash screen is shown (in milliseconds)
  });

 