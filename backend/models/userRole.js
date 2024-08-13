const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const UserRole = sequelize.define('UserRole', {
        UserId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        RoleId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Roles',
                key: 'id'
            }
        }
    });

    return UserRole;
};
