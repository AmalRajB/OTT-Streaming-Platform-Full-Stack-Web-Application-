import LandingPage from '../user_pages/userlandingpage'
import checkguest from "./checkguest";

const LandingProtected = checkguest(LandingPage);
export default LandingProtected;