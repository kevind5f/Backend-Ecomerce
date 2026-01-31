import { findUserByEmail, createUser } from '../models/user.model.js';

export const oauthCallback = async (req, res) => {
  const { email, name, provider, provider_id } = req.body;

  try {
    let user = await findUserByEmail(email);

    if (!user) {
      user = await createUser({
        email,
        name,
        provider,
        provider_id
      });
    }

    res.json({
      message: 'Usuario autenticado',
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en autenticación' });
  }
};
