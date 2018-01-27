/*
   functions to serve static client files and handle route redirection
*/

/* ================================= SETUP ================================= */

const path   = require('path');


/* ============================ ROUTE HANDLERS ============================= */

// SERVE CLIENT SPA
const serveClient = (req, res) => {
  console.log('serveClient');
  res.status(200)
    .sendFile(path.join(__dirname, '../client/build/index.html'));
}


/* ============================== EXPORT API =============================== */

module.exports = { serveClient };