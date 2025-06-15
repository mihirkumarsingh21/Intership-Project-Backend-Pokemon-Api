import Joi from "joi";

export const pokemonSchema = Joi.object({
    name: Joi.string().required(),

    height: Joi.number(),

    weight: Joi.number(),

    types: Joi.array().items(Joi.string()),
    
})