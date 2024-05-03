const sequelize = require('../database/connection.js');
const { Model, DataTypes } = require('sequelize');

class Attachment extends Model {}

Attachment.init({
    id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    file_name : {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    upload_time : {
        type: DataTypes.DATE,
        allowNull: false
    },
    task_id : {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    sequelize,
    modelName: "Attachment",
    tableName: "attachments",
    timestamps: false,
    underscored: true
})

module.exports = Attachment;