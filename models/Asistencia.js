module.exports = (sequelize, DataTypes) => {
  const ASISTENCIA = sequelize.define('ASISTENCIA', {
    ID_ASISTENCIA: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ID_CRONOGRAMA: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    FECHA: {
      type: DataTypes.DATE,
      allowNull: false
    },
    ESTADO: {
      type: DataTypes.STRING(1),
      allowNull: true
    },
    ESTATUS: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'ASISTENCIAS',
    timestamps: true,
    createdAt: 'FECHA_CREACION',
    updatedAt: 'FECHA_ACTUALIZACION'
  });

  return ASISTENCIA;
};