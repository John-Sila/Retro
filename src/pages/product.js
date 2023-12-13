import { Link } from "react-router-dom";
import  { ImLocation2 } from "react-icons/im";
import { MdMessage } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import { useEffect, useState } from "react";
import { getStorage, ref as storageRef, getDownloadURL, listAll, getMetadata } from 'firebase/storage';
import { firebaseConfigurationDetails } from "../external_functions";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, query, orderByChild, equalTo, limitToFirst, onValue, get, set} from "firebase/database";
import {  getAuth, onAuthStateChanged } from "firebase/auth";
// import { getMessaging, isSupported } from "firebase-messaging";

const Product = () => {

    // initialize messaging
    // const Messaging = getMessaging(initializeApp(firebaseConfigurationDetails));

    const [mobileNumber, setMobileNumber] = useState("");
    const [features, setFeatures] = useState([]);
    let [srcSet, setSrcSet] = useState([]);
    const [sellerName, setSellerName] = useState("");
    const [typedMessage, setTypedMessage] = useState("");
    const [recipient, setRecipient] = useState("");
    const [sender, setSender] = useState("");
    let [index, setIndex] = useState(0);
    const [canSend, setCanSend] = useState(false);
    const [text, setText] = useState(0);
    const [messageProgress, setMessageProgress] = useState(null)
    const [modifiedName, setModifiedName] = useState(null);

    const [mainImage, setMainImage] = useState("");
    const [productName, setProductName] = useState("");
    
    useEffect( () => {
        const Subject = localStorage.getItem("productParameters") === null ? "useFirebase" : "useDefault";
        // console.log(Subject);
        setPage(Subject);
        // let there be no available pressLinks
    }, [])

    // mobile number
    useEffect( () => {
        document.getElementById("linkToSeller").setAttribute("href", `https://api.whatsapp.com/send?phone=${mobileNumber}&text=Hello%2C%20this%20is%20concerning%20your%20product%20at%20AfriCart%20Marketplace%2E`);
    }, [mobileNumber]);
    
    const setPage = (param) => {
        if (param === "useDefault") {
            // default
            document.getElementById("thisComa").style.display = "none"
            
            const storedProductParameterJSON = localStorage.getItem("productParameters");
            const parsedParams = JSON.parse(storedProductParameterJSON);
            if (parsedParams) {
                document.getElementById("productImg").setAttribute("src", parsedParams.link);
                setMainImage(parsedParams.link);
                document.getElementById("region").innerHTML = parsedParams.location;
                document.getElementById("productItemName").innerHTML = parsedParams.name;
                setProductName(parsedParams.name);
                // document.getElementById("productSellerName").innerHTML = parsedParams.seller;
                setSellerName(parsedParams.seller);
                document.getElementById("productItemPrice").innerHTML = parsedParams.price;
                setMobileNumber(parsedParams.mobile);
                
                if (parsedParams.srcSet.length > 0) {
                    document.getElementById("productMoreImages").style.display = "none"; // srcSet
                    setSrcSet(parsedParams.srcSet)
                } else if (parsedParams.srcSet.length === 0) {
                    document.getElementById("additionalImages").style.display = "none";
                    document.getElementById("productMoreImages").style.display = "block";
                }
                var seller = parsedParams.seller;
                seller = seller.split(" ");
                const sellerAbbr = seller[0].split("")[0] + seller[1].split("")[0];
                document.getElementById("productSellerName").innerHTML = sellerAbbr;
                
                if (parsedParams.features.length !== 0) {
                    setFeatures(parsedParams.features)
                }

                // is this product a service or not?
                if (parsedParams.category.toLowerCase() === "services") {
                    document.getElementById("productItemPrice").style.display = "none";
                    document.getElementById("itemIsService").style.display = "block";
                }
                // localStorage.removeItem("productParameters");
            } 
        } else if (param === "useFirebase") {
            // firebase
            document.getElementById("thisComa").style.display = "inline"

            const storedProductParameterJSON = localStorage.getItem("fireBaseIncomingImage");
            const parsedParams = JSON.parse(storedProductParameterJSON);
            // return
            document.getElementById("productImg").setAttribute("src", parsedParams.singleURL);
            setMainImage(parsedParams.singleURL)
            document.getElementById("productSellerLocation").innerHTML = parsedParams.country;
            document.getElementById("productItemName").innerHTML = parsedParams.itemName;
            setProductName(parsedParams.name);


            const formatPrice = () => {
                let price = parsedParams.itemPrice;
                if (price.toString().split("").length < 4) {
                    return price;
                }

                price = price.toString().split("").reverse();
                let formattedPrice = "";
                for (let i = 0; i < price.length; i++) {

                    const element = price[i];
                    formattedPrice += element;

                    if ((i + 1) % 3 === 0 && i > 0 && i !== price.length - 1) {
                        formattedPrice += ",";
                    } 
                }
                return formattedPrice.split("").reverse().join("");

            };




            document.getElementById("productItemPrice").innerHTML = `KSh ${formatPrice()}`;
            document.getElementById("region").innerHTML = parsedParams.region;
            setSellerName(parsedParams.seller);
            setMobileNumber(parsedParams.phoneNumber);

            // get the additional images
            const store = getStorage(initializeApp(firebaseConfigurationDetails));
            const ref = storageRef(store, `customerUploads/${parsedParams.identity}/extraImages`);
            listAll(ref).then((result) => {
                const imageRefs = result.items.filter(async (item) => {
                    try {
                        const metadata = await getMetadata(item);
                        return metadata.contentType?.startsWith('image/');

                    } catch (error) {
                        console.error('Error getting metadata:', error);
                        return false;
                    }
                });

                if (imageRefs.length === 0) {
                    document.getElementById("productMoreImages").style.display = "block";
                    return;
                }

                let links = [];
                imageRefs.forEach( imageRef => {
                    getDownloadURL(imageRef).then((url) => {
                        links.push(url)
                        if (links.length === imageRefs.length) {
                            setSrcSet(links);
                        }
                    }).catch((err) => {
                        console.log(`Error getting additional images: ${err}`);
                    });
                })

            });


            var firebaseSeller = parsedParams.seller;
            seller = firebaseSeller.split(" ");
            const sellerAbbr = seller[0].split("")[0] + seller[1].split("")[0];
            document.getElementById("productSellerName").innerHTML = sellerAbbr;

            if (parsedParams.itemFeatures.length !== 0) {
                setFeatures(parsedParams.itemFeatures);
            }

            // is this product a service or not?
            if (parsedParams.itemCategory.toLowerCase() === "service") {
                document.getElementById("productItemPrice").style.display = "none";
                document.getElementById("itemIsService").style.display = "block";
            }
            // localStorage.removeItem("productParameters");
        }
    }
    
    // engage messages
    const engageMessages = () => {

        // we want to make sure that the person logged in is not the seller
        const auth = getAuth();
        onAuthStateChanged( auth, user => {

            if (user) {

                const db = getDatabase(initializeApp(firebaseConfigurationDetails));
                const reference = ref(db, "Customers");
                // this query locates us
                const theQuery = query(
                    reference,
                    orderByChild("trimmedEmail"),
                    equalTo(window.localStorage.getItem("trimmedEmail")),
                    limitToFirst(1),
                );
                onValue(theQuery, (querySnapshot) => {
                    const data = querySnapshot.val();
                    // console.log(data);
                    if (data === null) {
                        // then the number 
                        return false;
                    } else {
                        // we have data
                        const thisEntry = Object.entries(data);
                        const thisNum = thisEntry[0][1].phoneNumber;

                        // sender (this)
                        setSender(thisEntry[0][0]);
                        // console.log(thisEntry[0][0]);
                        
                        if (thisNum === mobileNumber) {
                            // the poster is the one writing the message
                            document.getElementById("ownChat").style.display = "inline";
                            document.getElementById("chatEncrypt").style.display = "none";
                            document.getElementById("chatToDelete").style.display = "none";
                            
                            // disable input
                            const subjectInput = document.getElementById("writeMessage");
                            subjectInput.value = "";
                            subjectInput.style.cursor = "not-allowed";
                            subjectInput.ariaDisabled = true;
                            subjectInput.disabled = true;
                            
                        } else {
                            // the poster is not the one writing the message
                            document.getElementById("chatEncrypt").style.display = "";
                            document.getElementById("chatToDelete").style.display = "";
                            
                            // disable input
                            const subjectInput = document.getElementById("writeMessage");
                            // subjectInput.value = "";
                            subjectInput.style.cursor = "";
                            subjectInput.ariaDisabled = false;
                            subjectInput.disabled = false;
                        }
                    }
                })
                    
            } else {
                // user is logged out
                document.getElementById("ownChat").style.display = "";
                document.getElementById("loginNeeded").style.display = "inline";

                // disable input
                const subjectInput = document.getElementById("writeMessage");
                subjectInput.value = "";
                subjectInput.style.cursor = "not-allowed";
                subjectInput.ariaDisabled = true;
                subjectInput.disabled = true;
                                
            }
        })

        const chatBox = document.getElementById("chatBox");
        if (chatBox) {
            chatBox.style.display = "flex";

            // for the cancel button
            const chatBoxWidth = chatBox.clientWidth;
            if (chatBoxWidth) {
                document.getElementById("cancelMessagesDiv").style.width = `${chatBoxWidth}px`;
            }

            const chatBoxHeight = chatBox.clientHeight;
            const firstSpanHeight = document.getElementById("messagesFirstSpan").clientHeight;
            if (chatBoxHeight && firstSpanHeight) {
                try {
                    const messagesBox = document.getElementById("theMessagesDiv");
                    if (messagesBox) {
                        messagesBox.style.height = `${chatBoxHeight - (firstSpanHeight * 2.75)}px`;
                    }
                } catch (error) {
                    console.error("Error styling chatBox: ", error);
                }
            }
        }
    }

    // disappear messageBox
    const chatBoxDisappear = () => {
        // alert(subject)
        document.getElementById("chatBox").style.display = "";
    }

    // writing message
    const writingMessage = text => {
        if (text === "") {
            const sendButton = document.getElementById("sendText");
            sendButton.style.opacity = "";
            sendButton.style.cursor = "";
            return false;
        } else {
            setTypedMessage(text);
            const sendButton = document.getElementById("sendText");
            try {
                sendButton.style.opacity = 1;
                sendButton.style.cursor = "pointer";
            } catch (error) {
                console.error("Couldn't respond to message input to enable send! ", error);
            }
        }
    }

    // sendMessage
    const sendMessageToSeller = event => {
        const styling = window.getComputedStyle(event.currentTarget).getPropertyValue("opacity");
        if (parseInt(styling) === 1) {
            event.currentTarget.style.opacity = .3;
            document.getElementById("writeMessage").value = "";
            // we have text to send
            // let's know their path
            const db = getDatabase(initializeApp(firebaseConfigurationDetails));
            const reference = ref(db, "Customers");
            try {
                const theQuery = query(
                    reference,
                    orderByChild("phoneNumber"),
                    equalTo(mobileNumber),
                    limitToFirst(1),
                );
                onValue(theQuery, (querySnapshot) => {
                    const data = querySnapshot.val();
                    if (data === null) {
                        console.log("We don't have this recipient somewhere.");
                        return false;
                    } else {
                        const Obj = Object.entries(data);
                        const thisReceiver = Obj[0][0];
                        setRecipient(thisReceiver);
                        setCanSend(true);

                        MessageFunc(sender, thisReceiver, typedMessage);


                    }
                })
            } catch (error) {
                console.log(`Error getting your email credential: ${error}`);
            }
        } else {
            console.log(styling);
            return false;
        }
    }


    const MessageFunc = (sending, receiving, message) => {

        // console.log(true);
        
        // console.log(sending, receiving, message);
        // return
        
        try {
            // console.log(`We have paths ${sender}, & ${recipient}`);
            if (sending === receiving) {
                // the poster is the one writing the message
                document.getElementById("ownChat").style.display = "inline";
                document.getElementById("chatEncrypt").style.display = "none";
                document.getElementById("chatToDelete").style.display = "none";
                
                // disable input
                const subjectInput = document.getElementById("writeMessage");
                subjectInput.value = "";
                subjectInput.style.cursor = "not-allowed";
                subjectInput.ariaDisabled = true;
                subjectInput.disabled = true;
            } else {
                setRecipient(receiving);
                setSender(sending);
                setText(message);
                

                // console.log("es");
                // we should be good now
                if (message === "") {
                    return false;
                }
 
                // know how far the messages have gone
                const db = getDatabase(initializeApp(firebaseConfigurationDetails));
                let ourItemName = productName.replace(/[^a-zA-Z0-9]+/g, "");
                setModifiedName(ourItemName);
                
                const howFar = ref(db, `Customers/${sending}/Messages/${receiving}/${ourItemName}`);
                
                // let lastPos = "";
                function posFunc () {

                    get(howFar).then((x) => {
                        const tVal = x.val();
    
                        let lastPos = tVal === null || tVal === undefined ? 0 : underFunc();
                        
                        function underFunc () {
                            const result = Object.keys(x.val());
                            const pos = result[result.length - 1];
                            let position = parseInt(pos) + 1;
                            
                            return position;
                        }
                        
                        setMessageProgress(lastPos);

                        if (index === 1) {
                            setIndex(0);
                            console.log(`index: ${index}`);
                            console.log(`done`);
                        }

                        FoundPosition(lastPos);
                        
                    }).catch((err) => {
                        console.log(err);
                    });
                    
                }

                posFunc();


                const FoundPosition = (pos) => {

                    const check = () => {
                            setIndex(1);
                    }

                    check();
                    return;

                }


                return;


                // post to sender


            }
            
        } catch (error) {
            console.log(`Error sending message: ${error}`);
        }

    }

    useEffect( () => {
        if (index && index === 1) {
            // console.log("Here");
            // setIndex(() => 0);

            console.table(sender, recipient, text);
            const db = getDatabase(initializeApp(firebaseConfigurationDetails));
            const thisRef = ref(db, `Customers/${sender}/Messages/${recipient}/${modifiedName}/${messageProgress}`);
            set(thisRef, `S:${text}`).then((result) => {
                console.log("Message posted to sender.");
            }).catch((err) => {
                console.log("Couldn't post message to sender's Database Account: ", err);
            });
    
            // post to the recipient
            const anotherRef = ref(db, `Customers/${recipient}/Messages/${sender}/${modifiedName}/${messageProgress}`);
            set(anotherRef, `R:${text}`).then((result) => {
                console.log("Message posted to receiver.");
            }).catch((err) => {
                console.log("Couldn't post message to recipient's Database Account");
            });

        }

    }, [index])

    

    return (
        <>
            <div className="productDiv" id="productDiv">
                {/* <img src="" alt="" /> */}
                <div className="firstDiv" id="firstDiv">
                    <h3 id="productItemName">Name</h3>
                    <img id="productImg" src="" alt="" />
                    <div>
                        <p><ImLocation2 /><span id="region"></span><span id="thisComa">,</span>&nbsp;<span id="productSellerLocation"></span></p>
                        <p id="productMoreImages">No more images for this item were provided.</p>
                    </div>

                    <div className="thisProfile">
                        <div id="sellerProfile" className="profile"><span id="productSellerName"></span></div>
                        <h3 id="productItemPrice"><span id="productPriceNegotiable">Yes</span></h3>

                        <p id="itemIsService">Since this is a service, the prices are not fixed and you might need to contact the service provider for prices.</p>

                        <Link to="" target="_blank" id="linkToSeller" className="linkToSeller"> <button type="button" className="WASeller"><span>Chat&nbsp;{sellerName}&nbsp;on WhatsApp</span></button></Link>
                    </div>

                    
                </div>
                
                <div className="secondDiv" id="secondDiv">

                    <div className="additionalImages" id="additionalImages">
                        {
                            srcSet.map( (imgurl, index) => (
                                <img src={imgurl} key={index} alt="img.png" />
                            ))
                        }
                    </div>
                    
                    <div id="features" className="features">
                        <h3>Features:</h3>
                        <ul>
                            {/* --- */}
                            {
                                features.map( (feature, index) => (
                                    <li key={index}>{feature}</li>
                                ))
                            }
                        </ul>
                    </div>

                    <button className="cartBtn">
                        <svg className="cart" fill="white" viewBox="0 0 576 512" height="1em" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"></path>
                        </svg>
                        ADD TO CART
                        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512" className="product">
                            <path d="M211.8 0c7.8 0 14.3 5.7 16.7 13.2C240.8 51.9 277.1 80 320 80s79.2-28.1 91.5-66.8C413.9 5.7 420.4 0 428.2 0h12.6c22.5 0 44.2 7.9 61.5 22.3L628.5 127.4c6.6 5.5 10.7 13.5 11.4 22.1s-2.1 17.1-7.8 23.6l-56 64c-11.4 13.1-31.2 14.6-44.6 3.5L480 197.7V448c0 35.3-28.7 64-64 64H224c-35.3 0-64-28.7-64-64V197.7l-51.5 42.9c-13.3 11.1-33.1 9.6-44.6-3.5l-56-64c-5.7-6.5-8.5-15-7.8-23.6s4.8-16.6 11.4-22.1L137.7 22.3C155 7.9 176.7 0 199.2 0h12.6z"></path>
                            </svg>
                    </button>

                    <button type="button" className="sendMessage" onClick={engageMessages}>Message {sellerName}</button>

                    
                    <div className="precaution">
                        <h3>Precaution</h3>
                        <h4><b>AfriCart</b> wishes to announce the following:</h4>
                        <ul>
                            <li>We advice you don't pay for items before delivery especially when dealing with sellers that you've never interacted with before.</li>
                            <li><b>AfriCart</b> is only responsible for damages when goods were bought from the <b>AfriCart</b> official shop and records for the transactions effectively made.</li>
                            <li><Link to="/"><b>AfriCart</b></Link> is the only official shop for <b>AfriCart.</b></li>
                            <li>Otherwise, in accordance to the <Link to="/privacy_policy" className="links">privacy policy</Link>, <b>AfriCart</b> will not be responsible, in any way, for any damage or infidelity that may occur between you and the seller.</li>
                            <li>However, <b>AfriCart</b> is responsible for ensuring the security of its customers and in case of mishandling, you can report abuse.</li>
                            <li><b>NB.</b> This report is <b>not</b> anonymous due to reasons mentioned in our <Link to="/privacy_policy">privacy policy.</Link></li>
                            <Link to="/report_abuse" className="r_abuse">Report Abuse!</Link>
                        </ul>
                    </div>
                </div>

                <div className="chatBox zoomClass" id="chatBox">
                    <span id="messagesFirstSpan"><MdMessage /> <span>Texting with {sellerName}</span></span>
                    <div className="theMessagesDiv" id="theMessagesDiv">
                        <span id="chatEncrypt">
                            This chat is not encrypted but it's also never used anywhere by anyone. <br />
                            Its only here to make your work easier. <hr />
                            However, for confidentiality, consider texting {sellerName} through WhatsApp.
                        </span>
                        <hr />
                        <span id="chatToDelete">Unless you have saved this chat, a message will disappear 24 hrs after {sellerName} has received it.</span>
                        <span id="ownChat">You posted this item. You cannot send messages to yourself.</span>
                        <span id="loginNeeded">Consider signing in first.</span>
                        <hr />

                    </div>
                    <div id="hasInput" className="hasInput">
                        <input type="text" name="writeMessage" id="writeMessage" placeholder="Write text message" onInput={ event => writingMessage(event.target.value) } disabled autoFocus />
                        <span id="sendText" onClick={sendMessageToSeller}><IoSend /></span>
                    </div>
                    <span id="cancelMessagesDiv" onClick={() => chatBoxDisappear()}><IoIosArrowDown /> <span>Cancel</span></span>
                </div>
            </div>
        </>
    )
}

export default Product;