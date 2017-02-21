(function () {
    'use strict';
    module.exports = function (sequelize, DataTypes) {
        var interjection;
        interjection = sequelize.define("interjection", {
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
            Description: DataTypes.STRING(500),
            IsActive: DataTypes.BOOLEAN
        });
        return interjection;
    };
}());
