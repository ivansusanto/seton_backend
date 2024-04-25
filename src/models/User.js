const sequelize = require('../database/connection.js');
const { Model, DataTypes } = require('sequelize');

class User extends Model {}

User.init({
    email: {
        type: DataTypes.STRING(255),
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    profile_picture: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    auth_token: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
    },
    status: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: 0
    }
}, {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: false,
    underscored: true
});

module.exports = User;