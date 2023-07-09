export default class UserAuth {
  constructor() {
    this.lastAuthUserKey =
      'CognitoIdentityServiceProvider.3nvvc6phpv3oda8hu6c2a0db0c.LastAuthUser';

    // eslint-disable-next-line camelcase
    aws_amplify.Amplify.configure({
      Auth: {
        region: 'us-west-2', // your region
        userPoolId: 'us-east-2_obGfnZjnI', // your user pool id
        userPoolWebClientId: '3nvvc6phpv3oda8hu6c2a0db0c', // your app client id
      },
    });
  }

  loadUserData() {
    const lstUsr = localStorage.getItem(this.lastAuthUserKey);

    if (lstUsr) {
      const userDataKey =
        `CognitoIdentityServiceProvider.3nvvc6phpv3oda8hu6c2a0db0c.
        ${lstUsr}.userData`;
      const userData = JSON.parse(localStorage.getItem(userDataKey));

      if (userData) {
        const nameObject = userData.UserAttributes.find(function(item) {
          return item.Name === 'name';
        });

        if (nameObject) {
          this.displayUser(nameObject);
        }
      }
    }
  }
    // Get the modal
  displayConfirmationForm(data, message) {
        // Hide the sign in form
        document.getElementById('loginContainer').style.display = 'none';

        // Show the confirmation form
        const confirmationForm = document.getElementById('confirmationForm');
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
            modal.style.display = 'block';
        }
    }

  signUp() {
    const username = document.getElementById('signUpUsername').value;
    const password = document.getElementById('signUpPassword').value;
    const email = document.getElementById('signUpEmail').value;
    const familyName = document.getElementById('signUpFamilyName').value;
    const name = document.getElementById('signUpName').value;

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
          console.log(data);
          this.displayConfirmationForm(data);
        })
        .catch((err) => console.log(err));
  }

  signIn() {
    const username = document.getElementById('signInUsername').value;
    const password = document.getElementById('signInPassword').value;

    aws_amplify.Auth.signIn(username, password)
        .then((user) => {
          console.log(user);
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
          if (err.name === 'UserNotConfirmedException') {
            this.displayConfirmationForm({user: {username: username}}, 'You have not confirmed your email. Check your email for a confirmation code.');
          }
        });
  }

  signOut() {
    aws_amplify.Auth.signOut()
        .then(() => {
          const lastAuthUserKey = 'CognitoIdentityServiceProvider.3nvvc6phpv3oda8hu6c2a0db0c.LastAuthUser';
          const lastAuthUser = localStorage.getItem(lastAuthUserKey);
          const userDataKey = `CognitoIdentityServiceProvider.3nvvc6phpv3oda8hu6c2a0db0c.${lastAuthUser}.userData`;
          localStorage.removeItem(userDataKey);
          localStorage.removeItem(lastAuthUserKey);
          location.reload();
        })
        .catch((err) => console.log(err));
  }


  displayUser(nameObject) {
    const userDisplay = document.getElementById('userDisplay');
    const usernameDisplay = document.getElementById('usernameDisplay');
    if (nameObject.Value) {
      usernameDisplay.innerText = nameObject.Value;
      userDisplay.hidden = false;
    }
    const name = nameObject?.signInUserSession?.idToken?.payload?.name;
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

  confirmSignUp() {
    const username = document.getElementById('confirm-username').value;
    const code = document.getElementById('confirmation-code').value;

    aws_amplify.Amplify.Auth.confirmSignUp(username, code)
        .then((data) => {
          console.log(data);
          window.location.reload();
        })
        .catch((err) => console.error(err));
  }
}
