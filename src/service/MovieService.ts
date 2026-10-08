import axios from "axios";
import { Movie } from "../models/Movie";
import { BASE_URL, handleToken } from "../libs/Token";

const getMovies = async () => {
    try {
        const response = await axios.get<Movie[]>(
            `${BASE_URL}/movies`,
             {
            headers: {
                 Authorization: handleToken()
                 },
        }
    );
        return response.data;
    } catch (err) {
        console.error(err);
    }
};

const getMovieById = async (movieId: string) => {
    try {
        const response = await axios.get<Movie>(
            `${BASE_URL}/movies/${movieId}`, 
            {
            headers: { Authorization: handleToken()

             },
        }
    );
        return response.data;
    } catch (err) {
        console.error(err);
    }
};

const saveMovie = async (movie: Partial<Movie>) => {
    try {
        const response = await axios.post(`${BASE_URL}/movies`, movie, {
            headers: { Authorization: handleToken() },
        }
    );
        return response.status; 
    } catch (err) {
        console.error(err);
    }
};

const updateMovie = async (movie: Movie) => {
    try {
        const response = await axios.patch(
            `${BASE_URL}/movies/${movie.movieId}`,
             movie, 
             {
            headers: { Authorization: handleToken() 

            },
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

const deleteMovie = async (movieId: string) => {
    try {
        const response = await axios.delete(
            `${BASE_URL}/movies/${movieId}`, 
            {
            headers: { Authorization: handleToken() },
        }
    );
      if (response.status !== 204) {
                throw new Error("Failed to delete the User")
      }
        return response.status; 
    } catch (err) {
        console.error(err);
    }
};

export default { getMovies, getMovieById, saveMovie, updateMovie, deleteMovie };