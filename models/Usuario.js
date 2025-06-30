module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('USUARIO', {
    ID_USUARIO: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ID_TIPO: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    CODIGOU: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true
    },
    EMAIL: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    CONTRASEÑA: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ESTATUS: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'USUARIOS',
    timestamps: true,
    createdAt: 'FECHA_CREACION',
    updatedAt: 'FECHA_ACTUALIZACION'
  });

  return Usuario;
};