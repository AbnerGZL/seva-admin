const { Nota, Matricula, Curso } = require('../models');

module.exports = {
  listar: async (req, res) => {
    try {
      const notas = await Nota.findAll({
        include: [
          { model: Matricula, as: 'matricula' },
          { model: Curso, as: 'curso' }
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
      const [matriculas, cursos] = await Promise.all([
        Matricula.findAll({ where: { ESTATUS: 1 } }),
        Curso.findAll({ where: { ESTATUS: 1 } })
      ]);
      res.render('notas/crear', { matriculas, cursos, formData: null, error: null });
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al cargar formulario' });
    }
  },

  crear: async (req, res) => {
    try {
      await Nota.create({
        ...req.body,
        ESTATUS: 1,
        FECHA_CREACION: new Date(),
        FECHA_MODIFICACION: new Date()
      });
      res.redirect('/notas');
    } catch (error) {
      console.error(error);
      const [matriculas, cursos] = await Promise.all([
        Matricula.findAll({ where: { ESTATUS: 1 } }),
        Curso.findAll({ where: { ESTATUS: 1 } })
      ]);
      res.render('notas/crear', { matriculas, cursos, formData: req.body, error: 'Error al crear nota' });
    }
  },

  editarForm: async (req, res) => {
    try {
      const nota = await Nota.findByPk(req.params.id);
      const [matriculas, cursos] = await Promise.all([
        Matricula.findAll({ where: { ESTATUS: 1 } }),
        Curso.findAll({ where: { ESTATUS: 1 } })
      ]);
      res.render('notas/editar', { nota, matriculas, cursos, error: null });
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al cargar formulario de edición' });
    }
  },

  editar: async (req, res) => {
    try {
      await Nota.update(
        {
          ...req.body,
          FECHA_MODIFICACION: new Date()
        },
        { where: { ID_NOTA: req.params.id } }
      );
      res.redirect('/notas');
    } catch (error) {
      console.error(error);
      const nota = await Nota.findByPk(req.params.id);
      const [matriculas, cursos] = await Promise.all([
        Matricula.findAll({ where: { ESTATUS: 1 } }),
        Curso.findAll({ where: { ESTATUS: 1 } })
      ]);
      res.render('notas/editar', { nota, matriculas, cursos, error: 'Error al actualizar nota' });
    }
  },

  eliminar: async (req, res) => {
    try {
      await Nota.update(
        { ESTATUS: 0, FECHA_MODIFICACION: new Date() },
        { where: { ID_NOTA: req.params.id } }
      );
      res.redirect('/notas');
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al eliminar nota' });
    }
  }
};
