const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Contestsdata = sequelize.define('Contestsdata',{
  contestId:{
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  contestName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  numberOfQuestions: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  numberOfParticipants: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  actualNumberOfParticipants: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue:0
  },
  date :{
    type: DataTypes.DATE,
    allowNull: false
  },
}, {
  freezeTableName:'Contestsdata',
  timestamps: false
});

module.exports=Contestsdata;