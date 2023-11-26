import { useEffect, useState } from "react";
import { Categories, Counties, Countries, adPageHiddenDivs } from "../external_functions";
import { Link } from "react-router-dom";
import { firebaseConfigurationDetails } from "../external_functions";
import { initializeApp } from "firebase/app";
import { getStorage, ref as storeRefModule, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getDatabase, set, ref as dbRefModule } from "firebase/database";

const Sell = () => {
    // loading state
    const [loading, setLoading] = useState(false);

    const [categories, setCategories] = useState(Categories);
    const [countries, setCountries] = useState(Countries);
    const [counties, setCounties] = useState([]);
    const [currentCountry, setCurrentCountry] = useState("Kenya");
    const [countryCode, setCountryCode] = useState("+254");

    const [enteredMainImage, setEnteredMainImage] = useState([]);
    let [enteredExtraSellerImages, setEnteredExtraSellerImages] = useState([]);
    const [noOfImages, setNoOfImages] = useState(0);
    const [oneExtraImage, setOneExtraImage] = useState(false);
    const [enteredSellerName, setEnteredSellerName] = useState("");
    // const [enteredCountry, setEnteredCountry] = useState("");
    const [enteredPhoneNumber, setEnteredPhoneNumber] = useState("");
    const [enteredRegion, setEnteredRegion] = useState("Nairobi");
    const [enteredItemName, setEnteredItemName] = useState("");
    const [enteredItemPrice, setEnteredItemPrice] = useState(0);
    const [enteredCategory, setEnteredCategory] = useState("Vehicles");
    const [enteredPriceNegotiable, setEnteredPriceNegotiable] = useState(null);
    const [enteredItemStatus, setEnteredItemStatus] = useState(null);
    let [enteredItemFeatures, setEnteredItemFeatures] = useState([]);

    const [editedPhoneNumber, setEditedPhoneNumber] = useState(null);


    useEffect( () => {
        if (loading) {
            document.getElementById("loadingModal").style.display = "flex";
        } else {
            document.getElementById("loadingModal").style.display = "none";
        }
    }, [loading])




    // change counties with country onChange
    useEffect( () => {
        if (currentCountry) {
            if (currentCountry === "Kenya") {
                setCounties(Counties[0]);
                setCountryCode("+254");
            } else if (currentCountry === "Uganda") {
                setCounties(Counties[1]);
                setCountryCode("+256");
            } else if (currentCountry === "Tanzania") {
                setCounties(Counties[2]);
                setCountryCode("+255");
            } else setCounties("");
        }

        setTimeout(() => { setEnteredRegion(document.getElementById("sellCounty").value); }, 0);

        
    }, [currentCountry]);

    // to alter the span for no. of images uploaded in extras div
    useEffect( () => {
        setNoOfImages(enteredExtraSellerImages.length);
        if (enteredExtraSellerImages.length === 1) {
            setOneExtraImage(true);
        } else setOneExtraImage(false);
    }, [enteredExtraSellerImages]);

    // phone number
    useEffect( () => {
        const fullPhoneNumber = countryCode.toString() + enteredPhoneNumber;
        setEditedPhoneNumber(fullPhoneNumber);
    }, [editedPhoneNumber, countryCode, enteredPhoneNumber])

    // when category changes
    useEffect( () => {
        if (enteredCategory === "Service") {
            document.getElementById("sellPriceLabel").style.display = "none";
            document.getElementById("priceNegotiableDiv").style.display = "none";
            document.getElementById("newOrOldItemDiv").style.display = "none";
            setEnteredItemPrice("null");
            setEnteredPriceNegotiable("null");
            setEnteredItemStatus("null");
            return;
        }
        document.getElementById("sellPriceLabel").style.display = "";
        document.getElementById("priceNegotiableDiv").style.display = "";
        document.getElementById("newOrOldItemDiv").style.display = "";
    }, [enteredCategory])

    // when user uploads main image
    const HandleMainImage = event => {
        const fileNameElement = document.getElementById('mainImgName');
        if (fileNameElement && event.target.files.length > 0) {
            const mainImage = event.target.files;
            fileNameElement.textContent = mainImage[0].name;
            setEnteredMainImage([...event.target.files]);
        } else {
            // ======
        }
    }

    // the additional images
    const HandleAdditionalImages = event => {
        const fileNamesElements = document.querySelectorAll(".additionalImagesNames");
        if (fileNamesElements) {
            let additionalImages = event.target.files;
            if (additionalImages.length > 0) {
                setEnteredExtraSellerImages([...event.target.files]);
            }
        }
    }

    // when a feature is typing
    const featureTyping = () => {
        document.getElementById("reqFeatures").style.display = "";
        const addButton = document.getElementById("addFeatureButton");
        const typedProductFeature = document.getElementById("typeProductFeature").value;
        if(typedProductFeature.split("").length >= 3) {
            addButton.classList.remove("inactiveButton");
            return;
        }
        addButton.classList.add("inactiveButton");
    }

    // adding product features
    const addFeature = () => {
        const typedProductFeature = document.getElementById("typeProductFeature").value;
        if (typedProductFeature.split("").length < 3) {
            // do nothing if there is nothing to add.
            document.getElementById("typeProductFeature").focus();
            return false;
        } else {
            // at least there is something in that input
            // and it's over 3 characters long
            const li = document.createElement("li");
            li.textContent = typedProductFeature;
            const ul = document.getElementById("featuresList")
            ul.appendChild( li );
            document.getElementById("removeFeatureButton").classList.remove("inactiveButton");
            
            let allListsTextContent = [], allLists = ul.querySelectorAll("li");
            for (let j = 0; j < allLists.length; j++) {
                const element = allLists[j].textContent;
                allListsTextContent.push(element)
                
            }
            setEnteredItemFeatures([...allListsTextContent]);

        }
        // it's added
        document.getElementById("addFeatureButton").classList.add("inactiveButton");
        document.getElementById("typeProductFeature").value = "";
        document.getElementById("typeProductFeature").focus();
    }
    
    // listen to the key enter when the user is typing a feature
    // const listenEnter = event => {
    //     if (event.keyCode === 13) {
    //         document.getElementById("addFeatureButton").click();
    //         document.getElementById("typeProductFeature").focus();
    //     }
    // }
    
    // delete the last feature.
    const deleteFeature = event => {
        const ul = document.getElementById("featuresList");
        const wholeList = ul.querySelectorAll("li");
        if (wholeList.length === 0) {
            document.getElementById("typeProductFeature").focus();
            return false
        } else {
            if (ul) {
                wholeList[wholeList.length - 1].remove();
            }
            if (wholeList.length === 1) {
                document.getElementById("removeFeatureButton").classList.add("inactiveButton");
                document.getElementById("typeProductFeature").focus();
            }
        }
    }










    // when the user clicks post
    const GenerateStoreVariable = () => {
        // get all inputs

        // main image
        const mainImage = document.getElementById("mainImage")?.files[0];
        if ( mainImage === undefined ) {
            adPageHiddenDivs("reqMainImage");
            window.scrollTo( {
                top: 0,
                behavior: "smooth",
            } )
            document.getElementById("mainImageClickable").click();
            return false;
        }

        // extra images
        // let extraImages = document.getElementById("additionalImages")?.files;
        // if( extraImages && extraImages.length !== 0 ) {
        //     for(let i=0; i < extraImages.length; i++) {
        //         // setEnteredExtraSellerImages( enteredExtraSellerImages += extraImages[i] )
        //     }
        // }
        if (enteredExtraSellerImages.length < 2) {
            window.scrollTo( {
                top: 0,
                behavior: "smooth",
            } )
            adPageHiddenDivs("reqExtraImages");
            return false;
        }
        
        
        // seller's name
        const sellSellerName = document.getElementById("sellSellerName")?.value.trim();
        if ( sellSellerName.indexOf(" ") === -1 || sellSellerName.indexOf(" ") !== sellSellerName.lastIndexOf(" ")) {
            // this person did not give 2 names
            adPageHiddenDivs("reqSellerName");
            document.getElementById("sellSellerName").focus();
            return false;
        }
        const splitSellerName = sellSellerName.split("");
        const unInclusive = ",./?;:'\"-_!`$%^&*)(><][}{\\+@~".split("");
        for (let a = 0; a < splitSellerName.length; a++) {
            for (let b = 0; b < unInclusive.length; b++) {
                if (splitSellerName[a] === unInclusive[b]) {
                    adPageHiddenDivs("reqSymbolsInName")
                    return false;
                }
            }
            
        }
        
        // country
        const sellerCountry = document.getElementById("sellCountry");
        if (sellerCountry) {
            // setEnteredCountry(sellerCountry.value);
        }

        // phone number
        const inputNumber = document.getElementById("sellSellerContact")?.value;
        if (inputNumber.length !== 9) {
            adPageHiddenDivs("reqPhoneNumber");
            document.getElementById("sellSellerContact").focus();
            document.getElementById("sellSellerContact").focus();
            return false
        } else {
            setEnteredPhoneNumber(inputNumber);
        }

        // county/region
        // const regionInput = document.getElementById("sellCounty");
        // if (regionInput) {
        //     // setEnteredRegion(regionInput.value);
        // }

        // item Name
        const itemName = document.getElementById("sellProduct")?.value;
        if (itemName === "" || itemName.length < 3) {
            adPageHiddenDivs("reqProductName");
            document.getElementById("sellProduct").focus();
            return false;
        }
        const splitItemName = itemName.split("");
        const unInclusiveHere = ",./?;:'\"_!`$%^&*)(><][}{\\+@~".split("");
        for (let a = 0; a < splitItemName.length; a++) {
            for (let b = 0; b < unInclusiveHere.length; b++) {
                if (splitItemName[a] === unInclusiveHere[b]) {
                    adPageHiddenDivs("reqSymbolsInItemName")
                    return false;
                }
            }
            
        }

        // price
        // const itemPrice = document.getElementById("sellPrice")?.value;
        if (enteredCategory.toLowerCase() !== "service") {
            if (!enteredItemPrice > 0) {
                adPageHiddenDivs("reqPrice");
                document.getElementById("sellPrice").focus();
                return false;
            }
        }

        // category
        // const category = document.getElementById("sellCategory").value;
        // if (!category) {
        //     adPageHiddenDivs("reqCatagory");
        //     return false;
        // } else setEnteredCategory(category);

        // item price negotiable
        if (enteredCategory.toLowerCase() !== "service") {
            const priceNegotiableDiv = document.getElementById("priceNegotiableDiv");
            if (priceNegotiableDiv) {
                if (enteredPriceNegotiable === null) {
                    adPageHiddenDivs("reqPriceNegotiable");
                    priceNegotiableDiv.querySelectorAll("input")[0].focus();
                    return false;
                }
            }
        }

        // item used
        const itemNewOrOldDiv = document.getElementById("newOrOldItemDiv");
        if (enteredCategory.toLowerCase !== "service") {
            if (itemNewOrOldDiv) {
                if (enteredItemStatus === null) {
                    adPageHiddenDivs("reqItemStatus");
                    itemNewOrOldDiv.querySelectorAll("input")[0].click();
                    alert("You didn't specify item status so the system chose 'used'.");
                }
            }
        }

        // features
        const sellerItemFeatures = document.getElementById("sellerItemFeatures");
        if (sellerItemFeatures) {
            const featuresList = sellerItemFeatures.querySelector("#featuresList");
            const lis = featuresList.querySelectorAll("li");
            if (lis && lis.length === 0) {
                // no feaures were added
                adPageHiddenDivs("reqFeatures");
                document.getElementById("typeProductFeature").focus();
                return false;
            } else {
                UploadImages();
                
            }
        }


    }

    const app = initializeApp(firebaseConfigurationDetails);
    const fireStore = getStorage(app);
    const db = getDatabase(app);

    // post to storages
    const UploadImages = async () => {
        setLoading(true);
        // const mainImage = enteredMainImage;
        const Rand = max => Math.floor(Math.random() * max);
        const customID = enteredSellerName.toLowerCase().replace(" ", "_") + enteredPhoneNumber.toString() + enteredItemName.toLowerCase().replace(" ", "_") + Rand(1000000);
        const storageRef = storeRefModule(fireStore, `customerUploads/${customID}/mainImage`);
        
        // Upload the file to Firebase Storage
        const uploadTask = uploadBytesResumable(storageRef, enteredMainImage[0]);
    
        uploadTask.on("state_changed", snapshot => {
            // Track upload progress if needed
            // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            // console.log(`Upload is ${progress}% done`);
          }, error => {
            // Handle errors during upload
            console.error("Upload failed:", error);
        }, () => {
            console.log("Main image has been uploaded!");
            // Upload successful, get the download URL

            // upload additional information to firestore
            const additionalImageInformation = {
                "Seller": enteredSellerName,
                "Country": currentCountry,
                "phoneNumber": editedPhoneNumber,
                "Region": enteredRegion,
                "itemName": enteredItemName,
                "itemPrice": enteredItemPrice,
                "itemCategory": enteredCategory,
                "priceNegotiable": enteredPriceNegotiable,
                "itemStatus": enteredItemStatus,
                "itemFeatures": [enteredItemFeatures],
            }
            const referenceTwo = dbRefModule(db, `customerUploads/${customID}`);
            set(referenceTwo, additionalImageInformation)
            .then(() => {
                console.log("Additional Information has been written successfully.");
            }).catch((err) => {
                console.log("Couldn't write extra information for image to database!");
            });

            // now upload the extra images
            uploadExtraImages();

          }
        );

        const uploadExtraImages = () => {
            try {
                const loop = enteredExtraSellerImages.length < 3 ? enteredExtraSellerImages.length : 3;
                for (let k = 0; k < loop; k++) {
                    const element = enteredExtraSellerImages[k];
                    const storageRef2 = storeRefModule(fireStore, `customerUploads/${customID}/extraImages/extra${k + 1}`);
                    
                    const uploadTask2 = uploadBytesResumable(storageRef2, element);
                    
                    uploadTask2.on("state_changed", snapshot => {
                        // Track upload progress if needed
                        // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        // console.log(`Upload is ${progress}% done`);
                    }, error => {
                        // Handle errors during upload
                        console.error("Upload failed:", error);
                    }, () => {
                        // get the download URL
                        console.log(`Extra Image ${k + 1} uploaded.`);
                        if (k === loop - 1) {
                            setLoading(false);
                        }
                    }
                    );
                }
                // we are good now.
                // go to homepage
                window.pathname.location = "/";
            } catch (error) {
                console.log("A slight error occurred: ", error);
            }
        };
    };
    
    




    


    // stop the number change on scroll at phone number
    const listen = event => {
        event.preventDefault();
    }

    // when a user clicks the radios in price negotiation
    const PriceNegotiationRadio = event => {
        setEnteredPriceNegotiable(event.target.getAttribute("data-innerhtml"));
        document.getElementById("reqPriceNegotiable").style.display = "none";
    }

    // when a user clicks the radios in new or old items
    const itemStatusNewOrOld = event => {
        setEnteredItemStatus(event.target.getAttribute("data-innerhtml"));
        document.getElementById("reqItemStatus").style.display = "none";
    }


    return(
        <>
            <div className="sellerDocumentContainer">
                <div className="leftContainer">
                    <h3>Images</h3>

                    <ul>
                        <li>Upload the main image of your product.</li>
                    </ul>
                        <span className="defaultHidden" id="reqMainImage">This image is needed.</span>

                    <div className="mainImgDiv">

                        <div className="container"> 
                            <label className="header" id="mainImageClickable" htmlFor="mainImage"> 
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> 
                                <path d="M7 10V9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9V10C19.2091 10 21 11.7909 21 14C21 15.4806 20.1956 16.8084 19 17.5M7 10C4.79086 10 3 11.7909 3 14C3 15.4806 3.8044 16.8084 5 17.5M7 10C7.43285 10 7.84965 10.0688 8.24006 10.1959M12 12V21M12 12L15 15M12 12L9 15" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg> <p>Browse File to upload!</p>
                            </label>

                            <label htmlFor="mainImage" className="footer"> 
                                <svg fill="#000000" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M15.331 6H8.5v20h15V14.154h-8.169z"></path><path d="M18.153 6h-.009v5.342H23.5v-.002z"></path></g></svg>
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5.16565 10.1534C5.07629 8.99181 5.99473 8 7.15975 8H16.8402C18.0053 8 18.9237 8.9918 18.8344 10.1534L18.142 19.1534C18.0619 20.1954 17.193 21 16.1479 21H7.85206C6.80699 21 5.93811 20.1954 5.85795 19.1534L5.16565 10.1534Z" stroke="#000000" strokeWidth="2"></path> <path d="M19.5 5H4.5" stroke="#000000" strokeWidth="2" strokeLinecap="round"></path> <path d="M10 3C10 2.44772 10.4477 2 11 2H13C13.5523 2 14 2.44772 14 3V5H10V3Z" stroke="#000000" strokeWidth="2"></path> </g></svg>
                            </label>
                            <p id="mainImgName">Not selected file</p> 
                            <input id="mainImage" name="mainImage" type="file" onChange={HandleMainImage}  accept="image/*" /> 
                        </div>

                    </div>

                    <ul>
                        <li>Click to upload multiple additional images</li>
                        <li>You can select upto 3 images.</li>
                        <li>This is also optional.</li>
                    </ul>

                    <div className="additionalmagesDiv">

                        <div className="container"> 
                            <label className="header" htmlFor="additionalImages"> 
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> 
                                <path d="M7 10V9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9V10C19.2091 10 21 11.7909 21 14C21 15.4806 20.1956 16.8084 19 17.5M7 10C4.79086 10 3 11.7909 3 14C3 15.4806 3.8044 16.8084 5 17.5M7 10C7.43285 10 7.84965 10.0688 8.24006 10.1959M12 12V21M12 12L15 15M12 12L9 15" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg> <p>Browse File to upload!</p>
                            </label>

                            <label htmlFor="additionalImages" className="footer"> 
                                <svg fill="#000000" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M15.331 6H8.5v20h15V14.154h-8.169z"></path><path d="M18.153 6h-.009v5.342H23.5v-.002z"></path></g></svg> 
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5.16565 10.1534C5.07629 8.99181 5.99473 8 7.15975 8H16.8402C18.0053 8 18.9237 8.9918 18.8344 10.1534L18.142 19.1534C18.0619 20.1954 17.193 21 16.1479 21H7.85206C6.80699 21 5.93811 20.1954 5.85795 19.1534L5.16565 10.1534Z" stroke="#000000" strokeWidth="2"></path> <path d="M19.5 5H4.5" stroke="#000000" strokeWidth="2" strokeLinecap="round"></path> <path d="M10 3C10 2.44772 10.4477 2 11 2H13C13.5523 2 14 2.44772 14 3V5H10V3Z" stroke="#000000" strokeWidth="2"></path> </g></svg>
                            </label> 

                            <p className="additionalImagesNames" id="additionalImage1">Selected <span id="numberOfFiles">{noOfImages}</span> file{oneExtraImage ? "" : "s"}</p> 
                            {/* <p className="additionalImagesNames" id="additionalImage2">Not selected file</p> 
                            <p className="additionalImagesNames" id="additionalImage3">Not selected file</p>  */}
                            <input id="additionalImages" name="additionalImages" type="file" onChange={HandleAdditionalImages}  accept="image/*" multiple aria-multiline /> 
                        </div>

                    </div>
                    





                </div>
                <div className="rightContainer">
                    <form action="">

                        {/* seller's name */}
                        <label htmlFor="sellSellerName"><span>Your name:</span>
                            <input type="text" name="sellSellerName" id="sellSellerName" onInput={e => setEnteredSellerName(e.target.value)} placeholder="Eg. John Sila" required aria-required />
                            <span className="defaultHidden" id="reqSellerName">Please provide 2 names.</span>
                            <span className="defaultHidden" id="reqSymbolsInName">Your name cannor contain symbols.</span>
                        </label>

                        {/* country */}
                        <label htmlFor="sellCountry">
                            <span>Country:</span>
                            <select name="sellCountry" id="sellCountry" onChange={ e => setCurrentCountry( e.target.value ) }>
                                <optgroup>
                                {
                                    countries.map( (country, index) => (
                                        <option value={country} key={index}>{country}</option>
                                    ))
                                }
                                </optgroup>
                            </select>
                            <span className="defaultHidden" id="reqExtraImages">Provide at least 2 extra images.</span>
                        </label>

                        {/* seller's phoneNumber */}
                        <label htmlFor="sellSellerContact"><span>Active phone number:</span>
                            <input type="number" name="sellSellerContact" onInput={e => setEnteredPhoneNumber(e.target.value)} id="sellSellerContact" placeholder="Eg. 717405109" onFocus={ event => event.target.addEventListener("wheel", listen) } onBlur={event => event.target.removeEventListener("wheel", listen)} required aria-required />
                            <span id="intlNumCode">{countryCode}</span>
                            <span className="defaultHidden" id="reqPhoneNumber">Provide a valid phone number.</span>
                        </label>

                        {/* county/region */}
                        <label htmlFor="sellCounty">
                            <span>County/Region:</span>
                            <select name="sellCounty" id="sellCounty" onChange={e => setEnteredRegion(e.target.value)}>
                                <optgroup>
                                {
                                    counties.map( (county, index) => (
                                        <option value={county} key={index}>{county}</option>
                                    ))
                                }
                                </optgroup>
                            </select>
                        </label>


                        {/* product name */}
                        <label htmlFor="sellProduct"><span>Item name:</span>
                            <input type="text" name="sellProduct" id="sellProduct" onBlur={e => setEnteredItemName(e.target.value)} placeholder="Eg. Leather Stitch Cardigans" required aria-required />
                            <span className="defaultHidden" id="reqProductName">Provide a valid item name.</span>
                            <span className="defaultHidden" id="reqSymbolsInItemName">Item name must not contain symbols.</span>
                        </label>

                        {/* price */}
                        <label htmlFor="sellPrice" id="sellPriceLabel">
                            <span>Price in KSh: @ item</span>
                            <input type="number" name="sellPrice" id="sellPrice" onInput={e => setEnteredItemPrice(e.target.value)} placeholder="Eg. 10000" min={1} onFocus={ event => event.target.addEventListener("wheel", listen) } onBlur={event => event.target.removeEventListener("wheel", listen)}  />
                            <span className="defaultHidden" id="reqPrice">Provide your price.</span>
                        </label>

                        {/* category */}
                        <label htmlFor="sellCategory">
                            <span>Category:</span>
                            <select name="sellCategory" id="sellCategory" onChange={ e => setEnteredCategory(e.target.value) }>
                                <optgroup>
                                {
                                    categories.map( (category, index) => (
                                        <option value={category} key={index}>{category}</option>
                                    ))
                                }
                                </optgroup>
                            </select>
                        </label>

                        {/* price fixed (true/!) */}
                        <div id="priceNegotiableDiv">
                            <span>Price negotiable</span>
                            <span className="defaultHidden" id="reqPriceNegotiable">You need to choose one of these.</span>
                            <label htmlFor="sellNegotiable">
                                <input type="radio" name="negotiatePrice" id="sellNegotiable" data-innerhtml="negotiable" onClick={PriceNegotiationRadio} />
                                <span>Yes</span>
                            </label>
                            <label htmlFor="sellNotNegotiable">
                                <input type="radio" name="negotiatePrice" id="sellNotNegotiable" data-innerhtml="notNegotiable" onClick={PriceNegotiationRadio} />
                                <span>No</span>
                            </label>
                            <label htmlFor="sellNegotiationUnlist">
                                <input type="radio" name="negotiatePrice" id="sellNegotiationUnlist" data-innerhtml="maybeNegotiable" onClick={PriceNegotiationRadio} />
                                <span>Don't say</span>
                            </label>
                        </div>

                        {/* item state (used/!) */}
                        <div id="newOrOldItemDiv">
                            <span>Is this item used/brand new:</span>
                            <span className="defaultHidden" id="reqItemStatus">Please select one.</span>
                            <label htmlFor="sellUsed">
                                <input type="radio" name="itemState" data-innerhtml="used" id="sellUsed" onClick={itemStatusNewOrOld} />
                                <span>Used</span>
                            </label>
                            <label htmlFor="sellBrandNew">
                                <input type="radio" name="itemState" data-innerhtml="brandNew" id="sellBrandNew" onClick={itemStatusNewOrOld} />
                                <span>Brand new</span>
                            </label>
                        </div>

                        {/* features */}
                        <div className="sellFeatures" id="sellerItemFeatures">
                            <span>Features:</span>
                            <span className="defaultHidden" id="reqFeatures">Provide at least one feature.</span>
                            <ul id="featuresList"></ul>
                            <input type="text" className="sellProductFeatures" id="typeProductFeature" onInput={featureTyping} /**onFocus={() => window.addEventListener("keypress", listenEnter)} onBlur={() => window.removeEventListener("keypress", listenEnter)} */ placeholder="Describe your item in few words..." />
                            <div className="hasAddButton">
                                <button type="button" onClick={addFeature} className="inactiveButton" id="addFeatureButton">Add</button>
                                <button type="button" onClick={deleteFeature} className="inactiveButton" id="removeFeatureButton">Undo</button>
                            </div>
                        </div>



                        <div className="btn-container">
                            <Link className="btn-content" to="#" onClick={GenerateStoreVariable}>
                                <span className="btn-title">Post</span>
                                <span className="icon-arrow">
                                    <svg width="66px" height="43px" viewBox="0 0 66 43" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                        <g id="arrow" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                            <path id="arrow-icon-one" d="M40.1543933,3.89485454 L43.9763149,0.139296592 C44.1708311,-0.0518420739 44.4826329,-0.0518571125 44.6771675,0.139262789 L65.6916134,20.7848311 C66.0855801,21.1718824 66.0911863,21.8050225 65.704135,22.1989893 C65.7000188,22.2031791 65.6958657,22.2073326 65.6916762,22.2114492 L44.677098,42.8607841 C44.4825957,43.0519059 44.1708242,43.0519358 43.9762853,42.8608513 L40.1545186,39.1069479 C39.9575152,38.9134427 39.9546793,38.5968729 40.1481845,38.3998695 C40.1502893,38.3977268 40.1524132,38.395603 40.1545562,38.3934985 L56.9937789,21.8567812 C57.1908028,21.6632968 57.193672,21.3467273 57.0001876,21.1497035 C56.9980647,21.1475418 56.9959223,21.1453995 56.9937605,21.1432767 L40.1545208,4.60825197 C39.9574869,4.41477773 39.9546013,4.09820839 40.1480756,3.90117456 C40.1501626,3.89904911 40.1522686,3.89694235 40.1543933,3.89485454 Z" fill="#FFFFFF"></path>
                                            <path id="arrow-icon-two" d="M20.1543933,3.89485454 L23.9763149,0.139296592 C24.1708311,-0.0518420739 24.4826329,-0.0518571125 24.6771675,0.139262789 L45.6916134,20.7848311 C46.0855801,21.1718824 46.0911863,21.8050225 45.704135,22.1989893 C45.7000188,22.2031791 45.6958657,22.2073326 45.6916762,22.2114492 L24.677098,42.8607841 C24.4825957,43.0519059 24.1708242,43.0519358 23.9762853,42.8608513 L20.1545186,39.1069479 C19.9575152,38.9134427 19.9546793,38.5968729 20.1481845,38.3998695 C20.1502893,38.3977268 20.1524132,38.395603 20.1545562,38.3934985 L36.9937789,21.8567812 C37.1908028,21.6632968 37.193672,21.3467273 37.0001876,21.1497035 C36.9980647,21.1475418 36.9959223,21.1453995 36.9937605,21.1432767 L20.1545208,4.60825197 C19.9574869,4.41477773 19.9546013,4.09820839 20.1480756,3.90117456 C20.1501626,3.89904911 20.1522686,3.89694235 20.1543933,3.89485454 Z" fill="#FFFFFF"></path>
                                            <path id="arrow-icon-three" d="M0.154393339,3.89485454 L3.97631488,0.139296592 C4.17083111,-0.0518420739 4.48263286,-0.0518571125 4.67716753,0.139262789 L25.6916134,20.7848311 C26.0855801,21.1718824 26.0911863,21.8050225 25.704135,22.1989893 C25.7000188,22.2031791 25.6958657,22.2073326 25.6916762,22.2114492 L4.67709797,42.8607841 C4.48259567,43.0519059 4.17082418,43.0519358 3.97628526,42.8608513 L0.154518591,39.1069479 C-0.0424848215,38.9134427 -0.0453206733,38.5968729 0.148184538,38.3998695 C0.150289256,38.3977268 0.152413239,38.395603 0.154556228,38.3934985 L16.9937789,21.8567812 C17.1908028,21.6632968 17.193672,21.3467273 17.0001876,21.1497035 C16.9980647,21.1475418 16.9959223,21.1453995 16.9937605,21.1432767 L0.15452076,4.60825197 C-0.0425130651,4.41477773 -0.0453986756,4.09820839 0.148075568,3.90117456 C0.150162624,3.89904911 0.152268631,3.89694235 0.154393339,3.89485454 Z" fill="#FFFFFF"></path>
                                        </g>
                                    </svg>
                                </span> 
                            </Link>
                        </div>


                    </form>
                </div>
            </div>
        </>
    )
}

export default Sell;