import { Link } from "react-router-dom"
import { AiFillEye } from "react-icons/ai"
import { BsArrowBarRight } from "react-icons/bs"

const SignUp = () => (
    <>
        <div className="signup" id="signup">
            <form action="" method="post">
                <label htmlFor="email">
                    <input type="text" name="email" id="email" required aria-required />
                    <span className="labelText">Email</span>
                </label>
                <label htmlFor="password">
                    <input type="password" name="password" id="password" required aria-required />
                    <span className="eye"><AiFillEye /></span>
                    <span className="labelText">Password</span>
                </label>
                <div className="submissionButtons">
                    <button type="submit">Create Account</button>
                </div>
                <div className="signupFinale">
                <hr />
                    <span>Already have an account? <Link to="/login" className="links">Login</Link></span><br />
                    <span>Go to <Link to="/" className="links">homepage.</Link></span>
                </div>
            </form>
        </div>
    </>
)
export default SignUp;