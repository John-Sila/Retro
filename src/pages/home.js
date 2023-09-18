import { Link } from "react-router-dom";
import ReactDOMServer from "react-dom/server"
import { FaTimes } from "react-icons/fa"
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { RiShoppingCart2Line, RiShoppingCart2Fill } from "react-icons/ri";
import { useEffect } from "react";

const Home = () => {

    useEffect( () => {
        document.getElementById("loading").style.display = "grid";
        // when the homepage loads, let's get data from the API
        fetch( "https://fakestoreapi.com/products").then(
            response => response.json()
            ).then(
                json => {
                document.getElementById("loading").style.display = "";
                // visualize data to console
                console.log(json);

                // do something with this data
                const homeRight = document.querySelector("#homeRight");
                
                if (homeRight) {
                    json.forEach(element => {
                        const imageDiv = document.createElement("div")
                        imageDiv.classList.add("imageDiv");

                        const image = document.createElement("img");
                        image.src = element.image;
    
                        let price = document.createElement("span");
                        const priceConstant = Number(146.95);
                        let productPrice = element.price;
                        productPrice *= priceConstant;

                        productPrice = Math.round(productPrice);
                        productPrice = `Ksh. ${productPrice}`;
                        price.innerHTML = productPrice;

                        const productReactions = document.createElement("div");
                        productReactions.classList += "productReactions";
                        const heartIcon = document.createElement('span');
                        heartIcon.id = "heartSpan";
                        const basketIcon = document.createElement('span');
                        basketIcon.id = "basketSpan";
                        const heartElement = ReactDOMServer.renderToString(<AiOutlineHeart />);
                        const cartElement = ReactDOMServer.renderToString(<RiShoppingCart2Line />);
                        const heartElementFill = ReactDOMServer.renderToString(<AiFillHeart />);
                        const cartElementFill = ReactDOMServer.renderToString(<RiShoppingCart2Fill />);
                        heartIcon.innerHTML = heartElement;
                        basketIcon.innerHTML = cartElement;
                        productReactions.appendChild(heartIcon);
                        productReactions.appendChild(basketIcon);

                        productReactions.addEventListener( "click", event => {
                            reactToProduct(event.target.id);
                        })
    
                        imageDiv.appendChild( image ); 
                        imageDiv.appendChild( price );
                        imageDiv.appendChild( productReactions );
    
                        homeRight.appendChild( imageDiv );
                    });
                }
            }
        )


        // also, set the top sticky style for the sideNav
        const sideNav = document.querySelector("#mainAds");
        const topNav = document.querySelector("#topNav");
        
        if (sideNav && topNav) {
            // sideNav.style.top = topNav.clientHeight + "px";
        }

    }, [])

    // React to product
    function reactToProduct( identityArgument ){
        alert(identityArgument);
    }

    return (
        <>
            <div className="hugePanel">
                <div className="hasSearch">
                    <input type="search" name="search" id="search" placeholder="I am looking for..." maxLength={12} minLength={3}/>
                    <FaTimes className="icon"/>
                </div>
            </div>
            <div className="homeContent">
                <aside id="mainAds">
                    <ul>
                        <li><Link to="" className="links">Vehicles</Link></li>
                        <li><Link to="" className="links">Mobile Phones</Link></li>
                        <li><Link to="" className="links">Computer & PC</Link></li>
                        <li><Link to="" className="links">Services</Link></li>
                    </ul>
                </aside>
                <div className="homeRight" id="homeRight">
                </div>
            </div>
        </>
    )
}

export default Home;