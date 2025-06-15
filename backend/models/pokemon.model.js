import { sequelize } from "../config/db.js";
import { DataTypes } from "sequelize";

const Pokemon = sequelize.define("FavoritePokemon", {

    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    height: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    weight: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    types: {
        type: DataTypes.JSON,
        allowNull: false
    }
  
 }, {timestamps: true})

export default Pokemon;
