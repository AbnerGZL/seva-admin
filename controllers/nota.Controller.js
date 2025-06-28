const { Nota, Cronograma, Estudiante, Carrera, Curso, Profesor, Matricula } = require('../models');

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
                  {
                    model: Estudiante,
                    as: 'estudiante',
                    attributes: ['NOMBRES', 'APELLIDOS']
                  },
                  {
                    model: Carrera,
                    as: 'carrera',
                    attributes: ['NOMBRE']
                  }
                ]
              },
              {
                model: Curso,
                as: 'curso',
                attributes: ['NOMBRE']
              },
              {
                model: Profesor,
                as: 'profesor',
                attributes: ['NOMBRES', 'APELLIDOS']
              }
            ]
          },
          {
            model: Curso,
            as: 'curso',
            attributes: ['NOMBRE']
          }
        ]
      });

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
          { model: Curso, as: 'curso' },
          { model: Profesor, as: 'profesor' }
        ]
      });

      const cursos = await Curso.findAll({ where: { ESTATUS: true } });

      res.render('notas/crear', {
        cronogramas,
        cursos,
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
      const { ID_CRONOGRAMA, ID_CURSO, PROMEDIOP, PROMEDIOT, UNIDAD } = req.body;

      if (!ID_CRONOGRAMA || !ID_CURSO || !PROMEDIOP || !PROMEDIOT || !UNIDAD) {
        throw new Error('Todos los campos son obligatorios.');
      }

      await Nota.create({
        ID_CRONOGRAMA,
        ID_CURSO,
        PROMEDIOP: parseFloat(PROMEDIOP).toFixed(2),
        PROMEDIOT: parseFloat(PROMEDIOT).toFixed(2),
        UNIDAD,
        ESTATUS: true,
        FECHA_CREACION: new Date(),
        FECHA_ACTUALIZACION: new Date()
      });

      res.redirect('/notas');
    } catch (error) {
      console.error(error);

      const [cronogramas, cursos] = await Promise.all([
        Cronograma.findAll({
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
            { model: Curso, as: 'curso' },
            { model: Profesor, as: 'profesor' }
          ]
        }),
        Curso.findAll({ where: { ESTATUS: true } })
      ]);

      res.render('notas/crear', {
        cronogramas,
        cursos,
        formData: req.body,
        error: error.message || 'Error al crear nota'
      });
    }
  },

  editarForm: async (req, res) => {
    try {
      const nota = await Nota.findByPk(req.params.id);

      const [cronogramas, cursos] = await Promise.all([
        Cronograma.findAll({
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
            { model: Curso, as: 'curso' },
            { model: Profesor, as: 'profesor' }
          ]
        }),
        Curso.findAll({ where: { ESTATUS: true } })
      ]);

      res.render('notas/editar', {
        nota,
        cronogramas,
        cursos,
        error: null
      });
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al cargar formulario de edición' });
    }
  },

  editar: async (req, res) => {
    try {
      const { ID_CRONOGRAMA, ID_CURSO, PROMEDIOP, PROMEDIOT, UNIDAD } = req.body;

      if (!ID_CRONOGRAMA || !ID_CURSO || !PROMEDIOP || !PROMEDIOT || !UNIDAD) {
        throw new Error('Todos los campos son obligatorios.');
      }

      await Nota.update(
        {
          ID_CRONOGRAMA,
          ID_CURSO,
          PROMEDIOP: parseFloat(PROMEDIOP).toFixed(2),
          PROMEDIOT: parseFloat(PROMEDIOT).toFixed(2),
          UNIDAD,
          FECHA_ACTUALIZACION: new Date()
        },
        { where: { ID_NOTA: req.params.id } }
      );

      res.redirect('/notas');
    } catch (error) {
      console.error(error);
      const nota = await Nota.findByPk(req.params.id);
      const [cronogramas, cursos] = await Promise.all([
        Cronograma.findAll({
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
            { model: Curso, as: 'curso' },
            { model: Profesor, as: 'profesor' }
          ]
        }),
        Curso.findAll({ where: { ESTATUS: true } })
      ]);

      res.render('notas/editar', {
        nota,
        cronogramas,
        cursos,
        error: error.message || 'Error al actualizar nota'
      });
    }
  },

  reactivar: async (req, res) => {
    try {
      await Nota.update(
        { ESTATUS: true, FECHA_ACTUALIZACION: new Date() },
        { where: { ID_NOTA: req.params.id } }
      );
      res.json({ ok: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false });
    }
  },

  eliminar: async (req, res) => {
    try {
      await Nota.update(
        { ESTATUS: false, FECHA_ACTUALIZACION: new Date() },
        { where: { ID_NOTA: req.params.id } }
      );
      res.redirect('/notas');
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al eliminar nota' });
    }
  }
};