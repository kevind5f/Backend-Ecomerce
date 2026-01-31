export const createCharge = async ({ amount, currency, email, token }) => {
  // Simulación de latencia
  await new Promise(resolve => setTimeout(resolve, 500));

  // Validación simulada
  if (!token || token === 'invalid') {
    throw new Error('Token de pago inválido');
  }

  return {
    id: `mock_charge_${Date.now()}`,
    amount: Math.round(amount * 100),
    currency_code: currency,
    email,
    status: 'paid',
    created_at: new Date().toISOString(),
    provider: 'CULQI_MOCK'
  };
};