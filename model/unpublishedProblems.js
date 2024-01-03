const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const unpublishedProblem = sequelize.define('unpublishedProblem', {
  problemName: {
    type: DataTypes.STRING(25),
    allowNull: false
  },
  problemid: {
    type: DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement: true
  },
  contestid: {
    type: DataTypes.STRING(),
    allowNull: true,
    defaultValue:null
  },
  problemnum: {
    type: DataTypes.INTEGER(),
    allowNull: true,
    defaultValue:null
  },
  problemStatement: {
    type: DataTypes.STRING(1500),
    allowNull: false
  },
  problemInput: {
    type: DataTypes.STRING(1000),
    allowNull: false
  },
  problemOutput: {
    type: DataTypes.STRING(1000),
    allowNull: false
  },
  problemNote: {
    type: DataTypes.STRING(1000),
    defaultValue:null,
    allowNull: true
  },
  timeLimit: {
    type: DataTypes.INTEGER(),
    allowNull: false
  },
  memoryLimit: {
    type: DataTypes.INTEGER(),
    allowNull: false
  },
  testCases: {
    type: DataTypes.INTEGER(),
    allowNull: true,
    defaultValue:0,
  },
  solution: {
    type: DataTypes.TEXT(),
    allowNull: false
  },
  difficulty: {
    type: DataTypes.INTEGER(),
    defaultValue:null,
    allowNull: true
  },
  attempts: {
    type: DataTypes.INTEGER(),
    defaultValue:0,
    allowNull: true
  }
}, {
  freezeTableName:'unpublishedProblem',
  timestamps: false
});

module.exports=unpublishedProblem;