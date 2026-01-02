import Login from "../user_pages/user_login";
import checkguest from "./checkguest";

const LoginProtected = checkguest(Login);
export default LoginProtected;