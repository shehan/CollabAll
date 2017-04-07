(function () {
    'use strict';
    module.exports = function (sequelize, DataTypes) {
        var group;
        group = sequelize.define("group", {
                ID: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                Name: DataTypes.STRING(255),
                IsActive: DataTypes.BOOLEAN
            },
            {
                classMethods: {
                    associate: function (models) {
                        group.hasMany(models.user_group, {
                            as: 'Group',
                            onDelete: 'CASCADE',
                            foreignKey: {allowNull: false},
                            constraints: true,
                            foreignKeyConstraint: true
                        });
                        group.hasMany(models.card, {
                            as: 'Group',
                            onDelete: 'CASCADE',
                            foreignKey: {allowNull: false},
                            constraints: true,
                            foreignKeyConstraint: true
                        });
                        group.hasMany(models.group_interjection, {
                            as: 'Group',
                            onDelete: 'CASCADE',
                            foreignKey: {allowNull: false},
                            constraints: true,
                            foreignKeyConstraint: true
                        });
                    }
                }
            }
        );
        return group;
    };
}());
