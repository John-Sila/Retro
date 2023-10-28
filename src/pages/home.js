import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";
import { windowOnclick } from "../external_functions";
import moreGoods from "./moregoods";
import { AiOutlineArrowLeft, AiOutlineArrowRight, AiFillStar } from "react-icons/ai";
import PanelImages from "./panelimages";

const Home = () => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // AS AT NOW, THE API IS DOWN 12-10-2023
    // useEffect(() => {
    //     setLoading(true);
    //     fetch('https://fakestoreapi.com/products')
    //       .then((response) => response.json())
    //       .then((json) => {
    //         // console.log(json);
    //         setProducts(json);
    //         setLoading(false);
    //       })
    //   }, []);

    // useEffect(() => {
    //     // Conditionally render the loading div when 'loading' is true
    //     document.getElementById("loadingModal").style.display = loading ? "flex" : "";

    // }, [loading]);


    // when our page loads
    useEffect( () => {
        
        // the slideshow
        const intervalId = setInterval(styleHugePanel, 10000);
        
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
        setLoading(true);
        console.log("Writing Document.");
        // set image
        const productDiv = document.getElementById("productDiv");
        const productImg = document.getElementById("productImg");
        if (productImg) {
            productImg.setAttribute("src", link);
        } else alert(false)

        if (srcSet.length === 0) {
            document.getElementById("productMoreImages").style.display = "none";
        }
        // alert(true)


        document.getElementById("productItemPrice").innerHTML = price;
        document.getElementById("productItemName").innerHTML = name;
        document.getElementById("productSellerLocation").innerHTML = location;
        document.getElementById("productPriceNegotiable").innerHTML = priceNegotiable === Boolean(true)? "Negotiable" : "Not negotiable";
        document.getElementById("productSellerName").innerHTML = seller;
        
        // features
        for (let i = 0; i < features.length; i++) {
            const element = features[i];
            const unorderedList = productDiv.querySelector("#firstDiv").querySelector("#features").getElementsByTagName("ul")[0];
            const li = document.createElement("li");
            const thisText = element;
            li.textContent = thisText;
            unorderedList.appendChild( li );
        }

        console.log("Product writing completed.");
        setLoading(false);
        window.location.pathname = "/this_item";
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
                        moreGoods.map((singleItem, index) => (
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
                                <span className="itemName"> {singleItem.name} </span>
                                <span className="price">{singleItem.price}</span>
                                <div className="stars">
                                    <span><AiFillStar/></span>
                                    <span><AiFillStar/></span>
                                    <span><AiFillStar/></span>
                                    <span><AiFillStar/></span>
                                    <span><AiFillStar/></span>
                                </div>
                            </div>
                        ))
                    }

                    {/* from the API */}
                    {/* {
                        products.map((product, index) => (
                            <div className="imageDiv" key={index} >
                                <img src={product.image} alt={product.title} />
                                <span className="itemName"> {product.title} </span>
                                <span className="price">Ksh. {Math.round(product.price * 146.95)}</span>
                            </div>
                        ))
                    } */}

                </div>
            </div>
        </>
    )
}

export default Home;