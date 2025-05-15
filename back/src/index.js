require('dotenv').config();
require('./connections/mysql');

const app = require('./app');
const PORT = process.env.PORT || 3443;

// Aplica el prefijo /api globalmente
const express = require('express');
const wrapper = express();

wrapper.use('/api', app);

wrapper.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
