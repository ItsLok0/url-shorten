// Middleware Express d'erreur — doit avoir 4 paramètres obligatoirement
// Express le reconnaît comme middleware d'erreur grâce au (err, req, res, next)
const errorHandler = (err, req, res, next) => {
    console.error(err)

    const status = err.status || 500
    const message = err.message || 'Internal server error'

    res.status(status).json({ error: message })
}

module.exports = errorHandler