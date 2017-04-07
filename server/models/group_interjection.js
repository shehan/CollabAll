(function () {
    'use strict';
    module.exports = function (sequelize, DataTypes) {
        var group_interjection;
        group_interjection = sequelize.define("group_interjection", {
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
                Icon: DataTypes.STRING(50),
                Color: DataTypes.STRING(50),
                IncludeCaptionist:DataTypes.BOOLEAN,
                IncludeInterpreter:DataTypes.BOOLEAN,
                IsActive: DataTypes.BOOLEAN
            },
            {
                classMethods: {
                    associate: function (models) {
                        group_interjection.belongsTo(models.group);
                    }
                }
            });
        return group_interjection;
    };
}());
