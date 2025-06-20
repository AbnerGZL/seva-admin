const { Pago, Matricula } = require('../models');

const generarCodigoReciboUnico = async () => {
  let codigo;
  let existe = true;

  while (existe) {
    const random = Math.floor(100000 + Math.random() * 900000);
    codigo = `REC-${random}`;
    const pagoExistente = await Pago.findOne({ where: { RECIBO: codigo } });
    existe = !!pagoExistente;
  }

  return codigo;
};

module.exports = {
  listar: async (req, res) => {
    try {
      const pagos = await Pago.findAll({ include: [{ model: Matricula, as: 'matricula' }] });
      res.render('pagos/listar', { pagos });
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al listar pagos' });
    }
  },

  crearForm: async (req, res) => {
    try {
      const matriculas = await Matricula.findAll({ where: { ESTATUS: true } });
      res.render('pagos/crear', { matriculas, formData: null, error: null });
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al cargar formulario de pago' });
    }
  },

  crear: async (req, res) => {
    try {
      const codigoRecibo = await generarCodigoReciboUnico();

      await Pago.create({
        ID_MATRICULA: req.body.ID_MATRICULA,
        FECHA_PAGO: req.body.FECHA_PAGO,
        MONTO: req.body.MONTO,
        FORMATO: req.body.FORMATO,
        RECIBO: codigoRecibo,
        OBSERVACION: req.body.OBSERVACION,
        ESTATUS: true,
        FECHA_CREACION: new Date(),
        FECHA_MODIFICACION: new Date()
      });

      res.redirect('/pagos');
    } catch (error) {
      console.error(error);
      const matriculas = await Matricula.findAll({ where: { ESTATUS: true } });
      res.render('pagos/crear', { matriculas, formData: req.body, error: 'Error al crear pago' });
    }
  },

  editarForm: async (req, res) => {
    try {
      const pago = await Pago.findByPk(req.params.id);
      const matriculas = await Matricula.findAll({ where: { ESTATUS: true } });
      res.render('pagos/editar', { pago, matriculas, error: null });
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al cargar el formulario de edición' });
    }
  },

  editar: async (req, res) => {
    try {
      await Pago.update({
        ID_MATRICULA: req.body.ID_MATRICULA,
        FECHA_PAGO: req.body.FECHA_PAGO,
        MONTO: req.body.MONTO,
        FORMATO: req.body.FORMATO,
        OBSERVACION: req.body.OBSERVACION,
        FECHA_MODIFICACION: new Date()
      }, {
        where: { ID_PAGO: req.params.id }
      });
      res.redirect('/pagos');
    } catch (error) {
      console.error(error);
      const pago = await Pago.findByPk(req.params.id);
      const matriculas = await Matricula.findAll({ where: { ESTATUS: true } });
      res.render('pagos/editar', { pago, matriculas, error: 'Error al actualizar pago' });
    }
  },

  eliminar: async (req, res) => {
    try {
      await Pago.update({ ESTATUS: false, FECHA_MODIFICACION: new Date() }, { where: { ID_PAGO: req.params.id } });
      res.redirect('/pagos');
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al eliminar pago' });
    }
  }
};
