import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { get, getDatabase, ref, query, orderByChild, equalTo, limitToFirst, onValue, set } from "firebase/database";
import { initializeApp } from "firebase/app";

import { BsThreeDots } from "react-icons/bs";
import { firebaseConfigurationDetails } from "../external_functions";

const Messages = () => {

    const [user, setUser] = useState(false);
    const [messagesPresent, setMessagesPresent] = useState(false);
    const [senders, setSenders] = useState([]);

    onAuthStateChanged(getAuth(), user => {
        if (user) {
            setUser(true);
        } else {
            setUser(false);
        }
    })

    // get messages
    useEffect( () => {


        if (user) {
            try {
                const database = getDatabase(initializeApp(firebaseConfigurationDetails));
                const trimmedEmail = window.localStorage.getItem("trimmedEmail");
                if (trimmedEmail === null) {
                    setUser(false);
                    return;
                } else {
                    const myQuery = query(
                        ref(database, "Customers"),
                        orderByChild("trimmedEmail"),
                        equalTo(trimmedEmail),
                        limitToFirst(1),
                        );
                        
                        onValue(myQuery, returnVal => {
                            let data = returnVal.val();
                            data = Object.keys(data);
                            const thisPath = data[0];


                            // get messages
                            const Senders = ref(database, `Customers/${thisPath}/Messages`);
                            get(Senders).then((result) => {
                                const data = result.val()
                                if (data === null || data === undefined) {
                                    return;
                                } else setMessagesPresent(true);

                                const Keys_One = Object.keys(data);
                                console.log(Keys_One);

                                let ActualNames = [];

                                for (let i = 0; i < Keys_One.length; i++) {
                                    
                                    // get the actual names
                                    const ref2 = ref(database, `Customers/${Keys_One[i]}/userName`);
                                    get(ref2).then((result) => {
                                        const data2 = result.val();

                                        if (data2 === null || data2 === undefined) {
                                            return;
                                        } else {

                                            // we have a username
                                            console.log(data2);
                                            
                                            ActualNames.push(data2);

                                            if ( i === Keys_One.length - 1 ) {
                                                // ActualNames = Array.from(ActualNames);
                                                setSenders(ActualNames);
                                                console.log(typeof(ActualNames));
                                            }

                                        }

                                    }).catch((err) => {
                                        console.log(err);
                                    });


                                    
                                }




                            }).catch((err) => {
                                console.log(err);
                            });

                    })
                }
            } catch (error) {
                console.log(`An error occurred trying to access your account. ${error}`);
            }

        } else {
            console.log(false);
            
        }


    }, [user])


    // senders
    useEffect( () => {
        const type1 = typeof(senders)
        console.log(type1);
        const Logger = (Object.entries(senders));
        console.log(Logger);


    }, [senders])


    return (
        <>

            <div className="mainMessagesDiv">
                <div className="innerMessagesDiv">


                    { user && messagesPresent && (
                        <>
                            <div className="theMessages">

                                

                                <div className="theMessagesLeft">
                                    
                                    {senders.map( (sender, index) => (

                                        <div className="oneOfSenders" key={index}>
                                            <p>{sender}</p>
                                        </div>

                                    ))}

                                </div>


                                <div className="theMessagesRight">


                                    <div className="inComingText theseMessages">
                                        <div className="textDiv">
                                            <span>Coming</span>
                                            <div className="messageDates">
                                                <span className="messageTime">12:09</span>
                                            </div>
                                        </div>
                                        <span className="threeMessageDots"><BsThreeDots /></span>
                                    </div>


                                    <div className="onGoingText theseMessages">
                                        <div className="textDiv">
                                            <span>Going</span>
                                            <div className="messageDates">
                                                <span className="messageTime">12:09</span>
                                            </div>
                                        </div>
                                        <span className="threeMessageDots"><BsThreeDots /></span>
                                    </div>

                                </div>



                            </div>
                        </>
                    )}

                    { !user && (
                        <>
                            <h3>You are Logged out.</h3>
                            <h4>To access your messages, log in first.</h4>
                        </>
                    )}

                    {/* when there are no messages */}
                    { !messagesPresent && user && (
                        <p id="noMessages"><i>You do not have any messages yet.</i></p>
                    )}


                </div>
            </div>

        </>
    )
}

export default Messages;