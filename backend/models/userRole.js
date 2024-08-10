// models/userrole.js
module.exports = (sequelize, DataTypes) => {
    const UserRole = sequelize.define('UserRole', {
        UserId: DataTypes.INTEGER,
        RoleId: DataTypes.INTEGER
    });

    return UserRole;
};