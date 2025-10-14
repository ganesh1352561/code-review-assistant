const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

// Use SQLite for development
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database.sqlite'),
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
  },
});

// Test the database connection and sync models
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('SQLite database connection has been established successfully.');
    
    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the SQLite database:', error);
  }
};

testConnection();

module.exports = sequelize;
