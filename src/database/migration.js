const fs = require('fs');
const Sequelize = require('sequelize');
const env = require("../config/env.config");
const sequelize = require('../database/connection.js');
const init = new Sequelize(
    "",
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

function getFile(dir, files = []) {
    const fileList = fs.readdirSync(dir);
    for (const file of fileList) {
        const name = `${dir}/${file}`;
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, files);
        } else {
            files.push(name);
        }
    }
    return files[files.length - 1];
}

const file = getFile("./src/database/resources");
const sqlString = fs.readFileSync(file, "utf8")
    .replace(/\r\n/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "");
const queries = sqlString.split(";").filter((q) => q != "");

console.log("Migrating database " + file.split("/")[file.split("/").length - 1]);
init.query("CREATE DATABASE IF NOT EXISTS `db_seton`")
    .then(() => {
        console.log("Executing query: DROP DATABASE IF EXISTS `db_seton`");
        sequelize.query("DROP DATABASE IF EXISTS `db_seton`")
            .then(() => {
                return Promise.all(queries.map(query => {
                    const message = query.substring(0, 80) + (query.length > 80 ? " ..." : "");
                    console.log("Executing query:", message);
                    return sequelize.query(query);
                }));
            })
            .then(() => {
                console.log("Database successfully migrated");
            })
            .catch(err => {
                console.error("Error executing SQL file:\n", err);
            });
    });

