const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Contestinprogress = sequelize.define('Contestinprogress', {
    userid: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ratingchanges: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rank:{
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue:0,
  },
},{
  freezeTableName:'Contestinprogress',
  timestamps: false
});

module.exports=Contestinprogress;