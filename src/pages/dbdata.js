import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import moreGoods from "./moregoods";

const Post = () => {
  // TODO: Replace the following with your app's Firebase project configuration
  // See: https://support.google.com/firebase/answer/7015592
  const firebaseConfig = {
    // FIREBASE_CONFIGURATION
    apiKey: "AIzaSyB-opll1P-81cOoc7oQUQ7G5QUSK5FhfrA",
    authDomain: "retro-bf312.firebaseapp.com",
    databaseURL: "https://retro-bf312-default-rtdb.firebaseio.com",
    projectId: "retro-bf312",
    storageBucket: "retro-bf312.appspot.com",
    messagingSenderId: "319056909364",
    appId: "1:319056909364:web:f2215ade4b825b8fe56661",
    measurementId: "G-NT5D2WTQ8T"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  // Assuming "moreGoods" is an array of products, loop through and add each product to Firestore
  moreGoods.forEach(async (product) => {
    // Define the collection where you want to store products (e.g., "products")
    const productsCollection = db.collection("products");

    // Use "setDoc" to add the product to the collection
    await setDoc(doc(productsCollection, product.id), product);
    console.log(`Wrote ${product} to firestore.`);
  });

  // console.log("Products have been added to Firestore.");
};

export default Post;
