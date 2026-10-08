import axios from "axios";
import { Show } from "../models/Show";
import { BASE_URL, handleToken } from "../libs/Token";

const getShows = async () => {
    try {
        const response = await axios.get<Show[]>(
            `${BASE_URL}/shows`, 
            {
            headers: { Authorization: handleToken() },
        }
    );
        return response.data;
    } catch (err) {
        console.error(err);
    }
};

const getShowById = async (showId: string) => {
    try {
        const response = await axios.get<Show>(
            `${BASE_URL}/shows/${showId}`,
             {
            headers: { Authorization: handleToken() },
        }
    );
        return response.data;
    } catch (err) {
        console.error(err);
    }
};

const saveShow = async (show: Partial<Show>) => {
    try {
        const response = await axios.post(
            `${BASE_URL}/shows`, show, 
            {
            headers: { Authorization: handleToken() },
        }
    );
        return response.status; 
    } catch (err) {
        console.error(err);
    }
};

const updateShow = async (show: Show) => {
    try {
        const response = await axios.patch(
            `${BASE_URL}/shows/${show.showId}`, show,
             {
            headers: { Authorization: handleToken() },
        }
    );
     if(response.status !== 204){
            throw new Error ("Failed to Update the Show")
        }
        return response.status; 
    } catch (err) {
        console.error(err);
    }
};

const deleteShow = async (showId: string) => {
    try {
        const response = await axios.delete(
            `${BASE_URL}/shows/${showId}`,
             {
            headers: { Authorization: handleToken() },
        }
    );
     if(response.status !== 204){
            throw new Error ("Failed to Delete the Show")
        }
        return response.status; 
    } catch (err) {
        console.error(err);
    }
};

export default { getShows, getShowById, saveShow, updateShow, deleteShow };