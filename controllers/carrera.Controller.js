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
      const nuevaCarrera = await Carrera.create({
        ...req.body,
        ESTATUS: true,
        FECHA_CREACION: new Date(),
        FECHA_MODIFICACION: new Date()
      });
      res.redirect('/carreras');
    } catch (error) {
      console.error(error);
      res.render('carreras/crear', { formData: req.body, error: 'Error al crear carrera' });
    }
  },

  editarForm: async (req, res) => {
    try {
      const carrera = await Carrera.findByPk(req.params.id);
      res.render('carreras/editar', { carrera, error: null });
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al cargar formulario de edición' });
    }
  },

  editar: async (req, res) => {
    try {
      await Carrera.update(
        {
          ...req.body,
          FECHA_MODIFICACION: new Date()
        },
        { where: { ID_CARRERA: req.params.id } }
      );
      res.redirect('/carreras');
    } catch (error) {
      console.error(error);
      const carrera = await Carrera.findByPk(req.params.id);
      res.render('carreras/editar', { carrera, error: 'Error al actualizar carrera' });
    }
  },

    eliminar: async (req, res) => {
      try {
        await Carrera.update({ ESTATUS: false }, { where: { ID_CARRERA: req.params.id } });
        res.redirect('/carreras');
      } catch (error) {
        console.error(error);
        res.render('error', { mensaje: 'Error al eliminar carrera' });
      }
    }
};
