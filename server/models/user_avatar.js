(function () {
    'use strict';
    module.exports = function (sequelize, DataTypes) {
        var user_avatar;
        user_avatar = sequelize.define("user_avatar", {
                ID: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                Avatar: DataTypes.TEXT('long'),
                IsActive: DataTypes.BOOLEAN
            },
            {
                classMethods: {
                    associate: function (models) {
                        user_avatar.belongsTo(models.user);
                    }
                }
            });
        return user_avatar;
    };
}());
