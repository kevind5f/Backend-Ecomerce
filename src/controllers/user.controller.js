import { findUserByEmail, createUser } from '../models/user.model.js';

export const registerUser = async (req, res) => {
  try {
    const { oauth_id, email, name } = req.body;

    if (!oauth_id || !email) {
      return res.status(400).json({
        message: 'oauth_id y email son obligatorios'
      });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        message: 'El usuario ya existe'
      });
    }

    const user = await createUser({ oauth_id, email, name });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al registrar usuario'
    });
  }
};
