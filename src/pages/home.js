import { Link } from "react-router-dom";
import ReactDOMServer from "react-dom/server"
import { FaTimes } from "react-icons/fa"
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { RiShoppingCart2Line, RiShoppingCart2Fill } from "react-icons/ri";
import { useEffect, useState } from "react";

const Home = () => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true)
        fetch('https://fakestoreapi.com/products')
          .then((response) => response.json())
          .then((json) => {
            setProducts(json);
            setLoading(false);
          });
      }, []);
      
      const toggleReaction = (productId, reaction) => {
          setProducts((prevProducts) =>
          prevProducts.map((product) => {
            if (product.id === productId) {
              return { ...product, reaction: reaction === product.reaction ? null : reaction, };
            }
            return product;
        })
        );
    };
    
    useEffect(() => {
        // Conditionally render the loading div when 'loading' is true
        document.getElementById("loading").style.display = loading ? "grid" : "";

    }, [loading]);

    
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

                    {products.map((product, index) => (
                        <div className="imageDiv" key={index}>
                            <img src={product.image} alt={product.title} />
                            <span className="price">Ksh. {Math.round(product.price * 146.95)}</span>
                            <div className="productReactions">
                                <span id="heartspan" onClick={() => toggleReaction(product.id, 'heart')} > {product.reaction === 'heart' ? <AiFillHeart /> : <AiOutlineHeart />} </span>
                                <span id="cartspan" onClick={() => toggleReaction(product.id, 'cart')}> {product.reaction === 'cart' ? <RiShoppingCart2Fill /> : <RiShoppingCart2Line />} </span>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </>
    )
}

export default Home;