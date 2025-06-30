const { Nota, Cronograma, Estudiante, Carrera, Profesor, Matricula } = require('../models');
const { actualizarPromedios } = require('./notaDetalle.Controller');
const { actualizarEstadoFinal } = require('./cronograma.Controller');

module.exports = {
  listar: async (req, res) => {
    try {
      const notas = await Nota.findAll({
        include: [
          {
            model: Cronograma,
            as: 'cronograma',
            include: [
              {
                model: Matricula,
                as: 'matricula',
                include: [
                  { model: Estudiante, as: 'estudiante' },
                  { model: Carrera, as: 'carrera' }
                ]
              },
              { model: Profesor, as: 'profesor' },
              { model: require('../models/Curso'), as: 'curso' }
            ]
          }
        ]
      });

      for (const nota of notas) {
        await actualizarPromedios(nota.ID_NOTA);
      }

      res.render('notas/listar', { notas });
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al listar notas' });
    }
  },

  crearForm: async (req, res) => {
    try {
      const cronogramas = await Cronograma.findAll({
        where: { ESTATUS: true },
        include: [
          {
            model: Matricula,
            as: 'matricula',
            include: [
              { model: Estudiante, as: 'estudiante' },
              { model: Carrera, as: 'carrera' }
            ]
          },
          { model: require('../models/Curso'), as: 'curso' },
          { model: Profesor, as: 'profesor' }
        ]
      });

      res.render('notas/crear', {
        cronogramas,
        formData: null,
        error: null
      });
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al cargar formulario' });
    }
  },

  crear: async (req, res) => {
    try {
      const { ID_CRONOGRAMA, UNIDAD } = req.body;
      if (!ID_CRONOGRAMA || !UNIDAD) {
        throw new Error('Todos los campos son obligatorios.');
      }

      await Nota.create({
        ID_CRONOGRAMA,
        PROMEDIOP: 0,
        PROMEDIOT: 0,
        UNIDAD,
        ESTATUS: true,
        FECHA_CREACION: new Date(),
        FECHA_ACTUALIZACION: new Date()
      });

      await actualizarEstadoFinal(ID_CRONOGRAMA);

      res.redirect('/notas');
    } catch (error) {
      console.error(error);

      const cronogramas = await Cronograma.findAll({
        where: { ESTATUS: true },
        include: [
          {
            model: Matricula,
            as: 'matricula',
            include: [
              { model: Estudiante, as: 'estudiante' },
              { model: Carrera, as: 'carrera' }
            ]
          },
          { model: require('../models/Curso'), as: 'curso' },
          { model: Profesor, as: 'profesor' }
        ]
      });

      res.render('notas/crear', {
        cronogramas,
        formData: req.body,
        error: error.message || 'Error al crear nota'
      });
    }
  },

  editarForm: async (req, res) => {
    try {
      const nota = await Nota.findByPk(req.params.id);
      const cronogramas = await Cronograma.findAll({
        where: { ESTATUS: true },
        include: [
          {
            model: Matricula,
            as: 'matricula',
            include: [
              { model: Estudiante, as: 'estudiante' },
              { model: Carrera, as: 'carrera' }
            ]
          },
          { model: require('../models/Curso'), as: 'curso' },
          { model: Profesor, as: 'profesor' }
        ]
      });

      res.render('notas/editar', { nota, cronogramas, error: null });
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al cargar formulario de edición' });
    }
  },

  editar: async (req, res) => {
    try {
      const { ID_CRONOGRAMA, UNIDAD } = req.body;
      if (!ID_CRONOGRAMA || !UNIDAD) {
        throw new Error('Todos los campos son obligatorios.');
      }

      await Nota.update(
        {
          ID_CRONOGRAMA,
          UNIDAD,
          FECHA_ACTUALIZACION: new Date()
        },
        { where: { ID_NOTA: req.params.id } }
      );

      await actualizarEstadoFinal(ID_CRONOGRAMA);

      res.redirect('/notas');
    } catch (error) {
      console.error(error);
      const nota = await Nota.findByPk(req.params.id);
      const cronogramas = await Cronograma.findAll({
        where: { ESTATUS: true },
        include: [
          {
            model: Matricula,
            as: 'matricula',
            include: [
              { model: Estudiante, as: 'estudiante' },
              { model: Carrera, as: 'carrera' }
            ]
          },
          { model: require('../models/Curso'), as: 'curso' },
          { model: Profesor, as: 'profesor' }
        ]
      });

      res.render('notas/editar', {
        nota,
        cronogramas,
        error: error.message || 'Error al actualizar nota'
      });
    }
  },

  eliminar: async (req, res) => {
    try {
      const nota = await Nota.findByPk(req.params.id);
      await Nota.update(
        { ESTATUS: false, FECHA_ACTUALIZACION: new Date() },
        { where: { ID_NOTA: req.params.id } }
      );

      if (nota) await actualizarEstadoFinal(nota.ID_CRONOGRAMA);

      res.redirect('/notas');
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al eliminar nota' });
    }
  },

  reactivar: async (req, res) => {
    try {
      const nota = await Nota.findByPk(req.params.id);
      await Nota.update(
        { ESTATUS: true, FECHA_ACTUALIZACION: new Date() },
        { where: { ID_NOTA: req.params.id } }
      );

      if (nota) await actualizarEstadoFinal(nota.ID_CRONOGRAMA);

      res.json({ ok: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false });
    }
  }
};