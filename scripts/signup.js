import { createUserWithEmailAndPassword, auth } from "./firebase.js"

const form = document.querySelector("#signup-form");
const fullNameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const button = document.querySelector("#btn");

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    button.innerText = "loading..."
    const fullName = fullNameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        button.value = "loading..."
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user;
        console.log("user...", userCredential);

        window.location.href = "./login.html"

        form.reset();

    } catch (error) {
        console.log(error);
        Swal.fire({
            title: "Wrong",
            text: error,
            icon: "error",
            footer: error.message,
        });
    }
})