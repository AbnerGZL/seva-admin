module.exports = (sequelize, DataTypes) => {
  const TipoUsuario = sequelize.define('TIPO_USUARIO', {
    ID_TIPO: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    NOMBRE: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    ESTATUS: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'TIPO_USUARIO',
    timestamps: true,
    createdAt: 'FECHA_CREACION',
    updatedAt: 'FECHA_ACTUALIZACION',
  });

  return TipoUsuario;
};
