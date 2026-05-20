require("dotenv").config();
const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME || "expressjs_db",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "123456",
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false, // set to console.log to see the raw SQL queries
    timezone: "+07:00",
  }
);

const connection = async () => {
  const host = process.env.DB_HOST || "localhost";
  const port = process.env.DB_PORT || 3306;
  const user = process.env.DB_USER || "root";
  const password = process.env.DB_PASSWORD || "123456";
  const database = process.env.DB_NAME || "expressjs_db";

  try {
    // Connect to MySQL server first (without database selection) to auto-create database if it doesn't exist
    const mysqlConnection = await mysql.createConnection({
      host,
      port,
      user,
      password,
    });
    await mysqlConnection.query(
      `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    await mysqlConnection.end();

    // Authenticate and sync with Sequelize
    await sequelize.authenticate();
    console.log(">>> Connection to MySQL has been established successfully.");

    // Sync all models
    await sequelize.sync({ alter: true });
    console.log(">>> All models were synchronized successfully.");
  } catch (error) {
    console.error(">>> Unable to connect to the database:", error);
    throw error;
  }
};

module.exports = {
  connection,
  sequelize,
};

