const { Estudiante, Usuario, TipoUsuario, Profesor, Carrera } = require('../models');

module.exports = {
  listar: async (req, res) => {
    try {
      const estudiantes = await Estudiante.findAll({
        include: [
          {
            model: Usuario,
            as: 'usuario',
            where: { ESTATUS: 1 },
            include: [{ model: TipoUsuario, as: 'tipo' }]
          }
        ]
      });
      res.render('estudiantes/listar', { estudiantes });
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al listar estudiantes' });
    }
  },

  crearForm: async (req, res) => {
    try {
      const todos = await Usuario.findAll({
        where: { ESTATUS: 1 },
        include: [
          {
            model: TipoUsuario,
            as: 'tipo',
            where: { NOMBRE: 'Estudiante' }
          },
          {
            model: Profesor,
            as: 'profesor',
            required: false
          },
          {
            model: Estudiante,
            as: 'estudiante',
            required: false
          }
        ]
      });

      // Solo usuarios tipo 'Estudiante' que no están asociados a Profesor ni Estudiante
      const usuarios = todos.filter(usuario => !usuario.profesor && !usuario.estudiante);
      const carreras = await Carrera.findAll();

      res.render('estudiantes/crear', {
        usuarios,
        carreras,
        formData: null,
        error: null
      });
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al cargar formulario' });
    }
  },

  crear: async (req, res) => {
    const { ID_USUARIO, NOMBRES, APELLIDOS, DNI, CARRERA, CORREO, ESTADO } = req.body;

    try {
      const usuario = await Usuario.findByPk(ID_USUARIO, {
        include: ['profesor', 'estudiante']
      });

      if (usuario.profesor) {
        throw new Error('Este usuario ya está registrado como profesor');
      }

      if (usuario.estudiante) {
        throw new Error('Este usuario ya está registrado como estudiante');
      }

      await Estudiante.create({
        ID_USUARIO,
        NOMBRES,
        APELLIDOS,
        DNI,
        CARRERA,
        CORREO,
        ESTADO,
        ESTATUS: true,
        FECHA_CREACION: new Date(),
        FECHA_MODIFICACION: new Date()
      });

      res.redirect('/estudiantes');
    } catch (error) {
      console.error('Error al crear estudiante:', error.message);
      const carreras = await Carrera.findAll();
      const todos = await Usuario.findAll({
        where: { ESTATUS: 1 },
        include: [
          {
            model: TipoUsuario,
            as: 'tipo',
            where: { NOMBRE: 'Estudiante' }
          },
          {
            model: Profesor,
            as: 'profesor',
            required: false
          },
          {
            model: Estudiante,
            as: 'estudiante',
            required: false
          }
        ]
      });

      const usuarios = todos.filter(usuario => !usuario.profesor && !usuario.estudiante);

      res.render('estudiantes/crear', {
        usuarios,
        carreras,
        formData: req.body,
        error: error.message
      });
    }
  },

  editarForm: async (req, res) => {
    try {
      const estudiante = await Estudiante.findByPk(req.params.id);
      const usuarios = await Usuario.findAll({ where: { ESTATUS: 1 } });
      const carreras = await Carrera.findAll();

      if (!estudiante) {
        return res.render('error', { mensaje: 'Estudiante no encontrado' });
      }

      res.render('estudiantes/editar', {
        estudiante,
        usuarios,
        carreras,
        error: null
      });
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al cargar el formulario' });
    }
  },

  editar: async (req, res) => {
    const { ID_USUARIO, NOMBRES, APELLIDOS, DNI, CARRERA, CORREO, ESTADO } = req.body;

    try {
      await Estudiante.update(
        {
          ID_USUARIO,
          NOMBRES,
          APELLIDOS,
          DNI,
          CARRERA,
          CORREO,
          ESTADO,
          FECHA_MODIFICACION: new Date()
        },
        { where: { ID_ESTUDIANTE: req.params.id } }
      );

      res.redirect('/estudiantes');
    } catch (error) {
      console.error(error);
      const estudiante = await Estudiante.findByPk(req.params.id);
      const usuarios = await Usuario.findAll({ where: { ESTATUS: 1 } });
      const carreras = await Carrera.findAll();

      res.render('estudiantes/editar', {
        estudiante,
        usuarios,
        carreras,
        error: 'Error al actualizar estudiante'
      });
    }
  },

  eliminar: async (req, res) => {
    try {
      await Estudiante.update(
        { ESTATUS: false, FECHA_MODIFICACION: new Date() },
        { where: { ID_ESTUDIANTE: req.params.id } }
      );
      res.redirect('/estudiantes');
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al eliminar estudiante' });
    }
  }
};
