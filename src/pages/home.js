// import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";
import { windowOnclick } from "../external_functions";
import moreGoods from "./moregoods";
import { AiOutlineArrowLeft, AiOutlineArrowRight, AiFillStar } from "react-icons/ai";
import PanelImages from "./panelimages";

// firebase
import { initializeApp } from "firebase/app";
import { getDatabase, get, ref } from "firebase/database";

const Home = () => {

    const [loading, setLoading] = useState(false);

    const [products, setProducts] = useState([]);
    const getProducts = () => {
        const auth = {
            apiKey: "AIzaSyB-opll1P-81cOoc7oQUQ7G5QUSK5FhfrA",
            authDomain: "retro-bf312.firebaseapp.com",
            databaseURL: "https://retro-bf312-default-rtdb.firebaseio.com",
            projectId: "retro-bf312",
            storageBucket: "retro-bf312.appspot.com",
            messagingSenderId: "319056909364",
            appId: "1:319056909364:web:f2215ade4b825b8fe56661",
            measurementId: "G-NT5D2WTQ8T" 
        }

        const app = initializeApp(auth);
        const db = getDatabase(app);
        const reference = ref(db, "Products");
        get(reference).then((snapShot) => {
            const data = snapShot.val();
            // console.log(data[1].link);
            setProducts(data);
            setLoading(false);
        }).catch((err) => {
            console.log("An error occurred: ", err);
        });
    }




    useEffect( () => {
        if (loading) {
            document.getElementById("loadingModal").style.display = "flex";
        } else {
            document.getElementById("loadingModal").style.display = "";
        }
    }, [loading])





    // when our page loads
    useEffect( () => {
        // the slideshow
        const intervalId = setInterval(styleHugePanel, 10000);
        getProducts();
        setLoading(true);
        
        return () => clearInterval(intervalId);
    }, [])


    const styleHugePanel = () => {
        const hugePanel = document.querySelector("#hugePanel");
        // get a random index
        const index = Math.floor(Math.random() * (PanelImages.length - 1));
        hugePanel.style.backgroundImage = `url(${PanelImages[index].src})`
    }

    const engageSearch = () => {
        const searchBox = document.querySelector("#search");
        document.getElementById("deleteInput").style.display = searchBox.value === "" ? "none" : "block";
    }
    
    const deleteInput = event => {
        document.querySelector("#search").value = "";
        event.target.style.display = "none";
    }

    const closeMenu = event => {
        document.getElementsByTagName("aside")[0].style.left = "-200vw";
        window.removeEventListener( "click", windowOnclick)
    }

    // image clicking
    const imageClicked = (link, srcSet, price, name, category, location, mobile, priceNegotiable, used, seller, features, additionalInfo) => {
        const productParameters = { link, srcSet, price, name, category, location, mobile, priceNegotiable, used, seller, features, additionalInfo };
        const stringifiedProductParameters = JSON.stringify(productParameters);
        localStorage.setItem("productParameters", stringifiedProductParameters);
        window.location.pathname = "/this_item";
    }

    // rate product
    const RateProduct = ( index, starNumber ) => {
        const subjectDiv = document.getElementsByClassName("imageDiv")[index];
        const stars = subjectDiv.querySelectorAll(".rateStars");
        stars.forEach( star => {star.classList.remove("checked")}); // remove any current checkings
        for (let i = 0; i < starNumber; i++) {
            stars[i].classList.add("checked");
        }
    }

    return (
        <>
            <div className="hugePanel" id="hugePanel">

                <div className="hugePanelLeft">
                    <span onClick={styleHugePanel}><AiOutlineArrowLeft /></span>
                </div>

                <div className="hasSearch">
                    <input type="search" name="search" id="search" placeholder="I am looking for..." maxLength={12} minLength={3} onInput={engageSearch} />
                    <FaTimes className="icon" id="deleteInput" onClick={deleteInput}/>
                </div>

                <div className="hugePanelRight">
                    <span onClick={styleHugePanel}><AiOutlineArrowRight /></span>
                </div>

            </div>

            <div className="homeContent">
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
                            
                            {/* <div className="snapOne">
                                <Link to="/login" className="links guest">Login</Link>
                                <Link to="/my_profile" className="links customer">Log out</Link>
                            </div> */}
                            
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
                                <span className="itemName">{singleItem.name}</span>
                                <span className="price">{singleItem.price}</span>
                                <div className="stars">
                                    <span className="rateStars" onClick={() => RateProduct(index, 1)}><AiFillStar/></span>
                                    <span className="rateStars" onClick={() => RateProduct(index, 2)}><AiFillStar/></span>
                                    <span className="rateStars" onClick={() => RateProduct(index, 3)}><AiFillStar/></span>
                                    <span className="rateStars" onClick={() => RateProduct(index, 4)}><AiFillStar/></span>
                                    <span className="rateStars" onClick={() => RateProduct(index, 5)}><AiFillStar/></span>
                                </div>
                            </div>
                        ))
                    }

                    {/* adsDivs */}
                    {/* <div className="adDiv1">this</div> */}

                </div>
            </div>
        </>
    )
}

export default Home;