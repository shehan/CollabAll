(function () {
    'use strict';
    module.exports = function (sequelize, DataTypes) {
        var card;
        card = sequelize.define("card", {
            ID: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            Title: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            Description: DataTypes.STRING(500),
            IsActive: DataTypes.BOOLEAN
        });
        return card;
    };
}());
