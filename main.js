window.onload = function() {
    var lastAuthUserKey = "CognitoIdentityServiceProvider.3nvvc6phpv3oda8hu6c2a0db0c.LastAuthUser";
    var lastAuthUser = localStorage.getItem(lastAuthUserKey);

    if (lastAuthUser) {
        var userDataKey = `CognitoIdentityServiceProvider.3nvvc6phpv3oda8hu6c2a0db0c.${lastAuthUser}.userData`;
        var userData = JSON.parse(localStorage.getItem(userDataKey));

        // Check if user data exists
        if (userData) {
            // Find the name object
            var nameObject = userData.UserAttributes.find(function (item) {
                return item.Name === 'name';
            });

            if (nameObject) {
                // Set the username in the userDisplay div and unhide it
                displayUser(nameObject)

                // Display the logout link
            }
        }
    }
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
    loadPhotos();
    aws_amplify.Amplify.configure({
        Auth: {
            region: 'us-west-2',  // your region
            userPoolId: 'us-east-2_obGfnZjnI',  // your user pool id
            userPoolWebClientId: '3nvvc6phpv3oda8hu6c2a0db0c',  // your app client id
        },
    });
});

function signUp() {
    var username = document.getElementById('signUpUsername').value;
    var password = document.getElementById('signUpPassword').value;
    var email = document.getElementById('signUpEmail').value;
    var familyName = document.getElementById('signUpFamilyName').value;
    var name = document.getElementById('signUpName').value;

    aws_amplify.Auth.signUp({
        username,
        password,
        attributes: {
            email: email,
            family_name: familyName,
            name: name,
        },
    })
        .then((data) => {
            console.log(data)
            displayConfirmationForm(data)
        })
        .catch((err) => console.log(err));
}

function signIn() {
    var username = document.getElementById('signInUsername').value;
    var password = document.getElementById('signInPassword').value;

    aws_amplify.Auth.signIn(username, password)
        .then((user) => {
            console.log(user);
            window.location.reload();
        })
        .catch((err) => {
            console.log(err);
            if (err.name === 'UserNotConfirmedException') {
                displayConfirmationForm({ user: { username: username } }, 'You have not confirmed your email. Check your email for a confirmation code.');
            }
        });
}

function displayUser(nameObject) {
    var userDisplay = document.getElementById('userDisplay');
    var usernameDisplay = document.getElementById('usernameDisplay');
    if (nameObject.Value) {
        usernameDisplay.innerText = nameObject.Value;
        userDisplay.hidden = false;
    }
    let name = nameObject?.signInUserSession?.idToken?.payload?.name;
    if (name) {
        usernameDisplay.innerText = name;
        userDisplay.hidden = false;
    }


    // Hide the login and signup forms
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('signupContainer').style.display = 'none';
    document.getElementById('signUpLink').style.display = 'none';
    document.getElementById('signInLink').style.display = 'none';
}

function confirmSignUp() {
    var username = document.getElementById('confirm-username').value;
    var code = document.getElementById('confirmation-code').value;

    aws_amplify.Amplify.Auth.confirmSignUp(username, code)
        .then(data => console.log(data))
        .catch(err => console.error(err));
}

function loadPhotos() {
    const pageToken = $('#pageToken').val();

    $.post('https://vzov3j7ltk.execute-api.us-east-2.amazonaws.com/listPhotos', { pageToken: pageToken }, function(data) {
        const response = JSON.parse(data);
        const items = response.items;
        const nextPageToken = response.nextPageToken;

        items.forEach(function(photo) {
            const photoUrl = photo.url;
            const fileType = getFileType(photo);

            if (fileType === 'mov') {
                const videoElement = document.createElement('video');
                videoElement.src = photoUrl;
                videoElement.controls = true;
                videoElement.className = 'photo';

                const containerElement = document.createElement('div');
                containerElement.appendChild(videoElement);

                $('#photos').append(containerElement);
            } else {
                const imageElement = document.createElement('img');
                imageElement.src = photoUrl;
                imageElement.alt = 'photo';
                imageElement.className = 'photo';

                $('#photos').append(imageElement);
            }
        });

        if (nextPageToken) {
            $('#pageToken').val(nextPageToken || '');
            $('#loadMoreBtn').show();
        } else {
            $('#pageToken').val('');
            $('#loadMoreBtn').hide();
        }
    });
}

function getFileType(photo) {
    // Retrieve the file type based on your logic
    // For example, you can check the metadata or extract it from the URL
    // Adjust this code based on your specific implementation
    const url = new URL(photo.url);
    const extension = url.pathname.split('.').pop().toLowerCase();

    if (extension === 'mov') {
        return 'mov';
    } else {
        return 'image'; // Default to 'image' for other file types
    }
}

function loadMorePhotos() {
    $('#loadMoreBtn').hide();
    loadPhotos();
}

function signOut() {
    aws_amplify.Auth.signOut()
        .then(() => {
            var lastAuthUserKey = "CognitoIdentityServiceProvider.3nvvc6phpv3oda8hu6c2a0db0c.LastAuthUser";
            var lastAuthUser = localStorage.getItem(lastAuthUserKey);
            var userDataKey = `CognitoIdentityServiceProvider.3nvvc6phpv3oda8hu6c2a0db0c.${lastAuthUser}.userData`;
            localStorage.removeItem(userDataKey);
            localStorage.removeItem(lastAuthUserKey);
            location.reload();
        })
        .catch(err => console.log(err));
}

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

