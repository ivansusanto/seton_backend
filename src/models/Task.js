const sequelize = require('../database/connection.js');
const { Model, DataTypes } = require('sequelize');

class Task extends Model {}

Task.init({
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
    deadline: {
        type: DataTypes.DATE,
        allowNull: false
    },
    description : {
        type: DataTypes.TEXT,
        allowNull: false
    },
    priority: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
    },
    status: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: 0
    },
    pic_email : {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    project_id : {
        type: DataTypes.INTEGER(11),
        allowNull: false
    }
}, {
    sequelize,
    modelName: "Task",
    tableName: "tasks",
    timestamps: false,
    underscored: true
})

module.exports = Task;