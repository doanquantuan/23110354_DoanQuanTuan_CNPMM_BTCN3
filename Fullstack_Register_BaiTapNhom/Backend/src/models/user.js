"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // User thuộc Role
      User.belongsTo(models.Role, {
        foreignKey: "roleId",
        targetKey: "id",
      });

      // User có nhiều OTP
      User.hasMany(models.OTP, {
        foreignKey: "userId",
      });
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      address: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      gender: DataTypes.BOOLEAN,
      image: DataTypes.STRING,
      roleId: DataTypes.INTEGER,
      positionId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
    },
  );
  return User;
};
