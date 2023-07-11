export {};
const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const { v4: uuidv4 } = require('uuid')

const User = sequelize.define('user', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true
    },
    firstname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    avatarUrl: {
        type: DataTypes.STRING
    },
    city: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true,
    tableName: "users",
    timestamps: false
});

User.beforeValidate((user: any, _: any) => {
    return user.id = uuidv4()
});

module.exports = User;