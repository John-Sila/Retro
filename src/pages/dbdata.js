import { initializeApp } from "firebase/app";
import { getDatabase, ref, query, equalTo, get } from "firebase/database";
import moreGoods from "./moregoods";

export default function Post() {
  const firebaseConfigurationKeys = {
    apiKey: "AIzaSyB-opll1P-81cOoc7oQUQ7G5QUSK5FhfrA",
    authDomain: "retro-bf312.firebaseapp.com",
    databaseURL: "https://retro-bf312-default-rtdb.firebaseio.com",
    projectId: "retro-bf312",
    storageBucket: "retro-bf312.appspot.com",
    messagingSenderId: "319056909364",
    appId: "1:319056909364:web:f2215ade4b825b8fe56661",
    measurementId: "G-NT5D2WTQ8T"
  };

  const app = initializeApp(firebaseConfigurationKeys);
  const db = getDatabase(app);

  // query
  const Query = query(ref(db, "Customers"), equalTo("trimmedEmail", "jsila3000"));
  get(Query)
    .then((snapshot) => {
      const data = snapshot.val();
      if (data) {
        const userKeys = Object.keys(data);
        const userKey = userKeys[0];
        const user = data[userKey];
        const Username = user.userName; // Assuming you store the name under the "name" property
        alert(Username);
      } else {
        alert("No user found with that email.");
      }
    })
    .catch((err) => {
      alert("Error getting data.");
    });

}
