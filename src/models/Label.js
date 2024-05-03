const sequelize = require('../database/connection.js');
const { Model, DataTypes } = require('sequelize');

class Label extends Model {}

Label.init({
    id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    title : {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    color : {
        type: DataTypes.STRING(7),
        allowNull: false
    },
    task_id : {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    sequelize,
    modelName: "Label",
    tableName: "labels",
    timestamps: false,
    underscored: true
})

module.exports = Label;