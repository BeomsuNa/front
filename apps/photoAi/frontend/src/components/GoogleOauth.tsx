import { GoogleLogin } from '@react-oauth/google';

const GoogleOauth = () => {
<GoogleLogin
  onSuccess={credentialResponse => {
    console.log(credentialResponse);
  }}
  onError={() => {
    console.log('Login Failed');
  }}
></GoogleLogin>
}
export default GoogleOauth
