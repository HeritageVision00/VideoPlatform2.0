module.exports = (sequelize, Sequelize) => {
    const Am = sequelize.define('attendance', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.STRING
      },
      time: {
        type: Sequelize.DATE
      },
      event: {
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      camId: {
        type: Sequelize.STRING
      },
      pName: {
        type: Sequelize.STRING
      },
      id_account: {
        type: Sequelize.STRING
      },
      id_branch: {
        type: Sequelize.STRING
      }
    })
  
    return Am
  }