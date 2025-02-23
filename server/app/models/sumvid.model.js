module.exports = (sequelize, Sequelize) => {
    const SumvidMultiple = sequelize.define('multipleVideoSum', {
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        batch_id: {
            type: Sequelize.STRING
        },
        name: {
            type: Sequelize.STRING
        },
        stored_name: {
            type: Sequelize.STRING
        },
        processedLocation: {
            type: Sequelize.STRING
        },
        location: {
            type: Sequelize.STRING
        },
        order: {
            type: Sequelize.STRING
        },
        new_name: {
            type: Sequelize.STRING
        },
        description: {
            type: Sequelize.DataTypes.STRING(64)
        },  
        id_account: {
            type: Sequelize.STRING
        },
        id_branch: {
            type: Sequelize.STRING
        },
        date: {
            type: Sequelize.DATE,
            allowNull: true
        },
    })
    return SumvidMultiple
    }
