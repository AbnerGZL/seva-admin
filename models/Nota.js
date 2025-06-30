module.exports = (sequelize, DataTypes) => {
  const Nota = sequelize.define('NOTA', {
  ID_NOTA: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ID_CRONOGRAMA: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  PROMEDIOP: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
  },
  PROMEDIOT: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
  },
  UNIDAD: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  ESTATUS: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
}, {
    tableName: 'NOTAS',
    timestamps: true,
    createdAt: 'FECHA_CREACION',
    updatedAt: 'FECHA_ACTUALIZACION'
  });

  return Nota;
};