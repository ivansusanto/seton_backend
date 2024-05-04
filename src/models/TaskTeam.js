const sequelize = require('../database/connection.js');
const { Model, DataTypes } = require('sequelize');

class TaskTeam extends Model {}

TaskTeam.init({
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
    modelName: "TaskTeam",
    tableName: "task_teams",
    timestamps: false,
    underscored: true
})

module.exports = TaskTeam;