import firebase from "firebase/compat/app";
import "firebase/compat/database";
import moreGoods from "./moregoods";

const Post = () => {
  const firebaseConfig = {
    // Your Firebase project configuration object
    apiKey: "AIzaSyB-opll1P-81cOoc7oQUQ7G5QUSK5FhfrA",
    authDomain: "retro-bf312.firebaseapp.com",
    databaseURL: "https://retro-bf312-default-rtdb.firebaseio.com",
    projectId: "retro-bf312",
    storageBucket: "retro-bf312.appspot.com",
    messagingSenderId: "319056909364",
    appId: "1:319056909364:web:f2215ade4b825b8fe56661",
    measurementId: "G-NT5D2WTQ8T",
  };

  firebase.initializeApp(firebaseConfig);

  const database = firebase.database();

  const addItem = (item) => {
    const itemsRef = database.ref("items");
    const newItemRef = itemsRef.push();
    newItemRef.set(item);
  };

  moreGoods.forEach((item) => {
    addItem(item);
  });
};

export default Post;
