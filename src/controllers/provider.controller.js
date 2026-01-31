import {
  getAllProviders,
  getProviderById,
  createProvider
} from '../models/provider.model.js';

import { updateProvider, deleteProvider } from '../models/provider.model.js';

export const listProviders = async (req, res) => {
  try {
    const providers = await getAllProviders();
    res.json(providers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al listar proveedores' });
  }
};

export const getProvider = async (req, res) => {
  try {
    const provider = await getProviderById(req.params.id);

    if (!provider) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    res.json(provider);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener proveedor' });
  }
};

export const createNewProvider = async (req, res) => {
  const { name, email, phone } = req.body;

  try {
    const provider = await createProvider({ name, email, phone });
    res.status(201).json(provider);
  } catch (error) {
    console.error(error);
    // Handle unique constraint for email (Postgres error code 23505)
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Email ya registrado' });
    }
    res.status(500).json({ error: 'Error al crear proveedor' });
  }
};

export const updateExistingProvider = async (req, res) => {
  const { name, email, phone } = req.body;
  const id = req.params.id;

  try {
    const provider = await updateProvider(id, { name, email, phone });

    if (!provider) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    res.json(provider);
  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Email ya registrado' });
    }
    res.status(500).json({ error: 'Error al actualizar proveedor' });
  }
};

export const removeProvider = async (req, res) => {
  const id = req.params.id;

  try {
    const provider = await deleteProvider(id);

    if (!provider) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    res.json({ message: 'Proveedor desactivado', provider });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar proveedor' });
  }
};
