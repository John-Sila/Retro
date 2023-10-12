import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";
import { windowOnclick, windowResized } from "../external_functions";
import moreGoods from "./moregoods";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import PanelImages from "./panelimages";

const Home = () => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // AS AT NOW, THE API IS DOWN 12-10-2023
    useEffect(() => {
        setLoading(true);
        fetch('https://fakestoreapi.com/products')
          .then((response) => response.json())
          .then((json) => {
            console.log(json);
            setProducts(json);
            setLoading(false);
          })
      }, []);

    useEffect(() => {
        // Conditionally render the loading div when 'loading' is true
        document.getElementById("loadingModal").style.display = loading ? "flex" : "";

    }, [loading]);


    // when our page loads
    useEffect( () => {
        
        // the slideshow
        const intervalId = setInterval(styleHugePanel, 10000);
        window.addEventListener( "resize", windowResized);
        // listen for page resize
        
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

    // display the modal when an image is clicked
    const imageDivModal = (index, source, name, url, cost) => {
        // for internal
        const imageDivModal = document.getElementById("imageDivModal");
        if (imageDivModal) {
            const imageDiv = imageDivModal.querySelectorAll("img")[0]
            imageDiv.src = url;
            imageDivModal.style.display = "grid";
            const rightDiv = imageDivModal.querySelector("#modalRight");
            rightDiv.querySelector("#itemName").innerHTML = name;
            rightDiv.querySelector("#itemPrice").innerHTML = cost;
            const x = getComputedStyle(rightDiv).backgroundImage
            if (x.toString().toLowerCase() !== "none" ) {
                // then this is a smaller screen and a media query has already been engaged
                rightDiv.style.backgroundImage = `url(${url})`;
            }

            windowResized()
        }
        // else return null;
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
                        <ul>
                            <li><Link to="" className="links">Vehicles</Link></li>
                            <li><Link to="" className="links">Mobile Phones</Link></li>
                            <li><Link to="" className="links">Computer, PC & Camera</Link></li>
                            <li><Link to="" className="links">Services</Link></li>
                            <li><Link to="" className="links">Pets</Link></li>
                            <li><Link to="" className="links">Agriculture & Food</Link></li>
                            <li><Link to="" className="links">Fashion</Link></li>
                            <li><Link to="" className="links">Health & Beauty</Link></li>
                            <li><Link to="" className="links">Children & Babies</Link></li>
                            <li><Link to="" className="links">Cyber Services</Link></li>
                            <li><Link to="" className="links">Sports & Extra Curricular</Link></li>
                            <li><Link to="" className="links">Furniture</Link></li>
                            <li><Link to="" className="links">Kitchenware</Link></li>
                        </ul>

                        <ul className="snapOne">
                            <li><Link to="/login" className="links guest">Login</Link></li>
                            <li><Link to="/profile" className="links customer">Profile</Link></li>
                        </ul>
                        
                    </div>

                </aside>

                <div className="homeRight" id="homeRight">

                    {/* from our JSON */}
                    {
                        moreGoods.map((singleItem, index) => (
                            <div className="imageDiv" key={index} onClick={() => imageDivModal(index, "internal", singleItem.name, singleItem.link, singleItem.price)}>
                                <img src={singleItem.link} alt={singleItem.name} />
                                <span className="itemName"> {singleItem.name} </span>
                                <span className="singleItem">{singleItem.price}</span>
                            </div>
                        ))
                    }

                    {/* from the API */}
                    {
                        products.map((product, index) => (
                            <div className="imageDiv" key={index} onClick={() => imageDivModal(index, "api")}>
                                <img src={product.image} alt={product.title} />
                                <span className="itemName"> {product.title} </span>
                                <span className="price">Ksh. {Math.round(product.price * 146.95)}</span>
                            </div>
                        ))
                    }

                </div>
            </div>
        </>
    )
}

export default Home;