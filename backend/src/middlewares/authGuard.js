const jwt = require('jsonwebtoken')

const authGuard = (req, res, next) => {
    // Récupère le token dans le header Authorization: Bearer <token>
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing token' })
    }

    const token = authHeader.split(' ')[1]

    try {
        // Vérifie et décode le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        // Attache l'user à la requête pour les controllers suivants
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' })
    }
}

module.exports = authGuard