module.exports = (req, res, next) => {
  console.log('User Role:', req.user.role); // Debug log
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Access denied, admin only' });
  }
  next();
};