import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, updateDoc,deleteDoc, doc, setDoc, getDoc, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
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
const storage = getStorage(app); // storage

function createAccountPage(){ // goes to create account page
  document.getElementById("loginPage").style.display = "none"; // makes it invis
  document.getElementById("registerPage").style.display = "block"; // makes the home page vis

}
document.getElementById("createAccount").addEventListener("click", createAccountPage);

function backToLogin(){ // goes to login page
  document.getElementById("registerPage").style.display = "none"; // makes the home page vis
  document.getElementById("loginPage").style.display = "block"; // makes it invis

}
document.getElementById("backLogin").addEventListener("click", backToLogin);

function registerAccount(){ // portion to signup with email

  const email1 = document.getElementById("registerEmail").value.trim(); // gets email
  const password1 = document.getElementById("registerPass").value.trim(); // gets pass

  createUserWithEmailAndPassword(auth, email1, password1) // auth portion
    .then((userCredential) => {

      const user = userCredential.user;

      document.getElementById("registerPage").style.display = "none";
      document.getElementById("homePage").style.display = "block";
    })
    .catch((error) => {
      console.error("Error Code:", error.code); // display to console when error
      console.error("Error Message:", error.message);

    });
}

document.getElementById("registerButton").addEventListener("click", function(event) {
  event.preventDefault(); // Prevent the default form submission
  registerAccount(); // Call the register function
});

function loginFunction(){ // login with email
  
  const email2 = document.getElementById("loginEmail").value;
  const password2 = document.getElementById("loginPass").value;

  signInWithEmailAndPassword(auth, email2, password2)
    .then((userCredential) => {

      const user = userCredential.user;
    
      document.getElementById("loginPage").style.display = "none";
      document.getElementById("homePage").style.display = "block";
      loadStickers();
    })
    .catch((error) => {

      console.error("Error Code:", error.code);
      console.error("Error Message:", error.message);
     
    });
  
}

function logoutUser() { // logs user out
  signOut(auth)
    .then(() => {
    
      const stickerGrid = document.getElementById("stickerGrid");
      stickerGrid.innerHTML = ""; // clears sticker grid when logout

      document.getElementById("homePage").style.display = "none";
      document.getElementById("loginPage").style.display = "block"; // goes back to login page

    })
    .catch((error) => {
      console.error("Error logging out:", error.message);
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
    // storage reference
    const storageRef = ref(storage, `stickers/${user.uid}/${file.name}`);

    // upload to firebase
    uploadBytes(storageRef, file).then((snapshot) => {
      console.log("Uploaded the image to Firebase Storage!");

      // get the dowload url
      getDownloadURL(snapshot.ref).then((downloadURL) => {

        // save sticker data and the download url
        const stickerData = {
          imageUrl: downloadURL, // firebase URL
          description: "", // description
          tradable: false, // non-tradable at first
        };

        addDoc(collection(db, "users", user.uid, "stickers"), stickerData)
          .then((docRef) => {
            console.log("Sticker added to Firestore");

            // create image with url and append to stickergrid
            const petrImg = document.createElement("img");
            petrImg.src = downloadURL;
            petrImg.classList.add("sticker");
            petrImg.alt = "Sticker";
            
            petrImg.dataset.stickerId = docRef.id;

            document.getElementById("stickerGrid").appendChild(petrImg);
            petrImg.addEventListener("click", function () {
              openStickerModal(petrImg);
            });

            image_input.value = ""; // clear it
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

function loadStickers() { // loads stickers when you login
  const user = auth.currentUser;

  if (user) {
    const stickersRef = collection(db, "users", user.uid, "stickers");

    getDocs(stickersRef)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const stickerData = doc.data();

          const petrImg = document.createElement("img");
          petrImg.src = stickerData.imageUrl; // user url
          petrImg.classList.add("sticker");
          petrImg.alt = "Sticker";

          petrImg.dataset.stickerId = doc.id;

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
  modal.style.display = "none"; // hide modal
}

function deleteSticker() {
  if (selectedSticker) {
    const user = auth.currentUser;
    const stickerId = selectedSticker.dataset.stickerId; // get the selected stickers ID

    if (user && stickerId) {
      const stickerRef = doc(db, "users", user.uid, "stickers", stickerId);

      // delete from firestorage
      deleteDoc(stickerRef)
        .then(() => {
          console.log("Sticker deleted from Firestore");

          // remove it from the grid
          selectedSticker.remove();
          closeStickerModal();
        })
        .catch((error) => {
          console.error("Error deleting sticker from Firestore:", error.message);
        });
    }
  }
}
document.getElementById("deleteStickerButton").addEventListener("click", deleteSticker);


function markTradable() { // marks sticker tradable
  if (selectedSticker) {
    const user = auth.currentUser;
    const stickerId = selectedSticker.dataset.stickerId;

    if (user && stickerId) {
      const stickerRef = doc(db, "users", user.uid, "stickers", stickerId);
      const isCurrentlyTradable = selectedSticker.classList.contains("tradable");

      // toggle if tradable
      if (isCurrentlyTradable) {
        selectedSticker.classList.remove("tradable");
      } else {
        selectedSticker.classList.add("tradable");
      }

      // update the tradable in Firebase
      updateDoc(stickerRef, {
        tradable: !isCurrentlyTradable
      })
        .then(() => {
          console.log("Tradable status updated in Firestore");
          closeStickerModal(); // close the modal after updating
        })
        .catch((error) => {
          console.error("Error updating tradable status:", error.message);
        });
    }
  }
}

document.getElementById("tradeButton").addEventListener("click", markTradable);


