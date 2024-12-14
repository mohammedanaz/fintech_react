import {noAuthInstance} from "../axios/Instances"

const AuthApi = {
    login: async (data) => {
        const response = await noAuthInstance.post("accounts/sign-in/", data);
        return response.data; 
    },
    signup: async (data) => {
        const response = await noAuthInstance.post("accounts/sign-up/", data);
        return response.data; 
    },
    signupOtp: async (data) => {
        const response = await noAuthInstance.post("accounts/signup_verify-otp/", data);
        return response.data; 
    },
    loginOtp: async (data) => {
        const response = await noAuthInstance.post("accounts/login_verify-otp/", data);
        return response.data; 
    },
  };
  
  export default AuthApi;