

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
  const username = document.getElementById("username").value; // Gets it from the email
  const email = document.getElementById("email").value; // Gets it from the email
  const pass = document.getElementById("password").value; // Gets it from the password

  if (email === "test@test" && pass === "123"){
    document.getElementById("registerPage").style.display = "none"; // makes it invis
    document.getElementById("homePage").style.display = "block"; // makes the home page vis

  }
  else{
    alert("Incorrect Username or Password. Please try again.");
  }
}

document.getElementById("registerButton").addEventListener("click", function(event) {
  event.preventDefault(); // Prevent the default form submission
  registerAccount(); // Call the register function
});

function loginFunction(){
  
  const email = document.getElementById("email").value; // Gets it from the email
  const pass = document.getElementById("password").value; // Gets it from the password

  if (email === "test@test" && pass === "123"){
    document.getElementById("loginPage").style.display = "none"; // makes it invis
    document.getElementById("homePage").style.display = "block"; // makes the home page vis

  }
  else{
    alert("Incorrect Username or Password. Please try again.");
  }
}

document.getElementById("loginButton").addEventListener("click", function(event){
  event.preventDefault(); // prevents refresh
  loginFunction(); // call function to login
});


function addImage(){
  const image_input = document.getElementById("stickerFile"); // gets the file input and puts into variable
  const file = image_input.files[0]; // get the first file in the input

  if (file){ // checks if valid file
    const petrImg = document.createElement("img"); // creates an image element
    petrImg.src = URL.createObjectURL(file); // creates a URL for our img element
    petrImg.classList.add("sticker"); // adds the sticker class
    petrImg.alt = "Sticker"; // Just in case
    document.getElementById("stickerGrid").appendChild(petrImg); // Append that sticker

     petrImg.addEventListener("click", function(){
      openStickerModal(petrImg);
     }); 
    image_input.value = ""; // Sets the field to empty
  } 

}

document.getElementById("addStickerButton").addEventListener("click", addImage); // adds functionality to addsticker button


let selectedSticker = null;

function openStickerModal(sticker){
  selectedSticker = sticker;
  const modalImage = document.getElementById("modalImage");
  modalImage.src = sticker.src;
  document.getElementById("stickerModal").style.display = "block";
  
}

const modal = document.getElementById("stickerModal");

modal.addEventListener("click", function(event){
  if (event.target === modal){
    closeStickerModal();
  }
})
function closeStickerModal(){
  const modal = document.getElementById("stickerModal");
  modal.style.display = "none"; // Hide modal
}

function deleteSticker(){
  if (selectedSticker){
    selectedSticker.remove();
    closeStickerModal();
  }
}

document.getElementById("deleteStickerButton").addEventListener("click", deleteSticker);


function markTradable(){
  if (selectedSticker){
    if (selectedSticker.classList.contains("tradeable")){
      selectedSticker.classList.remove("tradeable");
    }
    else{
      selectedSticker.classList.add("tradeable");
    }
    closeStickerModal();
  }
}

document.getElementById("tradeButton").addEventListener("click", markTradable);
