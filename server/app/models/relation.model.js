module.exports = (sequelize, Sequelize) => {
  const Relation = sequelize.define('relations', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    camera_id: {
      type: Sequelize.STRING
    },
    algo_id: {
      type: Sequelize.INTEGER
    },
    roi_id: {
      type: Sequelize.JSON
    },
    atributes: {
      type: Sequelize.JSON
    },
    id_account: {
      type: Sequelize.STRING
    },
    id_branch: {
      type: Sequelize.STRING
    },
    stream: {
      type: Sequelize.INTEGER
    },
    http_out: {
      type: Sequelize.STRING
    },
    server: {
      type: Sequelize.INTEGER
    }
  })

  return Relation
}
