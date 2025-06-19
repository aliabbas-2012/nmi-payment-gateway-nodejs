# 💳 NMI Secure Checkout Demo

This is a secure, local HTTPS demo for processing credit card payments using [NMI's Collect.js](https://secure.nmi.com/merchants/resources/integration_portal.php) and the NMI Gateway API.

---

## 📦 Features

- 🔒 HTTPS with self-signed certificates
- 💳 PCI-compliant card tokenization via Collect.js
- 🧾 Server-side payment handling via NMI API
- 🪵 Transaction logging to `transactions.log`
- 🌐 Fully functional local sandbox environment

---

## 📁 Project Structure
nmi-sandbox/
├── public/
│ ├── index.html # Checkout form with Collect.js
│ └── style.css # Basic styling
├── server.js # Node.js backend with payment logic
├── .env # API secret (excluded from Git)
├── .env.example # Example for other developers
├── .gitignore # Prevents committing secrets, logs, certs
├── localhost.pem # Self-signed cert (local only)
├── localhost-key.pem # Self-signed key (local only)
└── transactions.log # Auto-created payment logs



---

## 🚀 Getting Started

### 1. Clone the Project

```
git clone https://github.com/yourusername/nmi-sandbox.git
cd nmi-sandbox
```

### 2. Install Dependencies
npm install


### 3. Set Up .env
NMI_API_PASSWORD=your_nmi_security_key_here

### 4. Add Self-Signed SSL Certs
localhost.pem

localhost-key.pem

You can reuse provided files or generate your own:

```
openssl req -x509 -newkey rsa:2048 -keyout localhost-key.pem -out localhost.pem -days 365 -nodes -subj "/CN=localhost"
```

### Run the Server
```
node server.js
```
Now visit: https://localhost:4000


### Test Payments
Use test card: 4111 1111 1111 1111

Fill out the form

Submit and see response

View logs in transactions.log




