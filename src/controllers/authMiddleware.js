const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    req.session.flash = { type: 'error', message: 'Please log in to continue.' };
    return res.redirect('/login');
  }
  next();
};

const requireRole = (role) => (req, res, next) => {
  if (!req.session.user) {
    req.session.flash = { type: 'error', message: 'Please log in to continue.' };
    return res.redirect('/login');
  }

  if (req.session.user.role !== role) {
    req.session.flash = { type: 'error', message: 'Admin access is required to view that page.' };
    return res.redirect('/');
  }

  next();
};

export { requireLogin, requireRole };