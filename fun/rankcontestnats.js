const Sequelize = require('sequelize');
const { contestinprogress } = require('../model/contestinprogress');

async function rankContstants() {
  try {
    await contestinprogress.update(
      { order: Sequelize.literal('ROW_NUMBER() OVER (ORDER BY score DESC, rating ASC)') },
      { returning: true, where: {}, individualHooks: true }
    );
  } catch (error) {
    console.error('Error updating and sorting data in the database:', error);
  }
}
module.exports={
rankContstants
};