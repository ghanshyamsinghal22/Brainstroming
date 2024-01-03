const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Submission = sequelize.define('Submission', {
  // Model attributes are defined here
  // pk1: {
  //   type: DataTypes.STRING,
  //   primaryKey: true,
  //   allowNull: false
  // },
  Submissionid: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  when: {
    type: DataTypes.DATE,
    allowNull: false
  },
  who: {
    type: DataTypes.STRING,
    allowNull: false
  },
  problemId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  veridict: {
    type: DataTypes.STRING,
    allowNull: false
  },
  solution: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  official: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
}, {
  // Other model options go here
  freezeTableName:'Submission',
  timestamps: false
});

// console.log(Submission === sequelize.models.Submission); // true
module.exports=Submission;