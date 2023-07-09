import Photos from './src/photos.js';
import UserAuth from './src/auth.js';

window.onload = function() {
  window.userAuth = new UserAuth();
  window.userAuth.loadUserData();

  window.photoLoader = new Photos();
  window.photoLoader.loadPhotos();
};


$(document).ready(function() {
  const modal = document.getElementById('myModal');

  // Get the <span> element that closes the modal
  const span = document.getElementsByClassName('close')[0];

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = 'none';
  };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };
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

