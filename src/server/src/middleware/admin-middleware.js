module.exports = function (req, res, next) {
  try {
    const user = req.user;
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  } catch (err) {
    return res.status(403).json({ message: err.message });
  }
};
