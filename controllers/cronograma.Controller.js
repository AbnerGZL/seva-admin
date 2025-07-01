const { Cronograma, Matricula, Curso, Profesor, Estudiante, Usuario, Carrera, Nota } = require('../models');

async function actualizarEstadoFinal(ID_CRONOGRAMA) {
  try {
    const cronograma = await Cronograma.findByPk(ID_CRONOGRAMA);
    if (!cronograma) return;

    const ID_MATRICULA = cronograma.ID_MATRICULA;

    // Calcular NOTAF para el cronograma
    const notas = await Nota.findAll({
      where: { ID_CRONOGRAMA, ESTATUS: true }
    });

    if (notas.length === 0) return;

    let sumaP = 0, sumaT = 0;
    notas.forEach(n => {
      sumaP += parseFloat(n.PROMEDIOP || 0);
      sumaT += parseFloat(n.PROMEDIOT || 0);
    });

    const promedioP = sumaP / notas.length;
    const promedioT = sumaT / notas.length;
    const notaf = parseFloat(((promedioP + promedioT) / 2).toFixed(2));
    const estado = notaf >= 13 ? 'Aprobado' : 'Desaprobado';

    await Cronograma.update(
      {
        NOTAF: notaf,
        ESTADOC: estado,
        FECHA_ACTUALIZACION: new Date()
      },
      { where: { ID_CRONOGRAMA } }
    );

    // Obtener todos los cronogramas activos de la matrícula
    const cronogramas = await Cronograma.findAll({
      where: { ID_MATRICULA, ESTATUS: true }
    });

    // Filtrar los que tengan NOTAF válido
    const notasFinales = cronogramas
      .map(c => parseFloat(c.NOTAF))
      .filter(n => !isNaN(n));

    if (notasFinales.length < 2) {
      // ⚠️ Forzamos null si no hay suficientes notas
      await Matricula.update(
        {
          PROMEDIOF: null,
          CONDICION: null,
          FECHA_ACTUALIZACION: new Date()
        },
        { where: { ID_MATRICULA } }
      );
      return;
    }

    // Promediar correctamente si hay 2 o más
    const sumaNotas = notasFinales.reduce((acc, n) => acc + n, 0);
    const promedioFinal = parseFloat((sumaNotas / notasFinales.length).toFixed(2));
    const condicion = promedioFinal >= 13 ? 'Aprobado' : 'Desaprobado';

    await Matricula.update(
      {
        PROMEDIOF: promedioFinal,
        CONDICION: condicion,
        FECHA_ACTUALIZACION: new Date()
      },
      { where: { ID_MATRICULA } }
    );
  } catch (error) {
    console.error('Error al actualizar estado final:', error);
  }
}

module.exports = {
  listar: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 10;
      const offset = (page - 1) * limit;
    
      const { count, rows: cronogramas } = await Cronograma.findAndCountAll({
        include: [
          {
            model: Matricula,
            as: 'matricula',
            include: [
              { model: Estudiante, as: 'estudiante' },
              { model: Carrera, as: 'carrera' }
            ]
          },
          { model: Curso, as: 'curso' },
          {
            model: Profesor,
            as: 'profesor',
            include: [{ model: Usuario, as: 'usuario' }]
          }
        ],
        order: [['ID_CRONOGRAMA', 'DESC']],
        limit,
        offset
      });
    
      const totalPages = Math.ceil(count / limit);
    
      res.render('cronogramas/listar', {
        cronogramas,
        currentPage: page,
        totalPages
      });
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al listar cronogramas' });
    }
  },

  crearForm: async (req, res) => {
    try {
      const [matriculas, cursos, profesores] = await Promise.all([
        Matricula.findAll({
          where: { ESTATUS: true },
          include: [
            { model: Estudiante, as: 'estudiante' },
            { model: Carrera, as: 'carrera' }
          ]
        }),
        Curso.findAll({ where: { ESTATUS: true } }),
        Profesor.findAll({
          where: { ESTATUS: true },
          include: [{ model: Usuario, as: 'usuario' }]
        })
      ]);

      res.render('cronogramas/crear', {
        matriculas,
        cursos,
        profesores,
        formData: {},
        error: null
      });
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al cargar formulario de cronograma' });
    }
  },

  crear: async (req, res) => {
    const { ID_MATRICULA, ID_CURSO, ID_PROFESOR, CURSACION } = req.body;
    try {
      if (!ID_MATRICULA || !ID_CURSO || !ID_PROFESOR || !CURSACION) {
        throw new Error('Todos los campos son obligatorios.');
      }

      const nuevo = await Cronograma.create({
        ID_MATRICULA,
        ID_CURSO,
        ID_PROFESOR,
        CURSACION,
        ESTATUS: true,
        FECHA_CREACION: new Date(),
        FECHA_ACTUALIZACION: new Date()
      });

      await actualizarEstadoFinal(nuevo.ID_CRONOGRAMA);

      res.redirect('/cronogramas');
    } catch (error) {
      console.error(error);

      const [matriculas, cursos, profesores] = await Promise.all([
        Matricula.findAll({
          where: { ESTATUS: true },
          include: [
            { model: Estudiante, as: 'estudiante' },
            { model: Carrera, as: 'carrera' }
          ]
        }),
        Curso.findAll({ where: { ESTATUS: true } }),
        Profesor.findAll({
          where: { ESTATUS: true },
          include: [{ model: Usuario, as: 'usuario' }]
        })
      ]);

      res.render('cronogramas/crear', {
        matriculas,
        cursos,
        profesores,
        formData: req.body,
        error: error.message || 'Error al crear cronograma'
      });
    }
  },

  editarForm: async (req, res) => {
    try {
      const cronograma = await Cronograma.findByPk(req.params.id);
      if (!cronograma) {
        return res.render('error', { mensaje: 'Cronograma no encontrado' });
      }

      const [matriculas, cursos, profesores] = await Promise.all([
        Matricula.findAll({
          where: { ESTATUS: true },
          include: [
            { model: Estudiante, as: 'estudiante' },
            { model: Carrera, as: 'carrera' }
          ]
        }),
        Curso.findAll({ where: { ESTATUS: true } }),
        Profesor.findAll({
          where: { ESTATUS: true },
          include: [{ model: Usuario, as: 'usuario' }]
        })
      ]);

      res.render('cronogramas/editar', {
        cronograma,
        matriculas,
        cursos,
        profesores,
        error: null
      });
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al cargar formulario de edición' });
    }
  },

  editar: async (req, res) => {
    const { ID_MATRICULA, ID_CURSO, ID_PROFESOR, CURSACION } = req.body;
    try {
      if (!ID_MATRICULA || !ID_CURSO || !ID_PROFESOR || !CURSACION) {
        throw new Error('Todos los campos son obligatorios.');
      }

      await Cronograma.update(
        {
          ID_MATRICULA,
          ID_CURSO,
          ID_PROFESOR,
          CURSACION,
          FECHA_ACTUALIZACION: new Date()
        },
        { where: { ID_CRONOGRAMA: req.params.id } }
      );

      await actualizarEstadoFinal(req.params.id);

      res.redirect('/cronogramas');
    } catch (error) {
      console.error(error);

      const cronograma = await Cronograma.findByPk(req.params.id);
      const [matriculas, cursos, profesores] = await Promise.all([
        Matricula.findAll({
          where: { ESTATUS: true },
          include: [
            { model: Estudiante, as: 'estudiante' },
            { model: Carrera, as: 'carrera' }
          ]
        }),
        Curso.findAll({ where: { ESTATUS: true } }),
        Profesor.findAll({
          where: { ESTATUS: true },
          include: [{ model: Usuario, as: 'usuario' }]
        })
      ]);

      res.render('cronogramas/editar', {
        cronograma,
        matriculas,
        cursos,
        profesores,
        error: error.message || 'Error al actualizar cronograma'
      });
    }
  },

  eliminar: async (req, res) => {
    try {
      await Cronograma.update(
        { ESTATUS: false, FECHA_ACTUALIZACION: new Date() },
        { where: { ID_CRONOGRAMA: req.params.id } }
      );
      res.redirect('/cronogramas');
    } catch (error) {
      console.error(error);
      res.render('error', { mensaje: 'Error al eliminar cronograma' });
    }
  },

  reactivar: async (req, res) => {
    try {
      await Cronograma.update(
        { ESTATUS: true, FECHA_ACTUALIZACION: new Date() },
        { where: { ID_CRONOGRAMA: req.params.id } }
      );
      res.json({ ok: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ ok: false });
    }
  },

  actualizarEstadoFinal
};