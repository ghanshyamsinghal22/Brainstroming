const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const emergencyContest = sequelize.define('emergencyContest', {
    userid: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  ratingChanges : {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  penalty: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
}, {
  freezeTableName:'emergencyContest',
  timestamps: false
});

module.exports=emergencyContest;