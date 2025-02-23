module.exports = (sequelize, Sequelize) => {
    const Status = sequelize.define('statusAlgo', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        idCam: {
            type: Sequelize.STRING
        },
        algoId: {
            type: Sequelize.INTEGER
        },
        status: {
            type: Sequelize.INTEGER
        },
        id_account: {
            type: Sequelize.STRING
        },
        id_branch: {
            type: Sequelize.STRING
        },
        createdAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: true
        },
        }, {
        timestamps: false
    })
    return Status
}
