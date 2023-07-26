export {};
// import { UUID } from 'crypto';
// import { Model, InferAttributes, InferCreationAttributes } from 'sequelize';
// import { UserType } from '../types';
const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const { v4: uuidv4 } = require('uuid');

// class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
//     declare id: UUID;
//     declare firstname: string;
//     declare lastname: string;
//     declare username: string;
//     declare email: string;
//     declare password: string;
//     declare avatarUrl: string;
//     declare city: string;
//     declare resetToken: string;
//     declare resetTokenExpiration: string;
// }

// User.init(
//     {
//         id: {
//             type: DataTypes.UUID,
//             allowNull: false,
//             primaryKey: true
//         },
//         firstname: {
//             type: DataTypes.STRING,
//             allowNull: false
//         },
//         lastname: {
//             type: DataTypes.STRING,
//             allowNull: false
//         },
//         username: {
//             type: DataTypes.STRING,
//             allowNull: false,
//             unique: true
//         },
//         email: {
//             type: DataTypes.STRING,
//             allowNull: false,
//             unique: true,
//             validate: {
//                 isEmail: true
//             }
//         },
//         password: {
//             type: DataTypes.STRING,
//             allowNull: false
//         },
//         avatarUrl: {
//             type: DataTypes.STRING
//         },
//         city: {
//             type: DataTypes.STRING
//         },
//         resetToken: {
//             type: DataTypes.STRING
//         },
//         resetTokenExpiration: {
//             type: DataTypes.STRING
//         }
//     },
//     {
//         hooks: {
//             afterCreate: (user: any) => {
//                 delete user.password;
//                 delete user.avatarUrl;
//                 delete user.city;
//                 delete user.resetToken;
//                 delete user.resetTokenExpiration;
//             }
//         },
//         freezeTableName: true,
//         tableName: "users",
//         timestamps: false,
//         sequelize
//     },
// );

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
    },
    resetToken: {
        type: DataTypes.STRING
    },
    resetTokenExpiration: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true,
    tableName: "users",
    timestamps: false,
    defaultScope: {
        attributes: {
            exclude: ['password', 'resetToken', 'resetTokenExpiration']
        }
    }
});

User.beforeValidate((user: any, _: any) => {
    return user.id = uuidv4()
});

module.exports = User;