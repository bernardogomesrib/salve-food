require("dotenv").config({ path: "../.env" });

const express = require("express");
const cors = require("cors");
const mercadopago = require("mercadopago");
const Stripe = require("stripe");
const ACCESS_TOKEN = process.env.ACCESS_TOKEN_PRODUCAO;
const stripe = new Stripe(`${process.env.SECRET_KEY_TESTE_STRIPE}`, {
  apiVersion: "2022-11-15",
});
mercadopago.configure({
  access_token: ACCESS_TOKEN,
});
const app = express();
app.use(cors());
app.use(express.json());


app.post("/create-pix-payment", async (req, res) => {
  try {
    const { amount, description } = req.body;

    const payment_data = {
      transaction_amount: amount,
      description: description,
      payment_method_id: "pix",
      payer: {
        email: "thyago.smm@gmail.com",
      },
    };

    const response = await mercadopago.payment.create(payment_data);

    res.status(200).json({
      id: response.body.id,
      status: response.body.status,
      qr_code: response.body.point_of_interaction.transaction_data.qr_code,
      qr_code_base64:
        response.body.point_of_interaction.transaction_data.qr_code_base64,
    });
  } catch (error) {
    console.error("Erro ao criar pagamento Pix:", error);
    res
      .status(500)
      .json({ error: "Falha ao criar pagamento Pix", details: error });
  }
});

app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "brl",
      payment_method_types: ["card"],
    });
    return res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Erro ao criar PaymentIntent:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/create-boleto-payment", async (req, res) => {
  try {
    const { amount, description, firstName, lastName, email, cpf } = req.body;
    const payment_data = {
      transaction_amount: parseFloat(amount),
      description: description,
      payment_method_id: "bolbradesco",
      payer: {
        email: email,
        first_name: firstName,
        last_name: lastName,
        identification: {
          type: "CPF",
          number: cpf,
        },
      },
    };
    const response = await mercadopago.payment.create(payment_data);
    const transactionDetails = response.body.transaction_details;
    const poiData = response.body.point_of_interaction?.transaction_data;
    const boletoLink = 
      transactionDetails?.external_resource_url ||
      poiData?.ticket_url ||
      null;

    const barcode = poiData?.barcode || null;

    return res.status(200).json({
      id: response.body.id,
      status: response.body.status,
      status_detail: response.body.status_detail,
      boleto_link: boletoLink,
      barcode: barcode
    });
  } catch (error) {
    console.error("Erro ao criar pagamento Boleto MP:", error);
    return res.status(500).json({ 
      error: "Falha ao criar boleto MP", 
      details: error 
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
