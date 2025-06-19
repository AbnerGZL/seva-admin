const { DatosEstudiante, Estudiante } = require('../models');

module.exports = {
  listar: async (req, res) => {
    try {
      const datos = await DatosEstudiante.findAll({
        include: [{ model: Estudiante, as: 'estudiante' }]
      });
      res.render('datosEstudiante/listar', { datos });
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al listar los datos del estudiante' });
    }
  },

 crearForm: async (req, res) => {
   try {
     const estudiantes = await Estudiante.findAll({
       attributes: ['ID_ESTUDIANTE', 'NOMBRES', 'APELLIDOS', 'CORREO', 'DNI']
     });
 
     res.render('datosEstudiante/crear', {
       estudiantes,
       formData: null,
       error: null
     });
   } catch (error) {
     console.error(error);
     res.render('error', { mensaje: 'Error al cargar formulario' });
   }
 },

  crear: async (req, res) => {
    try {
      const { ID_ESTUDIANTE, DNI, FECHA_NAC, SEXO, DIRECCION, TELEFONO, EMAIL } = req.body;
      await DatosEstudiante.create({ ID_ESTUDIANTE, DNI, FECHA_NAC, SEXO, DIRECCION, TELEFONO, EMAIL });
      res.redirect('/datos-estudiantes');
    } catch (error) {
      console.error('Error al crear datos estudiante:', error);
      const estudiantes = await Estudiante.findAll();
      res.render('datosEstudiante/crear', {
        estudiantes,
        formData: req.body,
        error: 'Error al crear los datos del estudiante'
      });
    }
  },

  editarForm: async (req, res) => {
    try {
      const id = req.params.id;
      const dato = await DatosEstudiante.findByPk(id);
      const estudiantes = await Estudiante.findAll();
      res.render('datosEstudiante/editar', { dato, estudiantes, error: null });
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al cargar el formulario de edición' });
    }
  },

  editar: async (req, res) => {
    try {
      const id = req.params.id;
      await DatosEstudiante.update(req.body, { where: { ID_DATOS_ESTUDIANTE: id } });
      res.redirect('/datos-estudiantes');
    } catch (error) {
      console.error('Error al editar datos estudiante:', error);
      res.render('error', { mensaje: 'Error al editar los datos del estudiante' });
    }
  },

  eliminar: async (req, res) => {
    try {
      const id = req.params.id;
      await DatosEstudiante.destroy({ where: { ID_DATOS_ESTUDIANTE: id } });
      res.redirect('/datos-estudiantes');
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al eliminar datos del estudiante' });
    }
  }
};
