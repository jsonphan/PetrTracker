

function loginFunction(){
  
  const email = document.getElementById("email").value; // Gets it from the email
  const pass = document.getElementById("password").value; // Gets it from the password

  if (email === "test@test" && pass === "123"){
    document.getElementById("loginPage").style.display = "none"; // makes it invis
    document.getElementById("homePage").style.display = "block"; // makes the home page vis

  }
  else{
    alert("Incorrect Username or Password. Please try again.")
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

    image_input.value = ""; // Sets the field to empty
  } 
  else{
    alert("Invalid File, try again.");
  }

}

document.getElementById("addStickerButton").addEventListener("click", addImage); // adds functionality to addsticker button