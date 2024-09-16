// Determine environment (could be set by server or based on a variable)
const environment = 'development'; // Or 'production'

let configScript;
if (environment === 'development') {
  configScript = 'config.development.js';
} else {
  configScript = 'config.production.js';
}

const script = document.createElement('script');
script.src = configScript;
    script.onload = function () {
  // Your code that uses the configuration
  console.log('API Key:', configScript.firebaseConfig);
};


const firebaseConfig = {
    apiKey: "AIzaSyAFSZlgiHFUTTvhqAXIQTbOhPGNeeLYQQc",
    authDomain: "bytehustle-1.firebaseapp.com",
    databaseURL: "https://bytehustle-1-default-rtdb.firebaseio.com",
    projectId: "bytehustle-1",
    storageBucket: "bytehustle-1.appspot.com",
    messagingSenderId: "432556295891",
    appId: "1:432556295891:web:d13c2c998cddef6a817626",
    measurementId: "G-3F3M1TC2JF",
    //databaseURL: "bytehustle-1-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

const auth = firebase.auth()
const database = firebase.database();



function refreshList() {
    data = firebase.database().ref('users/');
    data.on('value', snapshot => {
        var users = snapshot.val();
        var userList = Object.getOwnPropertyNames(users)
        //document.getElementById('writeable').value = userList[0]
        refreshListChildren(userList)
    });
    
}

function userSignUp() {
    email = document.getElementById('email').value 
    password = document.getElementById('password').value
    full_name = document.getElementById('full_name').value
    language = document.getElementById('preference').value
    mobile = document.getElementById('mobile').value

    if (validate_email(email) == false) {
        alert("Email is invalid")
        return
    }
    if (validate_password(password) == false) {
        alert("Password is invalid, should be atleast 6 characters")
        return
    }
    if (validate_field(full_name) == false) {
        alert("Enter full name")
        return
    }
    if (validate_field(language) == false) {
        alert("Choose a programming language")
        return
    }

    if(validate_field(mobile) == false) {
        alert("Enter your mobile number")
        return
    }

    //move on with auth 
    auth.createUserWithEmailAndPassword(email, password)
    .then(function() {
        var user = auth.currentUser
        alert('Account created')
        
        console.log("Attempting database write..")
        writeCustomerData(user.uid, full_name, email, language, mobile) 
        console.log("Written to database")
    })
    .catch(function(error){
        //firebase will use 
        var error_code = error.code
        var error_message = error.message
    })    
}

function refreshListChildren(usersList) {
    var textAreaPreset = ""
    for (var i = 0; i < usersList.length; i++) {
        data = firebase.database().ref('users/' + usersList[i]);
        data.on('value', snapshot => {
            var usersListChildren = snapshot.val()
            console.log(usersListChildren)
            data = firebase.database().ref('users/' + usersList[i] + '/full_name');
            data.on('value', snapshot => {
                 var usersListChildrenName = snapshot.val()
                 console.log("Full Name: " + usersListChildrenName)
                 textAreaPreset += "Full Name: " + usersListChildrenName + "<br>"
                 data = firebase.database().ref('users/' + usersList[i] + '/mobile');
                 data.on('value', snapshot => {
                    var usersListChildrenNumber = snapshot.val()
                    console.log("Mobile Number: " + usersListChildrenNumber)
                    textAreaPreset += "Mobile Number: " + usersListChildrenNumber + " (Use to contact)" + "<br>"
                    data = firebase.database().ref('users/' + usersList[i] + '/language');
                    data.on('value', snapshot => {
                        var usersListChildrenLanguage = snapshot.val()
                        console.log("Field of Work: " + usersListChildrenLanguage)
                        if (usersListChildrenLanguage !== "null") textAreaPreset += "Field of Work: " + usersListChildrenLanguage + "<br>" + "<button" + "><span></span>Contact</button><br>";
                        
                    });
                 });
            });
            document.getElementById('area').innerHTML = textAreaPreset
            
        });
    }
    
}

function contact(usersListChildrenName) {
    console.log(usersListChildrenName + "Done")
}

function register() {
    email = document.getElementById('email').value 
    password = document.getElementById('password').value
    full_name = document.getElementById('name').value
    language = document.getElementById('language').value
    mobile = document.getElementById('mobile').value

    if (validate_email(email) == false) {
        alert("Email is invalid")
        return
    }
    if (validate_password(password) == false) {
        alert("Password is invalid, should be atleast 6 characters")
        return
    }
    if (validate_field(full_name) == false) {
        alert("Enter full name")
        return
    }
    if (validate_field(language) == false) {
        alert("Choose a programming language")
        return
    }

    if(validate_field(mobile) == false) {
        alert("Enter your mobile number")
        return
    }

    //move on with auth 
    auth.createUserWithEmailAndPassword(email, password)
    .then(function() {
        var user = auth.currentUser
        alert('Account created')
        
        console.log("Attempting database write..")
        writeUserData(user.uid, full_name, email, language, mobile) 
        console.log("Written to database")
    })
    .catch(function(error){
        //firebase will use 
        var error_code = error.code
        var error_message = error.message
    })
}

function login() {
    email = document.getElementById('email').value 
    password = document.getElementById('password').value
    account = document.getElementById('account').value

    if (validate_email(email) == false) {
        alert("Email is invalid")
        return
    }
    if (validate_password(password) == false) {
        alert("Password is invalid, should be atleast 6 characters")
        return
    }

    if (account == "User") {
        console.log("Attempting to sign in...")

        auth.signInWithEmailAndPassword(email, password)
        .then(function() {  
            alert("User logged in!")
            console.log("User logged in")
        })
        .catch(function(error) {
            //firebase will use 
            var error_code = error.code
            var error_message = error.message
            console.error("Error "+ error_message + " " + error_code )
        })
    }    

    console.log("Attempting to sign in...")

    auth.signInWithEmailAndPassword(email, password)
    .then(function() {  
        alert("User logged in!")
        console.log("User logged in")
    })
    .catch(function(error) {
        //firebase will use 
        var error_code = error.code
        var error_message = error.message
        console.error("Error "+ error_message + " " + error_code )
    })
}

function validate_email(email) {
    expression = /^[^@]+@\w+(\.\w+)+\w$/;
    if(expression.test(email) == true ) {
        return true
    } else {
        return false
    }
}

function validate_password(password) {
    if (password.length <= 6)
        return false;

    else
        return true
}

function validate_field(field) {
    if (field == null)
        return false
    else if (field.length == 0) 
        return false
    else
        return true
}

function writeUserData(userId, name, email, language, mobile) {
    firebase.database().ref('users/' + userId).set({
        full_name: name,                       
        email: email,
        language : language,
        mobile: mobile,
        last_login: Date.now()
    });
}

function writeCustomerData(userId, name, email, language, mobile) {
    firebase.database().ref('customers/' + userId).set({
        full_name: name,                       
        email: email,
        language : language,
        mobile: mobile,
        last_login: Date.now()
    });
}

function authStateListener() {
    // [START auth_state_listener]
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/v8/firebase.User
        var uid = user.uid;
        console.log("Signed in")
        if (document.getElementById("check").innerHTML != null)
            document.getElementById("check").innerHTML = "Signed in"
      } else {
        // User is signed out
        // ...
        console.log("Signed out")
        if (document.getElementById("check").innerHTML != null)
            document.getElementById("check").innerHTML = "Signed out"
      }
    });
    // [END auth_state_listener]
  }
  