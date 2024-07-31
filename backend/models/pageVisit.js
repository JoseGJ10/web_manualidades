const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PageVisit = sequelize.define('PageVisit', {
    page: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    visits: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    last_visit: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
},
{
    timestamps: true,
});


module.exports = PageVisit;
