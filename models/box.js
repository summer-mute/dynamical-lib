module.exports = function(sequelize, DataTypes) {
    let BoxProfile = sequelize.define("BoxProfile", {
          //need to save 
    //length, width, height, hex color, x-rotation, yrotation, profile name, foreign key is user ID
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      length: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            isNumeric:true
        }
      },
      width: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            isNumeric:true
        }
      },
      height: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            isNumeric:true
        }
      },
      hexColor: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty:true,
            len:[7]
        }
      },
      yRotation: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            isNumeric:true
        }
      },
      xRotation: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            isNumeric:true
        }
      }
    })
    BoxProfile.associate = function(models) {
        // We're saying that a BoxProfile should belong to a user
        // A BoxProfile can't be created without a user due to the foreign key constraint
        BoxProfile.belongsTo(models.User, {
          foreignKey: {
            allowNull: false
          }
        });
      };
    return BoxProfile;
};

