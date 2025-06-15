import express from "express";
import { fetchingSingleDataFromPokemonApi, fetchingDataFromPokemonApiAndAddingCustomData, favoritesPokemon, listingFavoritePokemon, updatingFavPokemon, removeFavData } from "../controllers/pokemon.controller.js";
import { authenticatedUser } from "../middlewares/auth.middleware.js";

const route = express.Router();

route.post("/pokemon/:name", authenticatedUser, fetchingDataFromPokemonApiAndAddingCustomData);
route.get("/pokemon/:id", authenticatedUser, fetchingSingleDataFromPokemonApi);
route.post("/favorites", authenticatedUser, favoritesPokemon);
route.get("/get-favorites-pokemon", authenticatedUser, listingFavoritePokemon);
route.put("/favorites/:id", authenticatedUser, updatingFavPokemon);
route.delete("/favorites/delete/:id", authenticatedUser, removeFavData);

export default route;