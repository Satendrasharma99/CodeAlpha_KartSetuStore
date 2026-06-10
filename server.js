const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Mock database for cyber-premium items
const cyberProducts = [
  { id: 1, name: "Neural Link V4.2", price: 1499, category: "implants", img: "🧠", desc: "Direct cortical processing accelerator.", stock: 5 },
  { id: 2, name: "Quantum Core Rig", price: 3899, category: "hardware", img: "🖥️", desc: "Sub-atomic processing server matrix.", stock: 2 },
  { id: 3, name: "Onyx Exo-Visor", price: 899, category: "gear", img: "  ", desc: "Multi-spectrum tactical HUD overlay.", stock: 8 },
  { id: 4, name: "Plasma Blade-Drive", price: 250, category: "hardware", img: "💾", desc: "100 Yottabyte high-density thermal storage.", stock: 15 },
  { id: 5, name: "Holosuit Alpha", price: 2100, category: "gear", img: "🧥", desc: "Adaptive light-bending camouflage fabric.", stock: 3 }
];

// API Endpoints
app.get('/api/products', (req, res) => {
  res.json(cyberProducts);
});

app.post('/api/checkout', (req, res) => {
  const { cart, paymentMethod, emiTerm } = req.body;
  if (!cart || cart.length === 0) {
    return res.status(400).json({ success: false, message: "Matrix Error: Cargo holds are empty." });
  }
  
  let subtotal = 0;
  cart.forEach(item => {
    const prod = cyberProducts.find(p => p.id === item.id);
    if (prod) subtotal += prod.price * item.quantity;
  });

  const transactionId = "TXN-" + Math.random().toString(36).substr(2, 9).toUpperCase();
  res.json({
    success: true,
    transactionId,
    amountProcessed: subtotal,
    message: "Quantum synchronization complete. Shipments dispatched via sub-orbital drones."
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 KartSetuStore Matrix online at port ${PORT}`);
});
