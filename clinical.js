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




const medicationTakenSelect = document.getElementById('medicationTaken');

// Retrieve medicines from Firebase and populate the select options
const medicinesRef = ref(database, 'tests');
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
});


// Get references to the necessary elements
const uploadPrescriptionsButton = document.getElementById('uploadPrescriptionsButton');
const overlay = document.getElementById('overlay');
const popupContainer = document.getElementById('uploadPrescriptionsPopup');
const closePopupButton = document.getElementById('closePopupButton');
const prescriptionsForm = document.getElementById('prescriptionsForm');

// Function to show the popup and overlay
const showPopup = () => {
  overlay.style.display = 'block';
  popupContainer.style.display = 'block';
};

// Function to hide the popup and overlay
const hidePopup = () => {
  overlay.style.display = 'none';
  popupContainer.style.display = 'none';
};

// Function to handle form submission
const handleFormSubmit = (e) => {
  e.preventDefault();
// Get the prescription value
const prescription = document.getElementById('prescription').value;

// Send the prescription to Firebase
const prescriptionsRef = ref(database, `prescriptions/${prescription}`);
set(prescriptionsRef, { prescription })
  .then(() => {
    // Clear the prescription field
    document.getElementById('prescription').value = '';
    // Close the popup
    hidePopup();
    // Show success message (replace this with your desired success message display)
    alert('Prescription uploaded successfully!');
  })
  .catch((error) => {
    console.error('Error uploading prescription:', error);
    // Show error message (replace this with your desired error message display)
    alert('Error uploading prescription. Please try again.');
  });

};

// Event listener for the "Upload Prescriptions" button
uploadPrescriptionsButton.addEventListener('click', showPopup);

// Event listener for the close button
closePopupButton.addEventListener('click', hidePopup);

// Event listener for the overlay (to close the popup when clicked outside)
overlay.addEventListener('click', hidePopup);

// Event listener for form submission
prescriptionsForm.addEventListener('submit', handleFormSubmit);



const form = document.querySelector('.popup-form');
const submitButton = document.querySelector('.popup-form button');
const patientsContainer = document.getElementById('patients');
let patients = []; // Declare patients variable outside the event listener
let patientCount = 1; // Initialize patient count
form.addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim(); // Remove leading and trailing spaces
  const dob = document.getElementById('dob').value;
 // const parents = document.getElementById('parents').value;
 // const residence = document.getElementById('residence').value;
  //const payment = document.getElementById('payment').value;
  const sex = document.getElementById('sex').value;
  //const patientId = `PI - ${patientCount.toString().padStart(3, '0')}`; // Generate patient ID

  const patientData = {
    name: name,
    dob: dob,
 //   parents: parents,
 //   residence: residence,
  ///  payment: payment,
    sex: sex,
 //   patientId: patientId
  };

  const patientsRef = ref(database, 'tests');
  const newPatientRef = child(patientsRef, name); // Use patient name as the key

  // Check if patient with the same name already exists
  get(newPatientRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        // Display an alert if patient with the same name already exists
        alert('Test with the same name already exists.');
      } else {
        // Save the new patient data
        set(newPatientRef, patientData)
          .then(() => {
            form.reset();
            showMessage('Test details uploaded successfully!');
            patientCount++; // Increment patient count
          })
          .catch((error) => {
            console.error('Error uploading patient details:', error);
            showMessage('Error uploading test details. Please try again.');
          });
      }
    })
    .catch((error) => {
      console.error('Error checking if test exists:', error);
      showMessage('Error checking if test exists. Please try again.');
    });
});



// Rest of the code...

// Add event listener to search button
searchButton.addEventListener('click', () => {
  const searchTerm = searchInput.value.trim(); // Get the search term

  // Show the loader
  loaderElement.classList.remove('hidden');

  // Clear the patients container
  patientsContainer.innerHTML = '';

  // Search through Firebase for patient names by key
  const patientsRef = ref(database, 'tests');
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
      patientsContainer.innerHTML = '<p class="no-results">No Tests found.</p>';
    }
  });
});

function renderPatients(patients) {
  
  patientsContainer.innerHTML = '';

// Create the table element
const table = document.createElement('table');
table.classList.add('patient-table');

// Create the table header row
const tableHeaderRow = document.createElement('tr');
tableHeaderRow.classList.add('table-header');

// Define the table header columns
const headers = ['Name',  'Test Case','Cost (UGX)', 'Actions'];

// Create the table header cells
headers.forEach(headerText => {
  const tableHeaderCell = document.createElement('th');
  tableHeaderCell.textContent = headerText;
  tableHeaderRow.appendChild(tableHeaderCell);
});

// Append the header row to the table
table.appendChild(tableHeaderRow);

patients.forEach(patient => {
  // Create a table row for each patient
  const tableRow = document.createElement('tr');
  tableRow.classList.add('table-row');

  // Create the table cells for patient information
  const nameCell = createTableCell(patient.name);
 // const residenceCell = createTableCell(patient.residence);
 // const paymentCell = createTableCell(patient.payment);
  const sexCell = createTableCell(patient.sex);
 // const patientIdCell = createTableCell(patient.patientId);
 // const parentsCell = createTableCell(patient.parents);
  const dobCell = createTableCell(patient.dob);
  
  // Calculate the age based on the date of birth
  const dob = new Date(patient.dob);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  const ageCell = createTableCell(age.toString());

// Create the actions cell with the delete button
const actionsCell = document.createElement('td');
const deleteButton = document.createElement('button');
deleteButton.textContent = 'Delete';
deleteButton.classList.add('delete-button');
deleteButton.addEventListener('click', function() {
  const confirmed = confirm("Are you sure you want to delete this test?");
  if (confirmed) {
    const password = prompt("Please enter the password to confirm:");
    // Replace 'YOUR_PASSWORD' with the actual password for confirmation
    if (password === 'mm') {
      // Remove the patient from Firebase
      const patientRef = ref(database, 'tests/' + patient.name);
      remove(patientRef)
        .then(() => {
          // Patient successfully deleted
          console.log('Test deleted successfully');
        })
        .catch(error => {
          // An error occurred while deleting the patient
          console.log('Error deleting test:', error);
        });
    } else {
      // Incorrect password entered
      alert('Incorrect password. Deletion canceled.');
    }
  } else {
    // Deletion canceled by the user
    console.log('Deletion canceled by the user');
  }
});
actionsCell.appendChild(deleteButton);


  // Append the cells to the table row
  tableRow.appendChild(nameCell);
 // tableRow.appendChild(residenceCell);
 // tableRow.appendChild(paymentCell);
  tableRow.appendChild(sexCell);
 // tableRow.appendChild(patientIdCell);
 // tableRow.appendChild(parentsCell);
  tableRow.appendChild(dobCell);
 // tableRow.appendChild(ageCell);
  tableRow.appendChild(actionsCell);

  // Append the row to the table
  table.appendChild(tableRow);
});



// Append the table to the patients container
patientsContainer.appendChild(table);

function createTableCell(text) {
  const cell = document.createElement('td');
  cell.textContent = text;
  return cell;
}

}

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

  // Generate current timestamp
  const dateTaken = Date.now();

  const recordData = {
    testsTaken: testsTaken,
    resultsObtained: resultsObtained,
    medicationTaken: medicationTaken,
    additionalNotes: additionalNotes,
    dateTaken: dateTaken
  };

  const patientRef = ref(database, `tests/${patientName}`);
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
    <h3>Test Details:</h3>
    <p><strong>Test Name:</strong> ${patient.name}</p>
    <p><strong>Cost:</strong> ${patient.dob}</p>
    <p><strong>Test Case:</strong> ${patient.sex}</p>
    <!-- Add more patient details as needed -->
     <button class="edit-button"><i class="fa fa-edit"></i>Edit</button>
        <button class="print-button"><i class="fa fa-print"></i>Print Details</button>
        <button class="del-button"><i class="fa fa-trash"></i>Delete Test</button>
  </div>
`;


  patientDetails.innerHTML = patientDetailsHTML;


  

  const patientHistoryElement = document.getElementById('patientHistory');

// Retrieve and display the patient's history
const patientName = patient.name; // Replace this with the patient's name
const patientHistoryRef = ref(database, `tests/${patientName}/history`);
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

function createRecordElement(recordKey, record) {
  const recordElement = document.createElement('div');
  recordElement.classList.add('record');

  const recordKeyElement = document.createElement('h4');
  recordKeyElement.textContent = 'Record Key: ' + recordKey;
  recordElement.appendChild(recordKeyElement);

  const dateTakenElement = document.createElement('p');
  const dateTaken = new Date(parseInt(record.dateTaken));
  if (!isNaN(dateTaken.getTime())) { // Check if the date is valid
    dateTakenElement.textContent = 'Date Taken: ' + dateTaken.toLocaleString();
  } else {
    dateTakenElement.textContent = 'Invalid Date';
  }
  recordElement.appendChild(dateTakenElement);

  const testsTakenElement = document.createElement('p');
  testsTakenElement.textContent = 'Tests Taken: ' + record.testsTaken;
  recordElement.appendChild(testsTakenElement);

  const resultsObtainedElement = document.createElement('p');
  resultsObtainedElement.textContent = 'Results Obtained: ' + record.resultsObtained;
  recordElement.appendChild(resultsObtainedElement);

  const medicationTakenElement = document.createElement('p');
  medicationTakenElement.textContent = 'Medication Taken: ' + record.medicationTaken;
  recordElement.appendChild(medicationTakenElement);

  const additionalNotesElement = document.createElement('p');
  additionalNotesElement.textContent = 'Additional Notes: ' + record.additionalNotes;
  recordElement.appendChild(additionalNotesElement);

  // Create delete button
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete-button');
  // Rest of the code...


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
      const recordRef = ref(database, `patients/${patientName}/history/${recordKey}`);

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
const patientsRef = ref(database, 'tests');

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

    const patientsRef = ref(database, 'tests');
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


// Get the online status element
const onlineStatusElement = document.getElementById('onlineStatus');
const overlayElement = document.getElementById('overlay');

// Function to update the online status indicator
function updateOnlineStatus() {
  if (navigator.onLine) {
    onlineStatusElement.innerHTML = '<i class="fa fa-wifi"></i>Online';
    onlineStatusElement.classList.remove('offline');
    onlineStatusElement.classList.add('online');
    overlayElement.style.display = 'none';
  } else {
    onlineStatusElement.innerHTML = '<i class="fa fa-exclamation-triangle"></i>Offline';
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