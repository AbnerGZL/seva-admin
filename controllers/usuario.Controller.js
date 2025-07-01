const { Usuario, TipoUsuario } = require('../models');
const bcrypt = require('bcryptjs');

const generarCodigoUsuarioUnico = async () => {
  let codigo;
  let existe = true;

  while (existe) {
    const random = Math.floor(100000 + Math.random() * 900000);
    codigo = `USR-${random}`;
    const existente = await Usuario.findOne({ where: { CODIGOU: codigo } });
    existe = !!existente;
  }

  return codigo;
};

module.exports = {
  listar: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;
    
      const { count, rows: usuarios } = await Usuario.findAndCountAll({
        include: [{ model: TipoUsuario, as: 'tipo' }],
        limit,
        offset,
        order: [['ID_USUARIO', 'DESC']]
      });
    
      const totalPages = Math.ceil(count / limit);
    
      res.render('usuarios/listar', {
        usuarios,
        currentPage: page,
        totalPages
      });
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al listar usuarios' });
    }
  },

  crearForm: async (req, res) => {
    try {
      const tipos = await TipoUsuario.findAll({ where: { ESTATUS: true } });
      const nuevoCodigo = await generarCodigoUsuarioUnico();

      res.render('usuarios/crear', {
        tipos,
        formData: { CODIGOU: nuevoCodigo },
        error: null
      });
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al cargar formulario' });
    }
  },

  crear: async (req, res) => {
    const { ID_TIPO, EMAIL, CONTRASEÑA } = req.body;

    try {
      if (!ID_TIPO || !EMAIL || !CONTRASEÑA) {
        const tipos = await TipoUsuario.findAll({ where: { ESTATUS: true } });
        return res.render('usuarios/crear', {
          tipos,
          formData: { ...req.body },
          error: 'Todos los campos son obligatorios'
        });
      }

      const tipo = await TipoUsuario.findByPk(ID_TIPO);
      if (!tipo) {
        const tipos = await TipoUsuario.findAll({ where: { ESTATUS: true } });
        return res.render('usuarios/crear', {
          tipos,
          formData: { ...req.body },
          error: 'Tipo de usuario no válido'
        });
      }

      const usuarioExistente = await Usuario.findOne({ where: { EMAIL } });
      if (usuarioExistente) {
        const tipos = await TipoUsuario.findAll({ where: { ESTATUS: true } });
        return res.render('usuarios/crear', {
          tipos,
          formData: { ...req.body },
          error: 'El email ya está registrado'
        });
      }

      const CODIGOU = await generarCodigoUsuarioUnico();

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
      const tipos = await TipoUsuario.findAll({ where: { ESTATUS: true } });
      let errorMessage = 'Error al crear usuario';
      if (error.name === 'SequelizeValidationError') {
        errorMessage = error.errors.map(e => e.message).join(', ');
      }

      const nuevoCodigo = await generarCodigoUsuarioUnico();
      res.render('usuarios/crear', {
        tipos,
        formData: { ...req.body, CODIGOU: nuevoCodigo },
        error: errorMessage
      });
    }
  },

  editarForm: async (req, res) => {
    try {
      const usuario = await Usuario.findByPk(req.params.id);
      const tipos = await TipoUsuario.findAll({ where: { ESTATUS: true } });

      if (!usuario) {
        return res.render('error', { mensaje: 'Usuario no encontrado' });
      }

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
      const tipos = await TipoUsuario.findAll({ where: { ESTATUS: true } });
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
