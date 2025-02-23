module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('accounts', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    username: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    id_account: {
      type: Sequelize.STRING
    },
    id_branch: {
      type: Sequelize.STRING
    },
    role: {
      type: Sequelize.STRING
    },
    cameras: {
      type: Sequelize.INTEGER
    },
    analytics: {
      type: Sequelize.INTEGER
    },
    disabled: {
      type: Sequelize.INTEGER
    },
    vms: {
      type: Sequelize.STRING
    },
    am: {
      type: Sequelize.INTEGER
    },
    vs: {
      type: Sequelize.INTEGER
    },
    mic: {
      type: Sequelize.INTEGER
    },
    vsd: {
      type: Sequelize.INTEGER
    },
    theme: {
      type: Sequelize.STRING
    },
    pic: {
      type: Sequelize.STRING
    }
  })

  return User
}
