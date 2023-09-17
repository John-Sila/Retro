import { FaTimes } from "react-icons/fa"

const Home = () => {
    return (
        <>
            <div className="hugePanel">
                <div className="hasSearch">
                    <input type="search" name="search" id="search" placeholder="I am looking for..." maxLength={12} minLength={3}/>
                    <FaTimes className="icon"/>
                </div>
            </div>
        </>
    )
}
export default Home;