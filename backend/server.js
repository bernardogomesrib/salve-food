require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const mercadopago = require('mercadopago');

const ACCESS_TOKEN = process.env.ACCESS_TOKEN_PRODUCAO;

// Agora isso funciona na 1.5.17
mercadopago.configure({
  access_token: ACCESS_TOKEN
});

const app = express();
app.use(cors());
app.use(express.json());

app.post('/create-pix-payment', async (req, res) => {
  try {
    const { amount, description } = req.body;

    const payment_data = {
      transaction_amount: amount,
      description: description,
      payment_method_id: 'pix',
      payer: {
        email: 'thyago.smm@gmail.com'
      }
    };

    // Versão antiga usa `payment.create`
    const response = await mercadopago.payment.create(payment_data);

    res.status(200).json({
      id: response.body.id,
      status: response.body.status,
      qr_code: response.body.point_of_interaction.transaction_data.qr_code,
      qr_code_base64: response.body.point_of_interaction.transaction_data.qr_code_base64
    });
  } catch (error) {
    console.error('Erro ao criar pagamento Pix:', error);
    res.status(500).json({ error: 'Falha ao criar pagamento Pix', details: error });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
