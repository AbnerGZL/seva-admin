const isAuthenticated = (req, res, next) => {
  if (req.session.usuario) {
    return next();
  }
  res.redirect('/login');
};

const isAdmin = (req, res, next) => {
  if (req.session.usuario?.ID_TIPO === 1) {
    return next();
  }
  res.status(403).render('error', {
    message: 'Acceso denegado: se requieren privilegios de administrador'
  });
};

module.exports = {
  isAuthenticated,
  isAdmin
};