module.exports = (sequelize, Sequelize) => {
  const SV = sequelize.define('relSumVideo', {
    sumId: {
      type: Sequelize.STRING
    },
    vidId: {
      type: Sequelize.STRING
    }
  })
  return SV
}
