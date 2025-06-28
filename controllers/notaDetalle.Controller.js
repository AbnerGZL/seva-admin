const { NotaDetalle, Nota, Cronograma, Matricula, Estudiante, Carrera, Curso } = require('../models');

const listar = async (req, res) => {
  try {
    const notaDetalles = await NotaDetalle.findAll({
      include: [{ model: Nota, as: 'nota' }]
    });
    res.render('notaDetalle/listar', { notaDetalles });
  } catch (error) {
    console.error(error);
    res.render('error', { mensaje: 'Error al listar los detalles de nota' });
  }
};

const mostrarFormularioCrear = async (req, res) => {
  try {
    const notas = await Nota.findAll({
      where: { ESTATUS: true },
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
            { model: Curso, as: 'curso' }
          ]
        }
      ]
    });

    res.render('notaDetalle/crear', { notas, formData: {}, error: null });
  } catch (error) {
    console.error(error);
    res.render('error', { mensaje: 'Error al cargar formulario de creación' });
  }
};

const crear = async (req, res) => {
  const { ID_NOTA, PRACTICA, TEORIA, FECHA } = req.body;

  try {
    if (!ID_NOTA || !PRACTICA || !TEORIA || !FECHA) {
      throw new Error('Todos los campos son obligatorios');
    }

    await NotaDetalle.create({
      ID_NOTA,
      PRACTICA: parseFloat(PRACTICA).toFixed(2),
      TEORIA: parseFloat(TEORIA).toFixed(2),
      FECHA,
      ESTATUS: true,
      FECHA_CREACION: new Date(),
      FECHA_ACTUALIZACION: new Date()
    });

    res.redirect('/notadetalle');
  } catch (error) {
    console.error(error);

    const notas = await Nota.findAll({
      where: { ESTATUS: true },
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
            { model: Curso, as: 'curso' }
          ]
        }
      ]
    });

    res.render('notaDetalle/crear', {
      notas,
      formData: req.body,
      error: error.message || 'Error al crear el detalle de nota'
    });
  }
};

const mostrarFormularioEditar = async (req, res) => {
  try {
    const notaDetalle = await NotaDetalle.findByPk(req.params.id);
    const notas = await Nota.findAll({
      where: { ESTATUS: true },
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
            { model: Curso, as: 'curso' }
          ]
        }
      ]
    });

    if (!notaDetalle) {
      return res.render('error', { mensaje: 'Detalle de nota no encontrado' });
    }

    res.render('notaDetalle/editar', { notaDetalle, notas, error: null });
  } catch (error) {
    console.error(error);
    res.render('error', { mensaje: 'Error al cargar formulario de edición' });
  }
};

const actualizar = async (req, res) => {
  const { ID_NOTA, PRACTICA, TEORIA, FECHA } = req.body;

  try {
    if (!ID_NOTA || !PRACTICA || !TEORIA || !FECHA) {
      throw new Error('Todos los campos son obligatorios');
    }

    await NotaDetalle.update(
      {
        ID_NOTA,
        PRACTICA: parseFloat(PRACTICA).toFixed(2),
        TEORIA: parseFloat(TEORIA).toFixed(2),
        FECHA,
        FECHA_ACTUALIZACION: new Date()
      },
      { where: { ID_NOTA_DETALLE: req.params.id } }
    );

    res.redirect('/notadetalle');
  } catch (error) {
    console.error(error);

    const notaDetalle = await NotaDetalle.findByPk(req.params.id);
    const notas = await Nota.findAll({
      where: { ESTATUS: true },
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
            { model: Curso, as: 'curso' }
          ]
        }
      ]
    });

    res.render('notaDetalle/editar', {
      notaDetalle,
      notas,
      error: error.message || 'Error al actualizar el detalle de nota'
    });
  }
};

const eliminar = async (req, res) => {
  try {
    await NotaDetalle.update(
      {
        ESTATUS: false,
        FECHA_ACTUALIZACION: new Date()
      },
      { where: { ID_NOTA_DETALLE: req.params.id } }
    );

    res.redirect('/notadetalle');
  } catch (error) {
    console.error(error);
    res.render('error', { mensaje: 'Error al eliminar el detalle de nota' });
  }
};

const reactivar = async (req, res) => {
  try {
    await NotaDetalle.update(
      {
        ESTATUS: true,
        FECHA_ACTUALIZACION: new Date()
      },
      { where: { ID_NOTA_DETALLE: req.params.id } }
    );
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
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
