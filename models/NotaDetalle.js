module.exports = (sequelize, DataTypes) => {
  const NOTA_DETALLE = sequelize.define('NOTA_DETALLE', {
    ID_NOTA_DETALLE: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ID_NOTA: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    PRACTICA: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    TEORIA: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    FECHA: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    ESTATUS: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  }, {
    tableName: 'NOTA_DETALLE',
    timestamps: true,
    createdAt: 'FECHA_CREACION',
    updatedAt: 'FECHA_ACTUALIZACION'
  });

  return NOTA_DETALLE;
}