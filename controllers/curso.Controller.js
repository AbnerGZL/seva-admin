const { Curso, Profesor } = require('../models');

module.exports = {
  listar: async (req, res) => {
    try {
      const cursos = await Curso.findAll({
        include: { model: Profesor, as: 'profesor' }
      });
      res.render('cursos/listar', { cursos });
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al listar cursos' });
    }
  },

  crearForm: async (req, res) => {
    try {
      const profesores = await Profesor.findAll({ where: { ESTATUS: true } });
      res.render('cursos/crear', { profesores, formData: null, error: null });
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al cargar formulario' });
    }
  },

  crear: async (req, res) => {
    const { ID_PROFESOR, CODIGOCU, NOMBRE, DESCRIPCION, CREDITOS, DURACION, HORAS } = req.body;
    try {
      await Curso.create({
        ID_PROFESOR,
        CODIGOCU,
        NOMBRE,
        DESCRIPCION,
        CREDITOS,
        DURACION,
        HORAS,
        ESTATUS: true,
        FECHA_CREACION: new Date(),
        FECHA_ACTUALIZACION: new Date()
      });
      res.redirect('/cursos');
    } catch (error) {
      console.error(error);
      const profesores = await Profesor.findAll({ where: { ESTATUS: true } });
      res.render('cursos/crear', {
        profesores,
        formData: req.body,
        error: 'Error al crear curso: ' + error.message
      });
    }
  },

  editarForm: async (req, res) => {
    try {
      const curso = await Curso.findByPk(req.params.id);
      const profesores = await Profesor.findAll({ where: { ESTATUS: true } });
      res.render('cursos/editar', { curso, profesores, error: null });
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al cargar curso' });
    }
  },

  editar: async (req, res) => {
    const { ID_PROFESOR, CODIGOCU, NOMBRE, DESCRIPCION, CREDITOS, DURACION, HORAS } = req.body;
    try {
      await Curso.update({
        ID_PROFESOR,
        CODIGOCU,
        NOMBRE,
        DESCRIPCION,
        CREDITOS,
        DURACION,
        HORAS,
        FECHA_ACTUALIZACION: new Date()
      }, {
        where: { ID_CURSO: req.params.id }
      });
      res.redirect('/cursos');
    } catch (error) {
      console.error(error);
      const curso = await Curso.findByPk(req.params.id);
      const profesores = await Profesor.findAll({ where: { ESTATUS: true } });
      res.render('cursos/editar', {
        curso,
        profesores,
        error: 'Error al actualizar curso: ' + error.message
      });
    }
  },

  eliminar: async (req, res) => {
    try {
      await Curso.update(
        { ESTATUS: false, FECHA_ACTUALIZACION: new Date() },
        { where: { ID_CURSO: req.params.id } }
      );
      res.redirect('/cursos');
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al eliminar curso' });
    }
  },

  reactivar: async (req, res) => {
    try {
      await Curso.update(
        { ESTATUS: true, FECHA_ACTUALIZACION: new Date() },
        { where: { ID_CURSO: req.params.id } }
      );
      res.json({ ok: true });
    } catch (error) {
      console.error(error);
      res.json({ ok: false });
    }
  }
};