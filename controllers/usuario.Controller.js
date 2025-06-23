const { Usuario, TipoUsuario } = require('../models');
const bcrypt = require('bcryptjs');

module.exports = {
  listar: async (req, res) => {
    try {
      const usuarios = await Usuario.findAll({
        include: [{ model: TipoUsuario, as: 'tipo' }]
      });
      res.render('usuarios/listar', { usuarios });
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al listar usuarios' });
    }
  },

  crearForm: async (req, res) => {
    try {
      const tipos = await TipoUsuario.findAll({ where: { ESTATUS: 1 } });
      res.render('usuarios/crear', { tipos, formData: null, error: null });
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al cargar formulario' });
    }
  },

  crear: async (req, res) => {
    const { ID_TIPO, CODIGOU, EMAIL, CONTRASEÑA } = req.body;

    try {
      if (!ID_TIPO || !CODIGOU || !EMAIL || !CONTRASEÑA) {
        const tipos = await TipoUsuario.findAll({ where: { ESTATUS: 1 } });
        return res.render('usuarios/crear', {
          tipos,
          formData: req.body,
          error: 'Todos los campos son obligatorios'
        });
      }

      const tipo = await TipoUsuario.findByPk(ID_TIPO);
      if (!tipo) {
        const tipos = await TipoUsuario.findAll();
        return res.render('usuarios/crear', {
          tipos,
          formData: req.body,
          error: 'Tipo de usuario no válido'
        });
      }

      const usuarioExistente = await Usuario.findOne({ where: { EMAIL } });
      if (usuarioExistente) {
        const tipos = await TipoUsuario.findAll();
        return res.render('usuarios/crear', {
          tipos,
          formData: req.body,
          error: 'El email ya está registrado'
        });
      }

      await Usuario.create({
        ID_TIPO,
        CODIGOU,
        EMAIL,
        CONTRASEÑA: bcrypt.hashSync(CONTRASEÑA, 10),
        ESTATUS: 1,
        FECHA_CREACION: new Date(),
        FECHA_MODIFICACION: new Date()
      });

      res.redirect('/usuarios');
    } catch (error) {
      console.error('Error al crear usuario:', error);
      const tipos = await TipoUsuario.findAll();
      let errorMessage = 'Error al crear usuario';
      if (error.name === 'SequelizeValidationError') {
        errorMessage = error.errors.map(e => e.message).join(', ');
      }
      res.render('usuarios/crear', {
        tipos,
        formData: req.body,
        error: errorMessage
      });
    }
  },

  editarForm: async (req, res) => {
    try {
      const usuario = await Usuario.findByPk(req.params.id);
      const tipos = await TipoUsuario.findAll({ where: { ESTATUS: 1 } });

      if (!usuario) {
        return res.render('error', { mensaje: 'Usuario no encontrado' });
      }

      // Si el usuario está inactivo, mostrar confirmación
      if (!usuario.ESTATUS) {
        return res.send(`
          <script>
            if (confirm('Este usuario está inactivo. ¿Deseas reactivarlo para editarlo?')) {
              window.location.href = '/usuarios/reactivar/${usuario.ID_USUARIO}';
            } else {
              window.location.href = '/usuarios';
            }
          </script>
        `);
      }

      res.render('usuarios/editar', { usuario, tipos, error: null });
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al cargar formulario' });
    }
  },

  reactivar: async (req, res) => {
    try {
      const { id } = req.params;
      await Usuario.update(
        {
          ESTATUS: 1,
          FECHA_MODIFICACION: new Date()
        },
        { where: { ID_USUARIO: id } }
      );
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error al reactivar usuario' });
    }
  },

  editar: async (req, res) => {
    const { ID_TIPO, CODIGOU, EMAIL, CONTRASEÑA } = req.body;

    try {
      const updateData = {
        ID_TIPO,
        CODIGOU,
        EMAIL,
        FECHA_MODIFICACION: new Date()
      };

      if (CONTRASEÑA && CONTRASEÑA.trim() !== '') {
        updateData.CONTRASEÑA = bcrypt.hashSync(CONTRASEÑA, 10);
      }

      await Usuario.update(updateData, {
        where: { ID_USUARIO: req.params.id }
      });

      res.redirect('/usuarios');
    } catch (error) {
      console.error(error);
      const usuario = await Usuario.findByPk(req.params.id);
      const tipos = await TipoUsuario.findAll({ where: { ESTATUS: 1 } });
      let errorMessage = 'Error al actualizar usuario';
      if (error.name === 'SequelizeValidationError') {
        errorMessage = error.errors.map(e => e.message).join(', ');
      }
      res.render('usuarios/editar', {
        usuario,
        tipos,
        error: errorMessage
      });
    }
  },

  eliminar: async (req, res) => {
    try {
      await Usuario.update(
        { ESTATUS: 0, FECHA_MODIFICACION: new Date() },
        { where: { ID_USUARIO: req.params.id } }
      );
      res.redirect('/usuarios');
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al eliminar usuario' });
    }
  }
};
