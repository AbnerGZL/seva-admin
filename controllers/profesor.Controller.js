const { Profesor, Usuario, TipoUsuario } = require('../models');

module.exports = {
  listar: async (req, res) => {
    try {
      const profesores = await Profesor.findAll({
        include: [{
          model: Usuario,
          as: 'usuario',
          where: { ESTATUS: 1 },
          include: [{ model: TipoUsuario, as: 'tipo' }]
        }]
      });

      res.render('profesores/listar', { profesores });
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al listar profesores' });
    }
  },

  crearForm: async (req, res) => {
    try {
      const usuarios = await Usuario.findAll({
        where: { ESTATUS: 1 },
        include: [
          {
            model: TipoUsuario,
            as: 'tipo',
            where: { NOMBRE: 'Profesor' }
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
      const { ID_USUARIO, NOMBRES, APELLIDOS, ESPECIALIDAD, TELEFONO } = req.body;
    
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
          TELEFONO,
          DNI: usuario.DNI,
          CORREO: usuario.EMAIL,
          ESTATUS: true,
          FECHA_CREACION: new Date(),
          FECHA_MODIFICACION: new Date()
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
              where: { NOMBRE: 'Profesor' }
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
    const { NOMBRES, APELLIDOS, ESPECIALIDAD, TELEFONO, CORREO } = req.body;

    try {
      await Profesor.update({
        NOMBRES,
        APELLIDOS,
        ESPECIALIDAD,
        TELEFONO,
        DNI,
        CORREO,
        FECHA_MODIFICACION: new Date()
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
        FECHA_MODIFICACION: new Date()
      }, {
        where: { ID_PROFESOR: req.params.id }
      });

      res.redirect('/profesores');
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al eliminar profesor' });
    }
  }
};
