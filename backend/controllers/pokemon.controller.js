import axios from "axios";
import { pokemonSchema } from "../validations/pokemon.validation.js";
import Pokemon from "../models/pokemon.model.js";

export const fetchingDataFromPokemonApiAndAddingCustomData = async (req, res) => {
    try {

        const legendaryNames = ["mewtwo", "mew", "lugia", "ho-oh", "rayquaza", "arceus"];
        let rarityLevel;
        const { powerScore } = req.body;
        const { name } = req.params;
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);

        const data = response.data;
        const {id, height, weight} = data;

        if(legendaryNames.includes(name.toLowerCase())) {
            rarityLevel = "legendary";
        } else {
            rarityLevel = "common";
        }

        const customDataAndPokemonApiData = {
            id,
            height,
            weight,
            powerScore: powerScore * ( height + weight ),
            rarityLevel
        }

        res.status(201).json({
            success: true,
            customDataAndPokemonApiData
        })
    } catch (error) {
        console.log(`error while fetching data from pokenmon : ${error}`);
        res.status(500).json({
            success: false,
            message: `server error something went wrong: ${error}`
        })
    }
} 

export const fetchingSingleDataFromPokemonApi = async (req, res) => {
    try {        
        const { id } = req.params;
        
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = response.data;
    
        const { name, height, weight } = data;
        
        res.status(200).json({
            success: true,
            id: data.id,
            name,
            height,
            weight,
        })
        
    } catch (error) {
        console.log(`error while fetching data from pokemon api: ${error.message}`);
        
        res.status(500).json({
            success: false,
            message: `server error something went wrong :${error.message}`
        })
    }
}

export const favoritesPokemon = async (req, res) => {
    try {

       const { error, value } = pokemonSchema.validate(req.body);

       if(error) {
        console.log(`error while validating pokemon inputs : ${error}`);
        
        return res.status(400).json({
            success: false,
            message: `Invalid inputs : ${error}`
        })
       }

       const { name } = value;

       const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);

       const data = response.data;

       const { id, height, weight, types } = data;

       const favoritePokemon = await Pokemon.create({
            id,
            name,
            height,
            weight,
            types: types.map((t) => t.type.name),
       })

       res.status(201).json({
        success: true,
        favoritePokemon
       })

    } catch (error) {
        console.log(`error while adding favorites pokemon: ${error}`);
        res.status(500).json({
            success: false,
            message: `server error something went wrong: ${error}`
        })
    }
}

export const listingFavoritePokemon = async (_, res) => {
    try {
        const listOfFavPokemon = await Pokemon.findAll();
        if(!listOfFavPokemon) {
            return res.status(400).json({
                success: false,
                message: "Failed to listing fav pokemon."
            })
        }

        console.log(`list of fav pokemon :${listOfFavPokemon}`);
        

        res.status(200).json({
            success: true,
            message: "Fav pokemon listed successfully",
            favPokemon: listOfFavPokemon
        })

    } catch (error) {
        console.log(`error while fetching fav pokemon from database: ${error}`);
        res.status(500).json({
            success: false,
            message: `server error something went wrong: ${error}`
        })
    }
}

export const updatingFavPokemon = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, height, weight, types } = req.body;

        const updatedFavData = await Pokemon.update({
            name,
            height,
            weight,
            types
        }, { where: { id: id} })

        if(!updatedFavData) {
            return res.status(400).json({
                success: false,
                message: "Failed to update."
            })
        }


        res.status(201).json({
            success: true,
            message: "Fav pokemon uptaded successfully.",
        })

    } catch (error) {
        console.log(`error while updating fav pokemon:${error}`);

        res.status(500).json({
            success: false,
            message: `server error something went wrong: ${error}`
        })
        
    }
}

export const removeFavData = async (req, res) => {
    try {

        const { id } = req.params;

        const removedData = await Pokemon.destroy({
            where: { id: id}
        })

        if(!removedData) {
            return res.status(400).json({
                success: false,
                message: "Failed to remove data."
            })
        }

        res.status(200).json({
            success: true,
            message: "Pokemon fav data remove successfully."
        })

    } catch (error) {
        console.log(`error while removing fav data : ${error}`);
        res.status(500).json({
            success: false,
            message: `server error something went wrong: ${error}`
        })
    }
}