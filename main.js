import Photos from './src/photos.js';
import UserAuth from './src/auth.js';

window.onload = function() {
    window.userAuth = new UserAuth();
    window.userAuth.loadUserData();

    window.photoLoader = new Photos();
    window.photoLoader.loadPhotos();
}

// Get the modal


function displayConfirmationForm(data, message) {
    // Hide the sign in form
    document.getElementById('loginContainer').style.display = 'none';

    // Show the confirmation form
    var confirmationForm = document.getElementById('confirmationForm');
    confirmationForm.style.display = 'block';

    // Pre-fill the username field with the username from the signup
    document.getElementById('confirm-username').value = data.user.username;

    // Show user's name
    document.getElementById('usernameDisplay').innerText = data.user.username;

    // Make the user display visible
    document.getElementById('userDisplay').style.display = 'block';

    document.getElementById('signUpLink').style.display = 'none';

    document.getElementById('signInLink').style.display = 'none';

    // If a message is provided, display it in the modal
    if (message) {
        document.getElementById('modalMessage').innerText = message;
        modal.style.display = "block";
    }
}



$(document).ready(function() {
    var modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

// When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});


function onSignUpLinkClick(e) {
    e.preventDefault(); // Prevent the default action (navigation) of the link
    document.getElementById('loginContainer').style.display = 'none'; // Hide the login form
    document.getElementById('signupContainer').style.display = 'block'; // Show the signup form
    document.getElementById('signUpLink').style.display = 'none';
    document.getElementById('signInLink').style.display = 'block';
}

function onSignInLinkClick(e) {
    e.preventDefault(); // Prevent the default action (navigation) of the link
    document.getElementById('signupContainer').style.display = 'none'; // Hide the signup form
    document.getElementById('loginContainer').style.display = 'block'; // Show the login form
    document.getElementById('signUpLink').style.display = 'block';
    document.getElementById('signInLink').style.display = 'none';
}

