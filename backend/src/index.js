const express = require('express')
const app = express()
const linkRoutes = require('./routes/link.routes')
const authRoutes = require('./routes/auth.routes')
const errorHandler = require('./middlewares/errorHandler')
const { redirectLink } = require('./controllers/link.controller')


// Parse le JSON des requêtes entrantes
app.use(express.json())

// Routes
app.use('/links', linkRoutes)
app.use('/auth', authRoutes)

// Toujours après les routes (redirect)
app.get('/:slug', redirectLink)

app.get('/', (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World!\n');
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

/** 
 * * Toujours en dernier (gestion des erreurs)
*/
app.use(errorHandler)