require("dotenv/config");

const dictionary = {
    HOST: process.env.HOST,
    EMAIL_ADDRESS: process.env.EMAIL_ADDRESS,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    SECRET_KEY: process.env.SECRET_KEY,
    BCRYPT_SALT: process.env.BCRYPT_SALT,
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_DIALECT: process.env.DB_DIALECT,
    PORT: process.env.PORT
};

module.exports = function env(key) {
    return dictionary[key];
}