const { Sequelize } = require('sequelize');
require('dotenv').config();
const config = require('./config.json');

const isTestEnv = process.env.NODE_ENV === 'test';

const sequelize = isTestEnv
                    ? new Sequelize('sqlite::memory:') // Base de datos en memoria para pruebas
                    : new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
                        host: process.env.DB_HOST,
                        dialect: config(process.env.NODE_ENV)
                      });

module.exports = sequelize;
