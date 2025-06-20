const { NotaDetalle, Nota } = require('../models');

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
    const notas = await Nota.findAll({ where: { ESTATUS: true } });
    res.render('notaDetalle/crear', { notas, formData: {}, error: null });
  } catch (error) {
    console.error(error);
    res.render('error', { mensaje: 'Error al cargar formulario de creación' });
  }
};

const crear = async (req, res) => {
  const { ID_NOTA, PRACTICA, TEORIA, FECHA } = req.body;
  try {
    await NotaDetalle.create({
      ID_NOTA,
      PRACTICA,
      TEORIA,
      FECHA,
      ESTATUS: true,
      FECHA_CREACION: new Date(),
      FECHA_MODIFICACION: new Date()
    });
    res.redirect('/notadetalle');
  } catch (error) {
    console.error(error);
    const notas = await Nota.findAll({ where: { ESTATUS: true } });
    res.render('notaDetalle/crear', {
      notas,
      formData: req.body,
      error: 'Error al crear el detalle de nota'
    });
  }
};

const mostrarFormularioEditar = async (req, res) => {
  try {
    const notaDetalle = await NotaDetalle.findByPk(req.params.id);
    const notas = await Nota.findAll({ where: { ESTATUS: true } });
    if (!notaDetalle) throw new Error();
    res.render('notaDetalle/editar', { notaDetalle, notas, error: null });
  } catch (error) {
    console.error(error);
    res.render('error', { mensaje: 'Error al cargar formulario de edición' });
  }
};

const actualizar = async (req, res) => {
  const { ID_NOTA, PRACTICA, TEORIA, FECHA } = req.body;
  try {
    await NotaDetalle.update({
      ID_NOTA,
      PRACTICA,
      TEORIA,
      FECHA,
      FECHA_MODIFICACION: new Date()
    }, {
      where: { ID_NOTA_DETALLE: req.params.id }
    });
    res.redirect('/notadetalle');
  } catch (error) {
    console.error(error);
    const notaDetalle = await NotaDetalle.findByPk(req.params.id);
    const notas = await Nota.findAll({ where: { ESTATUS: true } });
    res.render('notaDetalle/editar', {
      notaDetalle,
      notas,
      error: 'Error al actualizar el detalle de nota'
    });
  }
};

const eliminar = async (req, res) => {
  try {
    await NotaDetalle.update({ ESTATUS: false }, {
      where: { ID_NOTA_DETALLE: req.params.id }
    });
    res.redirect('/notadetalle');
  } catch (error) {
    console.error(error);
    res.render('error', { mensaje: 'Error al eliminar el detalle de nota' });
  }
};

module.exports = {
  listar,
  mostrarFormularioCrear,
  crear,
  mostrarFormularioEditar,
  actualizar,
  eliminar
};
