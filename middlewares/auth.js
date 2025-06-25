module.exports = {
  authMiddleware: (req, res, next) => {
    if (!req.session.usuario) {
      return res.redirect('/login');
    }
    next();
  },
  adminMiddleware: (req, res, next) => {
    if (req.session.usuario?.tipo !== 'Admin') {
      return res.render('error', { mensaje: 'Acceso no autorizado' });
    }
    next();
  }
};
