import {
    getFirestore,
    doc,
    collection,
    addDoc,
    serverTimestamp,
    onSnapshot,
    getDocs,
    auth,
    signOut,
    onAuthStateChanged,
} from "./firebase.js";

// email show and logout work

const liEmail = document.querySelector("#li-email");
const liLogout = document.querySelector("#li-logout");
const button = document.querySelector("#btn");

if (!liEmail || !liLogout || !button) {
    console.error("One or more of the required DOM elements are missing.");
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        const emailId = user.email;
        if (liEmail) {
            liEmail.innerHTML = "<img width='25px' height='25px' src='https://www.svgrepo.com/download/433961/waving-hand.svg'> " + emailId;
        }
        console.log("User is signed in:", user);
    } else {
        window.location.href = "./login.html";
    }
});

if (liLogout) {
    liLogout.addEventListener("click", async () => {
        if (button) {
            button.innerText = "loading...";
        }
        try {
            await signOut(auth);
            window.location.href = "../index.html";
        } catch (error) {
            console.error("Error signing out:", error);
        }
    });
}

// database add product work

const form = document.getElementById("form");
const productName = document.getElementById("product-name");
const productPrice = document.getElementById("product-price");
const productDetail = document.getElementById("product-detail");
const buttonProduct = document.getElementById("btn-1");

const myCollection = collection(db, "products");

form.addEventListener("submit", async (event) => {
    event.preventDefault();


    const myProducts = {
        productName: productName.value,
        productPrice: Number(productPrice.value),
        productImg: null,
        productDetail: productDetail.value,
        createdAt: serverTimestamp()
    };

    try {

        const response = await addDoc(myCollection, myProducts);
        // console.log(response);

        console.log(querySnapshot);
        const querySnapshot = await getDocs(myCollection);

        querySnapshot.forEach((doc) => {
            const product = doc.data()

            const valueName = document.getElementById("p-name");
            const valuePrice = document.getElementById("p-price");
            const valueDetail = document.getElementById("p-detail");
            const valueDate = document.getElementById("p-date");

            buttonProduct.innerText = "loading..."

            product.productName.innerHTML = valueName
            product.createdAt?.toDate().innerHTML += valueDate
            product.productPrice.innerHTML += valuePrice
            product.productDetail.innerHTML = valueDetail
        });

    } catch (error) {
        console.log(error);
    }

});