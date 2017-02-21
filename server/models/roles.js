(function () {
    'use strict';
    module.exports = function (sequelize, DataTypes) {
        var role;
        role = sequelize.define("role", {
                ID: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false,
                    unique: true
                },
                Name: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                    unique: true
                },
                FriendlyName: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                    unique: true
                },
                IsActive: DataTypes.BOOLEAN
            },
            {
                classMethods: {
                    associate: function (models) {
                        role.hasMany(models.user, {
                            as: 'Role',
                            onDelete: 'CASCADE',
                            foreignKey: {allowNull: false},
                            constraints: true,
                            foreignKeyConstraint: true
                        });
                    }
                }
            }
        );
        return role;
    };
}());
