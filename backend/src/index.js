const express = require('express');
const app = express();

// Parse le JSON des requêtes entrantes
app.use(express.json());

// Routes
const linkRoutes = require('./routes/link.routes');
app.use('/links', linkRoutes);

app.get('/', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World!\n');
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));