const express = require('express');
const app = express();

// Parse le JSON des requêtes entrantes
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ status: 'ok' });
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));