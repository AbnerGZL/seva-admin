const { NotaDetalle, Nota } = require('../models');
const { actualizarEstadoFinal } = require('./cronograma.Controller'); // Importar la función

// Actualiza los promedios en NOTA y el estado final en CRONOGRAMA
async function actualizarPromedios(idNota) {
  const detalles = await NotaDetalle.findAll({
    where: { ID_NOTA: idNota, ESTATUS: true }
  });

  let sumaPractica = 0;
  let sumaTeoria = 0;

  detalles.forEach(d => {
    sumaPractica += parseFloat(d.PRACTICA);
    sumaTeoria += parseFloat(d.TEORIA);
  });

  const total = detalles.length || 1; // Evita división por cero
  const promedioP = parseFloat((sumaPractica / total).toFixed(2));
  const promedioT = parseFloat((sumaTeoria / total).toFixed(2));

  await Nota.update(
    {
      PROMEDIOP: promedioP,
      PROMEDIOT: promedioT,
      FECHA_ACTUALIZACION: new Date()
    },
    { where: { ID_NOTA: idNota } }
  );

  const nota = await Nota.findByPk(idNota);
  if (nota) {
    await actualizarEstadoFinal(nota.ID_CRONOGRAMA);
  }
}

module.exports = {
  listar: async (req, res) => {
    try {
      const notaDetalles = await NotaDetalle.findAll({
        include: [
          {
            association: 'nota',
            include: [
              {
                association: 'cronograma',
                include: [
                  { association: 'curso' },
                  {
                    association: 'matricula',
                    include: [{ association: 'estudiante' }]
                  }
                ]
              }
            ]
          }
        ]
      });
      res.render('notaDetalle/listar', { notaDetalles });
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al listar los detalles de nota' });
    }
  },

  mostrarFormularioCrear: async (req, res) => {
    try {
      const notas = await Nota.findAll({
        where: { ESTATUS: true },
        include: [
          { association: 'detalles', where: { ESTATUS: true }, required: false },
          {
            association: 'cronograma',
            include: [
              { association: 'curso' },
              {
                association: 'matricula',
                include: [{ association: 'estudiante' }]
              }
            ]
          }
        ]
      });

      const notasConDetalleCount = notas.map(n => ({
        ...n.get({ plain: true }),
        detalleCount: n.detalles.length
      }));

      res.render('notaDetalle/crear', { notas: notasConDetalleCount, formData: {}, error: null });
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al cargar formulario de creación' });
    }
  },

  crear: async (req, res) => {
    const { ID_NOTA, PRACTICA, TEORIA, FECHA } = req.body;

    try {
      const notaP = parseFloat(PRACTICA);
      const notaT = parseFloat(TEORIA);

      if (!ID_NOTA || notaP == null || notaT == null || !FECHA) {
        throw new Error('Todos los campos son obligatorios');
      }

      if (isNaN(notaP) || isNaN(notaT) || notaP < 0 || notaP > 20 || notaT < 0 || notaT > 20) {
        throw new Error('Las notas deben estar entre 0 y 20');
      }

      await NotaDetalle.create({
        ID_NOTA,
        PRACTICA: notaP.toFixed(2),
        TEORIA: notaT.toFixed(2),
        FECHA,
        ESTATUS: true,
        FECHA_CREACION: new Date(),
        FECHA_ACTUALIZACION: new Date()
      });

      await actualizarPromedios(ID_NOTA);
      res.redirect('/notadetalle');
    } catch (error) {
      console.error(error);

      const notas = await Nota.findAll({
        where: { ESTATUS: true },
        include: [
          { association: 'detalles', where: { ESTATUS: true }, required: false },
          {
            association: 'cronograma',
            include: [
              { association: 'curso' },
              {
                association: 'matricula',
                include: [{ association: 'estudiante' }]
              }
            ]
          }
        ]
      });

      const notasConDetalleCount = notas.map(n => ({
        ...n.get({ plain: true }),
        detalleCount: n.detalles.length
      }));

      res.render('notaDetalle/crear', { notas: notasConDetalleCount, formData: req.body, error: error.message });
    }
  },

  mostrarFormularioEditar: async (req, res) => {
    try {
      const notaDetalle = await NotaDetalle.findByPk(req.params.id);
      const notas = await Nota.findAll({
        where: { ESTATUS: true },
        include: [
          { association: 'detalles', where: { ESTATUS: true }, required: false },
          {
            association: 'cronograma',
            include: [
              { association: 'curso' },
              {
                association: 'matricula',
                include: [{ association: 'estudiante' }]
              }
            ]
          }
        ]
      });

      const notasConDetalleCount = notas.map(n => ({
        ...n.get({ plain: true }),
        detalleCount: n.detalles.length
      }));

      if (!notaDetalle) return res.render('error', { mensaje: 'Detalle no encontrado' });

      res.render('notaDetalle/editar', { notaDetalle, notas: notasConDetalleCount, error: null });
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al cargar formulario de edición' });
    }
  },

  actualizar: async (req, res) => {
    const { ID_NOTA, PRACTICA, TEORIA, FECHA } = req.body;

    try {
      const notaP = parseFloat(PRACTICA);
      const notaT = parseFloat(TEORIA);

      if (!ID_NOTA || notaP == null || notaT == null || !FECHA) {
        throw new Error('Todos los campos son obligatorios');
      }

      if (isNaN(notaP) || isNaN(notaT) || notaP < 0 || notaP > 20 || notaT < 0 || notaT > 20) {
        throw new Error('Las notas deben estar entre 0 y 20');
      }

      await NotaDetalle.update(
        {
          ID_NOTA,
          PRACTICA: notaP.toFixed(2),
          TEORIA: notaT.toFixed(2),
          FECHA,
          FECHA_ACTUALIZACION: new Date()
        },
        { where: { ID_NOTA_DETALLE: req.params.id } }
      );

      await actualizarPromedios(ID_NOTA);
      res.redirect('/notadetalle');
    } catch (error) {
      console.error(error);

      const notaDetalle = await NotaDetalle.findByPk(req.params.id);
      const notas = await Nota.findAll({
        where: { ESTATUS: true },
        include: [
          { association: 'detalles', where: { ESTATUS: true }, required: false },
          {
            association: 'cronograma',
            include: [
              { association: 'curso' },
              {
                association: 'matricula',
                include: [{ association: 'estudiante' }]
              }
            ]
          }
        ]
      });

      const notasConDetalleCount = notas.map(n => ({
        ...n.get({ plain: true }),
        detalleCount: n.detalles.length
      }));

      res.render('notaDetalle/editar', { notaDetalle, notas: notasConDetalleCount, error: error.message });
    }
  },

  eliminar: async (req, res) => {
    try {
      const notaDetalle = await NotaDetalle.findByPk(req.params.id);
      if (!notaDetalle) return res.redirect('/notadetalle');

      await NotaDetalle.update(
        { ESTATUS: false, FECHA_ACTUALIZACION: new Date() },
        { where: { ID_NOTA_DETALLE: req.params.id } }
      );

      await actualizarPromedios(notaDetalle.ID_NOTA);
      res.redirect('/notadetalle');
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al eliminar el detalle de nota' });
    }
  },

  reactivar: async (req, res) => {
    try {
      const notaDetalle = await NotaDetalle.findByPk(req.params.id);
      if (!notaDetalle) return res.status(404).json({ ok: false });

      await NotaDetalle.update(
        { ESTATUS: true, FECHA_ACTUALIZACION: new Date() },
        { where: { ID_NOTA_DETALLE: req.params.id } }
      );

      await actualizarPromedios(notaDetalle.ID_NOTA);
      res.json({ ok: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false });
    }
  },

  actualizarPromedios
};