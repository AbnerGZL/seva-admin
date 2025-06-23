const { Asistencia, Matricula, Profesor, Curso, Usuario } = require('../models');
const { Op } = require('sequelize');

const listar = async (req, res) => {
  try {
    const asistencias = await Asistencia.findAll({
      include: [
        {
          model: Matricula,
          as: 'matricula',
          required: false
        },
        {
          model: Profesor,
          as: 'profesor',
          required: false,
          include: [{
            model: Usuario,
            as: 'usuario',
            required: false
          }]
        },
        {
          model: Curso,
          as: 'curso',
          required: false
        }
      ]
    });

    res.render('asistencias/listar', { asistencias });
  } catch (error) {
    console.error(error);
    res.render('error', { mensaje: 'Error al listar asistencias' });
  }
};

const mostrarFormularioCrear = async (req, res) => {
  try {
    const [matriculas, profesores, cursos] = await Promise.all([
      Matricula.findAll({ where: { ESTATUS: true } }),
      Profesor.findAll({
        where: { ESTATUS: true },
        include: [{ model: Usuario, as: 'usuario' }]
      }),
      Curso.findAll({ where: { ESTATUS: true } })
    ]);

    res.render('asistencias/crear', { matriculas, profesores, cursos, formData: {}, error: null });
  } catch (error) {
    console.error(error);
    res.render('error', { mensaje: 'Error al cargar el formulario de creación' });
  }
};

const crear = async (req, res) => {
  const { ID_MATRICULA, ID_PROFESOR, ID_CURSO, FECHA, ESTADO } = req.body;

  try {
    await Asistencia.create({
      ID_MATRICULA,
      ID_PROFESOR,
      ID_CURSO,
      FECHA,
      ESTADO,
      ESTATUS: true,
      FECHA_CREACION: new Date(),
      FECHA_MODIFICACION: new Date(),
    });
    res.redirect('/asistencias');
  } catch (error) {
    console.error(error);
    const [matriculas, profesores, cursos] = await Promise.all([
      Matricula.findAll({ where: { ESTATUS: true } }),
      Profesor.findAll({
        where: { ESTATUS: true },
        include: [{ model: Usuario, as: 'usuario' }]
      }),
      Curso.findAll({ where: { ESTATUS: true } })
    ]);
    res.render('asistencias/crear', {
      matriculas,
      profesores,
      cursos,
      formData: req.body,
      error: 'Error al registrar la asistencia'
    });
  }
};

const mostrarFormularioEditar = async (req, res) => {
  const { id } = req.params;
  try {
    const asistencia = await Asistencia.findByPk(id);
    const [matriculas, profesores, cursos] = await Promise.all([
      Matricula.findAll({ where: { ESTATUS: true } }),
      Profesor.findAll({
        where: { ESTATUS: true },
        include: [{ model: Usuario, as: 'usuario' }]
      }),
      Curso.findAll({ where: { ESTATUS: true } })
    ]);

    if (!asistencia) {
      return res.render('error', { mensaje: 'Asistencia no encontrada' });
    }

    res.render('asistencias/editar', {
      asistencia,
      matriculas,
      profesores,
      cursos,
      error: null
    });
  } catch (error) {
    console.error(error);
    res.render('error', { mensaje: 'Error al cargar el formulario de edición' });
  }
};

const actualizar = async (req, res) => {
  const { id } = req.params;
  const { ID_MATRICULA, ID_PROFESOR, ID_CURSO, FECHA, ESTADO } = req.body;

  try {
    await Asistencia.update(
      {
        ID_MATRICULA,
        ID_PROFESOR,
        ID_CURSO,
        FECHA,
        ESTADO,
        FECHA_MODIFICACION: new Date()
      },
      { where: { ID_ASISTENCIA: id } }
    );
    res.redirect('/asistencias');
  } catch (error) {
    console.error(error);
    res.render('error', { mensaje: 'Error al actualizar la asistencia' });
  }
};

const eliminar = async (req, res) => {
  const { id } = req.params;
  try {
    await Asistencia.update(
      { ESTATUS: false, FECHA_MODIFICACION: new Date() },
      { where: { ID_ASISTENCIA: id } }
    );
    res.redirect('/asistencias');
  } catch (error) {
    console.error(error);
    res.render('error', { mensaje: 'Error al eliminar la asistencia' });
  }
};

const reactivar = async (req, res) => {
  try {
    await Asistencia.update(
      { ESTATUS: true, FECHA_MODIFICACION: new Date() },
      { where: { ID_ASISTENCIA: req.params.id } }
    );
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.json({ ok: false });
  }
};

module.exports = {
  listar,
  mostrarFormularioCrear,
  crear,
  mostrarFormularioEditar,
  actualizar,
  eliminar,
  reactivar
};
