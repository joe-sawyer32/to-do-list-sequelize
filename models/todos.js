"use strict";
module.exports = function(sequelize, DataTypes) {
  var todos = sequelize.define(
    "todos",
    {
      todoItem: {
        allowNull: false,
        type: DataTypes.STRING
      },
      description: {
        allowNull: true,
        type: DataTypes.STRING
      },
      completed: {
        defaultValue: "f",
        type: DataTypes.BOOLEAN
      }
    },
    {
      classMethods: {
        associate: function(models) {
          // associations can be defined here
        }
      }
    }
  );
  return todos;
};
