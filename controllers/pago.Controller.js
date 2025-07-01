const { Pago, Matricula, Estudiante, Carrera } = require('../models');

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
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const { count, rows: pagos } = await Pago.findAndCountAll({
      include: [{
        model: Matricula,
        as: 'matricula',
        include: [
          { model: Estudiante, as: 'estudiante' },
          { model: Carrera, as: 'carrera' }
        ]
      }],
      limit,
      offset,
      order: [['ID_PAGO', 'DESC']]
    });

    const totalPages = Math.ceil(count / limit);

    res.render('pagos/listar', {
      pagos,
      currentPage: page,
      totalPages
    });
  } catch (error) {
    console.error(error);
    res.render('error', { mensaje: 'Error al listar pagos' });
  }
},

  crearForm: async (req, res) => {
    try {
      const matriculas = await Matricula.findAll({
        where: { ESTATUS: true },
        include: [
          {
            model: Estudiante,
            as: 'estudiante',
            where: { ESTATUS: true }
          },
          {
            model: Carrera,
            as: 'carrera'
          }
        ]
      });

      res.render('pagos/crear', { matriculas, formData: null, error: null });
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al cargar formulario de pago' });
    }
  },

  crear: async (req, res) => {
    const { ID_MATRICULA, FECHA_PAGO, MONTO, FORMATO, OBSERVACION } = req.body;

    try {
      if (!ID_MATRICULA || !FECHA_PAGO || !MONTO) {
        throw new Error('Matrícula, fecha de pago y monto son obligatorios.');
      }

      const codigoRecibo = await generarCodigoReciboUnico();

      await Pago.create({
        ID_MATRICULA,
        FECHA_PAGO,
        MONTO,
        FORMATO,
        RECIBO: codigoRecibo,
        OBSERVACION,
        ESTATUS: true,
        FECHA_CREACION: new Date(),
        FECHA_ACTUALIZACION: new Date()
      });

      res.redirect('/pagos');
    } catch (error) {
      console.error(error);

      const matriculas = await Matricula.findAll({
        where: { ESTATUS: true },
        include: [
          {
            model: Estudiante,
            as: 'estudiante',
            where: { ESTATUS: true }
          },
          {
            model: Carrera,
            as: 'carrera'
          }
        ]
      });

      res.render('pagos/crear', {
        matriculas,
        formData: req.body,
        error: error.message || 'Error al crear pago'
      });
    }
  },

  editarForm: async (req, res) => {
    try {
      const pago = await Pago.findByPk(req.params.id, {
        include: {
          model: Matricula,
          as: 'matricula',
          include: [
            { model: Estudiante, as: 'estudiante' },
            { model: Carrera, as: 'carrera' }
          ]
        }
      });

      const matriculas = await Matricula.findAll({
        where: { ESTATUS: true },
        include: [
          {
            model: Estudiante,
            as: 'estudiante',
            where: { ESTATUS: true }
          },
          {
            model: Carrera,
            as: 'carrera'
          }
        ]
      });

      res.render('pagos/editar', { pago, matriculas, error: null });
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al cargar el formulario de edición' });
    }
  },

  editar: async (req, res) => {
    const { ID_MATRICULA, FECHA_PAGO, MONTO, FORMATO, OBSERVACION } = req.body;

    try {
      await Pago.update({
        ID_MATRICULA,
        FECHA_PAGO,
        MONTO,
        FORMATO,
        OBSERVACION,
        FECHA_ACTUALIZACION: new Date()
      }, {
        where: { ID_PAGO: req.params.id }
      });

      res.redirect('/pagos');
    } catch (error) {
      console.error(error);

      const pago = await Pago.findByPk(req.params.id);
      const matriculas = await Matricula.findAll({
        where: { ESTATUS: true },
        include: [
          {
            model: Estudiante,
            as: 'estudiante',
            where: { ESTATUS: true }
          },
          {
            model: Carrera,
            as: 'carrera'
          }
        ]
      });

      res.render('pagos/editar', {
        pago,
        matriculas,
        error: 'Error al actualizar pago'
      });
    }
  },

  reactivar: async (req, res) => {
    try {
      await Pago.update({
        ESTATUS: true,
        FECHA_ACTUALIZACION: new Date()
      }, {
        where: { ID_PAGO: req.params.id }
      });

      res.json({ ok: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false, message: 'Error al reactivar pago' });
    }
  },

  eliminar: async (req, res) => {
    try {
      await Pago.update({
        ESTATUS: false,
        FECHA_ACTUALIZACION: new Date()
      }, {
        where: { ID_PAGO: req.params.id }
      });

      res.redirect('/pagos');
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al eliminar pago' });
    }
  }
};
