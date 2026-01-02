import Signup from '../user_pages/user_signup'
import checkguest from './checkguest'

const Signupprotected = checkguest(Signup);
export default Signupprotected;