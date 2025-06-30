module.exports = (sequelize, DataTypes) => {
  const Matricula = sequelize.define('MATRICULA', {
    ID_MATRICULA: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ID_ESTUDIANTE: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ID_CARRERA: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    FECHA_MATRICULA: {
      type: DataTypes.DATE,
      allowNull: false
    },
    ESTADO: {
      type: DataTypes.STRING(45),
      defaultValue: 'VIGENTE'
    },
    PROMEDIOF: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: true
    },
    CONDICION: {
      type: DataTypes.STRING(45),
      allowNull: true
    },    
    PERIODO: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    CICLO: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    ESTATUS: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'MATRICULAS',
    timestamps: true,
    createdAt: 'FECHA_CREACION',
    updatedAt: 'FECHA_ACTUALIZACION'
  });

  return Matricula;
};