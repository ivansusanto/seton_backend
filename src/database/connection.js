const Sequelize = require('sequelize');
const env = require("../config/env.config");

const sequelize = new Sequelize(
    env("DB_NAME"),
    env("DB_USER"),
    env("DB_PASSWORD"),
    {
        host: env("DB_HOST"),
        port: env("DB_PORT"),
        dialect: "mysql",
        timezone: "+07:00",
        logging: false
    }
);

module.exports = sequelize;