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
    db
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

    buttonProduct.innerText = "loading...";
    const myProducts = {
        productName: productName.value,
        productPrice: Number(productPrice.value),
        productImg: null,
        productDetail: productDetail.value,
        createdAt: serverTimestamp()
    };

    try {
        // Add the product to Firestore
        await addDoc(myCollection, myProducts);

        // Retrieve the products from Firestore
        const querySnapshot = await getDocs(myCollection);

        // Get the product container
        const productContainer = document.getElementById("product-container");

        // Clear previous product data (optional)
        productContainer.innerHTML = '';

        querySnapshot.forEach((doc) => {
            const product = doc.data();

            // Create a new product item
            const productItem = document.createElement("div");
            productItem.classList.add("product-item");

            // Format the creation date
            const formattedDate = product.createdAt
                ? new Date(product.createdAt.toDate()).toLocaleString()
                : "";

            // Set the content of the new product item
            productItem.innerHTML = `
                <h3>${product.productName}</h3>
                <p>Price: $${product.productPrice}</p>
                <p>${product.productDetail}</p>
                <span>Added ${formattedDate}</span>
            `;

            // Append the new product item to the container
            productContainer.appendChild(productItem);
        });

        form.reset();

        // Update button text
        if (buttonProduct) {
            buttonProduct.innerText = "Product added";
        }

    } catch (error) {
        console.error("Error adding document: ", error);
        if (buttonProduct) {
            buttonProduct.innerText = "Error";
        }
    }
});
