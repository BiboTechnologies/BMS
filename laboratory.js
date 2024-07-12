
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-storage.js";
import { getDatabase, ref, remove, push, get, update, onValue, child, set } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";
import { getAuth, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js";
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
const auth = getAuth(app);
const storage = getStorage(app);


      
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



/*const medicationTakenSelect = document.getElementById('medicationTaken');

// Retrieve medicines from Firebase and populate the select options
const medicinesRef = ref(database, 'medicine');
onValue(medicinesRef, (snapshot) => {
  const medicinesData = snapshot.val();

  // Clear existing options
  medicationTakenSelect.innerHTML = '';

  // Add options for each medicine
  if (medicinesData) {
    const medicines = Object.values(medicinesData);
    medicines.forEach((medicine) => {
      const option = document.createElement('option');
      option.value = medicine;
      option.textContent = medicine.name;
      medicationTakenSelect.appendChild(option);
    });
  }
});*/
const form = document.querySelector('.popup-form');
const submitButton = document.querySelector('.popup-form button');
const patientsContainer = document.getElementById('patients');
const loader = document.getElementById('loader'); // Add the loader element
let patients = []; // Declare patients variable outside the event listener
let patientCount = 1; // Initialize patient count

// Retrieve the maximum patient count from the database
const patientsRef = ref(database, 'patients');
get(patientsRef)
  .then((snapshot) => {
    if (snapshot.exists()) {
      const patientData = snapshot.val();
      const patientIds = Object.values(patientData).map((patient) => parseInt(patient.patientId));
      patientCount = Math.max(...patientIds, 0) + 1;
    } else {
      patientCount = 1; // If no patient data exists, start from 1
    }

    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const name = document.getElementById('name').value.trim(); // Remove leading and trailing spaces
      const dob = document.getElementById('dob').value;
      const parents = document.getElementById('parents').value;
      const residence = document.getElementById('residence').value;
      const payment = document.getElementById('payment').value;
      const sex = document.getElementById('sex').value;
      const patientId = patientCount.toString(); // Generate patient ID as plain number

      const patientData = {
        name: name,
        dob: dob,
        parents: parents,
        residence: residence,
        payment: payment,
        sex: sex,
        patientId: patientId
      };

      const newPatientRef = ref(database, `patients/${name}`); // Use patient name as the key

      // Check if patient with the same name already exists
      get(newPatientRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            // Display an alert if patient with the same name already exists
            alert('Patient with the same name already exists.');
          } else {
            // Show the loader
            loader.style.display = 'block';

            // Save the new patient data
            set(newPatientRef, patientData)
              .then(() => {
                form.reset();
                showMessage('Patient details uploaded successfully!');
                patientCount++; // Increment patient count

                // Hide the loader
                loader.style.display = 'none';
              })
              .catch((error) => {
                console.error('Error uploading patient details:', error);
                showMessage('Error uploading patient details. Please try again.');

                // Hide the loader
                loader.style.display = 'none';
              });
          }
        })
        .catch((error) => {
          console.error('Error checking if patient exists:', error);
          showMessage('Error checking if patient exists. Please try again.');

          // Hide the loader
          loader.style.display = 'none';
        });
    });
  })
  .catch((error) => {
    console.error('Error retrieving patient count:', error);
    showMessage('Error retrieving patient count. Please try again.');
  });

// Add event listener to search button
searchButton.addEventListener('click', () => {
  const searchTerm = searchInput.value.trim(); // Get the search term

  // Show the loader
  loaderElement.classList.remove('hidden');

  // Clear the patients container
  patientsContainer.innerHTML = '';

  // Search through Firebase for patient names and IDs
  const patientsRef = ref(database, 'patients');
  onValue(patientsRef, (snapshot) => {
    const patientsData = snapshot.val();
    const searchResults = [];

    if (patientsData) {
      const patients = Object.entries(patientsData);

      if (searchTerm !== '') {
        // Filter patients based on the search term
        patients.forEach(([patientId, patient]) => {
          if (patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || patient.patientId.includes(searchTerm)) {
            searchResults.push(patient);
          }
        });
      } else {
        // Display all patients if the search term is empty
        searchResults.push(...patients.map(([patientId, patient]) => patient));
      }
    }

    // Hide the loader
    loaderElement.classList.add('hidden');

    // Display search results
    if (searchResults.length > 0) {
      renderPatients(searchResults);
    } else {
      patientsContainer.innerHTML = '<p class="no-results">No Patients found.</p>';
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

// Define variables
let patientsData = []; // Store all patient data
let searchResults = []; // Store search results
let currentPage = 1;
const patientsPerPage = 100;

// Add event listener to search input for live search
searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.trim().toLowerCase(); // Get the search term

  // Clear the search results
  searchResults = [];

  if (searchTerm !== '') {
    // Filter patients based on the search term
    searchResults = patientsData.filter(patient => {
      return (
        patient.name.toLowerCase().includes(searchTerm) ||
        patient.patientId.includes(searchTerm)
      );
    });
  }

  // Update the pagination and render the patients
  currentPage = 1;
  renderPatients();
});

// Fetch patient data from Firebase
onValue(patientsRef, (snapshot) => {
  patientsData = snapshot.val() ? Object.values(snapshot.val()) : [];
  // Update the pagination and render the patients
  renderPatients();
});

// Function to render the patients for the current page
function renderPatients() {
  patientsContainer.innerHTML = '';

  // Apply search filter if searchResults exist, else use patientsData
  const dataToDisplay = searchResults.length > 0 ? searchResults : patientsData;

  // Calculate the start and end indices for the current page
  const startIndex = (currentPage - 1) * patientsPerPage;
  const endIndex = startIndex + patientsPerPage;

  // Create a subset of patients for the current page
  const patientsForPage = dataToDisplay.slice(startIndex, endIndex);

  // Create the table element
  const table = document.createElement('table');
  table.classList.add('patient-table');

  // Define the table header row
  const tableHeaderRow = document.createElement('tr');
  tableHeaderRow.classList.add('table-header');

  // Define the table header columns
  const headers = ['Name', 'Place of Residence', 'Payment Terms', 'Sex', 'Patient ID', 'Contact', 'Date of Birth', 'Age', 'Actions'];

  // Create the table header cells
  headers.forEach(headerText => {
    const tableHeaderCell = document.createElement('th');
    tableHeaderCell.textContent = headerText;
    tableHeaderRow.appendChild(tableHeaderCell);
  });

  // Function to create a table cell with hidden first digits
  function createHiddenDigitsTableCell(text, visibleDigitsCount) {
    const cell = document.createElement('td');
    const hiddenDigits = '*'.repeat(text.length - visibleDigitsCount);
    const visibleDigits = text.slice(-visibleDigitsCount);
    cell.textContent = hiddenDigits + visibleDigits;
    return cell;
  }

  // Append the header row to the table
  table.appendChild(tableHeaderRow);

patientsForPage.forEach(patient => {
  // Create a table row for each patient
  const tableRow = document.createElement('tr');
  tableRow.classList.add('table-row');

  // Create the table cells for patient information
  const nameCell = createTableCell(patient.name);
  const residenceCell = createTableCell(patient.residence);
  const paymentCell = createTableCell(patient.payment);
  const sexCell = createTableCell(patient.sex);
  const patientIdCell = createTableCell('PI - ' + patient.patientId);
  const parentsCell = createHiddenDigitsTableCell(patient.parents, 3);
  const dobCell = createTableCell(patient.dob);
  
  // Calculate the age based on the date of birth
  const dob = new Date(patient.dob);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  const ageCell = createTableCell(age.toString());

  // Create the actions cell with the view button
  const actionsCell = document.createElement('td');
  const viewButton = document.createElement('button');
  viewButton.textContent = 'View';
  viewButton.classList.add('view-button');
  viewButton.addEventListener('click', function() {
    currentPatientName = patient.name; // Set the current patient name
    openPatientHistoryPopup(patient);
  });
  actionsCell.appendChild(viewButton);

  // Append the cells to the table row
  tableRow.appendChild(nameCell);
  tableRow.appendChild(residenceCell);
  tableRow.appendChild(paymentCell);
  tableRow.appendChild(sexCell);
  tableRow.appendChild(patientIdCell);
  tableRow.appendChild(parentsCell);
  tableRow.appendChild(dobCell);
  tableRow.appendChild(ageCell);
  tableRow.appendChild(actionsCell);

  // Append the row to the table
  table.appendChild(tableRow);
});

// Append the table to the patients container
patientsContainer.appendChild(table);

  // Create pagination navigation
  const totalPages = Math.ceil(dataToDisplay.length / patientsPerPage);

  // Get a reference to the pagination div by its id
  const paginationDiv = document.getElementById('pagination');
  paginationDiv.innerHTML = ''; // Clear existing content in the div

  // Create previous and next buttons
  const prevButton = document.createElement('button');
  prevButton.textContent = 'Previous';
  prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderPatients(); // Re-render with the previous page
    }
  });

  const nextButton = document.createElement('button');
  nextButton.textContent = 'Next';
  nextButton.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderPatients(); // Re-render with the next page
    }
  });

  // Display current page and total pages
  const pageInfo = document.createElement('span');
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

  // Append the buttons and page info to the pagination div
  paginationDiv.appendChild(prevButton);
  paginationDiv.appendChild(pageInfo);
  paginationDiv.appendChild(nextButton);
}

// Add event listener to search input for live search
searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.trim().toLowerCase(); // Get the search term

  // Clear the search results
  searchResults = [];

  if (searchTerm !== '') {
    // Filter patients based on the search term
    searchResults = patientsData.filter(patient => {
      return (
        patient.name.toLowerCase().includes(searchTerm) ||
        patient.patientId.includes(searchTerm)
      );
    });
  }

  // Reset the pagination to the first page
  currentPage = 1;

  // Update the pagination and render the patients
  renderPatients();
});

// Call renderPatients with the initial parameters to show the first page
renderPatients();

function createTableCell(text) {
  const cell = document.createElement('td');
  cell.textContent = text;
  return cell;
}




















function openPatientHistoryPopup(patient) {
  const popupOverlay = document.getElementById('popupOverlay1');
  const popupClose = document.getElementById('popupClose1');
  const patientDetails = document.getElementById('patientDetails');
  const patientHistory = document.getElementById('patientHistory');

  // Clear existing patient details and history
  patientDetails.innerHTML = '';
  patientHistory.innerHTML = '';

  // Open the popup
  popupOverlay.style.visibility = 'visible';
  popupOverlay.style.opacity = '1';

  // Close the popup when the close button is clicked
  popupClose.addEventListener('click', function () {
    popupOverlay.style.visibility = 'hidden';
    popupOverlay.style.opacity = '0';
  });

  const patientDetailsHTML = `
  <div class="patient-details">
 
<style>
  .button {
    background-color: #4CAF50;
    border: none;
    color: white;
    padding: 10px;
    text-align: center;
    text-decoration: none;
    font-size: 14px;
    margin: 4px 2px;
    cursor: disabled;
    border-radius: 50px;
  }

  .save-button {
    background-color: #4CAF50;
  }

  .delete-button {
    background-color: #f44336;
  }
</style>
 <div class="patient-image-frame">
  <label for="uploadImage" class="upload-label">
    <i class="fa fa-upload"></i>
    
  </label>
  <input type="file" id="uploadImage" accept="image/*">
</div>
<h3>Patient Demographics:</h3>
<table class="patient-demographics-table">
    <tr>
      <td><strong>Name:</strong></td>
      <td>${patient.name}</td>
    </tr>
    <tr>
      <td><strong>Date of Birth:</strong></td>
      <td>${patient.dob}</td>
    </tr>
    <tr>
      <td><strong>Gender:</strong></td>
      <td>${patient.sex}</td>
    </tr>
    <tr>
      <td><strong>Payment Type:</strong></td>
      <td>${patient.payment}</td>
    </tr>
    <tr>
      <td><strong>Residence:</strong></td>
      <td>${patient.residence}</td>
    </tr>
    <tr>
      <td><strong>Contact:</strong></td>
      <td>${patient.parents}</td>
    </tr>
    <tr>
      <td><strong>Patient ID:</strong></td>
      <td>${patient.patientId}</td>
    </tr>
    <tr>
      <td><strong>Current Patient's Status:</strong></td>
      <td><span id="currentStatus"></span></td>
    </tr>
  </table>
    <div id="barcode"></div> <!-- This is where the generated barcode will be displayed -->

    <!-- Add a "Visit Count" element in your HTML -->
    <p style="text-decoration: underline;"><strong>No. of visits:</strong>  <span id="visitCount"></span></p>
    <!-- Add more patient details as needed -->

    <!-- The container for patient visit details -->
<div id="patientVisitDetails" ></div>
<!-- Add this inside your patient details HTML -->



    <!-- Assuming you have the patient's name as patientName variable -->
<button style="background: darkblue; display:none" id="visit" data-patient="${patient.patientId}" class="button save-button">
  <i id="visitIcon" style="margin-right: 5px;" class="fas fa-calendar-check"></i>Reg. Visit
</button>
          <button  style="background: darkblue; " id="triageButton"  class="button save-button"><i style="margin-right: 5px;" class="fas fa-chart-line"></i>Triage History</button>

<button style="display:none" id="saveButton"  class="button save-button" disabled><i style="margin-right: 5px;" class="fa fa-save"></i>Save Image</button>
<button style="display:none" id="delButton" class="button delete-button"><i class="fa fa-trash"></i>Delete Image</button>
<button style="display:none" id="addToWaitingListButton" class="button save-button">
  <i style="margin-right: 5px;" class="fas fa-list"></i>Add to Waiting List
</button>
<button style="display:none" id="editButton" class="button save-button">
  <i style="margin-right: 5px;" class="fa fa-edit"></i>Edit Details
</button>

  </div>
  `;


  patientDetails.innerHTML = patientDetailsHTML;

  const patientHistoryElement = document.getElementById('patientHistory');
// Get references to the elements
const uploadImage = document.getElementById('uploadImage');
const saveButton = document.getElementById('saveButton');
const imageFrame = document.querySelector('.patient-image-frame');
// ...

// Check if the patient has an image URL
if (patient.image) {
  // Create the image element
  const imageElement = document.createElement('img');
  imageElement.src = patient.image;
  imageElement.alt = 'Patient Image';

  // Append the image to the frame
  imageFrame.innerHTML = '';
  imageFrame.appendChild(imageElement);
} else {
  // Show the upload input if no image is available
  const uploadLabel = document.createElement('p');
  uploadLabel.htmlFor = 'uploadImage';
  uploadLabel.className = 'no-image-label';
  uploadLabel.innerHTML = `
  <i class="fas fa-image"></i>
  No Image found
`;


  const uploadInput = document.createElement('input');
  uploadInput.type = 'file';
  uploadInput.id = 'uploadImage';
  uploadInput.accept = 'image/*';

  imageFrame.innerHTML = '';
  imageFrame.appendChild(uploadLabel);
  imageFrame.appendChild(uploadInput);

  // Handle file selection
  uploadInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      const imageUrl = e.target.result;

      // Create the image element
      const imageElement = document.createElement('img');
      imageElement.src = imageUrl;
      imageElement.alt = 'Patient Image';

      // Append the image to the frame
      imageFrame.innerHTML = '';
      imageFrame.appendChild(imageElement);

      // Enable the save button
      saveButton.disabled = false;
    };

    reader.readAsDataURL(file);
  });
}


// Handle save button click
saveButton.addEventListener('click', function () {
  // Get the image data from the image element
  const imageElement = imageFrame.querySelector('img');
  const imageData = imageElement.src;

  // Get the patient name
  const patientName = patient.patientId;

  // Generate a unique filename for the image using the patient's name
  const filename = `${patientName}_${Date.now()}.jpg`;

  // Save the image data to Firebase Storage under the patient's name
  const imageRef = storageRef(storage, `images/${filename}`);
  const imageBlob = dataURItoBlob(imageData);

  // Upload the image blob to Firebase Storage
  const uploadTask = uploadBytes(imageRef, imageBlob);

  // Monitor the upload completion using the then method
  uploadTask.then(function () {
    // The image has been successfully uploaded
    // Get the download URL of the image
    getDownloadURL(imageRef).then(function (downloadURL) {
      // Save the download URL to the patient's data in Firebase
      const patientRef = ref(database, `patients/${patient.name}`);
      update(patientRef, {
        image: downloadURL,
      });

      // Show success message or perform any additional actions
      showMessage('Image saved successfully!');
    });
  }).catch(function (error) {
    // Handle the upload error
    console.error('Error uploading image:', error);
    showMessage('Error uploading image. Please try again.');
  });
});

const deleteButton = document.getElementById('delButton')
// ...

// Handle delete button click
deleteButton.addEventListener('click', function () {
  if (!patient.image) {
    // No image available, do nothing
    return;
  }

  // Update the patient's data to remove the image reference
  const patientRef = ref(database, `patients/${patient.name}`);
  update(patientRef, {
    image: null,
  })
    .then(() => {
      imageFrame.innerHTML = '';

      // Disable the delete button
      deleteButton.disabled = true;

      // Show success message or perform any additional actions
      showMessage('Image deleted successfully!');
    })
    .catch((error) => {
      console.error('Error deleting image:', error);
      showMessage('Error deleting image. Please try again.');
    });
});

// ...



// Check if the patient has an image URL
if (patient.image) {
  // Create the image element
  const imageElement = document.createElement('img');
  imageElement.src = patient.image;
  imageElement.alt = 'Patient Image';

  // Append the image to the frame
  imageFrame.innerHTML = '';
  imageFrame.appendChild(imageElement);

  // Enable the delete button
  deleteButton.disabled = false;
}
// ...


function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  
  return new Blob([ab], { type: mimeString });
}




 // Retrieve and display the patient's history
 const patientName = patient.patientId; // Replace this with the patient's name
const patientHistoryRef = ref(database, `patients/${patientName}/testsTaken`);

// Function to get the latest test status
function getLatestTestStatus(records) {
  if (records.length === 0) return 'Unknown';

  // Sort the records by dateTaken in descending order
  records.sort((a, b) => b.data.dateTaken - a.data.dateTaken);

  // Get the status of the latest test result
  const latestTestStatus = records[0].data.results?.finalStatus || 'Pending...';
  return latestTestStatus;
}

onValue(patientHistoryRef, (snapshot) => {
  patientHistoryElement.innerHTML = ''; // Clear previous records

  if (snapshot.exists()) {
    const records = [];
    snapshot.forEach((childSnapshot) => {
      const recordKey = childSnapshot.key;
      const record = childSnapshot.val();
      records.push({ key: recordKey, data: record });
    });

    // Get the patient's current status from the latest test result
    const currentStatusElement = document.getElementById('currentStatus');
    const currentStatus = getLatestTestStatus(records);
    currentStatusElement.textContent =  currentStatus;
    //currentStatusElement.style.color = currentStatus === 'Completed Successfully' ? 'darkblue' : 'orange';

    records.forEach((recordObj) => {
      const recordKey = recordObj.key;
      const record = recordObj.data;

      // Create the record element and add it to the patientHistoryElement
      const recordElement = createRecordElement(recordKey, record);
      patientHistoryElement.appendChild(recordElement);

      // Reference the test result node in Firebase
      const testResultRef = ref(database, `patients/${patientName}/testsTaken/${recordKey}/resultsObtained`);

      // Listen for changes in the test result status
      onValue(testResultRef, (resultSnapshot) => {
        const resultsObtainedElement = recordElement.querySelector('.results-obtained-data');
        if (resultsObtainedElement) {
          if (resultSnapshot.exists()) {
            const resultsObtained = resultSnapshot.val();
            resultsObtainedElement.textContent = (resultsObtained === 'Completed Successfully' ? 'Completed Successfully' : 'Pending...');
            resultsObtainedElement.style.color = resultsObtained === 'Completed Successfully' ? 'darkblue' : 'orange';
          } else {
            resultsObtainedElement.textContent = 'Pending...';
            resultsObtainedElement.style.color = 'orange';
          }
        } else {
          console.error("results-obtained-data element not found in recordElement");
        }
      });
    });
  } else {
    const noRecordsElement = document.createElement('p');
    noRecordsElement.textContent = 'No Records Found';
    noRecordsElement.style.fontStyle = 'italic';
    patientHistoryElement.appendChild(noRecordsElement);
  }
});






// Function to display the patient's visit details
function displayPatientVisitDetails(visitKeys, visitDetails) {
  const patientVisitDetailsDiv = document.getElementById('patientVisitDetails');
  patientVisitDetailsDiv.innerHTML = '';

  if (visitDetails) {
    const visitKeys = Object.keys(visitDetails);

    // Sort the visit keys in descending order based on timestamp
    visitKeys.sort((a, b) => visitDetails[b].timestamp - visitDetails[a].timestamp);

         // Get the visit count
         const visitCount = visitKeys.length;

// Display the visit count in the "Visit Count" element
const visitCountElement = document.getElementById('visitCount');
visitCountElement.textContent = visitCount;



    // Get the latest visit key
    const latestVisitKey = visitKeys[0];
    const latestVisitData = visitDetails[latestVisitKey];

    // Create the visit element for the latest visit
    const visitElement = document.createElement('div');

    // Add the visit details to the visit element
    visitElement.innerHTML = `

    <h3>LATEST VISIT TRIAGE:</h3>
<div class="visit-details-container">
  <p><b>Date:</b> ${formatDate(latestVisitData.timestamp)}</p>
  <p><b>Clinician's Name:</b> ${latestVisitData.clinicianName || 'N/D'}</p>
  <p><b>Temperature:</b> ${latestVisitData.temperature || 'N/D'} &deg;C</p>
  <p><b>BP:</b> ${latestVisitData.bp || 'N/D'} (mmHg)</p>
  <p><b>RR:</b> ${latestVisitData.rr || 'N/D'}</p>
  <p><b>HR:</b> ${latestVisitData.hr || 'N/D'}</p>
  <p><b>SpO2:</b> ${latestVisitData.sp02 || 'N/D'} (%)</p>
  <p><b>WT:</b> ${latestVisitData.wt || 'N/D'} (Kg)</p>
  <p><b>HT:</b> ${latestVisitData.ht || 'N/D'} (Cm)</p>
  <p><b>BMI:</b> ${latestVisitData.bmi || 'N/D'}</p>
  <p><b>MUAC:</b> ${latestVisitData.muac || 'N/D'}</p>
  <p><b>Weight for Age Z score:</b> ${latestVisitData.weightForAgeZScore || 'N/D'} (Kg)</p>
  <p><b>Disability:</b> ${latestVisitData.disability || 'N/D'}</p>
  <p><b>Known Chronic Illness:</b> ${latestVisitData.chronicIllness || 'N/D'}</p>
  <p><b>Any Drug Abuse:</b> ${latestVisitData.drugAbuse || 'N/D'}</p>
  <p><b>Allergies:</b> ${latestVisitData.allergies && latestVisitData.allergies.length > 0
    ? latestVisitData.allergies.join(', ')
    : 'N/D'}
  </p>
</div>
<hr>


    `;

    patientVisitDetailsDiv.appendChild(visitElement);
  } else {
    patientVisitDetailsDiv.textContent = 'No visit details found.';
    patientVisitDetailsDiv.style.fontStyle = 'italic';
  }
}


function getPatientVisitDetails(patientName) {
  const visitsRef = ref(database, `patients/${patientName}/visits`);
  onValue(visitsRef, (snapshot) => {
    const visitDetails = snapshot.val();
    if (visitDetails) {
      const visitKeys = Object.keys(visitDetails);
      visitKeys.sort((a, b) => visitDetails[b].timestamp - visitDetails[a].timestamp);

      // Call the function to display the patient's visit details
      displayPatientVisitDetails(visitKeys, visitDetails);
      // Call the function to create the chart
      createVisitTrendChart(visitKeys, visitDetails);
    } else {
      displayPatientVisitDetails(null); // If no visit details found, display an empty state
      createVisitTrendChart([], {}); // If no visit details found, create an empty chart
    }
  });
}

// Call the function to retrieve and display the patient's visit details
getPatientVisitDetails(patientName);

// Variable to track whether the popup is open or not
let isPopupOpen = false;




// Function to close the popup
function closePopup() {
  visitPopupOverlay.style.display = 'none';
}

// Event listener for the "Cancel" button
//const cancelVisitBtn = document.getElementById('cancelVisitBtn');
//cancelVisitBtn.addEventListener('click', closePopup);

// Function to format the timestamp
function formatDate(timestamp) {
  const date = new Date(timestamp);
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleString('en-US', options);
}

// Variable to store the reference to the current chart
let visitTrendChart;

// Function to destroy the previous chart if it exists
function destroyChart() {
  if (window.visitTrendChart && window.visitTrendChart.destroy) {
    window.visitTrendChart.destroy();
  }
}

// Function to analyze the trend and provide recommendations
function analyzeAndProvideRecommendations(temperatures, respiratoryRates, heartRates, spO2Values, vitalSignsData) {
  // Analyze the trend and generate recommendations based on the vital signs data
  const newTemperature = temperatures[0];
  const previousTemperature = temperatures[1];
  const temperatureDifference = newTemperature - previousTemperature;

  const newRespiratoryRate = respiratoryRates[0];
  const previousRespiratoryRate = respiratoryRates[1];
  const respiratoryRateDifference = newRespiratoryRate - previousRespiratoryRate;

  const newHeartRate = heartRates[0];
  const previousHeartRate = heartRates[1];
  const heartRateDifference = newHeartRate - previousHeartRate;

  const newSpO2 = spO2Values[0];
  const previousSpO2 = spO2Values[1];
  const spO2Difference = newSpO2 - previousSpO2;

  // Assuming 'wt' is the weight data
  const weightValues = vitalSignsData.map((data) => data.wt);

  // Calculate weight difference
  const lastWeight = weightValues[0];
  const previousWeight = weightValues[1];
  const weightDifference = lastWeight - previousWeight;

  const normalRanges = {
    temperature: { min: 36.1, max: 37.2 },
    respiratoryRate: { min: 12, max: 20 },
    heartRate: { min: 60, max: 100 },
    spO2: { min: 95, max: 100 },
    weight: { min: 50, max: 80 }
  };


  function getNoteAndIconClass(vital, value) {
  const normalRange = normalRanges[vital];
  let potentialSicknesses = '';

  if (isNaN(value) || value === 0) {
    return { note: 'No data registered yet', iconClass: 'no-data' };
  } else if (value < normalRange.min) {
    potentialSicknesses = '<ul>PS:';
    switch (vital) {
      case 'temperature':
        potentialSicknesses += '<li>Hypothermia</li><li>Exposure to cold conditions</li><li>Metabolic disorders</li>';
        break;
      case 'respiratoryRate':
        potentialSicknesses += '<li>Bradypnea</li><li>Overdose of certain medications</li><li>Neurological disorders</li>';
        break;
      case 'heartRate':
        potentialSicknesses += '<li>Bradycardia</li><li>Heart block</li><li>Hypothyroidism</li>';
        break;
      case 'spO2':
        potentialSicknesses += '<li>Hypoxemia</li><li>Respiratory distress</li><li>Lung disease</li>';
        break;
      case 'weight':
        potentialSicknesses += '<li>Malnutrition</li><li>Eating disorders</li><li>Chronic illness</li>';
        break;
      default:
        potentialSicknesses += '<li>Unknown potential sicknesses</li>';
    }
    potentialSicknesses += '</ul>';
    return { note: `Below normal range: ${potentialSicknesses}`, iconClass: 'below-normal' };
  } else if (value > normalRange.max) {
    potentialSicknesses = '<ul>PS:';
    switch (vital) {
      case 'temperature':
        potentialSicknesses += '<li>Fever</li><li>Infection</li><li>Inflammatory disorders</li>';
        break;
      case 'respiratoryRate':
        potentialSicknesses += '<li>Tachypnea</li><li>Respiratory distress</li><li>Anxiety</li><li>Lung diseases</li>';
        break;
      case 'heartRate':
        potentialSicknesses += '<li>Tachycardia</li><li>Hypertension</li><li>Anxiety</li><li>Heart disease</li>';
        break;
      case 'spO2':
        potentialSicknesses += '<li>Unknown potential sicknesses</li>';
        break;
      case 'weight':
        potentialSicknesses += '<li>Overweight</li><li>Obesity</li><li>Metabolic disorders</li>';
        break;
      default:
        potentialSicknesses += '<li>Unknown potential sicknesses</li>';
    }
    potentialSicknesses += '</ul>';
    return { note: `Above normal range: ${potentialSicknesses}`, iconClass: 'above-normal' };
  } else {
    return { note: `Within normal range.`, iconClass: 'normal' };
  }
}

const trendAnalysis = `
  <div class="trend-container">
    <div class="trend-box">
      <span class="icon ${getNoteAndIconClass('temperature', previousTemperature).iconClass}"><i class="fas fa-thermometer-half"></i></span>
      <span class="info">
        <strong>Temperature:</strong> ${getNoteAndIconClass('temperature', previousTemperature).note}
      </span>
    </div>
    <div class="trend-box">
      <span class="icon ${getNoteAndIconClass('respiratoryRate', previousRespiratoryRate).iconClass}"><i class="fas fa-lungs"></i></span>
      <span class="info">
        <strong>Respiratory Rate:</strong> ${getNoteAndIconClass('respiratoryRate', previousRespiratoryRate).note}
      </span>
    </div>
    <div class="trend-box">
      <span class="icon ${getNoteAndIconClass('heartRate', previousHeartRate).iconClass}"><i class="fas fa-heartbeat"></i></span>
      <span class="info">
        <strong>Heart Rate:</strong> ${getNoteAndIconClass('heartRate', previousHeartRate).note}
      </span>
    </div>
    <div class="trend-box">
      <span class="icon ${getNoteAndIconClass('spO2', previousSpO2).iconClass}"><i class="fas fa-chart-line"></i></span>
      <span class="info">
        <strong>SpO2 Levels:</strong> ${getNoteAndIconClass('spO2', previousSpO2).note}
      </span>
    </div>
    <div class="trend-box">
      <span class="icon ${getNoteAndIconClass('weight', previousWeight).iconClass}"><i class="fas fa-weight"></i></span>
      <span class="info">
        <strong>Weight:</strong> ${getNoteAndIconClass('weight', previousWeight).note}
      </span>
    </div>
  </div>
`;

return { trendAnalysis };
}


function createVisitTrendChart(visitKeys, visitDetails) {
  // Get the canvas element
  const visitTrendCanvas = document.getElementById('visitTrendChart');
  const ctx = visitTrendCanvas.getContext('2d');

  // Extract the vital signs data from the visitDetails
  const vitalSignsData = visitKeys.map((visitKey) => {
    const visitData = visitDetails[visitKey];
    return {
      date: formatDate(visitData.timestamp),
      temperature: visitData.temperature,
      bp: visitData.bp,
      rr: visitData.rr,
      hr: visitData.hr,
      sp02: visitData.sp02,
      wt: visitData.wt,
      ht: visitData.ht,
      bmi: visitData.bmi,
      muac: visitData.muac
    };
  });

  // Separate the data for each vital sign
  const dates = vitalSignsData.map((data) => data.date);
  const temperatures = vitalSignsData.map((data) => data.temperature);
  const respiratoryRates = vitalSignsData.map((data) => data.rr);
  const heartRates = vitalSignsData.map((data) => data.hr);
  const spO2Values = vitalSignsData.map((data) => data.sp02);
  const weightValues = vitalSignsData.map((data) => data.wt); // Assuming wt is weight

  // Destroy the previous chart instance if it exists
  destroyChart();

  // Reverse the data arrays to show the trend from left to right
  temperatures.reverse();
  respiratoryRates.reverse();
  heartRates.reverse();
  spO2Values.reverse();
  weightValues.reverse();  // Reverse the weight data array
  const { trendAnalysis } = analyzeAndProvideRecommendations(temperatures, respiratoryRates, heartRates, spO2Values, vitalSignsData);


  // Create the line chart
  window.visitTrendChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates.reverse(),
      datasets: [
        {
          label: 'Temperature (&deg;C)',
          data: temperatures,
          borderColor: 'red',
          fill: false
        },
        {
          label: 'Respiratory Rate',
          data: respiratoryRates,
          borderColor: 'green',
          fill: false
        },
        {
          label: 'Heart Rate',
          data: heartRates,
          borderColor: 'purple',
          fill: false
        },
        {
          label: 'SpO2 (%)',
          data: spO2Values,
          borderColor: 'orange',
          fill: false
        },
        {
          label: 'Weight (kg)',
          data: weightValues,
          borderColor: 'blue', // Adjust the color as needed
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Date'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Value'
          }
        }
      }
    }
  });


  // Display the trend analysis and recommendations in a div
  const trendAnalysisDiv = document.getElementById('trendAnalysisDiv');
  trendAnalysisDiv.innerHTML = `
    <h3>Trend Analysis:</h3>
    <p>${trendAnalysis}</p>

  `;

}

// Rest of the code remains the same
// ...


// Function to display the patient's visit details in the popup
function displayVisitsPopup(patientName) {
  // Get the reference to the patient's visits node in Firebase
  const visitsRef = ref(database, `patients/${patientName}/visits`);

  // Clear the existing content of the table body and canvas
  const tableBody = document.getElementById('tableBody');
  const visitTrendCanvas = document.getElementById('visitTrendChart');
  tableBody.innerHTML = '';
  visitTrendCanvas.getContext('2d').clearRect(0, 0, visitTrendCanvas.width, visitTrendCanvas.height);

  // Retrieve the patient's visits from Firebase
  onValue(visitsRef, (snapshot) => {
    const visitDetails = snapshot.val();

    if (visitDetails) {
      // Create an array of visit keys
      const visitKeys = Object.keys(visitDetails);

      // Sort the visit keys in descending order based on timestamp
      visitKeys.sort((a, b) => visitDetails[b].timestamp - visitDetails[a].timestamp);

      // Loop through the visits and display each visit's data in the table
      visitKeys.forEach((visitKey) => {
        const visitData = visitDetails[visitKey];

        // Create a table row for each visit
        const row = document.createElement('tr');

        // Add the visit details to the row
        row.innerHTML = `
          <td>${formatDate(visitData.timestamp)}</td>
          <td>${visitData.clinicianName}</td>
          <td>${visitData.temperature} &deg;C</td>
          <td>${visitData.bp}</td>
          <td>${visitData.rr}</td>
          <td>${visitData.hr}</td>
          <td>${visitData.sp02}</td>
          <td>${visitData.wt}</td>
          <td>${visitData.ht}</td>
          <td>${visitData.bmi}</td>
          <td>${visitData.muac}</td>
          <td>${visitData.weightForAgeZScore}</td>
          <td>${visitData.disability}</td>
          <td>${visitData.chronicIllness}</td>
          <td>${visitData.drugAbuse}</td>
          <td>${visitData.allergies.join(', ')}</td>
        `;

        tableBody.appendChild(row);
      });

      // Call the function to create the chart after displaying the visits data
      createVisitTrendChart(visitKeys, visitDetails);
    } else {
      // If no visit details found, display a message
      const noVisitsRow = document.createElement('tr');
      noVisitsRow.innerHTML = '<td colspan="17">No visit details found.</td>';
      tableBody.appendChild(noVisitsRow);
    }
  });

  // Show the popup
  const popupOverlay = document.getElementById('popup-overlay4');
  popupOverlay.style.display = 'block';
}

// Function to format the timestamp
function formatDate(timestamp) {
  const date = new Date(timestamp);
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleString('en-US', options);
}


// Get the close button element and add the click event listener to close the popup
const closePopupBtn4 = document.getElementById('closePopupBtn4');
closePopupBtn4.addEventListener('click', () => {
  const popupOverlay = document.getElementById('popup-overlay4');
  popupOverlay.style.display = 'none';
});
// Variable to store the current patient's name
let currentPatientName = patient.patientId;
/*
// Get the button element and add the click event listener
const visitButton = document.getElementById('visit');
const visitPopupOverlay = document.getElementById('popup-overlay3');

visitButton.addEventListener('click', (event) => {
  currentPatientName = event.target.getAttribute('data-patient'); // Extract the patient's name from the data-patient attribute
  visitPopupOverlay.style.display = 'block';
  // Update the isPopupOpen variable to true when the popup is opened
  isPopupOpen = true;
});


// Event listener for the "Save Visit" button (Moved outside other functions)
const saveVisitBtn = document.getElementById('saveVisitBtn');
saveVisitBtn.addEventListener('click', () => {
  // Get the values of the input fields
  const clinicianName = clinicianNameSelect.value;
  const temperature = document.getElementById('temperature').value;
  const bp = document.getElementById('bp').value;
  const rr = document.getElementById('rr').value;
  const hr = document.getElementById('hr').value;
  const sp02 = document.getElementById('sp02').value;
  const wt = document.getElementById('wt').value;
  const ht = document.getElementById('ht').value;
  const bmi = document.getElementById('bmi').value;
  const muac = document.getElementById('muac').value;
  const weightForAgeZScore = document.getElementById('weightForAgeZScore').value;
  const disability = document.getElementById('disability').value;
  const chronicIllness = document.getElementById('chronicIllness').value;
  const drugAbuse = document.getElementById('drugAbuse').value;
  const selectedAllergies = [...testsTakenSelect.selectedOptions].map(option => option.value);

  // Construct the visit object
  const visit = {
    clinicianName,
    temperature,
    bp,
    rr,
    hr,
    sp02,
    wt,
    ht,
    bmi,
    muac,
    weightForAgeZScore,
    disability,
    chronicIllness,
    drugAbuse,
    allergies: selectedAllergies,
    timestamp: Date.now()
  };

  // Push the visit to the "visits" node under the patient
  const visitsRef = ref(database, `patients/${currentPatientName}/visits`);
    push(visitsRef, visit)
    .then(() => {
      showMessage('Visit saved successfully!');
      // Clear the input fields after saving
      clinicianNameSelect.value = '';
      document.getElementById('temperature').value = '';
      document.getElementById('bp').value = '';
      document.getElementById('rr').value = '';
      document.getElementById('hr').value = '';
      document.getElementById('sp02').value = '';
      document.getElementById('wt').value = '';
      document.getElementById('ht').value = '';
      document.getElementById('bmi').value = '';
      document.getElementById('muac').value = '';
      document.getElementById('weightForAgeZScore').value = '';
      document.getElementById('disability').value = '';
      document.getElementById('chronicIllness').value = '';
      document.getElementById('drugAbuse').value = '';
      $('#allergies').val(null).trigger('change'); // Reset the Select2 multiple select
    })
    .catch((error) => {
      console.error('Error saving visit:', error);
    });

   closePopup();
});
*/


// Get the button element and add the click event listener
const triageButton = document.getElementById('triageButton');
triageButton.addEventListener('click', () => {
  displayVisitsPopup(patientName);
});


  function createRecordElement(recordKey, record) {
    const recordElement = document.createElement('div');
recordElement.classList.add('record');

const recordKeyElement = document.createElement('h4');
recordKeyElement.textContent = 'Record Key: ' + recordKey;
recordElement.appendChild(recordKeyElement);

const table = document.createElement('table');
recordElement.appendChild(table);

// Create record key row
const recordKeyRow = document.createElement('tr');
table.appendChild(recordKeyRow);

const recordKeyHeader = document.createElement('th');
recordKeyHeader.textContent = 'Record Key';
recordKeyRow.appendChild(recordKeyHeader);

const recordKeyData = document.createElement('td');
recordKeyData.textContent = recordKey;
recordKeyRow.appendChild(recordKeyData);

// Create date taken row
const dateTakenRow = document.createElement('tr');
table.appendChild(dateTakenRow);

const dateTakenHeader = document.createElement('th');
dateTakenHeader.textContent = 'Date Taken';
dateTakenRow.appendChild(dateTakenHeader);

const dateTakenElement = document.createElement('td');
const dateTaken = new Date(parseInt(record.dateTaken));
if (!isNaN(dateTaken.getTime())) {
  dateTakenElement.textContent = dateTaken.toLocaleString();
} else {
  dateTakenElement.textContent = 'Invalid Date';
}
dateTakenRow.appendChild(dateTakenElement);

// Create tests taken row
const testsTakenRow = document.createElement('tr');
table.appendChild(testsTakenRow);

const testsTakenHeader = document.createElement('th');
testsTakenHeader.textContent = 'Tests Taken';
testsTakenRow.appendChild(testsTakenHeader);

const testsTakenElement = document.createElement('td');
testsTakenElement.textContent = record.testsTaken;
testsTakenRow.appendChild(testsTakenElement);

// Create payment status row
const paymentStatusRow = document.createElement('tr');
table.appendChild(paymentStatusRow);

const paymentStatusHeader = document.createElement('th');
paymentStatusHeader.textContent = 'Test Payment';
paymentStatusRow.appendChild(paymentStatusHeader);

const paymentStatusElement = document.createElement('td');
paymentStatusElement.textContent = record.paymentstatus || 'Not Paid';
paymentStatusRow.appendChild(paymentStatusElement);

if (record.paymentstatus !== 'payment received') {
  paymentStatusElement.style.color = 'red';
} else {
  paymentStatusElement.style.color = 'blue';
}
// Create complaints row
const complaintsRow = document.createElement('tr');
table.appendChild(complaintsRow);

// Create table header for 'Complaints'
const complaintsHeader = document.createElement('th');
complaintsHeader.textContent = 'Patient Complaints';
complaintsRow.appendChild(complaintsHeader);

// Create table cell for 'Complaints'
const complaintsElement = document.createElement('td');
complaintsElement.textContent = record.additionalNotes || 'No complaints';
complaintsRow.appendChild(complaintsElement);

// Create examination row
const examinationRow = document.createElement('tr');
table.appendChild(examinationRow);

// Create table header for 'Examination'
const examinationHeader = document.createElement('th');
examinationHeader.textContent = 'Examination';
examinationRow.appendChild(examinationHeader);

// Create table cell for 'Examination'
const examinationElement = document.createElement('td');
examinationElement.textContent = record.examination || 'No examination found';
examinationRow.appendChild(examinationElement);




// Create medicine payment status row
const medicineStatusRow = document.createElement('tr');
table.appendChild(medicineStatusRow);

const medicineStatusHeader = document.createElement('th');
medicineStatusHeader.textContent = 'Medicine Payment';
medicineStatusRow.appendChild(medicineStatusHeader);

const medicineStatusData = document.createElement('td');
medicineStatusData.textContent = record.medicinestatus || 'Not Paid';
medicineStatusRow.appendChild(medicineStatusData);

if (record.medicinestatus !== 'payment received') {
  medicineStatusData.style.color = 'red';
} else {
  medicineStatusData.style.color = 'blue';
}

  // Create results obtained row
  const resultsObtainedRow = document.createElement('tr');
  table.appendChild(resultsObtainedRow);

  const resultsObtainedHeader = document.createElement('th');
  resultsObtainedHeader.textContent = 'Test Results status';
  resultsObtainedRow.appendChild(resultsObtainedHeader);

  
  const resultsObtainedElement = document.createElement('td');
  resultsObtainedElement.textContent = record.results?.resultsObtained || 'Pending...';
  resultsObtainedElement.classList.add('results-obtained-data'); // Add a class name to the results obtained cell
  if (record.results && record.results.resultsObtained === 'Completed Successfully') {
    resultsObtainedElement.style.color = 'darkblue';
  } else {
    resultsObtainedElement.style.color = 'orange';
  }
  resultsObtainedRow.appendChild(resultsObtainedElement);


// Create additional notes row
const additionalNotesRow = document.createElement('tr');
table.appendChild(additionalNotesRow);

const additionalNotesHeader = document.createElement('th');
additionalNotesHeader.textContent = 'Diagnosis';
additionalNotesRow.appendChild(additionalNotesHeader);


const additionalNotesElement = document.createElement('td');
additionalNotesElement.textContent = record.results?.additionalNotes || 'Pending...';
if (record.results && !record.results.additionalNotes) {
  additionalNotesElement.classList.add('pending');
}
additionalNotesRow.appendChild(additionalNotesElement);




// Create final status row
const finalStatusRow = document.createElement('tr');
table.appendChild(finalStatusRow);

const finalStatusHeader = document.createElement('th');
finalStatusHeader.textContent = 'Final Status of Patient';
finalStatusRow.appendChild(finalStatusHeader);

const finalStatusData = document.createElement('td');
finalStatusData.textContent = record.results?.finalStatus || 'Pending...';
finalStatusRow.appendChild(finalStatusData);

// Create follow-up date/time row
const followUpRow = document.createElement('tr');
table.appendChild(followUpRow);

const followUpHeader = document.createElement('th');
followUpHeader.textContent = 'Follow-up Date/Time';
followUpRow.appendChild(followUpHeader);

const followUpData = document.createElement('td');
followUpData.textContent = record.results?.followUpDateTime || 'none';
followUpRow.appendChild(followUpData);







const medicationTakenElement = document.createElement('div');
medicationTakenElement.classList.add('medication-taken');
const medicationTable = document.createElement('table');
medicationTable.classList.add('medication-table');

// Create table header row
const tableHeaderRow = document.createElement('tr');
const headers = ['Medication', 'Prescription', 'Milligrams', 'Cost'];
headers.forEach((headerText) => {
  const tableHeaderCell = document.createElement('th');
  tableHeaderCell.textContent = headerText;
  tableHeaderRow.appendChild(tableHeaderCell);
});
medicationTable.appendChild(tableHeaderRow);

let totalCost = 0; // Variable to store the total cost

if (record.results && record.results.medication) {
  const medicationNodes = record.results.medication;
  Object.keys(medicationNodes).forEach((medicationKey) => {
    const medicationData = medicationNodes[medicationKey];
    const tableRow = document.createElement('tr');
    const medicationCell = document.createElement('td');
    medicationCell.textContent = medicationData.medication;
    const prescriptionCell = document.createElement('td');
    prescriptionCell.textContent = medicationData.prescription;
    const gramsCell = document.createElement('td');
    gramsCell.textContent = medicationData.grams;
    const totalCostCell = document.createElement('td');
    totalCostCell.textContent = medicationData.totalCost;
    tableRow.appendChild(medicationCell);
    tableRow.appendChild(prescriptionCell);
    tableRow.appendChild(gramsCell);
    tableRow.appendChild(totalCostCell);
    medicationTable.appendChild(tableRow);

    totalCost += parseFloat(medicationData.totalCost); // Add the total cost to the variable
  });
}

medicationTakenElement.appendChild(medicationTable);
recordElement.appendChild(medicationTakenElement);

// Create the total element row
const totalRow = document.createElement('tr');
medicationTable.appendChild(totalRow);

const emptyCell = document.createElement('td');
emptyCell.setAttribute('colspan', '3');
totalRow.appendChild(emptyCell);

const totalCostCell = document.createElement('td');
totalCostCell.textContent = 'Medicine Total: UGX ' + totalCost.toFixed(2);
totalCostCell.classList.add('total-cell'); // Add the CSS class
totalRow.appendChild(totalCostCell);





// Create share button
const shareButton = document.createElement('button');
shareButton.id = 'shareButton';
shareButton.innerHTML = '<i class="fa fa-bell"></i> Notify'; // Use innerHTML instead of textContent
shareButton.addEventListener('click', () => {
     shareRecord(patient, record);
 
});

// Append the share button to the record element
//recordElement.appendChild(shareButton);



function shareRecord(patient, record) {
  // Get the patient's name, doctor's username, and the test key
  const patientName = patient.name;
  const testKey = recordKey;

  // Construct the notification message
  const message = `Results for ${testKey} for patient ${patientName} are ready.`;

  // Construct the message object
  const notification = {
    timestamp: Date.now(),
    message: message
  };

  // Update the chat node in Firebase with the notification
  const chatRef = ref(database, 'lab-results');
  push(chatRef, notification)
    .then(() => {
      console.log('Notification sent successfully!');
      showMessage('Notification sent successfully!');
    })
    .catch((error) => {
      console.error('Error sending notification:', error);
      showMessage('Error sending notification:', error);
    });
}





// Define visitKeys at a higher scope to make it accessible to both functions
let visitKeys = [];
let visitDetails = {};

// Function to display the patient's visit details
function displayPatientVisitDetails(visitKeys, visitDetails, latestVisitData) {
  const patientVisitDetailsDiv = document.getElementById('patientVisitDetails');
  patientVisitDetailsDiv.innerHTML = '';

  if (latestVisitData) {
    // Get the visit count
    const visitCount = visitKeys.length;

    // Display the visit count in the "Visit Count" element
    const visitCountElement = document.getElementById('visitCount');
    visitCountElement.textContent = visitCount;

    // Create the visit element for the latest visit
    const visitElement = document.createElement('div');

    // Add the visit details to the visit element
    visitElement.innerHTML = `
    <h3>LATEST VISIT TRIAGE:</h3>
    <div class="visit-details-container">
      <p><b>Date:</b> ${formatDate(latestVisitData.timestamp)}</p>
      <p><b>Clinician's Name:</b> ${latestVisitData.clinicianName || 'N/D'}</p>
      <p><b>Temperature:</b> ${latestVisitData.temperature || 'N/D'} &deg;C</p>
      <p><b>BP:</b> ${latestVisitData.bp || 'N/D'} (mmHg)</p>
      <p><b>RR:</b> ${latestVisitData.rr || 'N/D'}</p>
      <p><b>HR:</b> ${latestVisitData.hr || 'N/D'}</p>
      <p><b>SpO2:</b> ${latestVisitData.sp02 || 'N/D'} (%)</p>
      <p><b>WT:</b> ${latestVisitData.wt || 'N/D'} (Kg)</p>
      <p><b>HT:</b> ${latestVisitData.ht || 'N/D'} (Cm)</p>
      <p><b>BMI:</b> ${latestVisitData.bmi || 'N/D'}</p>
      <p><b>MUAC:</b> ${latestVisitData.muac || 'N/D'}</p>
      <p><b>Weight for Age Z score:</b> ${latestVisitData.weightForAgeZScore || 'N/D'} (Kg)</p>
      <p><b>Disability:</b> ${latestVisitData.disability || 'N/D'}</p>
      <p><b>Known Chronic Illness:</b> ${latestVisitData.chronicIllness || 'N/D'}</p>
      <p><b>Any Drug Abuse:</b> ${latestVisitData.drugAbuse || 'N/D'}</p>
      <p><b>Allergies:</b> ${latestVisitData.allergies && latestVisitData.allergies.length > 0
        ? latestVisitData.allergies.join(', ')
        : 'N/D'}
      </p>
    </div>
    <hr>
    `;

    patientVisitDetailsDiv.appendChild(visitElement);
  } else {
    patientVisitDetailsDiv.textContent = 'No visit details found.';
    patientVisitDetailsDiv.style.fontStyle = 'italic';
  }
}
// Function to get patient details
function getPatientDetails(patientName) {
  const patientRef = ref(database, `patients/${patientName}`);
  return get(patientRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        return null;
      }
    })
    .catch((error) => {
      console.error('Error fetching patient details:', error);
      return null;
    });
}

// Function to get the latest visit data for a patient
function getLatestVisitData(patientName) {
  const visitsRef = ref(database, `patients/${patientName}/visits`);
  return get(visitsRef)
    .then((snapshot) => {
      const visitDetails = snapshot.val();
      if (visitDetails) {
        // Get the visit keys and sort them in descending order based on timestamp
        const visitKeys = Object.keys(visitDetails).sort((a, b) => visitDetails[b].timestamp - visitDetails[a].timestamp);

        // Get the latest visit data if available
        const latestVisitKey = visitKeys[0];
        const latestVisitData = visitDetails[latestVisitKey];
        return latestVisitData;
      } else {
        return null;
      }
    })
    .catch((error) => {
      console.error('Error fetching latest visit data:', error);
      return null;
    });
}

function getPatientVisitDetails(patientName) {
  const visitsRef = ref(database, `patients/${patientName}/visits`);
  onValue(visitsRef, (snapshot) => {
    const visitDetails = snapshot.val();
    if (visitDetails) {
      // Get the visit keys and sort them in descending order based on timestamp
      visitKeys = Object.keys(visitDetails).sort((a, b) => visitDetails[b].timestamp - visitDetails[a].timestamp);

      // Get the latest visit data if available
      const latestVisitKey = visitKeys[0];
      const latestVisitData = visitDetails[latestVisitKey];

      // Call the function to display the patient's visit details
      displayPatientVisitDetails(visitKeys, visitDetails, latestVisitData);

      // Call the function to create the chart
      createVisitTrendChart(visitKeys, visitDetails);
    } else {
      displayPatientVisitDetails([], {}); // If no visit details found, display an empty state
      createVisitTrendChart([], {}); // If no visit details found, create an empty chart
    }
  });
}


// Call the function to retrieve and display the patient's visit details
getPatientVisitDetails(patientName);

// Create print button
const printButton = document.createElement('button');
printButton.innerHTML = '<i class="fa fa-print"></i> Print Record';
printButton.classList.add('print-button');

// Add event listener to the print button
printButton.addEventListener('click', async () => {
  // Get the patient details and latest visit data
  const patient = await getPatientDetails(patientName);
  const latestVisitData = await getLatestVisitData(patientName);

  // Call the printRecord function with patient details, record details, visit keys, visit details, and latest visit data
  printRecord(patient, record, visitKeys, visitDetails, latestVisitData);
});

// Append the print button to the record element
recordElement.appendChild(printButton);



// ...
// Function to print the record
function printRecord(patient, record, visitKeys, visitDetails, latestVisitData) {


  window.jsPDF = window.jspdf.jsPDF;
// Create a new jsPDF instance
const doc = new jsPDF();

// Set the font size
doc.setFontSize(20);

// Define the hospital logo URL or path
const hospitalLogo = 'sanyu.png'; // Replace with the actual URL or path

// Define the coordinates and dimensions for the header box
const headerBoxX = 20;
const headerBoxY = 10;
const headerBoxWidth = 170;
const headerBoxHeight = 40;

// Draw the header box without a border
doc.setFillColor(255, 255, 255);
doc.rect(headerBoxX, headerBoxY, headerBoxWidth, headerBoxHeight, 'F'); // Use 'F' for fill without border


// Calculate the center position of the header box
const headerBoxCenterX = headerBoxX + (headerBoxWidth / 2);
const headerBoxCenterY = headerBoxY + (headerBoxHeight / 2);

// Print hospital logo
// Increase the width and height values to adjust the size of the logo
doc.addImage(hospitalLogo, 'PNG', headerBoxX - 10, headerBoxY - 5, 55, 55); // Adjust width and height as needed


// Print hospital name
const hospitalName = 'SANYU HOSPITAL';
const hospitalNameWidth = doc.getTextWidth(hospitalName);
const hospitalNameY = headerBoxCenterY - 5; // Adjust the Y coordinate for vertical alignment
doc.setFont('helvetica', 'bold');
doc.setFontSize(28); // Increase font size for the hospital name
doc.setTextColor(0, 0, 0); // Set text color to black
doc.text(hospitalName, headerBoxCenterX, hospitalNameY, { align: 'center' });

// Print hospital address
const hospitalAddress = 'Located at Katooke-Wakiso District';
const hospitalAddressY = headerBoxCenterY + 6; // Adjust the Y coordinate for address
doc.setFont('helvetica', 'normal');
doc.setFontSize(12); // Decrease font size for the address
doc.text(hospitalAddress, headerBoxCenterX, hospitalAddressY, { align: 'center' });

// Print telephone contacts
const telephoneContacts = 'Tel: +256 708 657 717, Email: sanyuhospital@gmail.com';
const telephoneContactsY = headerBoxCenterY + 15; // Adjust the Y coordinate for contacts
doc.setFont('helvetica', 'normal');
doc.setFontSize(10); // Decrease font size for contacts
doc.text(telephoneContacts, headerBoxCenterX, telephoneContactsY, { align: 'center' });

// Reset the font
doc.setFont('helvetica', 'normal');
// Print the heading "PATIENT'S DETAILS"
doc.setFont('helvetica', 'bold');
doc.setFontSize(13);
const reportHeading = 'LABORATORY REPORT';
const reportHeadingWidth = doc.getTextWidth(reportHeading);
const reportHeadingX = (doc.internal.pageSize.getWidth() - reportHeadingWidth) / 2;
const reportHeadingY = headerBoxY + headerBoxHeight + 10;
doc.text(reportHeading, reportHeadingX, reportHeadingY);

// Print patient details in a table
doc.setFont('helvetica', 'normal');
doc.setFontSize(12);
const patientDetails = [
['Patient Name', patient.name, 'Record key:   ' + recordKey],
['Date of Birth', patient.dob, 'Date taken:   ' + dateTakenElement.textContent],
['Payment Type', patient.payment, 'Test taken:   ' +  testsTakenElement.textContent],
['Residence', patient.residence, 'Test Payment:   ' +  paymentStatusElement.textContent],
['Contact', patient.parents, 'Test Results status:   ' +  resultsObtainedElement.textContent],
['Patient ID', patient.patientId, 'Diagnosis:   '  + additionalNotesElement.textContent]
];
const patientTableX = 20;
const patientTableY = reportHeadingY + 5;
const patientTableOptions = {
startX: patientTableX,
startY: patientTableY,
margin: { top: 8 },
styles: { font: 'helvetica', fontStyle: 'normal', fontSize: 8 },
headStyles: { fillColor: [0, 128, 0], fontStyle: 'bold' },
bodyStyles: { fillColor: 255 },
columnStyles: { 0: { cellWidth: 55 }, 1: { cellWidth: 55 }, 2: { cellWidth: 70 } } // Adjust column widths
};

doc.autoTable({
head: [['Field', 'Value', 'Test Details']],
body: patientDetails,
...patientTableOptions
});


// Print the heading "LATEST VISIT TRIAGE"
doc.setFont('helvetica', 'bold');
doc.setFontSize(16);
const latestVisitHeading = 'LATEST VISIT TRIAGE';
const latestVisitHeadingWidth = doc.getTextWidth(latestVisitHeading);
const latestVisitHeadingX = (doc.internal.pageSize.getWidth() - latestVisitHeadingWidth) / 2;
const latestVisitHeadingY = patientTableY + 65;
doc.text(latestVisitHeading, latestVisitHeadingX, latestVisitHeadingY);

// Print the latest visit triage details in a table with four columns
doc.setFont('helvetica', 'normal');
doc.setFontSize(8);
const latestVisitTableX = 20;
const latestVisitTableY = latestVisitHeadingY + 5;
const latestVisitTableOptions = {
startX: latestVisitTableX,
startY: latestVisitTableY,
margin: { top: 8 },
styles: { font: 'helvetica', fontStyle: 'normal', fontSize: 7 },
headStyles: { fillColor: [0, 128, 0], fontStyle: 'bold' },
bodyStyles: { fillColor: 255 },
columnStyles: { 0: { cellWidth: 45 }, 1: { cellWidth: 45 }, 2: { cellWidth: 45 }, 3: { cellWidth: 45 } }
};

const latestVisitDetails = [];
if (latestVisitData) {
latestVisitDetails.push(
  ['Date', formatDate(latestVisitData.timestamp), 'Clinician\'s Name', latestVisitData.clinicianName || 'N/D'],
  ['Temperature', latestVisitData.temperature || 'N/D', 'BP', latestVisitData.bp || 'N/D'],
  ['RR', latestVisitData.rr || 'N/D', 'HR', latestVisitData.hr || 'N/D'],
  ['SpO2', latestVisitData.sp02 || 'N/D', 'WT', latestVisitData.wt || 'N/D'],
  ['HT', latestVisitData.ht || 'N/D', 'BMI', latestVisitData.bmi || 'N/D'],
  ['MUAC', latestVisitData.muac || 'N/D', 'Weight for Age Z score', latestVisitData.weightForAgeZScore || 'N/D'],
  ['Disability', latestVisitData.disability || 'N/D', 'Known Chronic Illness', latestVisitData.chronicIllness || 'N/D'],
  ['Any Drug Abuse', latestVisitData.drugAbuse || 'N/D', 'Allergies', latestVisitData.allergies && latestVisitData.allergies.length > 0
    ? latestVisitData.allergies.join(', ')
    : 'N/D']
);
} else {
// If there's no latest visit data, display "N/A" for each field
latestVisitDetails.push(
  ['Date', 'N/A', 'Clinician\'s Name', 'N/A'],
  ['Temperature', 'N/A', 'BP', 'N/A'],
  ['RR', 'N/A', 'HR', 'N/A'],
  ['SpO2', 'N/A', 'WT', 'N/A'],
  ['HT', 'N/A', 'BMI', 'N/A'],
  ['MUAC', 'N/A', 'Weight for Age Z score', 'N/A'],
  ['Disability', 'N/A', 'Known Chronic Illness', 'N/A'],
  ['Any Drug Abuse', 'N/A', 'Allergies', 'N/A']
);
}

doc.autoTable({
head: [['Field', 'Value', 'Field', 'Value']],
body: latestVisitDetails,
...latestVisitTableOptions
});


// Print medicine given table
const medicationTableData = [];
const medicationRows = medicationTable.querySelectorAll('tr');
for (let i = 1; i < medicationRows.length; i++) {
  const cells = medicationRows[i].querySelectorAll('td');
  if (cells.length === 4) { // Ensure there are 4 cells in each row
    const medication = cells[0].textContent;
    const prescription = cells[1].textContent;
    const grams = cells[2].textContent;
    
    medicationTableData.push([medication, prescription, grams]);
  }
}

doc.autoTable({
  startY: 200,
  head: [['Medication', 'Prescription', 'Pieces']],
  body: medicationTableData,
  theme: 'grid',
  styles: {
    fontSize: 8,
    cellPadding: 1.3,
    lineColor: [0, 0, 0],
    lineWidth: 0.1,
  },
  columnStyles: {
    0: { cellWidth: 50 },
    1: { cellWidth: 50 },
    2: { cellWidth: 40 },
   
  },
});

// Add the doctor's signature label
const signatureLabelX = 20;
const signatureLabelY = doc.internal.pageSize.getHeight() - 20;
doc.setFont('helvetica', 'normal');
doc.setFontSize(12);
doc.text('Doctor\'s Signature:', signatureLabelX, signatureLabelY, { align: 'left' });

// Print the document
doc.autoPrint();

// Open the print dialog
doc.output('dataurlnewwindow');
}







  
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

// Add event listener to the delete button
deleteButton.addEventListener('click', () => {
  const recordKey = recordKeyElement.getAttribute('data-record-key');
  deleteRecord(recordKey);
});

// Rest of the code...


// Create Finnish button
const finnishButton = document.createElement('button');
finnishButton.textContent = 'Done ';

// Create the tick icon
const tickIcon = document.createElement('i');
tickIcon.classList.add('fas', 'fa-check'); // Font Awesome class names for the tick icon
finnishButton.appendChild(tickIcon); // Append the tick icon to the button

finnishButton.classList.add('finnish-button');


// Retrieve the addMedicationForm element
const addMedicationForm = document.getElementById('addMedicationForm');
finnishButton.addEventListener('click', () => {
  // Get the record key
  const recordKey = recordKeyElement.textContent.replace('Record Key: ', '');

  // Reference the test node in Firebase
  const testRef = ref(database, `patients/${currentPatientName}/testsTaken/${recordKey}`);

  // Update the test result status to "Completed Successfully"
  update(testRef, {
    resultsObtained: 'Completed Successfully'
  })
    .then(() => {
      showMessage('Test status saved successfully!');
      // Update the content of the "Results Obtained" cell in the UI
      resultsObtainedData.textContent = 'Completed Successfully';
      resultsObtainedData.style.color = 'darkblue'; // Remove the orange color style if it was set previously
    })
    .catch((error) => {
      console.error('Error saving test status:', error);
    });
    shareRecord(patient, record);
});


 
// Create Upload Results input
const uploadResultsInput = document.createElement('input');
uploadResultsInput.type = 'file';
uploadResultsInput.classList.add('upload-results-input');
uploadResultsInput.accept = '.pdf'; // Accept only PDF files, you can change this to the desired file type

// Create Upload button
const uploadButton = document.createElement('button');
uploadButton.textContent = 'Upload';
uploadButton.classList.add('upload-button');
// Add event listener to the Upload button
uploadButton.addEventListener('click', () => {
  // Show loading spinner
  uploadButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';

  // Get the selected file from the input
  const selectedFile = uploadResultsInput.files[0];

  if (selectedFile) {
    // Get the patient name
    const patientName = patient.patientId;

    // Generate a unique filename for the uploaded file using the patient's name and current timestamp
    const filename = `${patientName}_${Date.now()}_${selectedFile.name}`;

    // Save the file to Firebase Storage under the patient's name and recordKey
    const fileRef = storageRef(storage, `results/${filename}`);

    // Upload the file to Firebase Storage using the uploadBytes function
    uploadBytes(fileRef, selectedFile)
      .then((snapshot) => {
        // The file has been successfully uploaded
        // Get the download URL of the file
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          // Save the download URL to the patient's data in Firebase
          const patientRef = ref(database, `patients/${patientName}/testsTaken/${recordKey}`);
          update(patientRef, {
            resultFileURL: downloadURL,
          });

          // Call the finnishButton function here
          finnishButtonFunction();

          // Show success message or perform any additional actions
          showMessage('File uploaded successfully!');
        });
      })
      .catch((error) => {
        // Handle the upload error
        console.error('Error uploading file:', error);
        showMessage('Error uploading file. Please try again.');
      })
      .finally(() => {
        // Revert back to the original button text after the upload is complete or fails
        uploadButton.textContent = 'Upload';
      });
  } else {
    showMessage('No file selected.');
    // Revert back to the original button text if no file is selected
    uploadButton.textContent = 'Upload';
  }
});

// Function to call the finnishButton functionality
function finnishButtonFunction() {
  // Get the record key
  const recordKey = recordKeyElement.textContent.replace('Record Key: ', '');

  // Reference the test node in Firebase
  const testRef = ref(database, `patients/${currentPatientName}/testsTaken/${recordKey}`);

  // Update the test result status to "Completed Successfully"
  update(testRef, {
    resultsObtained: 'Completed Successfully'
  })
    .then(() => {
      showMessage('Test status saved successfully!');
      // Update the content of the "Results Obtained" cell in the UI
      resultsObtainedData.textContent = 'Completed Successfully';
      resultsObtainedData.style.color = 'darkblue'; // Remove the orange color style if it was set previously
    })
    .catch((error) => {
      console.error('Error saving test status:', error);
    });

  // Call the shareRecord function here if needed
   shareRecord(patient, record);
}


// Create View Results button
const viewResultsButton = document.createElement('button');
viewResultsButton.textContent = 'View Results';
viewResultsButton.classList.add('view-results-button');

// Create the icon element (using Font Awesome's "fa-eye" icon)
const iconElement = document.createElement('i');
iconElement.classList.add('fas', 'fa-eye'); // Add Font Awesome class names for the eye icon

// Append the icon element to the button
viewResultsButton.appendChild(iconElement);


// Add event listener to the View Results button
viewResultsButton.addEventListener('click', () => {
  // Get the patient name and record key
  const patientName = patient.patientId;
  const recordKey = recordKeyElement.textContent.replace('Record Key: ', '');

  // Reference the test node in Firebase
  const testRef = ref(database, `patients/${patientName}/testsTaken/${recordKey}`);

  // Get the download URL of the file from Firebase Storage
  get(testRef).then((snapshot) => {
    const testData = snapshot.val();
    if (testData && testData.resultFileURL) {
      // Open the file URL in a new window for printing
      const fileURL = testData.resultFileURL;
      window.open(fileURL, '_blank');
    } else {
      showMessage('No results file available.');
    }
  }).catch((error) => {
    console.error('Error retrieving file URL:', error);
    showMessage('Error retrieving file URL. Please try again.');
  });
});

// Append the View Results button to the record element
recordElement.appendChild(viewResultsButton);


  // Append the Finnish button to the record element
  //recordElement.appendChild(finnishButton);

// Append the Upload Results input and Upload button to the record element
recordElement.appendChild(uploadResultsInput);
recordElement.appendChild(uploadButton);

  // Append the delete button to the record element
  //recordElement.appendChild(deleteButton);
  recordKeyElement.setAttribute('data-record-key', recordKey);

  
  return recordElement;
}
// Select the search input field
const testSearchInput = document.getElementById('testSearch');

// Add an input event listener to the search input field
testSearchInput.addEventListener('input', () => {
  const searchTerm = testSearchInput.value.toLowerCase(); // Get the search term and convert to lowercase

  // Select all the test record elements
  const testRecordElements = document.querySelectorAll('.record');

  // Loop through the test record elements and filter based on record keys
  testRecordElements.forEach((recordElement) => {
    const recordKeyElement = recordElement.querySelector('h4'); // Assuming record keys are inside h4 elements

    if (recordKeyElement) {
      const recordKey = recordKeyElement.textContent.toLowerCase();

      if (recordKey.includes(searchTerm)) {
        // Show the test if the record key matches the search term
        recordElement.style.display = 'block';
      } else {
        // Hide the test if the record key doesn't match the search term
        recordElement.style.display = 'none';
      }
    }
  });
});

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
      const recordRef = ref(database, `patients/${patientName}/testsTaken/${recordKey}`);

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

}
const labRequestsPopupOverlay = document.getElementById('labRequestsPopupOverlay');
let latestLabRequestMessage = '';
const shownMessages = new Set(); // Set to keep track of shown messages

// Function to display a custom notification message and play a sound
function showRequestMessage(message) {
  const notificationContainer = document.createElement('div');
  notificationContainer.className = 'request-notification'; // Add a class for styling
  notificationContainer.textContent = message;

  // Append the notification to the body
  document.body.appendChild(notificationContainer);

  // Remove the notification after a few seconds
  setTimeout(() => {
    notificationContainer.remove();
  }, 9000); // Adjust the duration as needed
}

// Function to play a sound without displaying a message
function playNotificationSound() {
  // Play a sound (you can replace 'notification.mp3' with your desired sound file)
  const audio = new Audio('new-notification-on-your-device-138695.mp3');
  audio.play();
}

// Function to display a browser notification and play a sound
function showNotification(message, timestamp) {
  if (!shownMessages.has(timestamp)) {
    // Play the notification sound
    playNotificationSound();

    // Add the timestamp to the set of shown messages
    shownMessages.add(timestamp);
  }
}


// Array to cache lab requests
const labRequestsCache = [];

// Function to retrieve and display lab requests from Firebase
function retrieveAndDisplayLabRequests() {
  const labRequestsList = document.getElementById('labRequestsList');
  labRequestsList.innerHTML = ''; // Clear previous lab requests

  const chatRef = ref(database, 'laboratory-requests');
  onValue(chatRef, (snapshot) => {
    try {
      if (snapshot.exists()) {
        let notDoneCount = 0;

        // Add event listeners to the filter buttons
        const notDoneBtn = document.getElementById('notDoneBtn');
        const completedBtn = document.getElementById('completedBtn');

        notDoneBtn.addEventListener('click', () => {
          applyFilter('Not Yet Done');
        });

        completedBtn.addEventListener('click', () => {
          applyFilter('Completed');
        });

        // Function to apply the filter
        function applyFilter(filter) {
          const labRequestsList = document.getElementById('labRequestsList');
          const labRequestItems = labRequestsList.querySelectorAll('li');

          labRequestItems.forEach((item) => {
            const status = item.getAttribute('data-status');
            if (status === filter || filter === 'All') {
              item.style.display = 'block';
            } else {
              item.style.display = 'none';
            }
          });

          // Update the active filter button
          const filterButtons = document.querySelectorAll('.filter-button');
          filterButtons.forEach((button) => {
            if (button.textContent === filter) {
              button.classList.add('active');
            } else {
              button.classList.remove('active');
            }
          });
        }

        snapshot.forEach((childSnapshot) => {
          const messageId = childSnapshot.key; // Use the message key as the identifier

          // Check if the message is already in the cache
          if (!labRequestsCache.includes(messageId)) {
            labRequestsCache.push(messageId); // Add the message key to the cache

            // Show a notification for the latest message
            showNotification(childSnapshot.val().message, messageId);
          }

          const labRequest = childSnapshot.val().message;
          const status = childSnapshot.val().status || 'Not Yet Done';
          const listItem = document.createElement('li');
          listItem.id = messageId; // Set the ID to the message ID
          listItem.setAttribute('data-status', status); // Set the "data-status" attribute

          // Create the message content with "Mark as Done" button
          const messageContent = document.createElement('span');
          messageContent.textContent = labRequest;
          listItem.appendChild(messageContent);

          // Create the "Mark as Done" button
          const messageStatus = document.createElement('span');
          messageStatus.textContent = status;
          messageStatus.classList.add('time-status'); // Add the CSS class to the span element
          listItem.appendChild(messageStatus);

          // Create the "Done" button
          const markAsDoneBtn = document.createElement('button');
          markAsDoneBtn.textContent = 'Done';
          markAsDoneBtn.classList.add('button-done'); // Add the CSS class to the button
          markAsDoneBtn.addEventListener('click', () => {
            markMessageAsDone(messageId);
          });
          listItem.appendChild(markAsDoneBtn);

          // Append the list item to the lab requests list
          labRequestsList.appendChild(listItem);

          if (status === 'Not Yet Done') {
            notDoneCount++;
            messageStatus.style.color = 'red';
            // Update the latest lab request message
            latestLabRequestMessage = labRequest;
          } else if (status === 'Completed') {
            markAsDoneBtn.style.display = 'none';
          }
        });

        // Display the count of not yet done messages
        const notDoneCountSpan = document.getElementById('notDoneCount');
        notDoneCountSpan.textContent = notDoneCount;
      } else {
        const noLabRequestsItem = document.createElement('li');
        noLabRequestsItem.textContent = 'No lab requests found.';
        labRequestsList.appendChild(noLabRequestsItem);
      }
    } catch (error) {
      console.error('Error retrieving lab requests:', error);
      showMessage('Error retrieving lab requests:', error);
    }
  });
}

// Attach click event to the envelope icon to open the lab requests popup
const envelopeIcon = document.getElementById('envelope-icon');
let labRequestsListener; // Variable to store the event listener

envelopeIcon.addEventListener('click', () => {
  // Retrieve and display lab requests from Firebase
  retrieveAndDisplayLabRequests();

  openLabRequestsPopup();
});

// Call the retrieveAndDisplayLabRequests function on page load
document.addEventListener('DOMContentLoaded', () => {
  retrieveAndDisplayLabRequests();
});

function markMessageAsDone(messageId) {
  // Update the message status in Firebase
  const messageRef = ref(database, `laboratory-requests/${messageId}`);
  update(messageRef, { status: 'Completed', timestamp: Date.now() })
    .then(() => {
      console.log('Message marked as done successfully!');
      // Clear the whole list and reload new messages
      retrieveAndDisplayLabRequests();
    })
    .catch((error) => {
      console.error('Error marking message as done:', error);
      showMessage('Error marking message as done:', error);
    });
}

// Function to format a timestamp in a human-readable format
function formatDate(timestamp) {
  const date = new Date(timestamp);
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  return date.toLocaleString(undefined, options);
}

// Function to open the lab requests popup
function openLabRequestsPopup() {
  const labRequestsPopupOverlay = document.getElementById('labRequestsPopupOverlay');
  labRequestsPopupOverlay.style.display = 'block';
}

// Function to close the lab requests popup
function closeLabRequestsPopup() {
  const labRequestsPopupOverlay = document.getElementById('labRequestsPopupOverlay');
  labRequestsPopupOverlay.style.display = 'none';
  const labRequestsList = document.getElementById('labRequestsList');
  labRequestsList.innerHTML = ''; // Clear previous lab requests

}

// Attach click event to the close button to close the lab requests popup
const labRequestsPopupClose = document.getElementById('labRequestsPopupClose');
labRequestsPopupClose.addEventListener('click', closeLabRequestsPopup);

// Close the lab requests popup when clicking outside the popup content
window.addEventListener('click', (event) => {
  const labRequestsPopupOverlay = document.getElementById('labRequestsPopupOverlay');
  if (event.target === labRequestsPopupOverlay) {
    closeLabRequestsPopup();
  }
});



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
//const patientsRef = ref(database, 'patients');

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


// Function to calculate the total based on inputs
const calculateTotal = () => {
  const medicationCost = parseFloat(
    medicationInput.selectedOptions[0].dataset.costPerGram
  );
  const gramsValue = parseFloat(gramsInput.value);
  const total = medicationCost * gramsValue;

  // Update the total element with the calculated value
  totalElement.textContent = 'Total: $' + total.toFixed(2);
};
// Function to create a new medication input with delete button
const createMedicationInput = () => {
  const medicationInputContainer = document.createElement('div');
  medicationInputContainer.classList.add('medication-input-container');

  // Medication label
  const medicationLabel = document.createElement('label');
  medicationLabel.textContent = 'Medicine:';
  medicationLabel.setAttribute('for', 'medicationInput');

  const medicationInput = document.createElement('select');
  medicationInput.required = true;
  medicationInput.classList.add('select2');

  const medicineRef = ref(database, 'medicine');
  onValue(medicineRef, (snapshot) => {
    const medicineData = snapshot.val();
    if (medicineData) {
      Object.values(medicineData).forEach((medicine) => {
        const option = document.createElement('option');
        option.value = medicine.name;
        option.text = medicine.name;
        option.dataset.costPerGram = medicine.pricepergram; // Set cost per gram from Firebase
        medicationInput.appendChild(option);
      });

      // Initialize Select2 for the medicationInput
      $(medicationInput).select2({
        dropdownParent: medicationInputContainer
      });
    }
  });

  // Prescription label
  const prescriptionLabel = document.createElement('label');
  prescriptionLabel.textContent = 'Prescription:';
  prescriptionLabel.setAttribute('for', 'prescriptionInput');

  const prescriptionInput = document.createElement('select');
  prescriptionInput.required = true;
  prescriptionInput.classList.add('select2');

  const prescriptionsRef = ref(database, 'prescriptions');
  onValue(prescriptionsRef, (snapshot) => {
    const prescriptionsData = snapshot.val();

    // Clear existing options
    prescriptionInput.innerHTML = '';

    // Add options for each prescription
    if (prescriptionsData) {
      const prescriptions = Object.values(prescriptionsData);
      prescriptions.forEach((prescription) => {
        const option = document.createElement('option');
        option.value = prescription.prescription;
        option.text = prescription.prescription;
        prescriptionInput.appendChild(option);
      });
    }
  });

  // Grams label
  const gramsLabel = document.createElement('label');
  gramsLabel.textContent = 'Milligrams:';
  gramsLabel.setAttribute('for', 'gramsInput');

  const gramsInput = document.createElement('input');
  gramsInput.type = 'number';
  gramsInput.step = 'any'; // Allow decimal values for grams
  gramsInput.placeholder = 'Milligrams';

  // Cost per gram output label
  const costPerGramLabel = document.createElement('label');
  costPerGramLabel.textContent = 'Cost of Milligrams:';
  costPerGramLabel.setAttribute('for', 'costPerGramOutput');

  const costPerGramOutput = document.createElement('output');
  costPerGramOutput.classList.add('cost-per-gram-output');
  costPerGramOutput.value = '';

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete-medication-button');
  deleteButton.innerHTML = '<i class="fa fa-trash"></i>';
  deleteButton.addEventListener('click', () => {
    medicationInputContainer.remove();
  });

  // Update the cost per gram output when grams input changes
  gramsInput.addEventListener('input', () => {
    const gramsValue = parseFloat(gramsInput.value); // Use parseFloat to handle decimal values
    const selectedOption = medicationInput.options[medicationInput.selectedIndex];
    const costPerGram = parseFloat(selectedOption.dataset.costPerGram);
    const totalCost = gramsValue * costPerGram;
    costPerGramOutput.value = totalCost.toFixed(2);
  });

  medicationInputContainer.appendChild(medicationLabel);
  medicationInputContainer.appendChild(medicationInput);
  medicationInputContainer.appendChild(prescriptionLabel);
  medicationInputContainer.appendChild(prescriptionInput);
  medicationInputContainer.appendChild(gramsLabel);
  medicationInputContainer.appendChild(gramsInput);
  medicationInputContainer.appendChild(costPerGramLabel);
  medicationInputContainer.appendChild(costPerGramOutput);
  medicationInputContainer.appendChild(deleteButton);

  const submitMedicationButton = document.createElement('button');
  submitMedicationButton.type = 'button';
  submitMedicationButton.textContent = 'Submit Medication';
  submitMedicationButton.classList.add('submit-medication-button');
  submitMedicationButton.addEventListener('click', () => {
    const medicationRecord = {
      medication: medicationInput.value,
      prescription: prescriptionInput.value,
      grams: parseFloat(gramsInput.value),
      totalCost: parseFloat(costPerGramOutput.value.replace(/,/g, ''))
    };

    // Get the record key from the hidden input field
    const recordKeyInput = document.querySelector('input[name="recordKey"]');
    const recordKey = recordKeyInput.value;

    // Write medication record to Firebase under the record key
    const patientRef = ref(database, `patients/${currentPatientName}/testsTaken/${recordKey}/results/medication`);
    const newRecordRef = push(patientRef);

    set(newRecordRef, medicationRecord)
      .then(() => {
        showMessage('Medication submitted successfully!');
      })
      .catch((error) => {
        console.error('Error submitting medication:', error);
        showMessage('Error submitting medication. Please try again.');
      });
  });

  medicationInputContainer.appendChild(submitMedicationButton);

  return medicationInputContainer;
};

const addMedicationButton = document.getElementById('addMedicationButton');
const medicationContainer = document.getElementById('medicationInputsContainer');
addMedicationButton.addEventListener('click', () => {
  const medicationInput = createMedicationInput();
  medicationContainer.appendChild(medicationInput);

  // Initialize Select2 for the new medication input
  $(medicationInput).find('select.select2').select2();
});


// Update the total cost when grams input changes
const medicationInputs = document.querySelectorAll('.medication-input-container');
medicationInputs.forEach((medicationInput) => {
  const gramsInput = medicationInput.querySelector('input[type="number"]');

});

// Update the total cost when the selected test changes
const testsTakenSelect = document.getElementById('testsTaken');
testsTakenSelect.addEventListener('change', () => {

});

// Retrieve tests from Firebase and populate the select options
const testsRef = ref(database, 'tests');
onValue(testsRef, (snapshot) => {
  const testsData = snapshot.val();

  // Clear existing options
  testsTakenSelect.innerHTML = '';

  // Add options for each test
  if (testsData) {
    const tests = Object.values(testsData);
    tests.forEach((test) => {
      const option = document.createElement('option');
      option.value = test.name + '      '+ 'Price: UGX ' + test.dob + '.00';
      option.textContent = test.name + '      '+ 'Price: UGX ' + test.dob + '.00';
      option.dataset.dob = test.dob;
      testsTakenSelect.appendChild(option);
    });
  }


});






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


addRecordForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const patientName = currentPatientName;
  const medicationInputs = document.querySelectorAll('.medication-input-container');

  const testsTakenSelect = document.getElementById('testsTaken');
  const selectedTestOption = testsTakenSelect.options[testsTakenSelect.selectedIndex];
  const testsTaken = selectedTestOption ? selectedTestOption.value : '';

  const resultsObtained = document.getElementById('resultsObtained').value;
  const additionalNotes = document.getElementById('additionalNotes').value;

  // Generate current timestamp
  const dateTaken = Date.now();

  const recordData = {
    testsTaken: testsTaken,
    resultsObtained: resultsObtained,
    additionalNotes: additionalNotes,
    dateTaken: dateTaken
  };

  const patientRef = ref(database, `patients/${patientName}`);
const testsTakenRef = child(patientRef, 'testsTaken');

// Retrieve the existing records to determine the test number
get(testsTakenRef)
  .then((snapshot) => {
    const testsData = snapshot.val();
    const testCount = testsData ? Object.keys(testsData).length : 0; // Get the number of existing records
    const newTestNumber = testCount + 1; // Calculate the new test number

    const newRecordRef = child(testsTakenRef, 'test' + newTestNumber);

    set(newRecordRef, recordData)
      .then(() => {
        // Save medication data under the new record
        medicationInputs.forEach((medicationInput) => {
          const medicationSelect = medicationInput.querySelector('select[name="medication"]');
          const prescriptionSelect = medicationInput.querySelector('select[name="prescription"]');
          const gramsInput = medicationInput.querySelector('input[name="grams"]');
          const costPerGramOutput = medicationInput.querySelector('.cost-per-gram-output');

          if (medicationSelect && prescriptionSelect && gramsInput && costPerGramOutput) {
            const medicationRecord = {
              medication: medicationSelect.value,
              prescription: prescriptionSelect.value,
              grams: parseFloat(gramsInput.value),
              totalCost: parseFloat(costPerGramOutput.value.replace(/,/g, ''))
            };

            const medicationRef = child(newRecordRef, 'medication');
            push(medicationRef, medicationRecord);
          }
       
      })
      .catch((error) => {
        console.error('Error saving new record:', error);
      });
  })
  .catch((error) => {
    console.error('Error retrieving existing records:', error);
  });

      
      addRecordForm.reset();
      showMessage('Record added successfully!');
    })
    .catch((error) => {
      console.error('Error adding record:', error);
      showMessage('Error adding record. Please try again.');
    });

});

const submitMedicationBtn = document.getElementById('submitMedicationButton');
submitMedicationBtn.addEventListener('click', (event) => {
  event.preventDefault(); // Prevent the default form submission

  const medicationRecord = {
    resultsObtained: document.getElementById('resultsObtained').value,
    additionalNotes: document.getElementById('additionalNotes').value
  };

  // Get the record key from the hidden input field
  const recordKeyInput = document.querySelector('input[name="recordKey"]');
  const recordKey = recordKeyInput.value;

 // Write medication record to Firebase under the "results" node
const patientRef = ref(database, `patients/${currentPatientName}/testsTaken/${recordKey}/results`);


set(patientRef, medicationRecord)
  .then(() => {
    showMessage('Medication submitted successfully!');
  })
  .catch((error) => {
    console.error('Error submitting medication:', error);
    showMessage('Error submitting medication. Please try again.');
  });

  // Trigger the click event for all submitMedicationButton elements
  const submitMedicationButtons = document.querySelectorAll('.submit-medication-button');
  submitMedicationButtons.forEach((button) => {
    button.click();
});
// Clear medication inputs
      const medicationContainer = document.getElementById('medicationInputsContainer');
      medicationContainer.innerHTML = '';
      document.getElementById('resultsObtained').value = '';
    document.getElementById('additionalNotes').value = '';

});






/*


const uploadForm = document.getElementById('addPatientForm');




uploadForm.addEventListener('DOMContentLoaded', () => {
  populateNextPatientId();
});

uploadForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const nameInput = document.getElementById('name');
  const dobInput = document.getElementById('dob');
  const parentsInput = document.getElementById('parents');
  const residenceInput = document.getElementById('residence');
  const paymentInput = document.getElementById('payment');
  const sexInput = document.getElementById('sex');
  const patientIdInput = document.getElementById('patientId');

  // Save patient data to Firebase
  const savePatientData = () => {
    const name = nameInput.value;
    const dob = dobInput.value;
    const parents = parentsInput.value;
    const residence = residenceInput.value;
    const payment = paymentInput.value;
    const sex = sexInput.value;
    const patientId = patientIdInput.value;

    const patientsRef = ref(database, 'patients');
    const newPatientRef = child(patientsRef, patientId); // Use patient ID as the key

    set(newPatientRef, {
      name: name,
      dob: dob,
      parents: parents,
      residence: residence,
      payment: payment,
      sex: sex,
      patientId: patientId
    })
      .then(() => {
        nameInput.value = '';
        dobInput.value = '';
        parentsInput.value = '';
        residenceInput.value = '';
        paymentInput.value = '';
        sexInput.value = '';
        patientIdInput.value = '';

        showMessage('Patient details uploaded successfully!');
      })
      .catch((error) => {
        console.error('Error uploading patient details:', error);
        showMessage('Error uploading patient details. Please try again.');
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

// Attach the savePatientData function to the form submit event
const addPatientForm = document.getElementById('addPatientForm');
addPatientForm.addEventListener('submit', (e) => {
  e.preventDefault();
  savePatientData();
});

});

*/


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


    // Get a reference to the database
const messagesRef = ref(database, 'chat-messages');
const chatBox = document.getElementById('chatBox');
const messageInput = document.getElementById('messageInput');
const sendMessageBtn = document.getElementById('sendMessageBtn');

// Audio for message sent
const messageSentAudio = new Audio('');


// Audio for new message received
const newMessageAudio = new Audio('');

// Array to store IDs of displayed messages
let displayedMessageIds = [];

// Listen for new messages
onValue(messagesRef, (snapshot) => {
  if (snapshot.exists()) {
    snapshot.forEach((childSnapshot) => {
      const messageId = childSnapshot.key;
      const message = childSnapshot.val();

      // Display the message only if it's not already displayed
      if (!displayedMessageIds.includes(messageId)) {
        displayChatMessage(message);
        playMessageSound(message.sender);
        displayedMessageIds.push(messageId);
      }
    });
  }
});
// Request permission for notifications when the page loads
document.addEventListener('DOMContentLoaded', (event) => {
  if (Notification.permission !== 'granted') {
    Notification.requestPermission();
  }
});

// Assuming currentPageSender is defined elsewhere in your code
 const currentPageSender = 'Laboratory'; // Example

// Function to parse timestamp in the format "6/13/2024 6:53 PM"
function parseTimestamp(timestampStr) {
  return new Date(Date.parse(timestampStr));
}

// Function to display messages in the chatBox
function displayChatMessage(message) {
  if (message) {
    const messageDiv = document.createElement('div');

    // Display sender's name and profile icon in the header
    const headerDiv = document.createElement('div');
    headerDiv.classList.add('message-header');

    // Creating the profile icon element (assuming it's an image)
    const profileIcon = document.createElement('img');
    profileIcon.src = 'profile.webp'; // Add the path to your profile icon image
    profileIcon.classList.add('profile-icon2');
    headerDiv.appendChild(profileIcon);

    // Creating the span for sender's name
    const nameSpan = document.createElement('span');
    nameSpan.textContent = message.sender;
    nameSpan.style.fontWeight = 'bold';
    headerDiv.appendChild(nameSpan);

    // Append tick icon for read status
    const tickIcon = document.createElement('i');
    tickIcon.classList.add('tick-icon', 'fas', 'fa-check'); // Assuming you're using Font Awesome for the tick icon
    if (message.read) {
      tickIcon.classList.add('read'); // Add 'read' class if message is read
    }
    //headerDiv.appendChild(tickIcon);

    messageDiv.appendChild(headerDiv);

    // Display message text
    const messageTextSpan = document.createElement('span');
    messageTextSpan.textContent = message.text;
    messageDiv.appendChild(messageTextSpan);

    // Display timestamp in 6:00 pm format
    const timestampSpan = document.createElement('span');
    const timestamp = parseTimestamp(message.timestamp);
    const formattedDate = `${timestamp.toLocaleDateString()} `;
    const formattedTime = `${timestamp.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
    timestampSpan.textContent = `${formattedDate}${formattedTime}`;
    timestampSpan.style.fontSize = '9px'; // Set font size for the timestamp
    timestampSpan.style.color = '#888'; // Set color for the timestamp
    messageDiv.appendChild(timestampSpan);

    // Add different classes based on the sender
    if (message.sender === 'Laboratory') {
      messageDiv.classList.add('patients-reception');
    } else {
      messageDiv.classList.add('other-sender');
    }

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the latest message

    // Display browser notification for new message if sent now and sender is different from the current page
    const currentTime = new Date();
    const timeDifference = currentTime - timestamp;
    const timeThreshold = 5000; // 5 seconds

    if (Notification.permission === 'granted' && timeDifference <= timeThreshold && message.sender !== currentPageSender) {
      new Notification('New message from ' + message.sender, {
        body: message.text,
        icon: 'profile.webp' // Optional: add an icon to the notification
      });
    }
  }
}


// Function to play message sound
function playMessageSound(sender) {
  if (sender === 'Laboratory') {
    messageSentAudio.play();
  } else {
    newMessageAudio.play();
  }
}

// Event listener for the Send button
sendMessageBtn.addEventListener('click', () => {
  const messageText = messageInput.value.trim();
  if (messageText !== '') {
    const sender = 'Laboratory'; // You can replace 'User' with the actual username or user ID
    const timestamp = new Date().toISOString();
    const message = { text: messageText, sender: sender, timestamp: timestamp };

    // Save the message to Firebase
    push(messagesRef, message)
      .catch((error) => {
        console.error('Error sending message:', error);
      });

    messageInput.value = ''; // Clear the input field
  }
});


const openChatBtn = document.getElementById('openChatBtn');
const chatOverlay = document.getElementById('chatOverlay');
const chatContainer = document.getElementById('chatContainer');

openChatBtn.addEventListener('click', () => {
  chatOverlay.style.display = 'block'; // Show overlay
  chatContainer.style.display = 'block'; // Show chat container
});

// Close chat on overlay click
chatOverlay.addEventListener('click', () => {
  chatOverlay.style.display = 'none'; // Hide overlay
  chatContainer.style.display = 'none'; // Hide chat container
});
// Function to send the message
function sendMessage() {
  const messageText = messageInput.value.trim();
  if (messageText !== '') {
    const sender = 'Laboratory'; // You can replace 'User' with the actual username or user ID
    const timestamp = new Date().toISOString();
    const message = { text: messageText, sender: sender, timestamp: timestamp };

    // Save the message to Firebase
    push(messagesRef, message)
      .catch((error) => {
        console.error('Error sending message:', error);
      });

    messageInput.value = ''; // Clear the input field
  }
}


// Event listener for the Send button
sendMessageBtn.addEventListener('click', sendMessage);

// Event listener for the Enter key in the input field
messageInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

// Function to mute all page sounds
function mutePageSounds(durationInSeconds) {
  // Select all audio elements on the page
  const audioElements = document.querySelectorAll('audio');

  // Mute all audio elements
  audioElements.forEach(audio => {
    audio.muted = true;
  });

  // Unmute after the specified duration
  setTimeout(() => {
    audioElements.forEach(audio => {
      audio.muted = false;
    });
  }, durationInSeconds * 1000);
}

// Call the function to mute page sounds for 5 seconds from page load
window.addEventListener('load', () => {
  mutePageSounds(5); // Mute for 5 seconds
});
