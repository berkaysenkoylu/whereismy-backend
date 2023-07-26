export {};
const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../utils/database');

const User = require('./user');

const Post = sequelize.define('post', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM,
        values: ['found', 'lost'],
        allowNull: false,
        validate: {
            isIn: {
                args: [['found', 'lost']],
                  msg: "Must be found or lost"
              }
          }
    },
    tags: {
        type: DataTypes.ARRAY(DataTypes.ENUM({
            values: ['urgent', 'with prize', 'pinned']
        }))
    },
    location: {
        type: DataTypes.JSON,
        allowNull: false
    },
    images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: []
    },
    category: {
        type: DataTypes.ENUM,
        values: ['dog', 'cat', 'parakeet', 'budgie', 'motorcycle', 'car', 'other'],
        allowNull: false
    }
}, {
    freezeTableName: true,
    tableName: "posts",
    hooks: {
        afterCreate: async (record: any) => {
            const { dataValues } = record;
            const { userId } = dataValues;
            // TODO revisit this implementation
            const user = await User.findOne({
                where: {
                    id: userId
                },
                attributes: {
                    exclude: ['password', 'resetToken', 'resetTokenExpiration', 'createdAt', 'updatedAt']
                }
            });

            record.userId = { ...user.dataValues };
        }
    }
});

Post.beforeValidate((post: any, _: any) => {
    return post.id = uuidv4()
});

module.exports = Post;