(function () {
    'use strict';

    var bcrypt = require('bcrypt-nodejs');

    module.exports = function (sequelize, DataTypes) {
        var user;
        user = sequelize.define("user", {
                ID: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                FirstName: {
                    type: DataTypes.STRING(255),
                    allowNull: false
                },
                LastName: {
                    type: DataTypes.STRING(255),
                    allowNull: false
                },
                Email: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                    unique: true
                },
                Password: {
                    type: DataTypes.STRING(255),
                    allowNull: false
                },
                IsActive: DataTypes.BOOLEAN
            },
            {
                classMethods: {
                    hashPassword: function (password) {
                        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
                    },

                    associate: function (models) {
                        user.hasMany(models.user_group, {
                            as: 'User',
                            onDelete: 'CASCADE',
                            foreignKey: {allowNull: false},
                            constraints: true,
                            foreignKeyConstraint: true
                        });
                        user.hasMany(models.card, {
                            as: 'User',
                            onDelete: 'CASCADE',
                            foreignKey: {allowNull: false},
                            constraints: true,
                            foreignKeyConstraint: true
                        });
                        user.hasOne(models.user_avatar, {
                            as: 'User',
                            onDelete: 'CASCADE',
                            foreignKey: {allowNull: false},
                            constraints: true,
                            foreignKeyConstraint: true
                        });
                    }
                },
                instanceMethods: {
                    comparePassword: function (password, callback) {
                        return bcrypt.compare(password, this.Password, callback);
                    }
                }
            }
        );
        return user;
    };
}());
