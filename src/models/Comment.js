const sequelize = require('../database/connection.js');
const { Model, DataTypes } = require('sequelize');

class Comment extends Model {}

Comment.init({
    id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    value : {
        type: DataTypes.TEXT,
        allowNull: false
    },
    time : {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    user_email : {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    task_id : {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    sequelize,
    modelName: "Comment",
    tableName: "comments",
    timestamps: false,
    underscored: true
})