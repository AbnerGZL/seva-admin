const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { Usuario, TipoUsuario } = require('../models');

router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

router.post('/login', async (req, res) => {
  const { EMAIL, CONTRASEÑA } = req.body;

  try {
    const usuario = await Usuario.findOne({
      where: { EMAIL, ESTATUS: 1 },
      include: [{ model: TipoUsuario, as: 'tipo' }]
    });

    if (!usuario || !bcrypt.compareSync(CONTRASEÑA, usuario.CONTRASEÑA)) {
      return res.render('login', { error: 'Credenciales incorrectas' });
    }

    if (usuario.tipo.NOMBRE !== 'Admin') {
      return res.render('login', { error: 'Solo administradores pueden iniciar sesión' });
    }

    req.session.usuario = {
      id: usuario.ID_USUARIO,
      email: usuario.EMAIL,
      tipo: usuario.tipo.NOMBRE
    };

    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.render('login', { error: 'Error al iniciar sesión' });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
