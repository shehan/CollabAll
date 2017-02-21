(function () {
    'use strict';
    module.exports = function (sequelize, DataTypes) {
        var gesture;
        gesture = sequelize.define("gesture", {
                ID: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
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
                        gesture.hasOne(models.interjection, {
                            as: 'Gesture',
                            onDelete: 'CASCADE',
                            foreignKey: {allowNull: false},
                            constraints: true,
                            foreignKeyConstraint: true
                        });
                    }
                }
            }
        );
        return gesture;
    };
}());
