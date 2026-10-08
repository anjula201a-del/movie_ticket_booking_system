import axios from "axios";
import { Theatre } from "../models/Theatre";
import { BASE_URL, handleToken } from "../libs/Token";

const getTheatres = async () => {
    try {
        const response = await axios.get<Theatre[]>(
            `${BASE_URL}/theatres`, 
            {
            headers: { Authorization: handleToken() },
        }
    );
        return response.data;
    } catch (err) {
        console.error(err);
    }
};

const saveTheatre = async (theatre: Partial<Theatre>) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/theatres`, theatre,
             {
            headers: { Authorization: handleToken() },
        }
    );
        return response.status; 
    } catch (err) {
        console.error(err);
    }
};

const updateTheatre = async (theatre: Theatre) => {
    try {
        const response = await axios.patch(
            `${BASE_URL}/theatres/${theatre.theatreId}`, theatre,
             {
            headers: { Authorization: handleToken() },
        }
    );
     if(response.status !== 204){
            throw new Error ("Failed to Update the Theater")
        }
        return response.status; 
    } catch (err) {
        console.error(err);
    }
};

const deleteTheatre = async (theatreId: string) => {
    try {
        const response = await axios.delete(
            `${BASE_URL}/theatres/${theatreId}`,
             {
            headers: { Authorization: handleToken() },
        }
    );
     if(response.status !== 204){
            throw new Error ("Failed to Delete Theater")
        }
        return response.status;
    } catch (err) {
        console.error(err);
    }
};

export default { getTheatres, saveTheatre, updateTheatre, deleteTheatre };