module.exports = (sequelize, Sequelize) => {
    const SumVid = sequelize.define('sumVids', {
        id: {
            type: Sequelize.STRING,
            primaryKey: true
        },
        rtsp_in: {
            type: Sequelize.STRING
        },
        http_in: {
            type: Sequelize.STRING
        },
        id_account: {
            type: Sequelize.STRING
        },
        id_branch: {
            type: Sequelize.STRING
        }
    })
    return SumVid
}
