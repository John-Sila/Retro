import { Link } from "react-router-dom";

const Login = () => {
    return (
        <>
            <div className="loginModal" id="loginModal">
                <form action="" method="post">
                    <label for="email">
                        <input type="text" name="email" id="loginEmail" min={2} required aria-required />
                        <span>Email</span>
                    </label> <br />
                    <label for="password">
                        <input type="password" name="password" id="loginPassword" required />
                        <span>Password</span>
                    </label>

                    <div className="loginSubmissionDiv">
                        <button type="submit">Submit</button>
                        <button type="button">Cancel</button>
                    </div>

                    <p>
                        <span>Don't have an account?</span><br />
                        <Link to="/signup" className="noAcc">Create Account.</Link>
                    </p>
                </form>
            </div>
        </>
    )
}
export default Login;