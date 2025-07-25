const {
  Asistencia,
  Cronograma,
  Matricula,
  Estudiante,
  Profesor,
  Usuario,
  Curso
} = require('../models');

const listar = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const { count, rows: asistencias } = await Asistencia.findAndCountAll({
      include: [
        {
          model: Cronograma,
          as: 'cronograma',
          include: [
            {
              model: Matricula,
              as: 'matricula',
              include: [{ model: Estudiante, as: 'estudiante' }]
            },
            { model: Curso, as: 'curso' },
            {
              model: Profesor,
              as: 'profesor',
              include: [{ model: Usuario, as: 'usuario' }]
            }
          ]
        }
      ],
      limit,
      offset,
      order: [['ID_ASISTENCIA', 'DESC']]
    });

    const totalPages = Math.ceil(count / limit);

    res.render('asistencias/listar', {
      asistencias,
      currentPage: page,
      totalPages
    });
  } catch (error) {
    console.error(error);
    res.render('error', { mensaje: 'Error al listar asistencias' });
  }
};

const mostrarFormularioCrear = async (req, res) => {
  try {
    const cronogramas = await Cronograma.findAll({
      where: { ESTATUS: true },
      include: [
        {
          model: Matricula,
          as: 'matricula',
          include: [{ model: Estudiante, as: 'estudiante' }]
        },
        { model: Curso, as: 'curso' }
      ]
    });

    res.render('asistencias/crear', {
      cronogramas,
      formData: {},
      error: null
    });
  } catch (error) {
    console.error(error);
    res.render('error', {
      mensaje: 'Error al cargar el formulario de creación'
    });
  }
};

const crear = async (req, res) => {
  const { ID_CRONOGRAMA, FECHA, ESTADO } = req.body;

  try {
    await Asistencia.create({
      ID_CRONOGRAMA,
      FECHA,
      ESTADO,
      ESTATUS: true,
      FECHA_CREACION: new Date(),
      FECHA_ACTUALIZACION: new Date()
    });

    res.redirect('/asistencias');
  } catch (error) {
    console.error(error);

    const cronogramas = await Cronograma.findAll({
      where: { ESTATUS: true },
      include: [
        {
          model: Matricula,
          as: 'matricula',
          include: [{ model: Estudiante, as: 'estudiante' }]
        },
        { model: Curso, as: 'curso' }
      ]
    });

    res.render('asistencias/crear', {
      cronogramas,
      formData: req.body,
      error: 'Error al registrar la asistencia'
    });
  }
};

const mostrarFormularioEditar = async (req, res) => {
  const { id } = req.params;

  try {
    const asistencia = await Asistencia.findByPk(id);
    if (!asistencia) {
      return res.render('error', { mensaje: 'Asistencia no encontrada' });
    }

    const cronogramas = await Cronograma.findAll({
      where: { ESTATUS: true },
      include: [
        {
          model: Matricula,
          as: 'matricula',
          include: [{ model: Estudiante, as: 'estudiante' }]
        },
        { model: Curso, as: 'curso' }
      ]
    });

    res.render('asistencias/editar', {
      asistencia,
      cronogramas,
      error: null
    });
  } catch (error) {
    console.error(error);
    res.render('error', {
      mensaje: 'Error al cargar el formulario de edición'
    });
  }
};

const actualizar = async (req, res) => {
  const { id } = req.params;
  const { ID_CRONOGRAMA, FECHA, ESTADO } = req.body;

  try {
    await Asistencia.update(
      {
        ID_CRONOGRAMA,
        FECHA,
        ESTADO,
        FECHA_ACTUALIZACION: new Date()
      },
      { where: { ID_ASISTENCIA: id } }
    );
    res.redirect('/asistencias');
  } catch (error) {
    console.error(error);
    res.render('error', {
      mensaje: 'Error al actualizar la asistencia'
    });
  }
};

const eliminar = async (req, res) => {
  const { id } = req.params;

  try {
    await Asistencia.update(
      { ESTATUS: false, FECHA_ACTUALIZACION: new Date() },
      { where: { ID_ASISTENCIA: id } }
    );
    res.redirect('/asistencias');
  } catch (error) {
    console.error(error);
    res.render('error', {
      mensaje: 'Error al eliminar la asistencia'
    });
  }
};

const reactivar = async (req, res) => {
  try {
    await Asistencia.update(
      { ESTATUS: true, FECHA_ACTUALIZACION: new Date() },
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
