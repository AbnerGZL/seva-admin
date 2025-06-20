const { Matricula, Estudiante, Carrera } = require('../models');

module.exports = {
  listar: async (req, res) => {
    try {
      const matriculas = await Matricula.findAll({
        include: [
          { model: Estudiante, as: 'estudiante' },
          { model: Carrera, as: 'carrera' }
        ],
      });
      res.render('matriculas/listar', { matriculas });
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al listar matrículas' });
    }
  },

  crearForm: async (req, res) => {
    try {
      const estudiantes = await Estudiante.findAll({ where: { ESTATUS: true } });
      const carreras = await Carrera.findAll({ where: { ESTATUS: true } });
      res.render('matriculas/crear', { estudiantes, carreras, formData: null, error: null });
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al cargar formulario de matrícula' });
    }
  },

  crear: async (req, res) => {
    try {
      await Matricula.create({
        ...req.body,
        ESTATUS: true,
        FECHA_CREACION: new Date(),
        FECHA_MODIFICACION: new Date()
      });
      res.redirect('/matriculas');
    } catch (error) {
      console.error(error);
      const estudiantes = await Estudiante.findAll({ where: { ESTATUS: true } });
      const carreras = await Carrera.findAll({ where: { ESTATUS: true } });
      res.render('matriculas/crear', {
        estudiantes,
        carreras,
        formData: req.body,
        error: 'Error al registrar matrícula'
      });
    }
  },

  editarForm: async (req, res) => {
    try {
      const matricula = await Matricula.findByPk(req.params.id);
      const estudiantes = await Estudiante.findAll({ where: { ESTATUS: true } });
      const carreras = await Carrera.findAll({ where: { ESTATUS: true } });

      if (!matricula) {
        return res.render('error', { mensaje: 'Matrícula no encontrada' });
      }

      res.render('matriculas/editar', { matricula, estudiantes, carreras, error: null });
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al cargar formulario de edición' });
    }
  },

  editar: async (req, res) => {
    try {
      await Matricula.update(
        {
          ...req.body,
          FECHA_MODIFICACION: new Date()
        },
        { where: { ID_MATRICULA: req.params.id } }
      );
      res.redirect('/matriculas');
    } catch (error) {
      console.error(error);
      const matricula = await Matricula.findByPk(req.params.id);
      const estudiantes = await Estudiante.findAll({ where: { ESTATUS: true } });
      const carreras = await Carrera.findAll({ where: { ESTATUS: true } });
      res.render('matriculas/editar', {
        matricula,
        estudiantes,
        carreras,
        error: 'Error al actualizar matrícula'
      });
    }
  },

  eliminar: async (req, res) => {
    try {
      await Matricula.update(
        { ESTATUS: false, FECHA_MODIFICACION: new Date() },
        { where: { ID_MATRICULA: req.params.id } }
      );
      res.redirect('/matriculas');
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al eliminar matrícula' });
    }
  }
};
