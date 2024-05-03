const sequelize = require('../database/connection.js');
const { Model, DataTypes } = require('sequelize');

class Team extends Model {}

Team.init({
    id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    task_id : {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    team_email : {
        type: DataTypes.STRING(255),
        allowNull: false
    },
}, {
    sequelize,
    modelName: "Team",
    tableName: "teams",
    timestamps: false,
    underscored: true
})