// models/Image.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Craft = require('./craft');

const Image = sequelize.define('Image', {
  filename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  position: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
});

Craft.hasMany(Image, { as: 'images' });
Image.belongsTo(Craft);

module.exports = Image;
