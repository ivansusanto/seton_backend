const sequelize = require('../database/connection.js');
const { Model, DataTypes } = require('sequelize');

class Checklist extends Model {}

Checklist.init({
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
    is_checked : {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: 0
    },
    task_id : {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    sequelize,
    modelName: "Checklist",
    tableName: "checklists",
    timestamps: false,
    underscored: true
})

module.exports = Checklist;