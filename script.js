import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, updateDoc, doc, setDoc, getDoc, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyC6oNqInbKnwrcTykbi-ZmNpEs17VEqvzU",
  authDomain: "start-4bda5.firebaseapp.com",
  projectId: "start-4bda5",
  storageBucket: "start-4bda5.appspot.com",
  messagingSenderId: "274359714119",
  appId: "1:274359714119:web:f7696f8c4fabd3c50bcc62",
  measurementId: "G-VQT2N42C6S",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // auth
const db = getFirestore(app); // database
const storage = getStorage(app); // Initialize Firebase Storage

function createAccountPage(){
  document.getElementById("loginPage").style.display = "none"; // makes it invis
  document.getElementById("registerPage").style.display = "block"; // makes the home page vis

}
document.getElementById("createAccount").addEventListener("click", createAccountPage);

function backToLogin(){
  document.getElementById("registerPage").style.display = "none"; // makes the home page vis
  document.getElementById("loginPage").style.display = "block"; // makes it invis

}
document.getElementById("backLogin").addEventListener("click", backToLogin);

function registerAccount(){

  const email1 = document.getElementById("registerEmail").value.trim(); // Gets it from the email
  const password1 = document.getElementById("registerPass").value.trim(); // Gets it from the password

  createUserWithEmailAndPassword(auth, email1, password1)
    .then((userCredential) => {
      // Signed up 
      const user = userCredential.user;

      alert("Account Created")
      document.getElementById("registerPage").style.display = "none";
      document.getElementById("homePage").style.display = "block";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error Code:", error.code);
      console.error("Error Message:", error.message);

    });
}

document.getElementById("registerButton").addEventListener("click", function(event) {
  event.preventDefault(); // Prevent the default form submission
  registerAccount(); // Call the register function
});

function loginFunction(){
  
  const email2 = document.getElementById("loginEmail").value; // Gets it from the email
  const password2 = document.getElementById("loginPass").value; // Gets it from the password

  signInWithEmailAndPassword(auth, email2, password2)
    .then((userCredential) => {
      // Signed up 
      const user = userCredential.user;
    
      alert("Signed In")
      document.getElementById("loginPage").style.display = "none";
      document.getElementById("homePage").style.display = "block";
      loadStickers();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error Code:", error.code);
      console.error("Error Message:", error.message);
     
    });
  
}

function logoutUser() {
  signOut(auth)
    .then(() => {
      // Successfully signed out
      alert("Logged out successfully!");
    
      const stickerGrid = document.getElementById("stickerGrid");
      stickerGrid.innerHTML = "";

      document.getElementById("homePage").style.display = "none";
      document.getElementById("loginPage").style.display = "block"; // Redirect to login page

    
    
    })
    .catch((error) => {
      // Handle errors
      console.error("Error logging out:", error.message);
      alert("Failed to log out: " + error.message);
    });
}
document.getElementById("logoutButton").addEventListener("click", function(event){
  event.preventDefault();
  logoutUser();
})


document.getElementById("loginButton").addEventListener("click", function(event){
  event.preventDefault(); // prevents refresh
  loginFunction(); // call function to login
});



function addImage() {
  const image_input = document.getElementById("stickerFile");
  const file = image_input.files[0];
  const user = auth.currentUser;

  if (file && user) {
    // Create a storage reference
    const storageRef = ref(storage, `stickers/${user.uid}/${file.name}`);

    // Upload the image to Firebase Storage
    uploadBytes(storageRef, file).then((snapshot) => {
      console.log("Uploaded the image to Firebase Storage!");

      // Get the download URL after the file is uploaded
      getDownloadURL(snapshot.ref).then((downloadURL) => {
        console.log("File available at", downloadURL);

        // Save the sticker info (including download URL) to Firestore
        const stickerData = {
          imageUrl: downloadURL, // Use the Firebase Storage URL
          description: "", // Initialize with an empty description
          tradable: false, // Initialize as non-tradable
        };

        addDoc(collection(db, "users", user.uid, "stickers"), stickerData)
          .then(() => {
            console.log("Sticker added to Firestore");

            // Now append the sticker to the grid with the correct URL
            const petrImg = document.createElement("img");
            petrImg.src = downloadURL;
            petrImg.classList.add("sticker");
            petrImg.alt = "Sticker";

            document.getElementById("stickerGrid").appendChild(petrImg);
            petrImg.addEventListener("click", function () {
              openStickerModal(petrImg);
            });

            image_input.value = ""; // Clear input field
          })
          .catch((error) => {
            console.error("Error adding sticker to Firestore:", error.message);
          });
      });
    }).catch((error) => {
      console.error("Error uploading image to Firebase Storage:", error.message);
    });
  }
}


document.getElementById("addStickerButton").addEventListener("click", addImage); // adds functionality to addsticker button

function loadStickers() {
  const user = auth.currentUser;

  if (user) {
    const stickersRef = collection(db, "users", user.uid, "stickers");

    getDocs(stickersRef)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const stickerData = doc.data();

          const petrImg = document.createElement("img");
          petrImg.src = stickerData.imageUrl; // Use the correct Firebase Storage URL
          petrImg.classList.add("sticker");
          petrImg.alt = "Sticker";

          if (stickerData.tradable) {
            petrImg.classList.add("tradable");
          }

          document.getElementById("stickerGrid").appendChild(petrImg);

          petrImg.addEventListener("click", function () {
            openStickerModal(petrImg);
          });
        });
      })
      .catch((error) => {
        console.error("Error loading stickers from Firestore:", error.message);
      });
  }
}


let selectedSticker = null;

function openStickerModal(sticker){ // opens the sticker modal to show stcierk/description/etc.
  selectedSticker = sticker;
  const modalImage = document.getElementById("modalImage");
  modalImage.src = sticker.src;
  document.getElementById("stickerModal").style.display = "block";
  
}

const modal = document.getElementById("stickerModal");

modal.addEventListener("click", function(event){ // when we click outside it closes modal
  if (event.target === modal){
    closeStickerModal();
  }
})
function closeStickerModal(){
  const modal = document.getElementById("stickerModal"); // function to close
  modal.style.display = "none"; // Hide modal
}

function deleteSticker(){ // deletes sticker
  if (selectedSticker){
    selectedSticker.remove();
    closeStickerModal();
  }
}

document.getElementById("deleteStickerButton").addEventListener("click", deleteSticker);


function markTradable(){ // allows the sticker to be marked tradable
  if (selectedSticker){
    if (selectedSticker.classList.contains("tradable")){
      selectedSticker.classList.remove("tradable");
    }
    else{
      selectedSticker.classList.add("tradable");
    }
    closeStickerModal();
  }
}

document.getElementById("tradeButton").addEventListener("click", markTradable);


