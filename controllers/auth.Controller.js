const { Usuario, TipoUsuario } = require('../models');
const bcrypt = require('bcryptjs');

exports.loginForm = (req, res) => {
  res.render('auth/login', { error: null });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ 
      where: { 
        EMAIL: email,
        ESTATUS: 1
      },
      include: [{ model: TipoUsuario, as: 'tipo' }]
    });

    if (!usuario) {
      return res.render('auth/login', { 
        error: 'Usuario no encontrado o inactivo' 
      });
    }

    const match = await bcrypt.compare(password, usuario.CONTRASEÑA);
    
    if (!match) {
      return res.render('auth/login', { error: 'Contraseña incorrecta' });
    }

    req.session.usuario = {
      id: usuario.ID_USUARIO,
      email: usuario.EMAIL,
      ID_TIPO: usuario.ID_TIPO,
      tipoNombre: usuario.tipo.NOMBRE
    };

    if (usuario.ID_TIPO === 1) {
      return res.redirect('/admin/dashboard');
    }
    return res.redirect('/');

  } catch (error) {
    console.error(error);
    res.render('auth/login', { error: 'Error al iniciar sesión' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/login');
};