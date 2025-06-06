require('dotenv').config();
const fs = require('fs');
const https = require('https');
const path = require('path');
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = 4000;

// SSL Certificate
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'localhost-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'localhost.pem'))
};

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Payment endpoint
app.post('/pay', async (req, res) => {
  const { name, email, phone, address, zip, amount, payment_token } = req.body;

  if (!name || !email || !amount || !payment_token) {
    return res.status(400).send(`<p style="color:red;">❌ Missing required payment fields.</p>`);
  }

  const [first_name, last_name = ''] = name.trim().split(' ');

  // ✅ Generate a unique orderid to prevent duplicate transaction errors
  const orderid = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  try {
    const postData = new URLSearchParams({
      security_key: process.env.NMI_API_PASSWORD,
      type: 'sale',
      amount,
      payment_token,
      first_name,
      last_name,
      email,
      phone: phone || '',
      address1: address || '',
      zip: zip || '',
      orderid // ✅ Important to prevent duplicates
    }).toString();

    const response = await axios.post(
      'https://secure.nmi.com/api/transact.php',
      postData,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const result = new URLSearchParams(response.data);
    const isSuccess = result.get('response') === '1';
    const authCode = result.get('authcode');
    const txnId = result.get('transactionid');

    const logLine = `${new Date().toISOString()} - ${name} - $${amount} - ${response.data}\n`;
    fs.appendFileSync(path.join(__dirname, 'transactions.log'), logLine);

    if (isSuccess) {
      res.send(`
        <p style="color:green;">✅ Payment Approved</p>
        <p><strong>Transaction ID:</strong> ${txnId}</p>
        <p><strong>Auth Code:</strong> ${authCode}</p>
        <pre>${response.data}</pre>
      `);
    } else {
      res.send(`<p style="color:red;">❌ Payment Failed</p><pre>${response.data}</pre>`);
    }

  } catch (error) {
    console.error('Payment API error:', error);
    res.status(500).send(`<p style="color:red;">❌ Server Error</p><pre>${error.message}</pre>`);
  }
});


// Start HTTPS server
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`✅ HTTPS server running at https://localhost:${PORT}`);
});
