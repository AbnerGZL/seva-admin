const { TipoUsuario } = require('../models');

module.exports = {
  listar: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;
    
      const { count, rows: tipos } = await TipoUsuario.findAndCountAll({
        limit,
        offset,
        order: [['ID_TIPO', 'DESC']]
      });
    
      const totalPages = Math.ceil(count / limit);
    
      res.render('tipos/listar', {
        tipos,
        currentPage: page,
        totalPages
      });
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al listar tipos de usuario' });
    }
  },

  crearForm: (req, res) => {
    res.render('tipos/crear', { formData: null, error: null });
  },

  crear: async (req, res) => {
    const { NOMBRE } = req.body;
    try {
      if (!NOMBRE || NOMBRE.trim() === '') {
        return res.render('tipos/crear', {
          formData: req.body,
          error: 'El nombre es obligatorio'
        });
      }

      const existente = await TipoUsuario.findOne({ where: { NOMBRE } });
      if (existente) {
        return res.render('tipos/crear', {
          formData: req.body,
          error: 'Ya existe un tipo de usuario con ese nombre.'
        });
      }

      await TipoUsuario.create({
        NOMBRE,
        ESTATUS: true,
        FECHA_CREACION: new Date(),
        FECHA_MODIFICACION: new Date()
      });

      res.redirect('/tipos');
    } catch (error) {
      console.error('Error al crear tipo de usuario:', error);
      res.render('tipos/crear', { formData: req.body, error: error.message });
    }
  },

  editarForm: async (req, res) => {
    const { id } = req.params;
    try {
      const tipo = await TipoUsuario.findByPk(id);
      if (!tipo) {
        return res.render('error', { mensaje: 'Tipo de usuario no encontrado' });
      }

      res.render('tipos/editar', { tipo, error: null });
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al cargar tipo de usuario' });
    }
  },

  editar: async (req, res) => {
    const { id } = req.params;
    const { NOMBRE } = req.body;

    try {
      if (!NOMBRE || NOMBRE.trim() === '') {
        const tipo = await TipoUsuario.findByPk(id);
        return res.render('tipos/editar', {
          tipo,
          error: 'El nombre es obligatorio'
        });
      }

      const existente = await TipoUsuario.findOne({
        where: { NOMBRE }
      });

      if (existente && existente.ID_TIPO != id) {
        const tipo = await TipoUsuario.findByPk(id);
        return res.render('tipos/editar', {
          tipo,
          error: 'Ya existe otro tipo de usuario con ese nombre.'
        });
      }

      await TipoUsuario.update(
        {
          NOMBRE,
          FECHA_MODIFICACION: new Date()
        },
        { where: { ID_TIPO: id } }
      );

      res.redirect('/tipos');
    } catch (error) {
      console.error('Error al editar tipo:', error);
      const tipo = await TipoUsuario.findByPk(id);
      res.render('tipos/editar', { tipo, error: error.message });
    }
  },

  reactivar: async (req, res) => {
    try {
      await TipoUsuario.update(
        { ESTATUS: true, FECHA_MODIFICACION: new Date() },
        { where: { ID_TIPO: req.params.id } }
      );
      res.sendStatus(200);
    } catch (error) {
      console.error('Error al reactivar tipo:', error);
      res.status(500).send('Error al reactivar tipo');
    }
  },

  eliminar: async (req, res) => {
    const { id } = req.params;
    try {
      await TipoUsuario.update(
        { ESTATUS: false, FECHA_MODIFICACION: new Date() },
        { where: { ID_TIPO: id } }
      );
      res.redirect('/tipos');
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al eliminar tipo' });
    }
  }
};
