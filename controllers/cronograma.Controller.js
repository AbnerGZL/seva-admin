const { Cronograma, Matricula, Curso, Profesor, Estudiante, Usuario, Carrera } = require('../models');

module.exports = {
  listar: async (req, res) => {
    try {
      const cronogramas = await Cronograma.findAll({
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
          {
            model: Profesor,
            as: 'profesor',
            include: [{ model: Usuario, as: 'usuario' }]
          }
        ]
      });
      res.render('cronogramas/listar', { cronogramas });
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al listar cronogramas' });
    }
  },

  crearForm: async (req, res) => {
    try {
      const [matriculas, cursos, profesores] = await Promise.all([
        Matricula.findAll({
          where: { ESTATUS: true },
          include: [
            { model: Estudiante, as: 'estudiante' },
            { model: Carrera, as: 'carrera' }
          ]
        }),
        Curso.findAll({ where: { ESTATUS: true } }),
        Profesor.findAll({
          where: { ESTATUS: true },
          include: [{ model: Usuario, as: 'usuario' }]
        })
      ]);

      res.render('cronogramas/crear', {
        matriculas,
        cursos,
        profesores,
        formData: {},
        error: null
      });
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al cargar formulario de cronograma' });
    }
  },

  crear: async (req, res) => {
    const { ID_MATRICULA, ID_CURSO, ID_PROFESOR, CURSACION } = req.body;
    try {
      if (!ID_MATRICULA || !ID_CURSO || !ID_PROFESOR || !CURSACION) {
        throw new Error('Todos los campos son obligatorios.');
      }

      await Cronograma.create({
        ID_MATRICULA,
        ID_CURSO,
        ID_PROFESOR,
        CURSACION,
        ESTATUS: true,
        FECHA_CREACION: new Date(),
        FECHA_ACTUALIZACION: new Date()
      });

      res.redirect('/cronogramas');
    } catch (error) {
      console.error(error);

      const [matriculas, cursos, profesores] = await Promise.all([
        Matricula.findAll({
          where: { ESTATUS: true },
          include: [
            { model: Estudiante, as: 'estudiante' },
            { model: Carrera, as: 'carrera' }
          ]
        }),
        Curso.findAll({ where: { ESTATUS: true } }),
        Profesor.findAll({
          where: { ESTATUS: true },
          include: [{ model: Usuario, as: 'usuario' }]
        })
      ]);

      res.render('cronogramas/crear', {
        matriculas,
        cursos,
        profesores,
        formData: req.body,
        error: error.message || 'Error al crear cronograma'
      });
    }
  },

  editarForm: async (req, res) => {
    try {
      const cronograma = await Cronograma.findByPk(req.params.id);
      if (!cronograma) {
        return res.render('error', { mensaje: 'Cronograma no encontrado' });
      }

      const [matriculas, cursos, profesores] = await Promise.all([
        Matricula.findAll({
          where: { ESTATUS: true },
          include: [
            { model: Estudiante, as: 'estudiante' },
            { model: Carrera, as: 'carrera' }
          ]
        }),
        Curso.findAll({ where: { ESTATUS: true } }),
        Profesor.findAll({
          where: { ESTATUS: true },
          include: [{ model: Usuario, as: 'usuario' }]
        })
      ]);

      res.render('cronogramas/editar', {
        cronograma,
        matriculas,
        cursos,
        profesores,
        error: null
      });
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al cargar formulario de edición' });
    }
  },

  editar: async (req, res) => {
    const { ID_MATRICULA, ID_CURSO, ID_PROFESOR, CURSACION } = req.body;
    try {
      if (!ID_MATRICULA || !ID_CURSO || !ID_PROFESOR || !CURSACION) {
        throw new Error('Todos los campos son obligatorios.');
      }

      await Cronograma.update(
        {
          ID_MATRICULA,
          ID_CURSO,
          ID_PROFESOR,
          CURSACION,
          FECHA_ACTUALIZACION: new Date()
        },
        { where: { ID_CRONOGRAMA: req.params.id } }
      );

      res.redirect('/cronogramas');
    } catch (error) {
      console.error(error);

      const cronograma = await Cronograma.findByPk(req.params.id);
      const [matriculas, cursos, profesores] = await Promise.all([
        Matricula.findAll({
          where: { ESTATUS: true },
          include: [
            { model: Estudiante, as: 'estudiante' },
            { model: Carrera, as: 'carrera' }
          ]
        }),
        Curso.findAll({ where: { ESTATUS: true } }),
        Profesor.findAll({
          where: { ESTATUS: true },
          include: [{ model: Usuario, as: 'usuario' }]
        })
      ]);

      res.render('cronogramas/editar', {
        cronograma,
        matriculas,
        cursos,
        profesores,
        error: error.message || 'Error al actualizar cronograma'
      });
    }
  },

  eliminar: async (req, res) => {
    try {
      await Cronograma.update(
        { ESTATUS: false, FECHA_ACTUALIZACION: new Date() },
        { where: { ID_CRONOGRAMA: req.params.id } }
      );
      res.redirect('/cronogramas');
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al eliminar cronograma' });
    }
  },

  reactivar: async (req, res) => {
    try {
      await Cronograma.update(
        { ESTATUS: true, FECHA_ACTUALIZACION: new Date() },
        { where: { ID_CRONOGRAMA: req.params.id } }
      );
      res.json({ ok: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false });
    }
  }
};