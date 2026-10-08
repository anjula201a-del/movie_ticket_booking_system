import axios from "axios";
import { SignIn } from "../models/SignIn";
import { User } from "../models/User";
import { BASE_URL } from "../libs/Token";



const signUp = async (user: Omit<User, "userId">) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/auth/signup`, 
            user
        );
         console.log("Token is: ",response.data.token)
        return response.status;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

const signIn = async (login: SignIn) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/auth/signin`,
             login
        );
        console.log("Token is: ", response.data.token);
        return response.data.token;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export default { signUp, signIn };