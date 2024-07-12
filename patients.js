

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-storage.js";
import { getDatabase, ref, remove, push, get, update, onValue, child, set } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js";
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
const auth = getAuth(app);
const storage = getStorage(app);

document.addEventListener('DOMContentLoaded', () => {
  const nameInput = document.getElementById('name');
  const nameFeedback = document.createElement('div');
  nameFeedback.id = 'nameFeedback';
  nameInput.insertAdjacentElement('afterend', nameFeedback);

  const existingPatientsPopup = document.getElementById('existingPatientsPopup');
  const existingPatientsContent = document.getElementById('existingPatientsContent');
  const closePopup = document.getElementById('closePopup');

  nameInput.addEventListener('input', async () => {
    const name = nameInput.value.trim();
    if (name) {
      const snapshot = await get(child(ref(database), 'patients'));
      if (snapshot.exists()) {
        const patients = snapshot.val();
        const matchingPatients = Object.values(patients).filter(patient =>
          patient.name.toLowerCase().includes(name.toLowerCase())
        );
        if (matchingPatients.length > 0) {
          nameFeedback.textContent = `Patient(s) with the name "${name}" already exist(s).`;
          nameFeedback.style.color = 'red';

          existingPatientsContent.innerHTML = ''; // Clear previous content
          const heading = document.createElement('h3');
          heading.textContent = `Existing Patients with the name "${name}":`;
          existingPatientsContent.appendChild(heading);

          matchingPatients.forEach(patient => {
            const patientDiv = document.createElement('div');
            patientDiv.classList.add('patient');
            patientDiv.innerHTML = `
              <p><strong>Name:</strong> ${patient.name}</p>
              <p><strong>Date of Birth:</strong> ${patient.dob}</p>
              <p><strong>Telephone Contact:</strong> ${patient.parents}</p>
              <p><strong>Next of Kin's Telephone Contact:</strong> ${patient.nok || 'Not Found'}</p>
              <p><strong>Place of Residence:</strong> ${patient.residence}</p>
              <p><strong>Payment Terms:</strong> ${patient.payment}</p>
              <p><strong>Sex:</strong> ${patient.sex}</p>
            `;
            existingPatientsContent.appendChild(patientDiv);
          });

          openPopup();
        } else {
          nameFeedback.textContent = '';
          closePopup.click(); // Close the popup if no matching patients
        }
      } else {
        nameFeedback.textContent = '';
        closePopup.click(); // Close the popup if no patients exist
      }
    } else {
      nameFeedback.textContent = '';
      closePopup.click(); // Close the popup if name input is empty
    }
  });

  // Close popup functionality
  closePopup.addEventListener('click', closePopupHandler);

  function openPopup() {
    existingPatientsPopup.style.display = 'block';
  }

  function closePopupHandler() {
    existingPatientsPopup.style.display = 'none';
  }
});







const fetchPatientCountBtn = document.getElementById('fetchPatientCountBtn');
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

// Function to fetch the latest patient count using unique patient IDs as node names
function fetchPatientCount() {
  const patientsRef = ref(database, 'patients');

  get(patientsRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const patientData = snapshot.val();
        const patientIds = Object.keys(patientData); // Get the patient IDs (unique node names)
        const numericPatientIds = patientIds.map((patientId) => parseInt(patientId));
        patientCount = Math.max(...numericPatientIds, 0) + 1;

        showMessage(`Next Patient Count: ${patientCount}`);
      } else {
        patientCount = 1; // If no patient data exists, start from 1
        showMessage(`No patients found. Starting from Patient ID: ${patientCount}`);
      }
    })
    .catch((error) => {
      console.error('Error retrieving patient count:', error);
      showMessage('Error retrieving patient count. Please try again.');
    });
}

// Add event listener to the fetch patient count button
fetchPatientCountBtn.addEventListener('click', fetchPatientCount);

  var uploadBtn = document.getElementById('uploadBtn');
        var popupOverlay = document.getElementById('popupOverlay');
        var popupClose = document.getElementById('popupClose');
      uploadBtn.addEventListener('click', function() {
      popupOverlay.style.visibility = 'visible';
      popupOverlay.style.opacity = '1';
      fetchPatientCount()
      });
      
      popupClose.addEventListener('click', function() {
      popupOverlay.style.visibility = 'hidden';
      popupOverlay.style.opacity = '0';
      });

      
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


displayMessage('', 'Please wait...', false); // Pass false for error message
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
const loader = document.getElementById('loader');
let patients = [];
let patientCount = 1;
const patientsRef = ref(database, 'patients');

const validateAndSanitizeData = (data, defaultValue = 'No data') => {
  for (const key in data) {
    if (data.hasOwnProperty(key) && (data[key] === undefined || data[key] === '')) {
      data[key] = defaultValue;
    }
  }
  return data;
};

const savePatientData = (name, dob, parents, residence, payment, sex, nok) => {
  const patientId = patientCount.toString();

  // Retrieve country codes from inputs
  const parentsCountryCode = document.getElementById('parentsCountryCode').value.trim();
  const nokCountryCode = document.getElementById('NOKCountryCode').value.trim();

  // Concatenate country code with telephone numbers
  const parentsWithCountryCode = `${parentsCountryCode}${parents}`;
  const nokWithCountryCode = `${nokCountryCode}${nok}`;

  // Create patient data object including country codes
  const patientData = {
    name: name,
    dob: dob,
    parents: parentsWithCountryCode, // Include country code
    residence: residence,
    payment: payment,
    sex: sex,
    nok: nokWithCountryCode, // Include country code
    patientId: patientId,
  };

  // Validate and sanitize patient data
  const sanitizedPatientData = validateAndSanitizeData(patientData);

  const newPatientRef = ref(database, `patients/${patientId}`);
  
  loader.style.display = 'block';

  set(newPatientRef, sanitizedPatientData)
    .then(() => {
      form.reset();
      showMessage('Patient details uploaded successfully!');
      patientCount++;
      loader.style.display = 'none';

      // Close the popup after saving
      closePopup();
    })
    .catch((error) => {
      console.error('Error uploading patient details:', error);
      showMessage('Error uploading patient details. Please try again.');
      loader.style.display = 'none';
    });
};


// Function to close the popup
function closePopup() {
  const popupOverlay = document.getElementById('popupOverlay');
  popupOverlay.style.visibility = 'hidden';
  popupOverlay.style.opacity = '0';
}


form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const dob = document.getElementById('dob').value;
  const parents = document.getElementById('parents').value;
  const residence = document.getElementById('residence').value;
  const payment = document.getElementById('payment').value;
  const sex = document.getElementById('sex').value;
  const nok = document.getElementById('NOK').value;

  savePatientData(name, dob, parents, residence, payment, sex, nok);
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

// Function to check if it's today's date (helper function)
function isToday(date) {
  const today = new Date();
  return date.getDate() === today.getDate() && date.getMonth() === today.getMonth();
}
// Function to find patients with birthdays today in Firebase
function findPatientsWithBirthdaysToday() {
  const patientsRef = ref(database, 'patients');

  onValue(patientsRef, (snapshot) => {
    const patientsData = snapshot.val();
    const searchResults = [];

    if (patientsData) {
      // Iterate through patient data to find birthdays today
      Object.entries(patientsData).forEach(([patientId, patient]) => {
        // Convert the DOB string to a Date object
        const dobDate = new Date(patient.dob);

        if (isToday(dobDate)) {
          searchResults.push(patient);
        }
      });
    }

 // Check if there are patients with birthdays today
 if (searchResults.length > 0) {
  // Display the list of patients in the action center
  displayPatientsInActionCenter(searchResults);
} else {
  // Display a message in the action center if there are no patients with birthdays today
  displayNoBirthdaysMessage();
}
});
}

// Function to display a message in the action center when there are no birthdays today
function displayNoBirthdaysMessage() {
  const actionCenter = document.getElementById('actionCenter'); // Replace 'actionCenter' with your actual element ID
  const messageContainer = document.createElement('div');

  // Add an image
  const image = document.createElement('img');
  image.src = 'no results.jpg'; // Replace with the actual path to your image
  image.alt = 'No Birthdays Today Image';
  image.style.width = '200px'; // Adjust the width as needed
  image.style.height = '200px'; // Adjust the height as needed
  messageContainer.appendChild(image);

  // Add the message
  const message = document.createElement('p');
  message.textContent = 'No birthdays today.';
  messageContainer.appendChild(message);

  // Replace the content of the action center with the message container
  actionCenter.innerHTML = '';
  actionCenter.appendChild(messageContainer);
}

// Function to display the list of patients in the action center
function displayPatientsInActionCenter(patients) {
  const actionCenter = document.getElementById('actionCenter'); // Replace 'actionCenter' with your actual element ID
  actionCenter.innerHTML = ''; // Clear the existing content


  // Add a header to the action center
  const header = document.createElement('h5');
  header.textContent = '🎉Wow! 🎂🎁 Some patients have birthdays today! 🎉';
  actionCenter.appendChild(header);
// Create a table to display patients
const patientTable = document.createElement('table'); // Use 'table' for a table format

// Add a header row to the table
const headerRow = document.createElement('tr');
const headerNameCell = document.createElement('th');
const headerButtonCell = document.createElement('th');
headerNameCell.textContent = 'Patient Name';
headerButtonCell.textContent = 'Actions';
headerRow.appendChild(headerNameCell);
headerRow.appendChild(headerButtonCell);
patientTable.appendChild(headerRow);

patients.forEach((patient) => {
  // Create a table row for each patient
  const tableRow = document.createElement('tr');

  // Create a cell for patient name
  const nameCell = document.createElement('td');
  nameCell.textContent = patient.name;
  // Create a cell for patient name
  const numberCell = document.createElement('td');
  numberCell.textContent = patient.parents;
   const overlay5 = document.getElementById('overlay');
    // Create a cell for the "Send Wishes" button
    const sendWishCell = document.createElement('td');
    const sendWishButton = document.createElement('button');
    sendWishButton.textContent = ' 🎉Send Wishes';
    sendWishButton.classList.add('sendBirthdayMessage'); // Add a class for styling
    sendWishButton.addEventListener('click', () => {
      // Handle the action to open the popup for sending wishes
      overlay5.style.display= 'block'
      openWishesPopup(patient);
    });
    sendWishCell.appendChild(sendWishButton);

  // Append cells to the table row
  tableRow.appendChild(nameCell);
  tableRow.appendChild(sendWishCell);

  // Append the table row to the table
  patientTable.appendChild(tableRow);
});

// Append the table to the action center
actionCenter.appendChild(patientTable);
}

// Call findPatientsWithBirthdaysToday on page load or as needed
window.onload = function () {
  findPatientsWithBirthdaysToday();
};


// Function to open the popup for sending wishes
function openWishesPopup(patient) {
  const WishesPopup = document.createElement('div');
  WishesPopup.classList.add('WishesPopup');

  // Create form elements for composing and sending wishes
  const form = document.createElement('form');
  const patientDetails = document.createElement('div');
  patientDetails.classList.add('details');
  patientDetails.innerHTML = `
    <p><strong>Name:</strong> ${patient.name}</p>
    <p><strong>Date of Birth:</strong> ${patient.dob}</p>
    <p><strong>Contact:</strong> ${patient.parents}</p>
  `;
  const yourHospitalName = 'Sanyu Hospital';
  const hospitalInfo = 'Katooke Wakiso District, Uganda';
  const messageLabel = document.createElement('label');
  messageLabel.textContent = 'Compose Birthday Message for:';
  const messageInput = document.createElement('textarea');
  messageInput.rows = 4;
  messageInput.placeholder = 'Type your birthday wishes here...';
  // Pre-fill the message with a template or any default content
  messageInput.value = `🎉 Happy Birthday, ${patient.name}! 🎂🎁\n\n`
    + `From all of us at ${yourHospitalName}, we wish you a day filled with joy and happiness. 🌞\n\n`
    + `As a birthday gift, we invite you to visit our hospital for a free comprehensive body checkup. 🩺🏥\n\n`
    + `Your health is important to us, and we are here to ensure you have a healthy and vibrant year ahead. 💪\n\n`
    + `Feel free to pass by and get the best care. 🚶‍♂️🚶‍♀️\n\n`
    + `Address: ${hospitalInfo}\n\n`
    + `Contact us at +256 708 657 717 for any inquiries. 📞`;

  const sendButton = document.createElement('button');
  sendButton.textContent = '🎉Send Wishes';
  sendButton.classList.add('sendBirthdayMessage');
  sendButton.addEventListener('click', (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();

    const message = messageInput.value;
    const recipientNumber = patient.parents; // Use the patient's number as the recipient
    const recipientName = patient.name; // Use the patient's name as the recipient's name
    // Call a function to send the wishes using recipientNumber, recipientName, and message
    sendWishes(recipientNumber, recipientName, message);

    closeWishesPopup(WishesPopup);
  });

  // Create close button
  const closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.classList.add('close-button');
  closeButton.addEventListener('click', () => {
    closeWishesPopup(WishesPopup);
  });

  // Append form elements to the form
  form.appendChild(messageLabel);
  form.appendChild(patientDetails);
  form.appendChild(messageInput);
  form.appendChild(sendButton);
  form.appendChild(closeButton);

  // Append the form to the popup
  WishesPopup.appendChild(form);

  // Append the popup to the document body
  document.body.appendChild(WishesPopup);

  // Show overlay
  overlay5.style.display = 'block';
}

// Rest of your code...




  const overlay5 = document.getElementById('overlay')

// Function to close the popup
function closeWishesPopup(WishesPopup) {
  // Remove the popup from the document body 
   // Close the popup after sending wishes
    overlay5.style.display= 'none'

  document.body.removeChild(WishesPopup);
}

// Function to send wishes (replace this with your actual implementation)
function sendWishes(recipientNumber, recipientName, message) {
  // Implement the logic to send wishes using the recipient's number, name, and the composed message
  showMessage(`Sending wishes to ${recipientName}`);

 // Open WhatsApp with pre-filled message using the WhatsApp Web API
 window.open(`https://api.whatsapp.com/send?phone=${recipientNumber}&text=${encodeURIComponent(message)}`);
}


// Function to render the patients for the current page
async function renderPatients() {
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
const headers = ['Select', 'Name', 'Residence', 'Payment Terms', 'Sex', 'Patient ID', 'Contact', 'Date of Birth', 'Age', 'Actions'];

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

  // Function to check if the given date is today
  function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth();
  }

  // Check if any patients have birthdays today
  let isBirthdayToday = false;

  // Append the header row to the table
  table.appendChild(tableHeaderRow);

  patientsForPage.forEach(patient => {
    // Create a table row for each patient
    const tableRow = document.createElement('tr');
     // Create the "Select" checkbox cell
  const selectCell = document.createElement('td');
  const selectCheckbox = document.createElement('input');
  selectCheckbox.type = 'checkbox';
  selectCell.appendChild(selectCheckbox);
  tableRow.appendChild(selectCell);

  // Add a click event listener to the row
  tableRow.addEventListener('click', () => {
    // Toggle the checkbox when the row is clicked
    selectCheckbox.checked = !selectCheckbox.checked;

    // Add or remove a CSS class to highlight the selected row
    if (selectCheckbox.checked) {
      tableRow.classList.add('selected-row');
    } else {
      tableRow.classList.remove('selected-row');
    }
  });

  
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

    // Check if it's the patient's birthday today
    if (isToday(dob)) {
      dobCell.style.backgroundColor = 'yellow'; // Make the DOB cell yellow
      // You can also add birthday icons or text here
      dobCell.innerHTML += ' 🎂🎁';
      isBirthdayToday = true; // Set the flag to indicate there's a birthday today
    }

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

  // Show a detailed message if there are birthdays today
  if (isBirthdayToday) {


 
    
// Function to open the birthday message popup
function openBirthdayMessagePopup(patients) {
  const birthdayMessagePopup = document.getElementById('birthdayMessagePopup');
  const patientsList = document.getElementById('patientsList');
  const closePopupButton = document.getElementById('closeMessagePopup');

  // Check if the necessary elements exist before proceeding
  if (!birthdayMessagePopup || !patientsList || !closePopupButton) {
    console.error('One or more required elements are missing.');
    return;
  }

  const patientsTable = document.getElementById('patientsTable');

  // Check if the patientsTable exists before clearing it
  if (patientsTable) {
    patientsTable.innerHTML = '';
  } else {
    console.error('patientsTable is missing.');
  }

  // Filter and populate the popup with patients who have birthdays today
  const todayPatients = patients.filter(patient => isToday(new Date(patient.dob)));

  todayPatients.forEach(patient => {
    const row = patientsTable.insertRow();
    const nameCell = row.insertCell(0);
    const phoneCell = row.insertCell(1);
  
    nameCell.textContent = patient.name;
    phoneCell.textContent = patient.parents;
  });

  // Display the popup
  birthdayMessagePopup.classList.add('active');

  // Handle the "Send" button click to send the birthday message to all patients
  const sendButton = document.getElementById('sendBirthdayMessage');

  // Check if the sendButton exists before attaching the click event
  if (sendButton) {
    sendButton.addEventListener('click', function() {
      const birthdayMessageInput = document.getElementById('birthdayMessageInput').value;
      const yourHospitalName = 'Sanyu Hospital';
      const hospitalInfo = 'Katooke Wakiso District, Uganda';

      // Define the function to send a message to a single patient
      function sendMessageToPatient(patient) {
        const message = `🎉 Happy Birthday, ${patient.name}! 🎂🎁\n\n`
          + `From all of us at ${yourHospitalName}, we wish you a day filled with joy and happiness. 🌞\n\n`
          + `As a birthday gift, we invite you to visit our hospital for a free comprehensive body checkup. 🩺🏥\n\n`
          + `Your health is important to us, and we are here to ensure you have a healthy and vibrant year ahead. 💪\n\n`
          + `Feel free to pass by and get the best care. 🚶‍♂️🚶‍♀️\n\n`
          + `Address: ${hospitalInfo}\n\n`
          + `Contact us at +256 708 657 717 for any inquiries. 📞`;

        // Use a method or library to open a WhatsApp chat and pre-fill the message
        window.open(`https://api.whatsapp.com/send?phone=${patient.parents}&text=${encodeURIComponent(message)}`);
      }

      // Send messages to patients with a delay between each message
      todayPatients.forEach((patient, index) => {
        setTimeout(() => {
          sendMessageToPatient(patient);
        }, index * 3000); // Adjust the delay (in milliseconds) as needed
      });

      // Close the popup
      overlay.style.display = 'none'
      birthdayMessagePopup.style.display = 'none';
    });
  } else {
    console.error('sendBirthdayMessage button is missing.');
  }




  // Handle the "Close" button click to close the popup
  closePopupButton.addEventListener('click', function() {
    // Close the popup by removing the "active" class
    birthdayMessagePopup.style.display = 'none';
    overlay.style.display = 'none'
  });
}





  }


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


















// Function to format the timestamp
function formatDate(timestamp) {
  const date = new Date(timestamp);
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleString('en-US', options);
}









const testsTakenSelect = document.getElementById('testsTaken');
const totalAmountSpan = document.getElementById('totalAmount');
const calculateTotalButton = document.getElementById('calculateTotalButton');

// Get references to the input fields
const amountInput = document.getElementById('amountInput');
const balanceInput = document.getElementById('balanceInput');

// Add event listener to the amount input field
amountInput.addEventListener('input', () => {
    // Get the total amount and the tendered amount
    const totalAmount = parseFloat(totalAmountSpan.textContent);
    const tenderedAmount = parseFloat(amountInput.value);

    // Calculate the change
    const change = tenderedAmount - totalAmount;

    // Display the change in the balance input field
    balanceInput.value = change.toFixed(2); // Display change with two decimal places
});

// Function to calculate and update the total price
function updateTotal() {
  const testsTakenValue = testsTakenSelect.value; // Get the value of the input
  const prices = extractPrice(testsTakenValue); // Extract prices for selected options

  // Calculate the total price
  const totalPrice = prices.reduce((acc, curr) => acc + curr, 0);

  // Display the total price in the totalAmount span
  totalAmountSpan.textContent = totalPrice.toFixed(2); // Assuming you want to display the total with two decimal places
}


// Function to calculate total when button is clicked
function calculateTotalOnClick() {
  updateTotal(); // Calculate and update total
}

// Event listener for changes in the select element
testsTakenSelect.addEventListener('change', updateTotal);

// Event listener for button click
calculateTotalButton.addEventListener('click', calculateTotalOnClick);

function extractPrice(inputValue) {
  const prices = [];
  
  // Use global flag (g) to match all occurrences of the price pattern in the input value
  const regex = /Price: UGX (\d+\.\d+)/g;
  let match;
  
  // Iterate over all matches found in the input value
  while ((match = regex.exec(inputValue)) !== null) {
    if (match[1]) {
      const price = parseFloat(match[1]); // Parse the price to a floating-point number
      prices.push(price); // Push the extracted price to the prices array
    }
  }
  
  return prices; // Return the array containing extracted prices
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
    <td><strong>Next of Kin Telephone Contact:</strong></td>
    <td>${patient.nok || 'Not Found'}</td>
  </tr>
    <tr>
    <td><strong>No. of Visits:</strong></td>
    <td id="visitCount"> </td>
  </tr>
    <tr>
      <td><strong>Current Patient's Status:</strong></td>
      <td><span id="currentStatus"></span></td>
    </tr>
  </table>
    <div id="barcode"></div> <!-- This is where the generated barcode will be displayed -->

    <!-- Add a "Visit Count" element in your HTML -->
    <!-- Add more patient details as needed -->

    <!-- The container for patient visit details -->
<div id="patientVisitDetails" ></div>
<!-- Add this inside your patient details HTML -->

<button style="display:none;" id="generateBarcodeButton" class="button save-button">
    <i style="margin-right: 5px;" class="fa fa-barcode"></i>Generate Barcode
  </button>



    <!-- Assuming you have the patient's name as patientName variable -->
<button style="background: darkblue;" id="visit" data-patient="${patient.patientId}" class="button save-button">
  <i id="visitIcon" style="margin-right: 5px;" class="fas fa-calendar-check"></i>Reg. Visit
</button>
          <button  style="background: darkblue; " id="triageButton"  class="button save-button"><i style="margin-right: 5px;" class="fas fa-chart-line"></i>Triage History</button>

<button id="saveButton"  class="button save-button" disabled><i style="margin-right: 5px;" class="fa fa-save"></i>Save Image</button>
<button id="delButton" class="button delete-button"><i class="fa fa-trash"></i>Delete Image</button>
<button id="addToWaitingListButton" class="button save-button">
  <i style="margin-right: 5px;" class="fas fa-list"></i>Add to Waiting List
</button>
<button id="editButton" class="button save-button">
  <i style="margin-right: 5px;" class="fa fa-edit"></i>Edit Details
</button>

<button style="background: darkblue; " id="printCardButton" class="button save-button">
  <i style="margin-right: 5px;" class="fa fa-print"></i>Patient Card
</button>

  </div>
  `;

  patientDetails.innerHTML = patientDetailsHTML;


// Define the function to print the patient card
function printPatientCard() {
  // Create a new window for printing
  const printWindow = window.open('', '', 'width=600,height=600');

  // Create the content to be printed
  const patientCardContent = `
    <div style="text-align: center;">
      <h1>${patient.name}</h1>
      <p><strong>Patient ID:</strong> ${patient.patientId}</p>
      <p><strong>Date of Birth:</strong> ${patient.dob}</p>
      <p><strong>Gender:</strong> ${patient.sex}</p>
      <p style="margin-top: 20px;"><strong>Hospital Name:</strong>Sanyu Hospital</p>
      <p><strong>Note:</strong> Please return to the hospital if found lost</p>
    </div>
  `;

  // Define the CSS styles for the patient card
  const cardStyles = `
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
    }
    h1 {
      color: #333;
      font-size: 24px;
      margin: 0;
    }
    p {
      color: #666;
      font-size: 16px;
      margin: 5px 0;
    }
    div {
      background-color: #f4f4f4;
      padding: 20px;
      border: 1px solid #ccc;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
      border-radius: 4px;
    }
  `;

  // Set the content of the print window
  printWindow.document.open();
  printWindow.document.write(`<style>${cardStyles}</style>`);
  printWindow.document.write(patientCardContent);
  printWindow.document.close();

  // Print the window
  printWindow.print();

  // Close the print window
  printWindow.close();
}

// Add an event listener to the "Print Patient Card" button
const printCardButton = document.getElementById('printCardButton');
printCardButton.addEventListener('click', printPatientCard);

/*

function generateBarcode() {
  const patientId =  "PI-" + patient.patientId; // Replace with the actual patient ID

  // Create an SVG element
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute('jsbarcode-format', 'CODE128');
  svg.setAttribute('jsbarcode-value', patientId);
  svg.classList.add("barcode");

  // Add the SVG element to the barcode container
  const barcodeContainer = document.getElementById('barcode');
  barcodeContainer.innerHTML = ''; // Clear previous content
  barcodeContainer.appendChild(svg);

  // Initialize JsBarcode for this specific SVG
  JsBarcode(".barcode").init();
}
*/
let currentPatientId; // Store the current patient's ID

const editButton = document.getElementById('editButton');
editButton.addEventListener('click', () => openEditPopup(patient.patientId));

let saveEditedDetailsHandler; // Variable to store the event listener

function openEditPopup(patientId) {
  const editPopupOverlay = document.getElementById('editPopupOverlay');
  const editPopup = document.getElementById('editPopup');
  editPopup.style.display = 'block';
  editPopupOverlay.style.visibility = 'visible';
  editPopupOverlay.style.opacity = '1';
  overlay.style.display = 'block'
// Add the event listener for saving edited details
saveEditedDetailsHandler = saveEditedDetails;

  // Store the current patient's ID
  currentPatientId = patientId;
  // Fill input fields with current patient details
  document.getElementById('editedName').value = patient.name;
  document.getElementById('editedDOB').value = patient.dob;
  document.getElementById('editedTel').value = patient.parents;
  // Display the patient ID in the popup
  document.getElementById('patientIdDisplay').innerText = `Patient ID: ${patientId}`;

}

// Event listener for closing the edit popup
const closeEditPopupButton = document.getElementById('closeEditPopup');
closeEditPopupButton.addEventListener('click', closeEditPopup);

function closeEditPopup() {
  const editPopup = document.getElementById('editPopup');
  const editPopupOverlay = document.getElementById('editPopupOverlay');
  editPopup.style.display = 'none';
  editPopupOverlay.style.visibility = 'hidden';
  editPopupOverlay.style.opacity = '0';
  overlay.style.display = 'none';
  // Remove the event listener for saving edited details
  saveEditedDetailsButton.removeEventListener('click', saveEditedDetailsHandler);

  // Clear the patient ID display when closing the popup
  document.getElementById('patientIdDisplay').innerText = '';
}

function saveEditedDetails() {
  const editedName = document.getElementById('editedName').value;
  const editedDOB = document.getElementById('editedDOB').value;
  const editedTel = document.getElementById('editedTel').value;

  // Ensure none of the fields is empty
  if (editedName.trim() === '' || editedDOB.trim() === '' || editedTel.trim() === '') {
    showMessage('Please fill in all fields.');
    return;
  }

  // Ensure the current patient's ID is available
  if (currentPatientId) {
    const editedPatient = {
      name: editedName,
      dob: editedDOB,
      parents: editedTel,
    };

    // Save updated details to Firebase under the specific patient
    const patientRef = ref(database, `patients/${currentPatientId}`);
    update(patientRef, editedPatient)
      .then(() => {
        showMessage('Patient details updated successfully!');
        closeEditPopup(); // Close the popup on success
      })
      .catch(error => {
        showMessage('Error updating patient details:', error);
      });

    // Remove the event listener to avoid duplicates
    saveEditedDetailsButton.removeEventListener('click', saveEditedDetails);
  } else {
    showMessage('Invalid patient data.');
  }
}


// Event listener for saving edited details
const saveEditedDetailsButton = document.getElementById('saveEditedDetails');
saveEditedDetailsButton.addEventListener('click', saveEditedDetails);



// Function to handle saving the visit
function handleSaveVisit() {
  if (currentPatientName) {
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

  // Push the visit to the "visits" node under the specific patient
  const visitsRef = ref(database, `patients/${currentPatientName}/visits`);
  push(visitsRef, visit)
    .then(() => {
      showMessage('Visit saved successfully!');
      
      // Reset the patient name and close the popup
      currentPatientName = ''; // Ensure you reset it when the visit is saved
      visitPopupTitle.textContent = ''; // Clear the patient name from the popup title
      visitPopupOverlay.style.display = 'none'; // Hide the popup
      isPopupOpen = false; // Update the isPopupOpen variable

      // Reset the form fields after saving the visit
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
   // Remove the event listener to avoid duplicates
   saveVisitButton.removeEventListener('click', handleSaveVisit);
  })
  .catch((error) => {
    console.error('Error saving visit:', error);
    showMessage('Error saving visit. Please try again.');
  });
} else {
showMessage('Invalid patient data.');

// Reset the patient name and close the popup
currentPatientName = ''; // Ensure you reset it when the visit is saved
visitPopupTitle.textContent = ''; // Clear the patient name from the popup title
visitPopupOverlay.style.display = 'none'; // Hide the popup
isPopupOpen = false; // Update the isPopupOpen variable

// Reset the form fields after saving the visit
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
// Remove the event listener to avoid duplicates
saveVisitButton.removeEventListener('click', handleSaveVisit);
}
}
// Get the "Save Visit" button element
const saveVisitButton = document.getElementById('saveVisitBtn');

// Get the button element and add the click event listener
const visitButton = document.getElementById('visit');
const visitPopupOverlay = document.getElementById('popup-overlay3');
const visitPopupTitle = document.getElementById('visitPopupTitle');
let currentPatientName = ''; // Declare a variable to store the current patient name

visitButton.addEventListener('click', (event) => {
  // Check if the popup is already open before opening it again
  if (!isPopupOpen) {
    currentPatientName = event.target.getAttribute('data-patient'); // Extract the patient's name from the data-patient attribute
    visitPopupTitle.textContent = `Save Visit for Patient: PI - ${currentPatientName}`; // Set the popup title
    visitPopupOverlay.style.display = 'block';
    // Update the isPopupOpen variable to true when the popup is opened
    isPopupOpen = true;

    // Remove any existing event listeners from "Save Visit" button and add the click event listener
    saveVisitButton.removeEventListener('click', handleSaveVisit);
    saveVisitButton.addEventListener('click', handleSaveVisit);
  }
});


// Get the close button element and add the click event listener to close the popup
const closePopupBtn4 = document.getElementById('closePopupBtn4');
closePopupBtn4.addEventListener('click', () => {
  const popupOverlay = document.getElementById('popup-overlay4');
  popupOverlay.style.display = 'none';
});
// Event listener for the "Cancel" button
const cancelVisitBtn = document.getElementById('cancelVisitBtn');

// Variable to track whether the popup is open or not
let isPopupOpen = false;
// Function to close the popup
function closePopup() {
  visitPopupOverlay.style.display = 'none';
}
// Function to close the "Visit" button popup
function closeVisitPopup() {
  visitPopupOverlay.style.display = 'none';
  // Update the isPopupOpen variable to false when the popup is closed
  isPopupOpen = false;
}

// Event listener for the "Cancel" button in the "Visit" button popup
cancelVisitBtn.addEventListener('click', closeVisitPopup);




// Assuming you have already included the Select2 library in your HTML
// Initialize Select2 for the "Allergies" select input
$('#allergies').select2({
  dropdownParent: $('body')
});

// Initialize Select2 for the "Clinician's Name" select input
$('#clinicianName').select2({
  dropdownParent: $('body')
});
/**
// Initialize Select2 for the "Clinician's Name" select input
$('#testsTaken').select2({
  dropdownParent: $('body')
});
// Initialize Select2 for the "Clinician's Name" select input
$('#testsTakenClone').select2({
  dropdownParent: $('body')
}); */
// Assuming you have the "testsTakenSelect" element as the "Allergies" select input
const testsTakenSelect = document.getElementById('allergies');

// Assuming you have the "clinicianNameSelect" element as the "Clinician's Name" select input
const clinicianNameSelect = document.getElementById('clinicianName');

// Retrieve allergies from Firebase and populate the "Allergies" select options
const allergiesRef = ref(database, 'medicine');
onValue(allergiesRef, (snapshot) => {
  const allergiesData = snapshot.val();

  // Clear existing options
  $('#allergies').empty(); // Use Select2 method to clear options

  // Add options for each allergy
  if (allergiesData) {
    const allergies = Object.values(allergiesData);
    allergies.forEach((allergy) => {
      const option = new Option(allergy.name, allergy.name);
      $('#allergies').append(option); // Use Select2 method to add option
    });
  }

  // Trigger change event after updating options to refresh Select2
  $('#allergies').trigger('change');
});

// Retrieve clinician names from Firebase and populate the "Clinician's Name" select options
const cliniciansRef = ref(database, 'staff');
onValue(cliniciansRef, (snapshot) => {
  const cliniciansData = snapshot.val();
  clinicianNameSelect.innerHTML = '<option value="" disabled selected>Select a clinician</option>';

  // Clear existing options
 // $('#clinicianName').empty(); // Use Select2 method to clear options

  // Add options for each clinician
  if (cliniciansData) {
    const clinicians = Object.values(cliniciansData);
    clinicians.forEach((clinician) => {
      const option = new Option(clinician.name, clinician.name);
      $('#clinicianName').append(option); // Use Select2 method to add option
    });
  }

  // Trigger change event after updating options to refresh Select2
  $('#clinicianName').trigger('change');
});

// Assuming you have the "patientName" variable with the patient's name

const addToWaitingListButton = document.getElementById('addToWaitingListButton');

addToWaitingListButton.addEventListener('click', () => {
  const patientName = patient.name;
  const patientId = patient.patientId;

  // Get the current date and time
  const currentDate = new Date();
  const formattedDate = formatDate(currentDate);

  // Send patient details along with the date and time to Firebase in the "waiting-list" node
  addToWaitingList(patientName, patientId, formattedDate);
});

// Function to add patient to the waiting list in Firebase
function addToWaitingList(patientName, patientId, date) {
  const waitingListRef = ref(database, 'waiting-list');
  push(waitingListRef, { name: patientName, id: patientId, date: date })
    .then(() => {
      
      showMessage('Patient added to the waiting list successfully!');
    })
    .catch((error) => {
      console.error('Error adding patient to the waiting list:', error);
      showMessage('Error adding patient to the waiting list:', error);
    });
}

// Function to format the date and time in a readable format (e.g., "YYYY-MM-DD HH:mm:ss")
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

  
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
  const uploadLabel = document.createElement('label');
  uploadLabel.htmlFor = 'uploadImage';
  uploadLabel.className = 'upload-label';
  uploadLabel.innerHTML = `
    <i class="fas fa-cloud-upload-alt"></i>
    Patient's Image 
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
  // Show loading spinner
  saveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

  // Get the image data from the image element
  const imageElement = imageFrame.querySelector('img');
  const imageData = imageElement.src;

  // Convert the image to WebP format
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const img = new Image();

  img.onload = function () {
    // Set canvas dimensions to the image dimensions
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw the image onto the canvas
    context.drawImage(img, 0, 0, img.width, img.height);

    // Convert the canvas content to a WebP data URL
    const webpDataURL = canvas.toDataURL('image/webp', 0.8); // Adjust quality as needed

    // Convert the WebP data URL to a Blob
    const imageBlob = dataURItoBlob(webpDataURL);

    // Get the patient name
    const patientName = patient.patientId;

    // Generate a unique filename for the image using the patient's name
    const filename = `${patientName}_${Date.now()}.webp`;

    // Save the image data to Firebase Storage under the patient's name
    const imageRef = storageRef(storage, `images/${filename}`);

    // Upload the image blob to Firebase Storage
    const uploadTask = uploadBytes(imageRef, imageBlob);

    // Monitor the upload completion using the then method
    uploadTask
      .then(function () {
        // The image has been successfully uploaded
        // Get the download URL of the image
        getDownloadURL(imageRef)
          .then(function (downloadURL) {
            // Save the download URL to the patient's data in Firebase
            const patientRef = ref(database, `patients/${patient.patientId}`);
            update(patientRef, {
              image: downloadURL,
            });

            // Show success message or perform any additional actions
            showMessage('Image saved successfully!');
          })
          .finally(() => {
            // Revert back to the original button text after the save is complete or fails
            saveButton.textContent = 'Save Image';
          });
      })
      .catch(function (error) {
        // Handle the upload error
        console.error('Error uploading image:', error);
        showMessage('Error uploading image. Please try again.');
        // Revert back to the original button text if there's an error
        saveButton.textContent = 'Save';
      });
  };

  // Set the source of the image element
  img.src = imageData;
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
  const patientRef = ref(database, `patients/${patient.patientId}`);
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
            resultsObtainedElement.textContent = 'Test Results status: ' + (resultsObtained === 'Completed Successfully' ? 'Completed Successfully' : 'Pending...');
            resultsObtainedElement.style.color = resultsObtained === 'Completed Successfully' ? 'darkblue' : 'orange';
          } else {
            resultsObtainedElement.textContent = 'Test Results status: Pending...';
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
  <td>${Array.isArray(visitData.allergies) ? visitData.allergies.join(', ') : ''}</td>
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

// Get the button element and add the click event listener
const triageButton = document.getElementById('triageButton');
triageButton.addEventListener('click', () => {
  displayVisitsPopup(patientName);
});
















function createRecordElement(recordKey, record) {
  const recordElement = document.createElement('div');
  recordElement.classList.add('record');


// Create the table
const table = document.createElement('table');
table.style.width = '100%';
table.setAttribute('border', '1');
recordElement.appendChild(table);

// Create and append row for 'Record Key'
const recordKeyRow = document.createElement('tr');
table.appendChild(recordKeyRow);

// Create and append header cell for 'Record Key'
const recordKeyHeader = document.createElement('th');
recordKeyHeader.textContent = 'Record Key:';
recordKeyRow.appendChild(recordKeyHeader);

// Create and append data cell for 'Record Key'
const recordKeyCell = document.createElement('td');
recordKeyCell.textContent = recordKey;
recordKeyRow.appendChild(recordKeyCell);

// Create and append row for 'Date Taken'
const dateTakenRow = document.createElement('tr');
table.appendChild(dateTakenRow);

// Create and append header cell for 'Date Taken'
const dateTakenHeader = document.createElement('th');
dateTakenHeader.textContent = 'Date Taken:';
dateTakenRow.appendChild(dateTakenHeader);

// Create and append data cell for 'Date Taken'
const dateTakenCell = document.createElement('td');
const dateTaken = new Date(parseInt(record.dateTaken));
if (!isNaN(dateTaken.getTime())) {
  dateTakenCell.textContent = dateTaken.toLocaleString();
} else {
  dateTakenCell.textContent = 'Invalid Date';
}
dateTakenRow.appendChild(dateTakenCell);

// Create and append row for 'Tests Taken'
const testsTakenRow = document.createElement('tr');
table.appendChild(testsTakenRow);

// Create and append header cell for 'Tests Taken'
const testsTakenHeader = document.createElement('th');
testsTakenHeader.textContent = 'Tests Taken:';
testsTakenRow.appendChild(testsTakenHeader);

// Create and append data cell for 'Tests Taken'
const testsTakenCell = document.createElement('td');
testsTakenCell.textContent = record.testsTaken;
testsTakenRow.appendChild(testsTakenCell);


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

// Add this line at the beginning of your code to store the prices data
const pricesData = {};
// Create a button for uploading consumables and sundries prices
const uploadPricesButton = document.createElement('button');
uploadPricesButton.textContent = ' + Prices';
uploadPricesButton.classList.add('upload-prices-button');

// Add event listener to the upload prices button
uploadPricesButton.addEventListener('click', () => {
  // Get the current record key
  const recordKey = recordKeyCell.textContent;

  const overlay = document.createElement('div');
  overlay.classList.add('overlay3');

  const popup = document.createElement('div');
  popup.classList.add('popup3');

  const closeButton = document.createElement('button');
  closeButton.textContent = 'X';
  closeButton.classList.add('close-button');

  const heading = document.createElement('h2');
  heading.textContent = 'Upload Medical Consumables & Sundries Prices';
  popup.appendChild(closeButton);
  popup.appendChild(heading);

  // Create a form to input the prices
  const pricesForm = document.createElement('form');
  pricesForm.id = 'pricesForm';

  // Input field for consumables price
  const consumablesLabel = document.createElement('label');
  consumablesLabel.textContent = 'Consumables Price (UGX):';
  const consumablesInput = document.createElement('input');
  consumablesInput.type = 'number';
  consumablesInput.name = 'consumablesPrice';
  consumablesInput.required = true;
  consumablesLabel.appendChild(consumablesInput);

  // Input field for sundries price
  const sundriesLabel = document.createElement('label');
  sundriesLabel.textContent = 'Sundries Price (UGX):';
  const sundriesInput = document.createElement('input');
  sundriesInput.type = 'number';
  sundriesInput.name = 'sundriesPrice';
  sundriesInput.required = true;
  sundriesLabel.appendChild(sundriesInput);

  // Submit button for the form
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Upload';
  submitButton.classList.add('upload-button');

  pricesForm.appendChild(consumablesLabel);
  pricesForm.appendChild(sundriesLabel);
  pricesForm.appendChild(submitButton);

  popup.appendChild(pricesForm);

  // Append the overlay and popup to the document body
  document.body.appendChild(overlay);
  document.body.appendChild(popup);

  // Show the overlay and popup
  overlay.style.display = 'block';
  popup.style.display = 'block';

  // Close button event listener
  closeButton.addEventListener('click', () => {
    // Hide the overlay and popup
    overlay.style.display = 'none';
    popup.style.display = 'none';
  });

  // Form submit event listener
  pricesForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(pricesForm);
    const consumablesPrice = formData.get('consumablesPrice');
    const sundriesPrice = formData.get('sundriesPrice');

    // Save the consumables and sundries data to Firebase under the exact test record
    saveConsumablesAndSundriesData(recordKey, consumablesPrice, sundriesPrice);

    // Hide the overlay and popup
    overlay.style.display = 'none';
    popup.style.display = 'none';
  });
});

function saveConsumablesAndSundriesData(recordKey, consumablesPrice, sundriesPrice) {
  // Save the consumablesPrice and sundriesPrice to the data object under the current record key
  const data = {
    consumablesPrice: parseFloat(consumablesPrice),
    sundriesPrice: parseFloat(sundriesPrice),
    dateUploaded: new Date().toLocaleString(),
  };

  // Save the data to Firebase under the exact test record
  const testRecordRef = ref(database, `patients/${patient.patientId}/testsTaken/${recordKey}`);
  update(testRecordRef, { consumablesAndSundries: data })
    .then(() => {
      showMessage('Consumables and Sundries data saved successfully!');
    })
    .catch((error) => {
      console.error('Error saving consumables and sundries data:', error);
      showMessage('Error saving consumables and sundries data. Please try again.');
    });
}

// Create payment status element
const paymentStatusElement = document.createElement('p');
paymentStatusElement.textContent = 'Test Payment: ' + (record.paymentstatus || 'Not Paid');
paymentStatusElement.classList.add('payment-status'); // Add the CSS class
recordElement.appendChild(paymentStatusElement);

// Create approve button only if payment is not received
if (record.paymentstatus !== 'payment received') {

  paymentStatusElement.style.color = 'red';




  
  // Create approve button
  const approveButton = document.createElement('button');
  approveButton.classList.add('approve-button');

  // Create check icon
  const checkIcon = document.createElement('i');
  checkIcon.classList.add('fas', 'fa-check-circle');

  // Set the inner HTML of the approve button
  approveButton.innerHTML = '';
  approveButton.appendChild(checkIcon);
  approveButton.innerHTML += ' Approve test payment';

// Add click event listener to the approve button
approveButton.addEventListener('click', () => {
  // Show confirmation dialog
  const confirmPayment = confirm("Are you sure you want to approve the test payment?");
  
  // Proceed with updating payment status if user confirms
  if (confirmPayment) {
    // Call the function to handle payment action
    handlePaymentAction();
  }
});

// Function to handle payment action
function handlePaymentAction() {
  // Capture the tests taken
  const testsTakenData = testsTakenCell.textContent.trim();
  console.log('Tests Taken:', testsTakenData);

  // Get the input element where you want to display the tests taken data
  const testsTakenInput = document.getElementById('testsTaken');

  // Set the value of the input element to the captured tests taken data
  testsTakenInput.value = testsTakenData;

  // Show custom payment details popup
  const confirmationPopup = document.getElementById('confirmationPopup');
  confirmationPopup.style.display = 'block';
  calculateTotalOnClick()
  // Close popup when close button is clicked
  const closePopupBtn = document.getElementById('closePopupBtn');
  closePopupBtn.addEventListener('click', closePopup);

  // Add event listener to the confirm payment button
  const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
  confirmPaymentBtn.addEventListener('click', confirmPaymentAction);

  // Function to close the popup
  function closePopup() {
    confirmationPopup.style.display = 'none';
    closePopupBtn.removeEventListener('click', closePopup);
    confirmPaymentBtn.removeEventListener('click', confirmPaymentAction);
  }
}


// Function to handle closing of the confirmation popup
function closeConfirmationPopup() {
  const confirmationPopup = document.getElementById('confirmationPopup');
  confirmationPopup.style.display = 'none';

  // Remove event listener from the confirm payment button
  const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
  confirmPaymentBtn.removeEventListener('click', confirmPaymentAction);
}

function confirmPaymentAction() {
  const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
  const patientIdInput = document.getElementById('patientIdInput');
  const departmentSelect = document.getElementById('department');
  const paymentModeSelect = document.getElementById('paymentMode');

  const testsTakenInput = document.getElementById('testsTaken'); // Change to input element
  const totalAmountSpan = document.getElementById('totalAmount');
  const amountInput = document.getElementById('amountInput');
  const balanceInput = document.getElementById('balanceInput');
  const confirmationPopup = document.getElementById('confirmationPopup');

  // Capture the tests taken data from the testsTakenCell element
  const testsTakenData = testsTakenCell.textContent.trim();
  console.log('Tests Taken now:', testsTakenData);

  // Set the value of the testsTakenInput element to the captured tests taken data
  testsTakenInput.value = testsTakenData;

   const testsTaken = testsTakenInput.value;
   const totalAmount = parseFloat(totalAmountSpan.textContent);
  const amountTendered = parseFloat(amountInput.value);
  const balance = parseFloat(balanceInput.value);
  const patientId = patientIdInput.value;
  const department = departmentSelect.value;
  const paymentMode = paymentModeSelect.value;

  // Construct the sales receipt object
  const salesReceipt = {
    testsTaken: testsTaken,
    totalAmount: totalAmount,
    amountTendered: amountTendered,
    balance: balance,
    patientId: patientId,
    department: department,
    paymentMode: paymentMode,
    timestamp: Date.now(),
  };

 // Upload the sales receipt to the database
 const salesReceiptsRef = ref(database, 'salesReceipts');
 push(salesReceiptsRef, salesReceipt)
   .then(() => {
     showMessage('Sales receipt uploaded successfully');

     // Close the popup and remove event listener
     closeConfirmationPopup();

      // Close the popup
      confirmationPopup.style.display = 'none';

      // Reset all fields
      testsTakenSelect.value = '';
      totalAmountSpan.textContent = '0.00';
      amountInput.value = '';
      balanceInput.value = '';
      patientIdInput.value = '';
      departmentSelect.value = '';
      paymentModeSelect.value = '';

      // Reset the total element
      updateTotal();

      // Construct the reference to the payment status in Firebase
      const paymentStatusRef = ref(database, `patients/${patient.patientId}/testsTaken/${recordKey}/paymentstatus`);

      // Set the payment status to 'payment received' in Firebase
      return set(paymentStatusRef, 'payment received')
        .then(() => {
          showMessage('Payment status updated successfully!');
          console.log('Payment status updated successfully.');
        });
    })
    .catch((error) => {
      showMessage('Error uploading sales receipt:', error);
      // Handle error
    });
}





  // Append the approve button to a container element on your webpage
  recordElement.appendChild(approveButton);
}else {
  paymentStatusElement.style.color = 'blue';
}






// Create complaints row
const complaintsRow = document.createElement('tr');
recordElement.appendChild(complaintsRow);

// Create table header for 'Complaints'
const complaintsHeader = document.createElement('th');
complaintsHeader.textContent = 'Patient Complaints';
complaintsRow.appendChild(complaintsHeader);

// Create table cell for 'Complaints'
const complaintsElement = document.createElement('td');
complaintsElement.textContent = record.additionalNotes || 'No complaints';
complaintsRow.appendChild(complaintsElement);

// Optionally, style the complaints element based on the content (if required)
if (!record.additionalNotes) {
  complaintsElement.style.color = 'gray';
} else {
  complaintsElement.style.color = 'black';
}



// Create results obtained element
const resultsObtainedElement = document.createElement('p');
  resultsObtainedElement.textContent = 'Test Results status: ' + (record.results?.resultsObtained || 'Pending...');
  
  // Add the 'results-obtained-data' class to the element
  resultsObtainedElement.classList.add('results-obtained-data');

  if (record.results && record.results.resultsObtained === 'Completed Successfully') {
    resultsObtainedElement.style.color = 'darkblue';
  } else {
    resultsObtainedElement.style.color = 'orange';
  }
  recordElement.appendChild(resultsObtainedElement);

  const followUp = document.createElement('th');
  followUp.textContent = 'Follow Up date & time';
recordElement.appendChild(followUp);

const followUpData = document.createElement('td');
followUpData.textContent = record.results?.followUpDateTime || 'none';
recordElement.appendChild(followUpData);

  const finalStatusHeader = document.createElement('th');
finalStatusHeader.textContent = 'Final Status of Patient';
recordElement.appendChild(finalStatusHeader);

const finalStatusData = document.createElement('td');
finalStatusData.textContent = record.results?.finalStatus || 'Pending...';
recordElement.appendChild(finalStatusData);
// Create a row for the consumables price
const consumablesRow = document.createElement('tr');
recordElement.appendChild(consumablesRow);

  const consumablesPriceHeader = document.createElement('th');
  consumablesPriceHeader.textContent = 'Consumables Price (UGX)';
  consumablesPriceHeader.style.color = "blue"
  consumablesPriceHeader.style.fontWeight = "bold"
  consumablesRow.appendChild(consumablesPriceHeader);

  // Check if consumables price data exists for the current record key and the nested node
  if (record.hasOwnProperty('consumablesAndSundries')) {
    const consumablesPriceData = record.consumablesAndSundries.consumablesPrice.toLocaleString('en-US', {    style: 'currency',   currency: 'UGX',  });

    const consumablesPriceDataCell = document.createElement('td');
    consumablesPriceDataCell.textContent = consumablesPriceData;
    consumablesPriceDataCell.style.color = "green"
    consumablesPriceDataCell.style.fontWeight = "bold"
    consumablesRow.appendChild(consumablesPriceDataCell);
  } else {
    // If consumables price data not found, display "Not Found" in the table cell
    const noConsumablesDataCell = document.createElement('td');
    noConsumablesDataCell.textContent = 'Not Found';
    noConsumablesDataCell.style.color = "red"
    noConsumablesDataCell.style.fontWeight = "bold"
    consumablesRow.appendChild(noConsumablesDataCell);
  }

  // Create a row for the sundries price
  const sundriesRow = document.createElement('tr');
  recordElement.appendChild(sundriesRow);

  const sundriesPriceHeader = document.createElement('th');
  sundriesPriceHeader.textContent = 'Sundries Price (UGX)';
  sundriesPriceHeader.style.color = "blue"
  sundriesRow.appendChild(sundriesPriceHeader);

  // Check if sundries price data exists for the current record key and the nested node
  if (record.hasOwnProperty('consumablesAndSundries')) {
    const sundriesPriceData = record.consumablesAndSundries.sundriesPrice.toLocaleString('en-US', {    style: 'currency',   currency: 'UGX',  });

    const sundriesPriceDataCell = document.createElement('td');
    sundriesPriceDataCell.style.color = "green"
    sundriesPriceDataCell.style.fontWeight = "bold"
    sundriesPriceDataCell.textContent = sundriesPriceData;
    sundriesRow.appendChild(sundriesPriceDataCell);
  } else {
    // If sundries price data not found, display "Not Found" in the table cell
    const noSundriesDataCell = document.createElement('td');
    noSundriesDataCell.textContent = 'Not Found';
    noSundriesDataCell.textContent = 'Not Found';
    noSundriesDataCell.style.color = "red"
    noSundriesDataCell.style.fontWeight = "bold"
    sundriesRow.appendChild(noSundriesDataCell);
  }

  let totalDataCell;
  let totalCostCell;
// Create a row for the treatment total
const treatmentTotalRow = document.createElement('tr');
  recordElement.appendChild(treatmentTotalRow);

  const totalHeader = document.createElement('th');
  totalHeader.textContent = 'Treatment Total (UGX)';
  treatmentTotalRow.appendChild(totalHeader);

  // Calculate the treatment total by adding consumables and sundries prices
  if (record.hasOwnProperty('consumablesAndSundries')) {
    const consumablesPrice = record.consumablesAndSundries.consumablesPrice;
    const sundriesPrice = record.consumablesAndSundries.sundriesPrice;
    const treatmentTotal = consumablesPrice + sundriesPrice;


    totalDataCell = document.createElement('td');
    totalDataCell.textContent = 'UGX ' + treatmentTotal.toFixed(2); // Use toFixed(2) to ensure two decimal places
    treatmentTotalRow.appendChild(totalDataCell);
  } else {
    // If consumables and sundries price data not found, display "Not Found" in the table cell
    const noTotalDataCell = document.createElement('td');
    noTotalDataCell.textContent = 'Not Found';
    treatmentTotalRow.appendChild(noTotalDataCell);
  }

const medicationTakenElement = document.createElement('div');
medicationTakenElement.classList.add('medication-taken');
const medicationTable = document.createElement('table');
medicationTable.classList.add('medication-table');

const medicationTableData = [];

// Create table header row
const tableHeaderRow = document.createElement('tr');
const headers = ['Medication', 'Prescription', 'Pieces', 'Total Cost'];
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
        // Create an object to represent each row of medication data
        const rowData = {
      medication: medicationData.medication,
      prescription: medicationData.prescription,
      grams: medicationData.grams,
      totalCost: medicationData.totalCost,
      overallTotalCost: medicationData.totalCost,
    };

    // Push the row data object into the medicationTableData array
    medicationTableData.push(rowData);
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

// Create total cost cell
totalCostCell = document.createElement('td');
totalCostCell.textContent = 'Total Cost: UGX ' + totalCost.toFixed(2);
totalCostCell.classList.add('total-cell'); // Add the CSS class\

// Create payment status element
const medicineStatusElement = document.createElement('p');
medicineStatusElement.textContent = 'Medicine Payment: ' + (record.medicinestatus || 'Not Paid');
medicineStatusElement.classList.add('payment-status'); // Add the CSS class
recordElement.appendChild(medicineStatusElement);


// Get the treatment total from the first element
let treatmentTotal1 = 0;
if (totalDataCell && totalDataCell.textContent) {
    const totalDataText = totalDataCell.textContent.replace('UGX', '').trim();
    if (totalDataText) {
        treatmentTotal1 = parseFloat(totalDataText);
    }
}

// Extract numeric value from totalCostCell.textContent
let treatmentTotal2 = 0;
if (totalCostCell && totalCostCell.textContent) {
    const totalCostText = totalCostCell.textContent.replace('Total Cost: UGX', '').trim();
    if (totalCostText) {
        treatmentTotal2 = parseFloat(totalCostText);
    }
}

// Log treatmentTotal2 and treatmentTotal1 after they are initialized
console.log('Treatment 2:', treatmentTotal2);
console.log('Treatment 1:', treatmentTotal1);

// Check if treatmentTotal2 is a valid number after parsing
if (!isNaN(treatmentTotal2)) {
    // Successfully parsed treatmentTotal2, proceed with calculations
    // Calculate the overall total by summing up the totals from both elements
    const overallTotal = treatmentTotal1 + treatmentTotal2;
    console.log('Overall Total:', overallTotal);

    // Display the overall total
    const overallTotalSpan = document.createElement('span');
    overallTotalSpan.textContent = 'Overall Total: UGX ' + overallTotal.toFixed(2);
    overallTotalSpan.classList.add('overall-total'); // Add the CSS class

    // Append the overall total to the document body or any desired location
    medicationTable.appendChild(overallTotalSpan);
} else {
    // Failed to parse treatmentTotal2, handle the error
    console.log('Failed to parse treatmentTotal2:', totalCostText);
}

// Create approve button only if payment is not received
if (record.medicinestatus !== 'payment received') {

  medicineStatusElement.style.color = 'red';
  // Create approve button
  const approve2Button = document.createElement('button');
  approve2Button.classList.add('approve-button');

  // Create check icon
  const checkIcon = document.createElement('i');
  checkIcon.classList.add('fas', 'fa-check-circle');

  // Set the inner HTML of the approve button
  approve2Button.innerHTML = '';
  approve2Button.appendChild(checkIcon);
  approve2Button.innerHTML += ' Approve medicine payment';

  // Add click event listener to the approve button
  approve2Button.addEventListener('click', () => {
    // Update the payment status in Firebase
    const medicineStatusRef = ref(database, `patients/${patientName}/testsTaken/${recordKey}/medicinestatus`);

    set(medicineStatusRef, 'payment received')
      .then(() => {
        showMessage('Payment status updated successfully!');
        console.log('Payment status updated successfully.');
      })
      .catch((error) => {
        console.error('Error updating payment status:', error);
        showMessage('Error updating payment status:', error);
      });
  });

  // Append the approve button to a container element on your webpage
  recordElement.appendChild(approve2Button);
}else {
  medicineStatusElement.style.color = 'blue';
}



const additionalNotesElement = document.createElement('p');
additionalNotesElement.textContent = 'Diagnosis: ' + (record.results?.additionalNotes || 'Pending...');
if (record.results && !record.results.additionalNotes) {
  additionalNotesElement.classList.add('pending');
}
recordElement.appendChild(additionalNotesElement);



// Append the upload prices button to the record element
recordElement.appendChild(uploadPricesButton);






// Create share button
const shareButton = document.createElement('button');
shareButton.id = 'shareButton';
shareButton.innerHTML = '<i class="fa fa-paper-plane"></i> Lab Request'; // Use innerHTML instead of textContent
shareButton.addEventListener('click', () => {
  // Ensure the user object is defined
    shareRecord(patient, record);
  }
);

// Append the share button to the record element
recordElement.appendChild(shareButton);
// Create a WhatsApp share button
const whatsappShareButton = document.createElement('button');
whatsappShareButton.id = 'whatsappShareButton';
whatsappShareButton.innerHTML = '<i class="fa fa-whatsapp"></i> Results';
// Add a click event listener to the WhatsApp share button

// Add a click event listener to the WhatsApp share button
whatsappShareButton.addEventListener('click', () => {
  // Get the download URL of the result file
  const patientName = patient.patientId;
  const recordKey = recordKeyCell.textContent.replace('Record Key: ', '');
  const testRef = ref(database, `patients/${patientName}/testsTaken/${recordKey}`);

  get(testRef)
    .then((snapshot) => {
      const testData = snapshot.val();
      if (testData && testData.resultFileURL) {
        // Get the patient's WhatsApp number from the patient object
        const patientPhoneNumber = patient.parents;

        // Create the WhatsApp message with the file URL
        const fileURL = testData.resultFileURL;
        const message = generateWhatsAppMessage(fileURL);

        // Construct the WhatsApp URL with the patient's number and message using the official  API
        const whatsappURL = `https://api.whatsapp.com/send?phone=${patientPhoneNumber}&text=${encodeURIComponent(message)}`;

        // Open WhatsApp in a new tab or window
        window.open(whatsappURL, '_blank');
      } else {
        showMessage('No results file available.');
      }
    })
    .catch((error) => {
      console.error('Error retrieving file URL:', error);
      showMessage('Error retrieving file URL. Please try again.');
    });
});

// Function to generate the WhatsApp message
function generateWhatsAppMessage(fileURL) {
  // Customize the message content here based on the patient's information and the file URL
  const patientName = patient.name; // Replace with the actual patient's name
  const hospitalName = 'Sanyu Hospital'; // Replace with the hospital's name
  const contactNumber = '+256 708 657 717'; // Replace with the hospital's contact number

  // Create the message text with the file URL
  const message = `Hello ${patientName},\n\nThis is ${hospitalName}. We are pleased to share your latest medical results with you. Please click on the link below to access your results:\n\n${fileURL}\n\nFor any questions or assistance, feel free to contact us at ${contactNumber}.\n\nThank you for choosing ${hospitalName} for your healthcare needs. We value your trust and are here to assist you with any medical concerns.\n\nBest regards,\n${hospitalName}`;

  return message;
}



function shareRecord(patient, record) {
  // Get the patient's name, doctor's username, and the test key
  const patientId = patient.patientId;
  const patientName = patient.name;
  const testKey = recordKey;

  // Construct the notification message
  const message = `New Test ${testKey} for patient ${patientName} PI - ${patientId} to be done.`;

  // Construct the message object
  const notification = {
    timestamp: Date.now(),
    message: message
  };

  // Update the chat node in Firebase with the notification
  const chatRef = ref(database, 'laboratory-requests');
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
  // Define the signature popup element
  const signaturePopup = document.getElementById('signaturePopup');
  let signatureData; // Declare signatureData variable at a higher scope

  // Create print button
  const printButton = document.createElement('button');
  printButton.innerHTML = '<i class="fa fa-print"></i> Print Record';
  printButton.classList.add('print-button');

  const overlay2 = document.getElementById('overlay2');

  // Initialize Signature Pad once when the page loads
  const signatureCanvas = document.getElementById('signatureCanvas');
  const signaturePad = new SignaturePad(signatureCanvas, { /* Add options if needed */ });

  const saveSignatureButton = document.getElementById('saveSignature');
  const closeSignatureButton = document.getElementById('closeSignaturePopup');

  saveSignatureButton.addEventListener('click', () => {
    signatureData = signaturePad.toDataURL();
    if (signatureData) {
      // Save the signatureData and close the popup
      signaturePopup.style.display = 'none';
      overlay2.style.display = 'none';
    } else {
      alert('Please provide a signature before saving.');
    }
  });
  const clearSignatureButton = document.getElementById('clearSignature');

  clearSignatureButton.addEventListener('click', () => {
    // Clear the signature
    signaturePad.clear();
  });
  
  closeSignatureButton.addEventListener('click', () => {
    // Clear the signature and close the popup
    signaturePad.clear();
    signaturePopup.style.display = 'none';
    overlay2.style.display = 'none';
  });

  // Add event listener to the print button
  printButton.addEventListener('click', async () => {
    // Get the patient details and latest visit data
    const patient = await getPatientDetails(patientName);
    const latestVisitData = await getLatestVisitData(patientName);
    
    // Display the signature popup when the print button is clicked
    overlay2.style.display = 'block';
    signaturePopup.style.display = 'block';

// Inside your printButton click event listener
if (signatureData) {
  console.log('Latest Visit Data for Printing:', latestVisitData); // Log the latestVisitData
  printRecord(patient, record, visitKeys, visitDetails, latestVisitData);
}
 else {
      alert('Please provide a signature before printing.');
    }
  });

  // Append the print button to the record element
  recordElement.appendChild(printButton);

  // async function to show the signature popup
  async function openSignaturePopup() {
    overlay2.style.display = 'block';
    signaturePopup.style.display = 'block';
  }
// Append the print button to the record element
recordElement.appendChild(printButton);

// Create a WhatsApp share button for medical form details
const whatsappMedicalFormButton = document.createElement('button');
whatsappMedicalFormButton.id = 'whatsappMedicalFormButton';
whatsappMedicalFormButton.innerHTML = '<i class="fa fa-whatsapp"></i>Medical Form';


// Add a click event listener to the WhatsApp medical form button
whatsappMedicalFormButton.addEventListener('click', () => {
  // Replace 'patientPhoneNumber' with the actual WhatsApp number of the patient
  const patientPhoneNumber = patient.parents; // Replace with the correct property name
  const latestVisitData = generateLatestVisitDetailsFromDisplay();

  // Generate the WhatsApp message for the shared medical form
  const message = generateMedicalFormWhatsAppMessage(
    patient,
    latestVisitData,
    medicationTableData,
    testsTakenCell,
    paymentStatusElement,
    resultsObtainedElement,
    followUpData,
    consumablesRow,
    sundriesRow,
    treatmentTotalRow
  );

  // Construct the WhatsApp URL with the patient's number and message
  const whatsappURL = `https://wa.me/${patientPhoneNumber}?text=${encodeURIComponent(message)}`;

  // Open WhatsApp in a new tab or window
  window.open(whatsappURL, '_blank');
});

// Append the WhatsApp medical form share button to the record element
recordElement.appendChild(whatsappMedicalFormButton);

function generateMedicalFormWhatsAppMessage(patient, latestVisitData, medicationTableData, testsTakenElement, paymentStatusElement, resultsObtainedElement, followUpData, consumablesRow, sundriesRow, treatmentTotalRow) {
  // Customize the message content here based on the patient's information, latest visit data, medication details, and the new details

  const patientName = patient.name; // Replace with the actual patient's name
  const latestVisitDetails = generateLatestVisitDetailsFromDisplay(latestVisitData);
  const medicationDetails = generateMedicationDetails(medicationTableData);

  const testsTaken = `Tests Taken: ${testsTakenElement.textContent}`;
  const paymentStatus = `Test Payment: ${paymentStatusElement.textContent}`;
  const resultsObtained = `Test Results Status: ${resultsObtainedElement.textContent}`;
  const followUp = `Follow Up Date & Time: ${followUpData.textContent}`;
  const consumablesPrice = `Consumables Price (UGX): ${consumablesRow.lastChild.textContent}`;
  const sundriesPrice = `Sundries Price (UGX): ${sundriesRow.lastChild.textContent}`;
  const treatmentTotal = `Treatment Total (UGX): ${treatmentTotalRow.lastChild.textContent}`;

  // Create the message text
  const message = `Hello ${patientName},\n\nMedical Form Details:\n${latestVisitDetails}\n\nMedication Details:\n${medicationDetails}\n\nAdditional Details:\n${testsTaken}\n${paymentStatus}\n${resultsObtained}\n${followUp}\n${consumablesPrice}\n${sundriesPrice}\n${treatmentTotal}\n\nThank you for choosing our healthcare services. If you have any questions or need further assistance, please feel free to contact us.`;

  return message;
}





function generateLatestVisitDetails(latestVisitData) {
  if (latestVisitData) {
    // Customize this based on the fields you want to include
    const date = formatDate(latestVisitData.timestamp);
    const clinicianName = latestVisitData.clinicianName || 'N/D';
    const temperature = latestVisitData.temperature || 'N/D';
    const bp = latestVisitData.bp || 'N/D';
    // Add more fields as needed

    return `Date: ${date}\nClinician's Name: ${clinicianName}\nTemperature: ${temperature}\nBP: ${bp}\n`;
  } else {
    return 'Latest visit data not available.';
  }
}


function generateMedicationDetails(medicationTableData) {
  if (medicationTableData.length > 0) {
    // Customize this based on the medication details format
    const details = medicationTableData.map((medication) => {
      const medicationName = medication.medication;
      const prescription = medication.prescription;
      const grams = medication.grams;
      return `${medicationName}: Prescription - ${prescription}, Milligrams - ${grams}`;
    });

    return details.join('\n');
  } else {
    return 'No medication details available.';
  }
}


function generateLatestVisitDetailsFromDisplay() {
  const visitDetailsContainer = document.querySelector('.visit-details-container');
  const date = visitDetailsContainer.querySelector("p:nth-child(1)").textContent;
  const clinicianName = visitDetailsContainer.querySelector("p:nth-child(2)").textContent;
  const temperature = visitDetailsContainer.querySelector("p:nth-child(3)").textContent;
  const bp = visitDetailsContainer.querySelector("p:nth-child(4)").textContent;
  const rr = visitDetailsContainer.querySelector("p:nth-child(5)").textContent;
  const hr = visitDetailsContainer.querySelector("p:nth-child(6)").textContent;
  const sp02 = visitDetailsContainer.querySelector("p:nth-child(7)").textContent;
  const wt = visitDetailsContainer.querySelector("p:nth-child(8)").textContent;
  const ht = visitDetailsContainer.querySelector("p:nth-child(9)").textContent;
  const bmi = visitDetailsContainer.querySelector("p:nth-child(10)").textContent;
  const muac = visitDetailsContainer.querySelector("p:nth-child(11)").textContent;
  const weightForAgeZScore = visitDetailsContainer.querySelector("p:nth-child(12)").textContent;
  const disability = visitDetailsContainer.querySelector("p:nth-child(13)").textContent;
  const chronicIllness = visitDetailsContainer.querySelector("p:nth-child(14)").textContent;
  const drugAbuse = visitDetailsContainer.querySelector("p:nth-child(15)").textContent;
  const allergies = visitDetailsContainer.querySelector("p:nth-child(16)").textContent;

  // Return all the extracted details
  return `${date}\n${clinicianName}\n${temperature}\n${bp}\n${rr}\n${hr}\n${sp02}\n${wt}\n${ht}\n${bmi}\n${muac}\n${weightForAgeZScore}\n${disability}\n${chronicIllness}\n${drugAbuse}\n${allergies}`;
}

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
// Print the heading "LABORATORY REPORT"
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
  ['Patient Name', patient.name, '' + recordKey],
  ['Date of Birth', patient.dob, '' + dateTakenCell.textContent],
  ['Payment Type', patient.payment, '' +  testsTakenCell.textContent],
  ['Residence', patient.residence, '' +  paymentStatusElement.innerText],
  ['Contact', patient.parents, '' +  resultsObtainedElement.innerText],
  ['Patient ID', patient.patientId, ''  + additionalNotesElement.innerText]
  
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
    
    medicationTableData.push([medication, prescription]);
  }
}

doc.autoTable({
  startY: 200,
  head: [['Medication', 'Prescription']],
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

  // Use the saved signatureData for the doctor's signature
  if (signatureData) {
    const signatureImage = new Image();
    signatureImage.src = signatureData;
    const signatureImageX = 50;
    const signatureImageY = doc.internal.pageSize.getHeight() - 30;
    doc.addImage(signatureImage, 'PNG', signatureImageX, signatureImageY, 45, 20);
  }

  // Print the document
  doc.autoPrint();

  // Open the print dialog
  doc.output('dataurlnewwindow');
}

// Create a button for printing the test invoice
const printInvoiceButton = document.createElement('button');
printInvoiceButton.textContent = 'Print TI';
printInvoiceButton.classList.add('button', 'print-invoice-button');
// Create an icon element (e.g., using Font Awesome)
const invoiceIcon = document.createElement('i');
invoiceIcon.classList.add('fas', 'fa-file-invoice');

// Append the icon to the button
printInvoiceButton.appendChild(invoiceIcon);

// Add an event listener to the "Print Test Invoice" button
printInvoiceButton.addEventListener('click', () => {
  printTestInvoice(patient.name, patient.patientId, recordKey, record.testsTaken, recordKey); // Modify these arguments as needed
});

// Append the "Print Test Invoice" button to the record element
recordElement.appendChild(printInvoiceButton);
function printTestInvoice(patientName, patientId, recordKey, testName) {
  
// Inside the printTestInvoice function, pass the recordKey to generateInvoiceNumber
const invoiceNumber = generateInvoiceNumber(recordKey);

// Create the content to be printed as a test invoice, including hospital credentials
const invoiceContent = `
  <div class="invoice">
    <div class="invoice-header">
      <h2>Sanyu Hospital</h2>
      <p>Katooke</p>
      <p>Wakiso District (Uganda)</p>
      <p>Phone: +256 708 657 717</p>
      <p>Email: sanyuhospital@gmail.com</p>
    </div>
    <div class="invoice-details">
      <h1>Test Invoice</h1>
      <p><strong>Invoice Ref:</strong> ${invoiceNumber}<p>
      <p><strong>Invoice Date:</strong> ${getCurrentDate()}</p>
      <p><strong>Patient Name:</strong> ${patientName}</p>
      <p><strong>Patient ID:</strong> ${patientId}</p>
      <p><strong>Test Name:</strong> ${testName}</p>
      <p><strong>Record Key:</strong> ${recordKey}</p>
    </div>
    <div class="watermark">
      <img src="sanyu.png" alt="Watermark" class="watermark-image">
    </div>
  </div>
`;

// Create a new window for printing
const printWindow = window.open('', '', 'width=600,height=600');

// Set the content of the print window
printWindow.document.open();
printWindow.document.write(`<style>${invoiceStyles}</style>`);
printWindow.document.write(invoiceContent);
printWindow.document.close();

// Print the window
printWindow.print();
}

// Generate the invoice number as the same value as the record key
function generateInvoiceNumber(recordKey) {
  return `${recordKey}`;
}

// Get the current date in a formatted string
function getCurrentDate() {
  const currentDate = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return currentDate.toLocaleDateString(undefined, options);
}

const invoiceStyles = `
  .invoice {
    font-family: Arial, sans-serif;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    margin: 0 auto;
    padding: 20px;
    width: 80%;
  }

  .invoice-header {
    text-align: left;
  }

  .invoice-header h2 {
    font-size: 24px;
    margin: 0;
  }

  .invoice-header p {
    font-size: 16px;
    margin: 5px 0;
  }

  .invoice-details {
    text-align: right;
  }

  .invoice-details h1 {
    font-size: 28px;
  }

  .invoice-details p {
    font-size: 18px;
    margin: 5px 0;
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

`;

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
// Append the WhatsApp share button to the record element
recordElement.appendChild(whatsappShareButton);

// Create delete button
/*
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
finnishButton.textContent = 'Add Results';
finnishButton.classList.add('finnish-button');

// Retrieve the addMedicationForm element
const addMedicationForm = document.getElementById('addMedicationForm');

finnishButton.addEventListener('click', () => {
  // Remove the existing record key input from the form
  const existingRecordKeyInput = addMedicationForm.querySelector('input[name="recordKey"]');
  if (existingRecordKeyInput) {
    existingRecordKeyInput.remove();
  }

  // Get the record key
  const recordKey = recordKeyElement.textContent.replace('Record Key: ', '');

  const overlay = document.createElement('div');
  overlay.classList.add('overlay3');

  const popup = document.createElement('div');
  popup.classList.add('popup3');

  const closeButton = document.createElement('button');
  closeButton.textContent = 'X';
  closeButton.classList.add('close-button');

  const heading = document.createElement('h2');
  heading.textContent = 'Add Medical Record';
  popup.appendChild(closeButton);
  popup.appendChild(heading);

  // Store the record key in a hidden input field within the form
  const recordKeyInput = document.createElement('input');
  recordKeyInput.type = 'hidden';
  recordKeyInput.name = 'recordKey';
  recordKeyInput.value = recordKey;
  addMedicationForm.appendChild(recordKeyInput);

  popup.appendChild(addMedicationForm);

  // Append the overlay and popup to the document body
  document.body.appendChild(overlay);
  document.body.appendChild(popup);

  // Show the overlay and popup
  overlay.style.display = 'block';
  popup.style.display = 'block';

  // Close button event listener
  closeButton.addEventListener('click', () => {
    // Clear the form fields
    document.getElementById('resultsObtained').value = '';
    document.getElementById('additionalNotes').value = '';

    // Hide the overlay and popup
    overlay.style.display = 'none';
    popup.style.display = 'none';
  });
});

  // Append the Finnish button to the record element
  recordElement.appendChild(finnishButton);

  // Append the delete button to the record element
recordElement.appendChild(deleteButton);
  recordKeyElement.setAttribute('data-record-key', recordKey);
*/
  return recordElement;
}
/*
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
 */

// Automatically generate the barcode when the patient details are displayed
//generateBarcode();

};



// Get the lab requests popup elements
const listPopupOverlay = document.getElementById('listPopupOverlay');
// Variable to store the latest lab request message
let listMessage = null;

// Function to display a browser notification
function showNotification(message) {
  if (Notification.permission === 'granted') {
    const notification = new Notification('New waiting Request', {
      body: message,
    });

    // Close the notification after a few seconds
    setTimeout(notification.close.bind(notification), 9000);
  } else if (Notification.permission !== 'denied') {
    // Request permission to display notifications
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        showNotification(message);
      }
    });
  }
}

 // Function to retrieve and display lab requests from Firebase
function retrieveAndDisplaylist() {
  const waitinglist = document.getElementById('waitinglist');
  waitinglist.innerHTML = ''; // Clear previous lab requests

  const chatRef = ref(database, 'waiting-list');
  onValue(chatRef, (snapshot) => {
    try {
      if (snapshot.exists()) {
        let listCount = 0;

        // Add event listeners to the filter buttons
        const notseen = document.getElementById('notseen');
        const seen = document.getElementById('seen');

        notseen.addEventListener('click', () => {
          applyFilter('Not Yet Done');
        });

        seen.addEventListener('click', () => {
          applyFilter('Completed');
        });

        // Function to apply the filter
        function applyFilter(filter) {
          const waitinglist = document.getElementById('waitinglist');
          const waitinglistItems = waitinglist.querySelectorAll('li');

          waitinglistItems.forEach((item) => {
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

        const messages = [];
        snapshot.forEach((childSnapshot) => {
          const messageId = childSnapshot.key;
          const patient = childSnapshot.val().name;
          const status = childSnapshot.val().status || 'Not Yet Done';
          const timestamp = childSnapshot.val().date || '';
          const listItem = document.createElement('li');
          listItem.id = messageId; // Set the ID to the message ID
          listItem.setAttribute('data-status', status); // Set the "data-status" attribute

          // Create the message content with "Mark as Done" button
          const messageContent = document.createElement('span');
          messageContent.textContent = patient;
          listItem.appendChild(messageContent);

          // Create the "Mark as Done" button
          const messageStatus = document.createElement('span');
          messageStatus.textContent = status + (timestamp ? ' - ' + formatDate(timestamp) : '');
          messageStatus.classList.add('time-status'); // Add the CSS class to the span element
          listItem.appendChild(messageStatus);

          // Create the "Done" button
          const markAsDoneBtn2 = document.createElement('button');
          markAsDoneBtn2.textContent = 'Seen';
          markAsDoneBtn2.classList.add('button-done'); // Add the CSS class to the button
          markAsDoneBtn2.addEventListener('click', () => {
            markpatientAsDone(messageId);
          });
          //listItem.appendChild(markAsDoneBtn2);

          // Add each message to the beginning of the array
          messages.unshift(listItem);

          if (status === 'Not Yet Done') {
            listCount++;
            messageStatus.style.color = 'red';
            // Update the latest lab request message
            listMessage = name;
          } else if (status === 'Completed') {
            markAsDoneBtn2.style.display = 'none';
          }
        });

        // Append the reversed array of messages to the waiting list
        messages.forEach((message) => {
          waitinglist.appendChild(message);
        });

        // Show a notification for the latest message (if there is any latest message)
        if (listMessage) {
          showNotification(listMessage);
        }

        // Display the count of not yet done messages
        const listCountSpan = document.getElementById('listCount');
        listCountSpan.textContent = listCount;
      } else {
        const listItem = document.createElement('li');
        listItem.textContent = 'No lab requests found.';
        waitinglist.appendChild(listItem);
      }
    } catch (error) {
      console.error('Error retrieving lab requests:', error);
      showMessage('Error retrieving lab requests:', error);
    }
  });
}


// Attach click event to the envelope icon to open the lab requests popup
const list = document.getElementById('list');
let listListener; // Variable to store the event listener

list.addEventListener('click', () => {
  // Retrieve and display lab requests from Firebase
  retrieveAndDisplaylist();

  openlistPopup();
});

// Call the retrieveAndDisplayLabRequests function on page load
document.addEventListener('DOMContentLoaded', () => {
  retrieveAndDisplaylist();
});

function markpatientAsDone(messageId) {
  // Update the message status in Firebase
  const listRef = ref(database, `waiting-list/${messageId}`);
  update(listRef, { status: 'Completed', timestamp: Date.now() })
    .then(() => {
      console.log('Message marked as done successfully!');
      // Clear the whole list and reload new messages
      retrieveAndDisplaylist();
    })
    .catch((error) => {
      console.error('Error marking message as done:', error);
      showMessage('Error marking message as done:', error);
    });
}

// Function to format a timestamp in a human-readable format
//function formatDate(timestamp) {
 // const date = new Date(timestamp);
 // const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  //return date.toLocaleString(undefined, options);
//}

// Function to open the lab requests popup
function openlistPopup() {
  const listPopupOverlay = document.getElementById('listPopupOverlay');
  listPopupOverlay.style.display = 'block';
}

// Function to close the lab requests popup
function closelistPopup() {
  const listPopupOverlay = document.getElementById('listPopupOverlay');
  listPopupOverlay.style.display = 'none';
}

// Attach click event to the close button to close the lab requests popup
const listPopupClose = document.getElementById('listPopupClose');
listPopupClose.addEventListener('click', closelistPopup);

// Close the lab requests popup when clicking outside the popup content
window.addEventListener('click', (event) => {
  const listPopupOverlay = document.getElementById('listPopupOverlay');
  if (event.target === listPopupOverlay) {
    closelistPopup();
  }
});
/*
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
*/




//end of waiting list 





// Get the lab requests popup elements
const labRequestsPopupOverlay = document.getElementById('listPopupOverlay');
// Variable to store the latest lab request message
let latestLabRequestMessage = null;

const labResultShownMessages = new Set(); // Set to keep track of shown lab result messages

// Function to play a lab result notification sound without displaying a message
function playLabResultNotificationSound() {
  // Play a sound (replace 'lab-notification.mp3' with your desired sound file)
  const audio = new Audio('');
  audio.play();
}

// Function to display a lab result browser notification and play a sound
function showLabResultNotification(message, messageId) {
  if (!labResultShownMessages.has(messageId)) {
    // Play the lab result notification sound
    playLabResultNotificationSound();

    // Add the message ID to the set of shown lab result messages
    labResultShownMessages.add(messageId);
  }
}

// Array to cache lab result messages
const labResultMessagesCache = [];


// Function to retrieve and display lab requests from Firebase
function retrieveAndDisplayLabRequests() {
  const labRequestsList = document.getElementById('labRequestsList');
  labRequestsList.innerHTML = ''; // Clear previous lab requests

  const chatRef = ref(database, 'lab-results');
  onValue(chatRef, (snapshot) => {
    try {
      if (snapshot.exists()) {
        let notDoneCount = 0;
        const messages = [];

        // Initialize variables to track latest message
        let latestLabRequestMessage = null;
        let latestLabRequestTimestamp = null;

        snapshot.forEach((childSnapshot) => {
          const messageId = childSnapshot.key;
          const labRequest = childSnapshot.val().message;
          const status = childSnapshot.val().status || 'Not Yet Done';
          const timestamp = childSnapshot.val().timestamp || '';

          // Check if the timestamp matches the current time
          const currentTime = new Date();
          const messageTime = new Date(timestamp);

          if (messageTime.getTime() === currentTime.getTime()) {
            // Show a notification for the current time lab request message
            showLabResultNotification(labRequest, messageId);
          }

          const listItem = document.createElement('li');
          listItem.id = messageId; // Set the ID to the message ID
          listItem.setAttribute('data-status', status); // Set the "data-status" attribute

          // Create the message content with "Mark as Done" button
          const messageContent = document.createElement('span');
          messageContent.textContent = labRequest;
          listItem.appendChild(messageContent);

          // Create the "Done" button
          const messageStatus = document.createElement('span');
          messageStatus.textContent = status + (timestamp ? ' - ' + formatDate(timestamp) : '');
          messageStatus.classList.add('time-status'); // Add the CSS class to the span element
          listItem.appendChild(messageStatus);

          // Create the "Mark as Done" button
          const markAsDoneBtn = document.createElement('button');
          markAsDoneBtn.textContent = 'Clear';
          markAsDoneBtn.classList.add('button-done'); // Add the CSS class to the button
          markAsDoneBtn.addEventListener('click', () => {
            markMessageAsDone(messageId);
          });
          listItem.appendChild(markAsDoneBtn);

          // Add each message to the beginning of the array
          messages.unshift(listItem);

          if (status === 'Not Yet Done') {
            notDoneCount++;
            messageStatus.style.color = 'red';
            // Update the latest lab request message and timestamp
            if (!latestLabRequestTimestamp || messageTime > latestLabRequestTimestamp) {
              latestLabRequestMessage = labRequest;
              latestLabRequestTimestamp = messageTime;
            }
          } else if (status === 'Completed') {
            markAsDoneBtn.style.display = 'none';
          }
        });

        // Append the reversed array of messages to the lab requests list
        messages.forEach((message) => {
          labRequestsList.appendChild(message);
        });

        // Show a notification for the latest message (if there is any latest message)
        if (latestLabRequestMessage) {
          showLabResultNotification(latestLabRequestMessage);
        }

        // Display the count of not yet done messages
        const notDoneCountSpan = document.getElementById('notDoneCount');
        notDoneCountSpan.textContent = notDoneCount;
      } else {
        const noLabRequestsItem = document.createElement('li');
        noLabRequestsItem.textContent = 'No lab results found.';
        labRequestsList.appendChild(noLabRequestsItem);
      }
    } catch (error) {
      console.error('Error retrieving lab results:', error);
      showMessage('Error retrieving lab results:', error);
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
  const messageRef = ref(database, `lab-results/${messageId}`);
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
//function formatDate(timestamp) {
 // const date = new Date(timestamp);
 // const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
  //return date.toLocaleString(undefined, options);
//}

// Function to open the lab requests popup
function openLabRequestsPopup() {
  const labRequestsPopupOverlay = document.getElementById('labRequestsPopupOverlay');
  labRequestsPopupOverlay.style.display = 'block';
}

// Function to close the lab requests popup
function closeLabRequestsPopup() {
  const labRequestsPopupOverlay = document.getElementById('labRequestsPopupOverlay');
  labRequestsPopupOverlay.style.display = 'none';
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
  medicationLabel.textContent = 'Medication:';
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
  }
});
// Prescription label
const prescriptionLabel = document.createElement('label');
  prescriptionLabel.textContent = 'Prescription:';
  prescriptionLabel.setAttribute('for', 'prescriptionInput');


  const prescriptionInput = document.createElement('select');
  prescriptionInput.required = true;

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
addMedicationButton.addEventListener('click', () => {
  const medicationInput = createMedicationInput();
  const medicationContainer = document.getElementById('medication');
  medicationContainer.appendChild(medicationInput);

 // Initialize Select2 for the new medication input
 $(medicationInput).find('select').select2({
    dropdownParent: medicationInput
  });
});


// Update the total cost when grams input changes
const medicationInputs = document.querySelectorAll('.medication-input-container');
medicationInputs.forEach((medicationInput) => {
  const gramsInput = medicationInput.querySelector('input[type="number"]');

});




const addRecordForm = document.getElementById('addRecordForm');
let currentPatientName = '';


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

      // Clear medication inputs
      const medicationContainer = document.getElementById('medicationInputsContainer');
      medicationContainer.innerHTML = '';

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
// JavaScript code to set the current date in the popup
const currentDateElement = document.getElementById('currentDate');
if (currentDateElement) {
    const currentDate = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    currentDateElement.textContent = currentDate.toLocaleDateString(undefined, options);
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

// Array to store timestamps of all messages retrieved
let messageTimestamps = [];

// Get the last opened timestamp from local storage
const lastOpenedTimestamp = localStorage.getItem('lastOpenedTimestamp');

const updateUnreadMessageCount = () => {
  const unreadMessageCount = messageTimestamps.filter(timestamp => timestamp > lastOpenedTimestamp).length;
  const spanCount = document.getElementById('unreadMessageCount');
  spanCount.textContent = unreadMessageCount.toString();
};

let lastSeenTimestamp = 0;

// Listen for new messages
onValue(messagesRef, (snapshot) => {
  if (snapshot.exists()) {
    snapshot.forEach((childSnapshot) => {
      const messageId = childSnapshot.key;
      const message = childSnapshot.val();

      // Store the timestamp of the message
      messageTimestamps.push(message.timestamp);

      // Display the message only if it's not already displayed
      if (!displayedMessageIds.includes(messageId)) {
        displayChatMessage(message);
        playMessageSound(message.sender);
        displayedMessageIds.push(messageId);
      }
    });

    // Update unread message count after processing all new messages
    updateUnreadMessageCount();
  }
});

const openChatBtn = document.getElementById('openChatBtn');

// Event listener for opening the chat room button
openChatBtn.addEventListener('click', () => {
  // Reset span count to 0
  const spanCount = document.getElementById('unreadMessageCount');
  spanCount.textContent = '0';

  // Register the time and date when the chat room is opened
  const lastOpenedTimestamp = new Date().toISOString();
  localStorage.setItem('lastOpenedTimestamp', lastOpenedTimestamp);

  // Display chat room
  chatOverlay.style.display = 'block';
  chatContainer.style.display = 'block';
});


// Rest of your code...





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
// Request permission for notifications when the page loads
document.addEventListener('DOMContentLoaded', (event) => {
  if (Notification.permission !== 'granted') {
    Notification.requestPermission();
  }
});

// Assuming currentPageSender is defined elsewhere in your code
 const currentPageSender = 'Patients Reception'; // Example

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
    if (message.sender === 'Patients Reception') {
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




// Function to play message sound and update span count
function playMessageSound(sender) {
  if (sender === 'Patients Reception') {
    messageSentAudio.play();
  } else {
    newMessageAudio.play();
    // Increment span count
   // const spanCount = document.getElementById('unreadMessageCount');
    //spanCount.textContent = parseInt(spanCount.textContent) + 1;
  }
}

// Array to store IDs of displayed messages


// Event listener for the Send button
sendMessageBtn.addEventListener('click', sendMessage);

// Event listener for the Enter key in the input field
messageInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

// Function to send the message
function sendMessage() {
  const messageText = messageInput.value.trim();
  if (messageText !== '') {
    const sender = 'Patients Reception'; // You can replace 'User' with the actual username or user ID
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




    // Ensure the DOM is fully loaded before adding event listeners
    document.addEventListener('DOMContentLoaded', function() {
      // Get a reference to the button
      const confirmPaymentBtnClone = document.getElementById('confirmPaymentBtnClone');

      // Function to handle closing of the confirmation popup
      function closeConfirmationPopup() {
        const confirmationPopupClone = document.getElementById('confirmationPopupClone');
        confirmationPopupClone.style.display = 'none';

        // Remove event listener from the confirm payment button
        confirmPaymentBtnClone.removeEventListener('click', confirmPaymentAction2);
      }

      // Confirm payment action
      function confirmPaymentAction2(event) {
        //console.log('Button clicked'); // Debugging line
        event.preventDefault();
        
        const patientIdInputClone = document.getElementById('patientIdInputClone');
        const departmentSelectClone = document.getElementById('departmentClone');
        const paymentModeSelectClone = document.getElementById('paymentModeClone');
        const consumablesInputClone = document.getElementById('consumablesClone');
        
        const totalCostClone = parseFloat(consumablesInputClone.value);
        const patientIdClone = patientIdInputClone.value;

        // Construct the sales receipt object
        const salesReceipt = {
          totalAmount: totalCostClone,
          patientId: patientIdClone,
          department: departmentSelectClone.value,
          paymentMode: paymentModeSelectClone.value,
          timestamp: Date.now(),
        };

        // Upload the sales receipt to the database
        const salesReceiptsRef = ref(database, 'salesReceipts');
        push(salesReceiptsRef, salesReceipt)
          .then(() => {
            showMessage('Sales receipt uploaded successfully');

            // Close the popup and remove event listener
            closeConfirmationPopup();

            // Reset all fields
            consumablesInputClone.value = '';
            patientIdInputClone.value = '';
            departmentSelectClone.value = '';
            paymentModeSelectClone.value = '';

            // Reset the total element
            updateTotal();

          })
          .catch((error) => {
            showMessage('Error uploading sales receipt:', error);
          });
      }

      // Add event listener for button click
      confirmPaymentBtnClone.addEventListener('click', confirmPaymentAction2);
    });




document.addEventListener('DOMContentLoaded', function () {
  const callButton = document.getElementById('callButton');
  const callModal = document.getElementById('callModal');
  const closeModal = document.querySelector('.modal-content .close');
  const receptionButton = document.getElementById('receptionButton');
  const labButton = document.getElementById('labButton');
  const doctorRoomButton = document.getElementById('doctorRoomButton');

  // Audio for notification sound
  const notificationSound = new Audio('ring.mp3');

  callButton.addEventListener('click', function () {
    // Display the modal
    callModal.style.display = 'block';
  });

  closeModal.addEventListener('click', function () {
    // Hide the modal
    callModal.style.display = 'none';
  });

  window.addEventListener('click', function (event) {
    if (event.target == callModal) {
      // Hide the modal if the user clicks outside of it
      callModal.style.display = 'none';
    }
  });

  function makeCall(destination) {
    // Check if there is already a call node
    const callsRef = ref(database, 'calls');
    get(callsRef).then((snapshot) => {
      const existingCall = snapshot.val();
      if (existingCall) {
        // Update the existing call node
        update(ref(database, `calls/${Object.keys(existingCall)[0]}`), {
          status: 'calling',
          destination: destination,
          timestamp: Date.now()
        }).then(() => {
          console.log('Call node updated successfully.');
          callModal.style.display = 'none'; // Hide the modal after successful update
          playNotificationSound(); // Play notification sound
        }).catch((error) => {
          console.error('Error updating call node:', error);
        });
      } else {
        // Create a new call node if none exists
        const callNodeRef = push(callsRef);
        set(callNodeRef, {
          status: 'calling',
          destination: destination,
          timestamp: Date.now()
        }).then(() => {
          console.log('Call node created successfully.');
          callModal.style.display = 'none'; // Hide the modal after successful creation
          playNotificationSound(); // Play notification sound
        }).catch((error) => {
          console.error('Error creating call node:', error);
        });
      }
    }).catch((error) => {
      console.error('Error fetching calls:', error);
    });
  }

  receptionButton.addEventListener('click', function () {
    makeCall('Reception');
  });

  labButton.addEventListener('click', function () {
    makeCall('Lab');
  });

  doctorRoomButton.addEventListener('click', function () {
    makeCall('Doctor\'s Room');
  });

  // Function to play notification sound
  function playNotificationSound() {
    // Check if the sound is muted
    if (!notificationSound.muted) {
      // Play the notification sound
      notificationSound.play().catch((error) => {
        console.error('Error playing notification sound:', error);
      });
    }
  }
});



