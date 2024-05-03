const sequelize = require('../database/connection.js');
const { Model, DataTypes } = require('sequelize');

class Member extends Model {}

Member.init({
    id : {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    project_id : {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    member_email: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
}, {
    sequelize,
    modelName: "Member",
    tableName: "members",
    timestamps: false,
    underscored: true
})