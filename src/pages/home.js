import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa"
import { useEffect } from "react";

const Home = () => {

    useEffect( () => {
        // when the homepage loads, let's get data from the API
        fetch( "https://fakestoreapi.com/products").then(
            response => response.json()
        ).then(
            json => {
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
    
                        const price = document.createElement("span");
                        price.innerHTML = element.price;
    
                        imageDiv.appendChild( image ); 
                        imageDiv.appendChild( price );
    
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