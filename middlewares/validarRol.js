module.exports = async (req, res, next) => {
  const { ID_USUARIO } = req.body;
  
  const usuario = await Usuario.findByPk(ID_USUARIO, {
    include: ['profesor', 'estudiante']
  });

  if (usuario.profesor && usuario.estudiante) {
    return res.status(400).json({ error: 'El usuario ya tiene ambos roles' });
  }

  next();
};