module.exports = (sequelize, DataTypes) => {
  const Estudiante = sequelize.define('ESTUDIANTE', {
    ID_ESTUDIANTE: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ID_USUARIO: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ESTADO: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    NOMBRES: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    APELLIDOS: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    DNI: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CARRERA: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    CORREO: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    FECHA_NAC: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    SEXO: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    DIRECCION: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    TELEFONO: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    ESTATUS: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'ESTUDIANTES',
    timestamps: true,
    createdAt: 'FECHA_CREACION',
    updatedAt: 'FECHA_ACTUALIZACION'
  });

  return Estudiante;
};
