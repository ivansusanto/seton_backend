const sequelize = require('../database/connection.js');
const { Model, DataTypes } = require('sequelize');

class Project extends Model {}

Project.init({
    id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name : {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description : {
        type: DataTypes.TEXT,
        allowNull: false
    },
    start: {
        type: DataTypes.DATE,
        allowNull: false
    },
    deadline: {
        type: DataTypes.DATE,
        allowNull: false
    },
    pm_email: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    status: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: 0
    },
}, {
    sequelize,
    modelName: "Project",
    tableName: "projects",
    timestamps: false,
    underscored: true
})

module.exports = Project;