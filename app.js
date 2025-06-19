const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./models');
const usuarioRoutes = require('./routes/usuario.Routes');
const dashboardRoutes = require('./routes/dashboard.Routes');
const estudianteRoutes = require('./routes/estudiante.Routes');
const profesorRoutes = require("./routes/profesor.Routes");
const tipoRoutes = require('./routes/tipoUsuario.Routes');
const datosRoutes = require('./routes/datosEstudiante.Routes');
const cursoRoutes = require('./routes/curso.Routes');
const carreraRoutes = require('./routes/carrera.Routes');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/', dashboardRoutes);
app.use('/usuarios', usuarioRoutes);
app.use("/estudiantes", estudianteRoutes),
app.use("/profesores", profesorRoutes);
app.use("/tipos", tipoRoutes);
app.use("/datos", datosRoutes);
app.use("/cursos", cursoRoutes);
app.use("/carreras", carreraRoutes)

db.sequelize.sync({ force: false }).then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Servidor CRUD corriendo en http://localhost:${PORT}`));
});