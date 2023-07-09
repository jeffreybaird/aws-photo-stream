export default class UserAuth {
    constructor() {
        this.lastAuthUserKey = "CognitoIdentityServiceProvider.3nvvc6phpv3oda8hu6c2a0db0c.LastAuthUser";

        aws_amplify.Amplify.configure({
            Auth: {
                region: 'us-west-2',  // your region
                userPoolId: 'us-east-2_obGfnZjnI',  // your user pool id
                userPoolWebClientId: '3nvvc6phpv3oda8hu6c2a0db0c',  // your app client id
            },
        });
    }

    loadUserData() {
        var lastAuthUser = localStorage.getItem(this.lastAuthUserKey);

        if (lastAuthUser) {
            var userDataKey = `CognitoIdentityServiceProvider.3nvvc6phpv3oda8hu6c2a0db0c.${lastAuthUser}.userData`;
            var userData = JSON.parse(localStorage.getItem(userDataKey));

            if (userData) {
                var nameObject = userData.UserAttributes.find(function (item) {
                    return item.Name === 'name';
                });

                if (nameObject) {
                    this.displayUser(nameObject);
                }
            }
        }
    }

    signUp() {
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

    signIn() {
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
                    displayConfirmationForm({user: {username: username}}, 'You have not confirmed your email. Check your email for a confirmation code.');
                }
            });
    }

    signOut() {
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


    displayUser(nameObject) {
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

    confirmSignUp() {
        var username = document.getElementById('confirm-username').value;
        var code = document.getElementById('confirmation-code').value;

        aws_amplify.Amplify.Auth.confirmSignUp(username, code)
            .then(data => {
                console.log(data);
                window.location.reload();
            })
            .catch(err => console.error(err));
    }
}