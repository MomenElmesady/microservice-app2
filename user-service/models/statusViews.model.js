const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcrypt")

const StatusView = sequelize.define("StatusViews", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  indexes: [
    {
      name: 'status_user_idx',
      unique: true, // if each user can view a status only once
      fields: ['status_id', 'user_id']
    }
  ],
  timestamps: true, // Enables createdAt and updatedAt
});

module.exports = StatusView;
