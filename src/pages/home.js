// import { Link } from "react-router-dom";
import { FaTimes, FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import { firebaseConfigurationDetails, windowOnclick } from "../external_functions";
import { AiOutlineArrowLeft, AiOutlineArrowRight, AiFillStar } from "react-icons/ai";
// import PanelImages from "./panelimages";
import { ReactComponent as TransportTruck } from "../svgs/undraw_delivery_truck_vt6p.svg";
import { ReactComponent as Gardening } from "../svgs/undraw_gardening_re_e658.svg";
import { ReactComponent as Computer } from "../svgs/undraw_online_test_re_kyfx.svg";

// firebase
import { initializeApp } from "firebase/app";
import { getDatabase, get, ref, query, orderByChild, equalTo, limitToFirst, onValue, set } from "firebase/database";
// import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getStorage, ref as storageRef, getDownloadURL, listAll, getMetadata } from 'firebase/storage';
import { getAuth, onAuthStateChanged } from "firebase/auth";


const Home = () => {

    // states
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    let [dirNames, setDirNames] = useState([]);
    const [img, setImg] = useState([]);
    const [imgInfo, setImgInfo] = useState([]);
    const [addedImages, setAddedImages] = useState([]);
    const [windowListen, setWindowListen] = useState(false);
    const [counter, setCounter] = useState(0);
    // const [filterContent, setFilterContent] = useState(true);

    const [searchVal, setSearchVal] = useState("");

    // firebase instance
    const app = initializeApp(firebaseConfigurationDetails);
    const db = getDatabase(app);
    const store = getStorage(app);

    // the loading state
    useEffect( () => {
        if (loading) {
            document.getElementById("loadingModal").style.display = "flex";
            setCounter(() => counter + 1);
        } else {
            setCounter(0);
            document.getElementById("loadingModal").style.display = "none";
        }
    }, [loading])

    // the loading counter
    useEffect( () => {
        console.log(counter);
        if (counter > 10) {
            window.location.reload();
        }
    }, [counter])


    
    
    // when our page loads
    useEffect( () => {
        setLoading(true); // load
        // const intervalId = setInterval(styleHugePanel, 10000); // the slideshow

        // get default products
        const reference = ref(db, "Products");
        get(reference).then((snapShot) => {
            const data = snapShot.val();
            // console.log(data[1].link);
            setProducts(data);
            setLoading(false);
        }).catch((err) => {
            console.log("An error occurred: ", err);
        });

        // get the other customer uploads too
        if (dirNames.length === 0) {
            const imagesRef = storageRef(store, 'customerUploads');
            listAll(imagesRef)
            .then((res) => {
                // get the directory names
                const newDirNames = res.prefixes.map((prefixRef) => prefixRef.name);
                // setDirNames((prevDirNames) => [...prevDirNames, ...newDirNames]);
                setDirNames(newDirNames)

            })
            .catch((error) => {
                console.error('Error listing subdirectories:', error);
            });
        }

            
        // return () => clearInterval(intervalId); // clean
        styleHugePanel();
        getRatings();

    }, []);


    // get item ratings
    const getRatings = () => {
        const thisRef = ref(db, "Products");
        get(thisRef).then((result) => {
            const data = result.val();
            for (let i = 0; i <= data.length; i++) {
                const element = data[i];
                if (element === undefined || element.rating === null || element.rating === undefined) {
                    continue;
                } else {
                    const ratings = Object.values(element.rating);
                    const ratingLen = Object.keys(element.rating).length;
                    const addedStars = ratings.reduce( (a, b) => b + a);
                    const rate = Math.round(addedStars / parseFloat(ratingLen));
                    const thisDiv = document.getElementById(element.id);
                    const starsDiv = thisDiv.querySelectorAll(".stars")[0];
                    const stars = starsDiv.childNodes;
                    try {
                        for (let i = 0; i < rate; i++) {
                            const main = stars[i];
                            main.classList.add("checked");
                            
                        }
                    } catch (error) {
                        console.log(`Stars for this item (${element.id}) couldn't be located.`);
                    }
                }


                
            }
        }).catch((err) => {
            console.log("Couldn't access database for ratings!", err);
        });

        // perform another get for customerUploads
        const customerUploadsRef = ref(db, `customerUploads`);
        get(customerUploadsRef).then((result) => {
            const data = result.val();
            const Keys = Object.keys(data);
            const length = Keys.length;

            const thisObj = Object.entries(data);
            // console.log(thisObj);


            // return
            for (let i = 0; i < length; i++) {
                const element = thisObj[i][1];
                if (element === undefined || element.rating === null || element.rating === undefined) {
                    continue;
                } else {
                    const ratings = Object.values(element.rating);
                    // console.log(ratings);
                    // return
                    const ratingLen = Object.keys(element.rating).length;
                    const addedStars = ratings.reduce( (a, b) => b + a);
                    const rate = Math.round(addedStars / parseFloat(ratingLen));
                    // console.log(rate);

                    (function abolishNull () {
                        const thisDiv = document.getElementById(element.identity);
                        while (thisDiv === null) {
                            setTimeout(() => {
                                abolishNull();
                            }, 200);
                            return false;
                        }

                        // thisDiv is not null
                        // return
                        if (thisDiv) {
                            const starsDiv = thisDiv.querySelectorAll(".stars")[0];
                            if (starsDiv) {
                                const stars = starsDiv.childNodes;
                                if (stars) {
                                    try {
                                        for (let i = 0; i < rate; i++) {
                                            const main = stars[i];
                                            main.classList.add("checked");
                                        }
                                    } catch (error) {
                                        console.log(`Stars for this item (${element.identity}) couldn't be located.`);
                                    }
                                } else console.log("stars unavailable");
                            } else console.log("This starsDiv could not be found.");
                        } else console.log("This particular imageDiv is unavailable");
                    })();
                } 
            }
        }).catch((err) => {
            console.log("Couldn't access database for ratings on customerUploads!", err);
        });
    };

    // log dirnames...and images, their adds and imgInfo
    let images = [], extrasInfo = [], moreImages = [];
    useEffect( () => {
        // console.log("and here", dirNames);
        if (dirNames.length > 0) {
            // we have names now
            // get urls for main image
            for ( let i = 0; i < dirNames.length; i++) {
                const dirName = dirNames[i];
                const pathRef = storageRef(store, `customerUploads/${dirName}`);

                listAll(pathRef)
                .then((result) => {
                    const imageRefs = result.items.filter(async (item) => {
                        try {
                            const metadata = await getMetadata(item);
                            return metadata.contentType?.startsWith('image/');

                        } catch (error) {
                            console.error('Error getting metadata:', error);
                            return false;
                        }
                    });


                    imageRefs.forEach((imageRef) => {
                        getDownloadURL(imageRef)
                        .then((url) => {
                            // console.log('Image URL:', url);
                            // Use the URL as needed (e.g., display the image on your website)
                            images.push(url);


                            // also get extra images here
                            const moreImagesRef = storageRef(store, `customerUploads/${dirName}/extraImages`);
                            listAll(moreImagesRef).then((result) => {
                                const onlyImagesInExtra = result.items.filter(async (item) => {
                                    // get only the images
                                    try {
                                        const metadata = await getMetadata(item);
                                        return metadata.contentType?.startsWith('image/');
                
                                    } catch (error) {
                                        console.error(`Error getting metadata for additional images of directory ${i + 1}:`, error);
                                        return false;
                                    }
                                });
                                const internalArrayForExtraImages = [];
                                onlyImagesInExtra.forEach( (singleImage) => {
                                    getDownloadURL(singleImage).then((url) => {
                                        internalArrayForExtraImages.push(url);
                                        if (internalArrayForExtraImages.length === onlyImagesInExtra.length) {
                                            // then we are good
                                            // console.log(true)
                                            moreImages.push(internalArrayForExtraImages);
                                        }
                                    }).catch((err) => {
                                        console.log(`Couldn't fetch url for an extra image belonging to image ${i + 1}`);
                                    });
                                })



                            }).catch((err) => {
                                console.log("Couldn't get to the table containing extra images.");
                            });




                            // also perform addInfo here
                            const pathRef = ref(db, `customerUploads/${dirName}`);
                            get(pathRef).then((snapShot) => {
                                const retrievedInfo = snapShot.val();
                                try {
                                    if (imgInfo.length < dirNames.length) {
                                        // const index = dirNames.length;
                                        // appendDatabaseAccess([retrievedInfo], index);

                                        extrasInfo.push(retrievedInfo);
                                        setImgInfo(extrasInfo);

                                        // if (imgInfo.length === index) {
                                        //     console.log("Info set: ", imgInfo);
                                        // }

                                    }
                                } catch (error) {
                                    console.log(`Couldn't call database function: ${error}`);
                                }
                            }).catch((err) => {
                                console.error("Couldn't access database image info.", err);
                            });


                            

                            // handle urls
                            if (i === dirNames.length - 1) {
                                // the loop is over
                                HandleURLs(dirNames.length);
                            }

                            


                        }).catch((error) => {
                            console.error('Error getting download URL for this image:', error);
                        });
                    });

                })
                .catch((error) => {
                    console.error('Error listing files: ', error);
                });
            }
        }
    }, [dirNames]);

    // setting the derivative states for mainpage(url), extraImages(uel) and addINFO
    const HandleURLs = loopNumber => {
        if (images.length === loopNumber && extrasInfo.length === loopNumber && moreImages.length !== 0) {
            // alert()
            setImg(images);
            setImgInfo([...extrasInfo]);
            setAddedImages([...moreImages]);
        } else {
            setTimeout(() => {
                HandleURLs(loopNumber);
            }, 500);
        }
    }

    // the hero tab
    const styleHugePanel = () => {
        const hugePanel = document.querySelector("#hugePanel");
        if (hugePanel) {
            const svgs = hugePanel.querySelector("#svgElements");
            if (svgs) {
                const children = svgs.childNodes;

                // this is just for the first show
                setTimeout(() => {
                    children.forEach( child => {
                        child.style.display = "none";
                    })
                    const randInt = Math.floor( Math.random() * children.length );
                    const child = children[randInt];
                    child.style.display = "block";
                    setTimeout(() => {
                        child.style.opacity = 1.0;
                    }, 3000);
                    setTimeout(() => {
                        child.style.opacity = .0;
                    }, 7000);
                }, 0);




                setInterval(() => {
                    children.forEach( child => {
                        child.style.display = "none";
                    })
                    const randInt = Math.floor( Math.random() * children.length );
                    const child = children[randInt];
                    child.style.display = "block";
                    setTimeout(() => {
                        child.style.opacity = 1.0;
                    }, 3000);
                    setTimeout(() => {
                        child.style.opacity = .0;
                    }, 7000);
                }, 10000);
            }
        } else return false;
    }

    // when mouse is over the search icon
    const SearchIconClick = () => {
        if (searchVal === "") { return false }
        // this is supposed to execute when the user wants to search generally.
        // like all mercedes benz cars in the site
        const noSearchResults = document.getElementById("noSearchResults");
        const imageDivs = document.querySelectorAll('.imageDiv');
        if (noSearchResults === null) {
            // there are results for searched content
            // show the search results in their divs
            
            // first, then disappear all of the imageDivs
            imageDivs.forEach(imageDiv => {
                imageDiv.style.display = "none";
            })
            const searchedContent = document.getElementById("searchedContent");
            const allPsHere = searchedContent.querySelectorAll("p");
            // then loop again over all imageDivs and see if their search result is here
            // then display them
            // today we finish with that😓
            imageDivs.forEach( imageDiv => {
                const thisItemName = imageDiv.querySelector(".itemName").innerHTML;

                for (let i = 0; i < allPsHere.length; i++) {
                    if (thisItemName === allPsHere[i].innerHTML) {
                        imageDiv.style.display = "";
                        break;
                    }
                    
                }

            })

            setSearchVal("");

        } else {
            // there are no results for searched content
            // so just display everything
            imageDivs.forEach(imageDiv => {
                imageDiv.style.display = "";
            })
        };
        
    }

    // windowListen
    window.onclick = event => {
        setSearchVal("");
    }

    // searching
    useEffect( () => {
        // first, strip the search results bare
        const searchedContentDiv = document.getElementById("searchedContent");
        const children = searchedContentDiv.childNodes;
        if (searchedContentDiv && children) {
            for ( let i = children.length - 1; i >= 0; --i ){
                searchedContentDiv.removeChild(children[i]);
            }
        }

        // onInput, know whether to display the "x"
        const xIcon = document.getElementById("deleteInput");
        if (searchVal === "") {
            xIcon.style.display = "";
        } else {
            // alert("here")
            xIcon.style.display = "block"
            // also, know if to intergrate the search results
            // since the client is trying to search something.
            const searchables = document.getElementsByClassName("searchable");

            if (searchables) {
                setWindowListen(true);
                // we want to ensure the regexp wont have symbols
                function cleanRegex(str) {
                    return str.toLowerCase().replace(/[^a-zA-Z\s-]/g, ''); // Replace any character not in a-z or A-Z with an empty string
                }

                const regularExpression = new RegExp(cleanRegex(searchVal));
                // alert(cleanRegex(searchVal))
                for (let i = 0; i < searchables.length; i++) {
                    const element = searchables[i].textContent.toString().toLowerCase();
                    if (regularExpression.test(element)) {
                        const pElement = document.createElement("p");
                        // const pElementText = document.createTextNode(element);
                        pElement.innerHTML = searchables[i].textContent;

                        
                        // when a searched item is clicked
                        // make the page only contain that one item
                        pElement.addEventListener( "click", event => {
                            const imageDivs = document.querySelectorAll('.imageDiv');
                            if (imageDivs) {
                                imageDivs.forEach( imageDiv => {
                                    if ( imageDiv.querySelectorAll(".itemName")[0].innerHTML === searchables[i].textContent ) {
                                        imageDiv.style.display = "";
                                        return;
                                    } else {
                                        imageDiv.style.display = "none";
                                    }
                                })
                            }

                            // remove this div's contents so it disappears
                            setSearchVal("");

                        })

                        document.getElementById("searchedContent")?.appendChild(pElement);
                    } 
                }

                // if input is not empty but we still dont have any results
                // tell them that no results were found
                if (document.getElementById("searchedContent")?.childNodes.length === 0) {
                    const pElement = document.createElement("span");
                    pElement.innerHTML = "No matches found!";
                    pElement.id = "noSearchResults";
                    document.getElementById("searchedContent")?.appendChild(pElement);
                }
            }

            // only when we have content
            // setWindowListen(true)

        };

    }, [searchVal])
    
    // delete search value
    const deleteInput = event => {
        document.querySelector("#search").value = "";
        setSearchVal("");
        document.querySelector("#search").focus();
    }

    // for filtering from aside
    const filterFromAside = event => {
        const innerHtml = event.target.textContent.toLowerCase().replace(/[\s,]+/g, '');
        const imageDivs = document.querySelectorAll(".imageDiv");

        if (innerHtml !== "allProducts") {
            imageDivs.forEach( imageDiv => { imageDiv.style.display = "none" } );
        }

        switch (innerHtml) {
            case "allproducts":
                imageDivs.forEach( imageDiv => { imageDiv.style.display = "" } );
                break;
            case "vehicles":
                {
                    imageDivs.forEach( imageDiv => {
                        const thisCategory = imageDiv.querySelectorAll(".itemCategorySpan")[0]?.textContent.toLowerCase().replace(/[\s,]+/g, '');
                        // alert(thisCategory);
                        if (thisCategory === "vehicles") {
                            imageDiv.style.display = "";
                        }
                    })
                    break;
                }

            case "mobilephones":
                {
                    imageDivs.forEach( imageDiv => {
                        const thisCategory = imageDiv.querySelectorAll(".itemCategorySpan")[0]?.textContent.toLowerCase().replace(/[\s,]+/g, '');
                        // alert(thisCategory);
                        if (thisCategory === "mobilephones") {
                            imageDiv.style.display = "";
                        }
                    })
                    break;
                }

            case "computerpccamera":
                {
                    imageDivs.forEach( imageDiv => {
                        const thisCategory = imageDiv.querySelectorAll(".itemCategorySpan")[0]?.textContent.toLowerCase().replace(/[\s,]+/g, '');
                        // alert(thisCategory);
                        if (thisCategory === "computerpccamera") {
                            imageDiv.style.display = "";
                        }
                    })
                    break;
                }

            case "generalelectronics":
                {
                    imageDivs.forEach( imageDiv => {
                        const thisCategory = imageDiv.querySelectorAll(".itemCategorySpan")[0]?.textContent.toLowerCase().replace(/[\s,]+/g, '');
                        // alert(thisCategory);
                        if (thisCategory === "generalelectronics") {
                            imageDiv.style.display = "";
                        }
                    })
                    break;
                }

            case "services":
                {
                    imageDivs.forEach( imageDiv => {
                        const thisCategory = imageDiv.querySelectorAll(".itemCategorySpan")[0]?.textContent.toLowerCase().replace(/[\s,]+/g, '');
                        // alert(thisCategory);
                        if (thisCategory === "services") {
                            imageDiv.style.display = "";
                        }
                    })
                    break;
                }

            case "pets":
                {
                    imageDivs.forEach( imageDiv => {
                        const thisCategory = imageDiv.querySelectorAll(".itemCategorySpan")[0]?.textContent.toLowerCase().replace(/[\s,]+/g, '');
                        // alert(thisCategory);
                        if (thisCategory === "pets") {
                            imageDiv.style.display = "";
                        }
                    })
                    break;
                }

            case "foodagriculture":
                {
                    imageDivs.forEach( imageDiv => {
                        const thisCategory = imageDiv.querySelectorAll(".itemCategorySpan")[0]?.textContent.toLowerCase().replace(/[\s,]+/g, '');
                        // alert(thisCategory);
                        if (thisCategory === "foodagriculture") {
                            imageDiv.style.display = "";
                        }
                    })
                    break;
                }

            case "fashioninteriordesign":
                {
                    imageDivs.forEach( imageDiv => {
                        const thisCategory = imageDiv.querySelectorAll(".itemCategorySpan")[0]?.textContent.toLowerCase().replace(/[\s,]+/g, '');
                        // alert(thisCategory);
                        if (thisCategory === "fashioninteriordesign") {
                            imageDiv.style.display = "";
                        }
                    })
                    break;
                }
            

            case "healthbeauty":
                {
                    imageDivs.forEach( imageDiv => {
                        const thisCategory = imageDiv.querySelectorAll(".itemCategorySpan")[0]?.textContent.toLowerCase().replace(/[\s,]+/g, '');
                        // alert(thisCategory);
                        if (thisCategory === "healthbeauty") {
                            imageDiv.style.display = "";
                        }
                    })
                    break;
                }
            

            case "childrenbabies":
                {
                    imageDivs.forEach( imageDiv => {
                        const thisCategory = imageDiv.querySelectorAll(".itemCategorySpan")[0]?.textContent.toLowerCase().replace(/[\s,]+/g, '');
                        // alert(thisCategory);
                        if (thisCategory === "childrenbabies") {
                            imageDiv.style.display = "";
                        }
                    })
                    break;
                }
            

            case "sportsextracurricular":
                {
                    imageDivs.forEach( imageDiv => {
                        const thisCategory = imageDiv.querySelectorAll(".itemCategorySpan")[0]?.textContent.toLowerCase().replace(/[\s,]+/g, '');
                        // alert(thisCategory);
                        if (thisCategory === "sportsextracurricular") {
                            imageDiv.style.display = "";
                        }
                    })
                    break;
                }
            

            case "furniture":
                {
                    imageDivs.forEach( imageDiv => {
                        const thisCategory = imageDiv.querySelectorAll(".itemCategorySpan")[0]?.textContent.toLowerCase().replace(/[\s,]+/g, '');
                        // alert(thisCategory);
                        if (thisCategory === "furniture") {
                            imageDiv.style.display = "";
                        }
                    })
                    break;
                }
            

            case "kitchenware":
                {
                    imageDivs.forEach( imageDiv => {
                        const thisCategory = imageDiv.querySelectorAll(".itemCategorySpan")[0]?.textContent.toLowerCase().replace(/[\s,]+/g, '');
                        // alert(thisCategory);
                        if (thisCategory === "kitchenware") {
                            imageDiv.style.display = "";
                        }
                    })
                    break;
                }
            
                
            default:
                imageDivs.forEach( imageDiv => { imageDiv.style.display = "" } );
                break;
        }

        // check whether there are any of the divs available
        // if false, inform the user then the filter couldn't find any items in that category
        const imageDivsArray = Array.from(imageDivs);
        const availableAsideFiltrationResults = imageDivsArray.filter(imageDiv => {
            const display = window.getComputedStyle(imageDiv).getPropertyValue("display");
            return display !== "none";
        });
        if (availableAsideFiltrationResults.length === 0) {
            document.getElementById("filteredEventTarget").innerHTML = event.target.textContent;
            document.getElementById("noFiltrationResults").style.display = "flex";
        } else {
            document.getElementById("noFiltrationResults").style.display = "";
        }
    }

    // close menu
    const closeMenu = event => {
        document.getElementsByTagName("aside")[0].style.left = "-200vw";
        window.removeEventListener( "click", windowOnclick)
    }

    // image clicking
    const imageClicked = (link, srcSet, price, name, category, location, mobile, priceNegotiable, used, seller, features, additionalInfo) => {
        const productParameters = { link, srcSet, price, name, category, location, mobile, priceNegotiable, used, seller, features, additionalInfo };
        const stringifiedProductParameters = JSON.stringify(productParameters);
        localStorage.setItem("productParameters", stringifiedProductParameters);
        // if there was an existing event of firebase image clicking, delete it
        localStorage.removeItem("fireBaseIncomingImage");
        window.location.pathname = "/this_item";
    }

    // imageContextMenu
    const imageContextMenu = () => {
        // alert(true)
    }

    // rate product
    const RateProduct = ( identity, starNumber, source ) => {

        // this action requires the user to be logged in
        const auth = getAuth();
        // check the user login state
        // Set up an observer to watch for changes in the user's authentication state
        onAuthStateChanged(auth, user => {
            if (!user) {
                // User is signed out
                document.getElementById("loginFirst").style.display = "grid";
                return false;
            } else {
                // User is signed in
                const subjectDiv = document.getElementById(identity);
                const stars = subjectDiv.querySelectorAll(".rateStars");
                stars.forEach( star => {star.classList.remove("checked")}); // remove any current checkings
                for (let i = 0; i < starNumber; i++) {
                    stars[i].classList.add("checked");
                    stars[i].classList.add("starPulseOut");
                }
        
                // now edit database
                if (source === "defaults") {
                    // access database
                    const app = initializeApp(firebaseConfigurationDetails);
                    const database = getDatabase(app);
                    const reference = ref(database, "Products");
                    const theQuery = query(
                        reference,
                        orderByChild("id"),
                        equalTo(identity),
                        limitToFirst(1)
                    )
                    onValue(theQuery, (snapshot) => {
                        const data = snapshot.val();
                        if (data === null) {
                            return false;
                        } else {
                            const parsed = Object.keys(data)[0];
                            // now you can have the path
                            const postRef = ref(database, `Products/${parsed}/rating/${window.localStorage.getItem("trimmedEmail")}`);
                            set(postRef, starNumber).then(() => {
                                // rating has been made successfully
                            }).catch((err) => {
                                // rating couldn't be posted to db
                                stars.forEach( star => {star.classList.remove("checked")});
                            });

                        }

                    })
  
                } else if (source === "customerUploads") {
                    // go to database
                    const thisRef = ref(db, `customerUploads/${identity}/rating/${window.localStorage.getItem("trimmedEmail")}`)
                    set(thisRef, starNumber).then(() => {
                        // rate has been put to database
                    }).catch((err) => {
                        console.log(`Error updating product's rating.${err}`);
                        stars.forEach( star => {star.classList.remove("checked")}); 
                    });
                }

            }

        });



    }

    // when rate star animation ends
    const starAnimationEnded = () => {
        // alert("animatonEnded=true")
        const stars = document.querySelectorAll(".rateStars");
        if (stars) {
            stars.forEach( star => {
                star.classList.remove("starPulseOut");
            })
        }
    }

    // for firebase images onclick
    const fireBaseImgClicked = ( singleURL, identity, country, region, seller, itemCategory, itemFeatures, itemName, itemPrice, itemStatus, phoneNumber, priceNegotiable ) => {
        // create the JSON
        const fireBaseImageString = { singleURL, identity, country, region, seller, itemCategory, itemFeatures, itemName, itemPrice, itemStatus, phoneNumber, priceNegotiable }
        console.log(fireBaseImageString);
        const fireBaseImageJSON = JSON.stringify(fireBaseImageString);
        localStorage.setItem("fireBaseIncomingImage", fireBaseImageJSON);
        // if there was a defaultImages click, delete it
        localStorage.removeItem("productParameters");

        // alert(addedImages.length);
        console.log(itemFeatures.length);

        window.location.pathname = "/this_item";
    }


    // format price
    const formatPrice = param => {
        let price = param;
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

    return (
        <>
            <div className="hugePanel" id="hugePanel">

                <div className="svgElements" id="svgElements">
                    <div className="TransportTruck" id="TransportTruck"><TransportTruck style={{height: "20vh", width: "100vw"}} /></div>
                    <div className="Gardening" id="Gardening"><Gardening style={{height: "20vh", width: "100vw"}} /></div>
                    <div className="Computer" id="Computer"><Computer style={{height: "20vh", width: "100vw"}} /></div>
                </div>

            </div>

            <div className="homeContent">

                <div className="hasSearch" id="hasSearch">

                    <div className="searchDiv" id="searchDiv">
                        <input type="search" className="zoomClass" name="search" id="search" placeholder="Search market" maxLength={15} onInput={e => setSearchVal(e.target.value)} />
                        
                        <div className="makeRel">
                            <div className="searchedContent" id="searchedContent">
                                
                            </div>
                        </div>
                    </div>

                    <span onClick={SearchIconClick}>
                        <FaSearch className="searchIcon" id="searchIcon" onClick={SearchIconClick} />
                    </span>
                    <FaTimes className="icon" id="deleteInput" onClick={deleteInput}/>

                </div>

                <div className="flexRow">
                    <aside id="mainAds">
                        <span className="closeMenu" id="closeMenu" onClick={closeMenu}><FaTimes /></span>

                        <div>

                            <div>
                                <button type="button" onClick={filterFromAside}>All Products</button>
                                <button type="button" onClick={filterFromAside}>Vehicles</button>
                                <button type="button" onClick={filterFromAside}>Mobile Phones</button>
                                <button type="button" onClick={filterFromAside}>Computer, PC, Camera</button>
                                <button type="button" onClick={filterFromAside}>General Electronics</button>
                                <button type="button" onClick={filterFromAside}>Services</button>
                                <button type="button" onClick={filterFromAside}>Pets</button>
                                <button type="button" onClick={filterFromAside}>Food, Agriculture</button>
                                <button type="button" onClick={filterFromAside}>Fashion, Interior Design</button>
                                <button type="button" onClick={filterFromAside}>Health, Beauty</button>
                                <button type="button" onClick={filterFromAside}>Children, Babies</button>
                                <button type="button" onClick={filterFromAside}>Sports, Extra Curricular</button>
                                <button type="button" onClick={filterFromAside}>Furniture</button>
                                <button type="button" onClick={filterFromAside}>Kitchenware</button>
                            </div>

                        </div>

                    </aside>

                    <div className="homeRight" id="homeRight">


                        {/* when filtration didnt work */}
                        <div className="noFiltrationResults" id="noFiltrationResults">
                            <p>Results for <span id="filteredEventTarget"></span> could not be found!</p>
                            <p id="rotateThis90">: (</p>
                        </div>



                        {/* from our JSON */}
                        {
                            products.map((singleItem, index) => (
                                <div className="imageDiv internal" key={index} id={singleItem.id} >

                                    <img src={singleItem.link} alt={singleItem.name} onContextMenu={imageContextMenu} onClick={() => imageClicked(
                                        singleItem.link,
                                        singleItem.srcSet,
                                        singleItem.price,
                                        singleItem.name,
                                        singleItem.category,
                                        singleItem.location,
                                        singleItem.mobile,
                                        singleItem.priceNegotiable,
                                        singleItem.used,
                                        singleItem.seller,
                                        singleItem.features,
                                        singleItem.additionalInfo,
                                        )}
                                    />

                                    <span className="itemName searchable">{singleItem.name}</span>
                                    <span className="price">{singleItem.price}</span>
                                    <span className="itemCategorySpan"><i>{singleItem.category}</i></span>
                                    <div className="hasStarsDiv">
                                        <div className="stars">
                                            <span className="rateStars" onAnimationEnd={starAnimationEnded} onClick={() => RateProduct(singleItem.id, 1, "defaults")}><AiFillStar/></span>
                                            <span className="rateStars" onAnimationEnd={starAnimationEnded} onClick={() => RateProduct(singleItem.id, 2, "defaults")}><AiFillStar/></span>
                                            <span className="rateStars" onAnimationEnd={starAnimationEnded} onClick={() => RateProduct(singleItem.id, 3, "defaults")}><AiFillStar/></span>
                                            <span className="rateStars" onAnimationEnd={starAnimationEnded} onClick={() => RateProduct(singleItem.id, 4, "defaults")}><AiFillStar/></span>
                                            <span className="rateStars" onAnimationEnd={starAnimationEnded} onClick={() => RateProduct(singleItem.id, 5, "defaults")}><AiFillStar/></span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                        
                        {/* from firebase */}
                        {
                            img.map((singleURL, index) => (
                                <div className="imageDiv internal" key={index} id={imgInfo[index].identity}>
                                    <img src={singleURL} alt={imgInfo[index].itemName} onClick={() => fireBaseImgClicked(
                                        singleURL,
                                        imgInfo[index].identity,
                                        imgInfo[index].Country,
                                        imgInfo[index].Region,
                                        imgInfo[index].Seller,
                                        imgInfo[index].itemCategory,
                                        imgInfo[index].itemFeatures[0],
                                        imgInfo[index].itemName,
                                        imgInfo[index].itemPrice,
                                        imgInfo[index].itemStatus,
                                        imgInfo[index].phoneNumber,
                                        imgInfo[index].priceNegotiable,
                                    )} />

                                    {imgInfo && imgInfo[index] && (
                                        <>
                                            <span className="itemName searchable">{imgInfo[index].itemName}</span>
                                            {/* <span>Identity: {imgInfo[index].identity}</span> */}
                                            {/* Other content */}
                                            <span className="price">{imgInfo[index].itemPrice === "null" ? "Service" : `KSh ${formatPrice(imgInfo[index].itemPrice)}` }</span>
                                            <span className="itemCategorySpan"><i>{imgInfo[index].itemCategory}</i></span>
                                            <div className="hasStarsDiv">
                                                <div className="stars">
                                                    <span className="rateStars" onAnimationEnd={starAnimationEnded} onClick={() => RateProduct(imgInfo[index].identity, 1, "customerUploads")}><AiFillStar/></span>
                                                    <span className="rateStars" onAnimationEnd={starAnimationEnded} onClick={() => RateProduct(imgInfo[index].identity, 2, "customerUploads")}><AiFillStar/></span>
                                                    <span className="rateStars" onAnimationEnd={starAnimationEnded} onClick={() => RateProduct(imgInfo[index].identity, 3, "customerUploads")}><AiFillStar/></span>
                                                    <span className="rateStars" onAnimationEnd={starAnimationEnded} onClick={() => RateProduct(imgInfo[index].identity, 4, "customerUploads")}><AiFillStar/></span>
                                                    <span className="rateStars" onAnimationEnd={starAnimationEnded} onClick={() => RateProduct(imgInfo[index].identity, 5, "customerUploads")}><AiFillStar/></span>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home;