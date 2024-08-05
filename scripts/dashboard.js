import { auth, signOut, onAuthStateChanged } from "./firebase.js";

const liEmail = document.querySelector("#li-email");

onAuthStateChanged(auth, (user) => {
    if (user) {
        const emailId = user.email;
        liEmail.innerHTML = "<img width='25px' height='25px' src='https://www.svgrepo.com/download/433961/waving-hand.svg'> </img>" + emailId
        console.log(user);
    } else {
        window.location.href = "./login.html"
    }
});

const liLogout = document.querySelector("#li-logout");
const button = document.querySelector("#btn")

liLogout.addEventListener("click", async () => {
    button.innerText = "loading..."
    await signOut(auth)
    window.location.href = "../index.html"
})