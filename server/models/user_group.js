(function () {
    'use strict';
    module.exports = function (sequelize, DataTypes) {
        var user_group;
        user_group = sequelize.define("user_group", {
            ID: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            IsActive: DataTypes.BOOLEAN
        });
        return user_group;
    };
}());
