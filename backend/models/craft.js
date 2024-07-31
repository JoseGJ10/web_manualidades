// models/Craft.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Craft = sequelize.define('Craft', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  }
}, {
  timestamps: true,
});

module.exports = Craft;


