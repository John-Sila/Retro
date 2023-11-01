import { initializeApp } from "firebase/app";
import { getDatabase, ref, query, orderByChild, equalTo, limitToFirst, onValue, get } from "firebase/database";
import { firebaseConfigurationDetails } from "../external_functions";

export default function Post() {

  const app = initializeApp(firebaseConfigurationDetails);
  const db = getDatabase(app);

  // Reference to "Customers" node
  const reference = ref(db, "Customers");

  // Query for users with trimmedEmail equal to "jsila3000"
  const theQuery = query(
    reference,
    orderByChild("trimmedEmail"),
    equalTo("jsila3000"),
    limitToFirst(1)
  );

  // Attach a listener to the query
  onValue(theQuery, (snapshot) => {
    // Handle the snapshot data here
    const data = snapshot.val();
    const parsed = Object.keys(data)[0];

    // get
    const ref2 = ref(db, `Customers/${parsed}`);
    get(ref2).then((snapShot) => {
      const data = snapShot.val();
      alert(data.username);
    }).catch((err) => {
      console.log("An error occurred while trying to get your username: ", err)
    });

  });
}
