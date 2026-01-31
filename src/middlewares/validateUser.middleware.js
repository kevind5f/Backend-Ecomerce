export const validateUser = (req, res, next) => {
  const { oauth_id, email } = req.body;

  if (!oauth_id || !email) {
    return res.status(400).json({
      message: 'oauth_id y email son obligatorios'
    });
  }

  next();
};