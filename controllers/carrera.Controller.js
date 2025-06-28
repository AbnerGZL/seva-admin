const { Carrera } = require('../models');

module.exports = {
  listar: async (req, res) => {
    try {
      const carreras = await Carrera.findAll();
      res.render('carreras/listar', { carreras });
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al listar carreras' });
    }
  },

  crearForm: (req, res) => {
    res.render('carreras/crear', { formData: null, error: null });
  },

  crear: async (req, res) => {
    try {
      await Carrera.create({
        ...req.body,
        ESTATUS: true,
        FECHA_CREACION: new Date(),
        FECHA_ACTUALIZACION: new Date()
      });
      res.redirect('/carreras');
    } catch (error) {
      console.error(error);
      res.render('carreras/crear', {
        formData: req.body,
        error: 'Error al crear carrera: ' + error.message
      });
    }
  },

  editarForm: async (req, res) => {
    const { id } = req.params;
    try {
      const carrera = await Carrera.findByPk(id);
      if (!carrera) {
        return res.render('error', { mensaje: 'Carrera no encontrada' });
      }

      res.render('carreras/editar', {
        carrera,
        formData: carrera, // <== Aquí estás enviando formData
        error: null
      });
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al cargar el formulario de edición' });
    }
  },

  editar: async (req, res) => {
    try {
      await Carrera.update(
        {
          ...req.body,
          FECHA_ACTUALIZACION: new Date()
        },
        { where: { ID_CARRERA: req.params.id } }
      );
      res.redirect('/carreras');
    } catch (error) {
      console.error(error);
      const carrera = await Carrera.findByPk(req.params.id);
      res.render('carreras/editar', {
        carrera,
        error: 'Error al actualizar carrera: ' + error.message
      });
    }
  },

  eliminar: async (req, res) => {
    try {
      await Carrera.update(
        { ESTATUS: false, FECHA_ACTUALIZACION: new Date() },
        { where: { ID_CARRERA: req.params.id } }
      );
      res.redirect('/carreras');
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al eliminar carrera' });
    }
  },

  reactivar: async (req, res) => {
    try {
      await Carrera.update(
        { ESTATUS: true, FECHA_ACTUALIZACION: new Date() },
        { where: { ID_CARRERA: req.params.id } }
      );
      res.json({ ok: true });
    } catch (error) {
      console.error(error);
      res.json({ ok: false });
    }
  }
};
