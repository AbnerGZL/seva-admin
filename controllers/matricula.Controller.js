const { Matricula, Estudiante, Carrera, Cronograma } = require('../models');
const { Op } = require('sequelize');

async function actualizarPromedioFinalMatricula(idMatricula) {
  try {
    const cronogramas = await Cronograma.findAll({
      where: {
        ID_MATRICULA: idMatricula,
        ESTATUS: true,
        NOTAF: { [Op.ne]: null } // Asegura que NO sea null
      }
    });

    // Filtrar por cronogramas que tengan NOTAF numérico y válido
    const notasValidas = cronogramas.filter(c => !isNaN(parseFloat(c.NOTAF)));

    if (notasValidas.length < 2) {
      await Matricula.update(
        {
          PROMEDIOF: null,
          CONDICION: null,
          FECHA_ACTUALIZACION: new Date()
        },
        { where: { ID_MATRICULA: idMatricula } }
      );
      return;
    }

    const suma = notasValidas.reduce((total, c) => total + parseFloat(c.NOTAF), 0);
    const promedio = parseFloat((suma / notasValidas.length).toFixed(2));
    const condicion = promedio >= 13 ? 'Aprobado' : 'Desaprobado';

    await Matricula.update(
      {
        PROMEDIOF: promedio,
        CONDICION: condicion,
        FECHA_ACTUALIZACION: new Date()
      },
      { where: { ID_MATRICULA: idMatricula } }
    );
  } catch (error) {
    console.error('Error al actualizar promedio final:', error);
  }
}

module.exports = {
  listar: async (req, res) => {
    try {
      const matriculas = await Matricula.findAll({
        include: [
          { model: Estudiante, as: 'estudiante' },
          { model: Carrera, as: 'carrera' }
        ]
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
      res.render('matriculas/crear', {
        estudiantes,
        carreras,
        formData: null,
        error: null
      });
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al cargar formulario de matrícula' });
    }
  },

  crear: async (req, res) => {
    try {
      const nuevaMatricula = await Matricula.create({
        ...req.body,
        PROMEDIOF: 0.00,
        CONDICION: 'Desaprobado',
        ESTATUS: true,
        FECHA_CREACION: new Date(),
        FECHA_ACTUALIZACION: new Date()
      });

      // Actualizar PROMEDIOF y CONDICION después de crear, en caso ya haya cronogramas relacionados (opcional)
      await actualizarPromedioFinalMatricula(nuevaMatricula.ID_MATRICULA);

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
      if (!matricula) {
        return res.render('error', { mensaje: 'Matrícula no encontrada' });
      }

      const estudiantes = await Estudiante.findAll({ where: { ESTATUS: true } });
      const carreras = await Carrera.findAll({ where: { ESTATUS: true } });

      res.render('matriculas/editar', {
        matricula,
        estudiantes,
        carreras,
        error: null
      });
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
          FECHA_ACTUALIZACION: new Date()
        },
        { where: { ID_MATRICULA: req.params.id } }
      );

      // Recalcular promedio y condición después de editar datos relevantes
      await actualizarPromedioFinalMatricula(req.params.id);

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
        {
          ESTATUS: false,
          FECHA_ACTUALIZACION: new Date()
        },
        { where: { ID_MATRICULA: req.params.id } }
      );
      res.redirect('/matriculas');
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al eliminar matrícula' });
    }
  },

  reactivar: async (req, res) => {
    try {
      await Matricula.update(
        {
          ESTATUS: true,
          FECHA_ACTUALIZACION: new Date()
        },
        { where: { ID_MATRICULA: req.params.id } }
      );

      // Recalcular promedio final al reactivar
      await actualizarPromedioFinalMatricula(req.params.id);

      res.json({ ok: true });
    } catch (error) {
      console.error(error);
      res.json({ ok: false });
    }
  },

  actualizarPromedioFinalMatricula
};