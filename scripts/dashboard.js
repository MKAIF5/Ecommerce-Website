import {
    getFirestore,
    doc,
    collection,
    addDoc,
    serverTimestamp,
    getDocs,
    deleteDoc,
    auth,
    signOut,
    onAuthStateChanged,
    db,
    ref,
    uploadBytes,
    getDownloadURL,
    getStorage
} from "./firebase.js";

const storage = getStorage();

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
const productImg = document.getElementById("product-img");
const buttonProduct = document.getElementById("btn-1");

const myCollection = collection(db, "products");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    buttonProduct.innerText = "loading...";

    try {
        const myFile = productImg.files[0];
        let imgURL = "";

        if (myFile) {
            const storageRef = ref(storage, `images/${myFile.name}`);
            // Upload the file to Firebase Storage
            const snapshot = await uploadBytes(storageRef, myFile);
            // Get the download URL
            imgURL = await getDownloadURL(snapshot.ref);
        }

        const myProducts = {
            productName: productName.value,
            productPrice: Number(productPrice.value),
            productImg: imgURL,
            productDetail: productDetail.value,
            createdAt: serverTimestamp()
        };

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
            const productId = doc.id;  // Get the document ID

            // Create a new product item
            const productItem = document.createElement("div");
            productItem.classList.add("product-item");

            // Format the creation date
            const date = product.createdAt
                ? dateFns.formatDistance(product.createdAt.toDate(), new Date(), { addSuffix: true })
                : "";

            // Set the content of the new product item
            productItem.innerHTML = `
            <button class="remove-btn" data-id="${productId}">❌</button>
                ${product.productImg ? `<img src="${product.productImg}" alt="${product.productName}" style="width: 100px; height: 100px;" />` : ''}
                <h3>${product.productName}</h3>
                <p>Price: $${product.productPrice}</p>
                <p>${product.productDetail}</p>
                <span>Added ${date}</span>
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

        Swal.fire({
            title: "Error",
            text: error.message,
            icon: "error",
            footer: "Something went wrong!"
        });

        buttonProduct.innerText = "Submit";
        form.reset();
    }
});

// Remove product functionality
document.getElementById("product-container").addEventListener("click", async (event) => {
    if (event.target.classList.contains("remove-btn")) {
        const productId = event.target.getAttribute("data-id");

        try {
            // Remove the product from Firestore
            await deleteDoc(doc(db, "products", productId));

            // Optionally, you may also remove the image from Firebase Storage here

            // Remove the product from the DOM
            event.target.parentElement.remove();

            Swal.fire({
                title: "Success",
                text: "Product removed successfully!",
                icon: "success"
            });

        } catch (error) {
            console.error("Error removing document: ", error);

            Swal.fire({
                title: "Error",
                text: error.message,
                icon: "error",
                footer: "Something went wrong!"
            });
        }
    }
});

