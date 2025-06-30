module.exports = (sequelize, DataTypes) => {
  const Carrera = sequelize.define('CARRERA', {
    ID_CARRERA: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    NOMBRE: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    CODIGOCA: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true
    },
    DESCRIPCION: {
      type: DataTypes.STRING(200)
    },
    DURACION: {
      type: DataTypes.STRING(45)
    },
    TOTAL_CREDITOS: {
      type: DataTypes.INTEGER
    },
    TITULO: {
      type: DataTypes.STRING(50)
    },
    GRADO: {
      type: DataTypes.STRING(45)
    },
    DEPARTAMENTO: {
      type: DataTypes.STRING(45)
    },
    MODALIDAD: {
      type: DataTypes.STRING(45)
    },
    ESTATUS: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'CARRERAS',
    timestamps: true,
    createdAt: 'FECHA_CREACION',
    updatedAt: 'FECHA_ACTUALIZACION'
  });

  return Carrera;
};