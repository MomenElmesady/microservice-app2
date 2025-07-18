const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const bcrypt = require("bcrypt");
const UserStatus = require("./userStatus.model");

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: false
  },
  profile_image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  discription: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: true
  },
  otpExpiresAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  fcm_token: {
    type: DataTypes.TEXT,
    defaultValue: null
  }
}, {
  indexes: [
    {
      name: 'idx_users_email',
      fields: ['email']
    }
  ]
  ,
  timestamps: true, // Enables createdAt and updatedAt
  hooks: {
    beforeCreate: async (user, options) => {
      try {
        // Hash the password before creating the user
        user.password = await hashPassword(user.password);
      } catch (error) {
        console.error("Error hashing password:", error);
        throw new Error('Password hashing failed');
      }
    },
  
    afterCreate: async (user, options) => {
      try {
        // Create a UserStatus record after the user is created
        await UserStatus.create({
          user_id: user.id,
          last_seen: new Date()
        });
      } catch (error) {
        console.error("Error creating UserStatus:", error);
        throw new Error('User status creation failed');
      }
    }
  }
});

async function hashPassword(password) {
  return await bcrypt.hash(password, 12)
}
module.exports = User;
