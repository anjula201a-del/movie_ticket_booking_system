import axios from "axios";
import { User } from "../models/User";
import { BASE_URL, handleToken } from "../libs/Token";

const getUsers = async () => {
    try {
        const response = await axios.get<User[]>(
            `${BASE_URL}/users`,
             {
            headers: { Authorization: handleToken() },
        }
    );
        return response.data;
    } catch (err) {
        console.error(err);
    }
};

const getUserById = async (userId: string) => {
    try {
        const response = await axios.get<User>(
            `${BASE_URL}/users/${userId}`, 
            {
            headers: { Authorization: handleToken() },
        }
    );
        return response.data;
    } catch (err) {
        console.error(err);
    }
};

const updateUser = async (user: User) => {
    try {
        const response = await axios.patch(
            `${BASE_URL}/users/${user.userId}`, user, 
            {
            headers: { Authorization: handleToken() },
        }
    );
     if(response.status !== 204){
            throw new Error ("Failed to Update the User")
        }
        return response.status; 
    } catch (err) {
        console.error(err);
    }
};

const deleteUser = async (userId: string) => {
    try {
        const response = await axios.delete(
            `${BASE_URL}/users/${userId}`, 
            {
            headers: { Authorization: handleToken() },
        }
    );
     if(response.status !== 204){
            throw new Error ("Failed to Delete the User")
        }
        return response.status; 
    } catch (err) {
        console.error(err);
    }
};

export default { getUsers, getUserById, updateUser, deleteUser };