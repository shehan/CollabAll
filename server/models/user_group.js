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
            },
            {
                classMethods: {
                    associate: function (models) {
                        user_group.belongsTo(models.user);
                        user_group.belongsTo(models.group);
                    }
                }
            });
        return user_group;
    };
}());
