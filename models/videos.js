module.exports = function(sequelize, DataTypes) {
    const Video = sequelize.define('Video',{
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len:[1]
            }
        },
        videoId: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len:[1]
            }
        }
    });

    Video.associate = function(models) {
        Video.belongsTo(models.User,{
            foreignKey:{
                allowNull: false
            }
        });
    };

    return Video;

}