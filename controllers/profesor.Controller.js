const { Profesor, Usuario, TipoUsuario } = require('../models');

module.exports = {
  listar: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;
    
      const { count, rows: profesores } = await Profesor.findAndCountAll({
        limit,
        offset,
        order: [['ID_PROFESOR', 'DESC']]
      });
    
      const totalPages = Math.ceil(count / limit);
    
      res.render('profesores/listar', {
        profesores,
        currentPage: page,
        totalPages
      });
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al listar profesores' });
    }
  },

  crearForm: async (req, res) => {
    try {
      const usuarios = await Usuario.findAll({
        where: { ESTATUS: true },
        include: [
          {
            model: TipoUsuario,
            as: 'tipo',
            where: { NOMBRE: 'Profesor', ESTATUS: true }
          },
          {
            model: Profesor,
            as: 'profesor',
            required: false
          }
        ]
      });

      const disponibles = usuarios.filter(u => !u.profesor);

      res.render('profesores/crear', {
        usuarios: disponibles,
        formData: null,
        error: null
      });
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al cargar formulario' });
    }
  },

  crear: async (req, res) => {
    const { ID_USUARIO, NOMBRES, APELLIDOS, DNI, ESPECIALIDAD, ESTADO } = req.body;

    try {
      const usuario = await Usuario.findByPk(ID_USUARIO, {
        include: ['profesor']
      });

      if (usuario.profesor) {
        throw new Error('Este usuario ya está registrado como profesor');
      }

      await Profesor.create({
        ID_USUARIO,
        NOMBRES,
        APELLIDOS,
        ESPECIALIDAD,
        DNI,
        CORREO: usuario.EMAIL,
        ESTATUS: true,
        ESTADO,
        FECHA_CREACION: new Date(),
        FECHA_ACTUALIZACION: new Date()
      });

      res.redirect('/profesores');
    } catch (error) {
      console.error('Error al crear profesor:', error);

      const usuarios = await Usuario.findAll({
        where: { ESTATUS: 1 },
        include: [
          {
            model: TipoUsuario,
            as: 'tipo',
            where: { NOMBRE: 'Profesor', ESTATUS: true }
          },
          {
            model: Profesor,
            as: 'profesor',
            required: false
          }
        ]
      });

      const disponibles = usuarios.filter(u => !u.profesor);

      res.render('profesores/crear', {
        usuarios: disponibles,
        formData: req.body,
        error: error.message
      });
    }
  },

  editarForm: async (req, res) => {
    try {
      const profesor = await Profesor.findByPk(req.params.id);
      if (!profesor) return res.render('error', { mensaje: 'Profesor no encontrado' });

      res.render('profesores/editar', { profesor, error: null });
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al cargar formulario' });
    }
  },

  editar: async (req, res) => {
    const { NOMBRES, APELLIDOS, DNI, ESPECIALIDAD, CORREO, ESTADO } = req.body;

    try {
      await Profesor.update({
        NOMBRES,
        APELLIDOS,
        ESPECIALIDAD,
        DNI,
        CORREO,
        ESTADO,
        FECHA_ACTUALIZACION: new Date()
      }, {
        where: { ID_PROFESOR: req.params.id }
      });

      res.redirect('/profesores');
    } catch (error) {
      console.error('Error al editar profesor:', error);
      const profesor = await Profesor.findByPk(req.params.id);
      res.render('profesores/editar', {
        profesor,
        error: 'Error al actualizar profesor'
      });
    }
  },

  eliminar: async (req, res) => {
    try {
      await Profesor.update({
        ESTATUS: false,
        ESTADO: 'Inactivo',
        FECHA_ACTUALIZACION: new Date()
      }, {
        where: { ID_PROFESOR: req.params.id }
      });

      res.redirect('/profesores');
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al eliminar profesor' });
    }
  },

  reactivar: async (req, res) => {
    try {
      const { id } = req.params;

      const profesor = await Profesor.findByPk(id);
      if (!profesor) {
        return res.status(404).json({ mensaje: 'Profesor no encontrado' });
      }

      await Profesor.update(
        {
          ESTATUS: true,
          ESTADO: 'Activo',
          FECHA_ACTUALIZACION: new Date()
        },
        { where: { ID_PROFESOR: id } }
      );

      res.json({ ok: true });
    } catch (error) {
      console.error('Error al reactivar profesor:', error);
      res.status(500).json({ mensaje: 'Error al reactivar profesor' });
    }
  }
};