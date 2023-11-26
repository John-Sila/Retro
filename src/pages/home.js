// import { Link } from "react-router-dom";
import { FaTimes, FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";
import { firebaseConfigurationDetails, windowOnclick } from "../external_functions";
import { AiOutlineArrowLeft, AiOutlineArrowRight, AiFillStar } from "react-icons/ai";
import PanelImages from "./panelimages";
import { ReactComponent as TransportTruck } from "../svgs/undraw_delivery_truck_vt6p.svg";
import { ReactComponent as Gardening } from "../svgs/undraw_gardening_re_e658.svg";
import { ReactComponent as Computer } from "../svgs/undraw_online_test_re_kyfx.svg";

// firebase
import { initializeApp } from "firebase/app";
import { getDatabase, get, ref } from "firebase/database";
// import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getStorage, ref as storageRef, getDownloadURL, listAll, getMetadata } from 'firebase/storage';


const Home = () => {

    // states
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    let [dirNames, setDirNames] = useState([]);
    const [img, setImg] = useState([]);
    const [imgInfo, setImgInfo] = useState([]);
    const [addedImages, setAddedImages] = useState([]);
    const [windowListen, setWindowListen] = useState(false);

    const [searchVal, setSearchVal] = useState("");

    // firebase instance
    const app = initializeApp(firebaseConfigurationDetails);
    const db = getDatabase(app);
    const store = getStorage(app);

    // the loading state
    useEffect( () => {
        if (loading) {
            document.getElementById("loadingModal").style.display = "flex";
        } else {
            document.getElementById("loadingModal").style.display = "none";
        }
    }, [loading])



    
    
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

    }, [])

    // log dirnames
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

    // while (moreImages.length === 0) {
    //     setLoading(true);
    // }

    // the hero tab
    const styleHugePanel = () => {
        const hugePanel = document.querySelector("#hugePanel");
        if (hugePanel) {
            const svgs = hugePanel.querySelector("#svgElements");
            if (svgs) {
                const children = svgs.childNodes;
                setInterval(() => {
                    children.forEach( child => {
                        child.style.display = "none";
                    })
                    const randInt = Math.floor( Math.random() * children.length );
                    const child = children[randInt];
                    child.style.display = "block";
                    // setTimeout(() => {
                    //     child.style.opacity = .5;
                    // }, 500);
                    setTimeout(() => {
                        child.style.opacity = 1.0;
                    }, 3000);
                    setTimeout(() => {
                        child.style.opacity = .0;
                    }, 7000);
                    // setTimeout(() => {
                    //     child.style.opacity = 0;
                    // }, 8000);
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

    // rate product
    const RateProduct = ( index, starNumber ) => {
        const subjectDiv = document.getElementsByClassName("imageDiv")[index - 1];
        const stars = subjectDiv.querySelectorAll(".rateStars");
        stars.forEach( star => {star.classList.remove("checked")}); // remove any current checkings
        for (let i = 0; i < starNumber; i++) {
            stars[i].classList.add("checked");
        }
    }

    // for firebase images onclick
    const fireBaseImgClicked = ( i, singleURL, srcSet, country, region, seller, itemCategory, itemFeatures, itemName, itemPrice, itemStatus, phoneNumber, priceNegotiable ) => {
        // create the JSON
        const fireBaseImageString = { singleURL, srcSet, country, region, seller, itemCategory, itemFeatures, itemName, itemPrice, itemStatus, phoneNumber, priceNegotiable }
        console.log(fireBaseImageString);
        const fireBaseImageJSON = JSON.stringify(fireBaseImageString);
        localStorage.setItem("fireBaseIncomingImage", fireBaseImageJSON);
        // if there was a defaultImages click, delete it
        localStorage.removeItem("productParameters");

        // alert(addedImages.length);
        console.log(itemFeatures.length);

        window.location.pathname = "/this_item";
    }

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
                                <button type="button">Vehicles</button>
                                <button type="button">Mobile Phones</button>
                                <button type="button">Computer, PC & Camera</button>
                                <button type="button">Services</button>
                                <button type="button">Pets</button>
                                <button type="button">Agriculture & Food</button>
                                <button type="button">Fashion & Interior</button>
                                <button type="button">Health & Beauty</button>
                                <button type="button">Children & Babies</button>
                                <button type="button">Sports & Extra Curricular</button>
                                <button type="button">Furniture</button>
                                <button type="button">Kitchenware</button>
                            </div>

                        </div>

                    </aside>

                    <div className="homeRight" id="homeRight">
                        {/* from our JSON */}
                        {
                            products.map((singleItem, index) => (
                                <div className="imageDiv internal" key={index} >

                                    <img src={singleItem.link} alt={singleItem.name} onClick={() => imageClicked(
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
                                        )} />
                                    <span className="itemName searchable">{singleItem.name}</span>
                                    <span className="price">{singleItem.price}</span>
                                    <div className="hasStarsDiv">
                                        <div className="stars">
                                            <span className="rateStars" onClick={() => RateProduct(index, 1)}><AiFillStar/></span>
                                            <span className="rateStars" onClick={() => RateProduct(index, 2)}><AiFillStar/></span>
                                            <span className="rateStars" onClick={() => RateProduct(index, 3)}><AiFillStar/></span>
                                            <span className="rateStars" onClick={() => RateProduct(index, 4)}><AiFillStar/></span>
                                            <span className="rateStars" onClick={() => RateProduct(index, 5)}><AiFillStar/></span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }

                        {/* adsDivs */}
                        {/* <div className="adDiv1">this</div> */}

                        {/* from firebase */}
                        {
                            img.map((singleURL, index) => (
                                <div className="imageDiv internal" key={index}>
                                    <img src={singleURL} alt={imgInfo[index].itemName} onClick={() => fireBaseImgClicked(
                                        index,
                                        singleURL,
                                        addedImages[index],
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
                                            {/* Other content */}
                                            <span className="price">{imgInfo[index].itemPrice === "null" ? "Service" : `KSh ${imgInfo[index].itemPrice}` }</span>
                                            <div className="hasStarsDiv">
                                                <div className="stars">
                                                    <span className="rateStars" onClick={() => RateProduct(index, 1)}><AiFillStar/></span>
                                                    <span className="rateStars" onClick={() => RateProduct(index, 2)}><AiFillStar/></span>
                                                    <span className="rateStars" onClick={() => RateProduct(index, 3)}><AiFillStar/></span>
                                                    <span className="rateStars" onClick={() => RateProduct(index, 4)}><AiFillStar/></span>
                                                    <span className="rateStars" onClick={() => RateProduct(index, 5)}><AiFillStar/></span>
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