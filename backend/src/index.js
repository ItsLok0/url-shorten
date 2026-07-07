require('dotenv').config()

const express = require('express')
const app = express()
// Parse le JSON des requêtes entrantes
app.use(express.json())

const cors = require('cors')
app.use(cors({
    origin: ['http://localhost:4200', 'https://url-shorten-pp.vercel.app']
}))

const linkRoutes = require('./routes/link.routes')
const authRoutes = require('./routes/auth.routes')
// Routes
app.use('/links', linkRoutes)
app.use('/auth', authRoutes)

const { redirectLink } = require('./controllers/link.controller')
// Toujours après les routes (redirect)
app.get('/:slug', redirectLink)

const errorHandler = require('./middlewares/errorHandler')
/** 
 * * Toujours en dernier (gestion des erreurs)
*/
app.use(errorHandler)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));