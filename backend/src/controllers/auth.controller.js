const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { z } = require('zod')
const prisma = require('../lib/prisma')

// Schéma de valiation (avant ajout en BDD)  
const authSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
})

const register = async (req, res, next) => {
    // Validation données
    const result = authSchema.safeParse(req.body)
    if (!result.success) {
        return res.status(400).json({ error: result.error.errors })
    }

    const { email, password } = result.data

    try {
        // Vérification si l'email existe déjà
        const existingEmail = await prisma.user.findUnique({
            where: { email }
        })
        if (existingEmail) {
            return res.status(409).json({ error: 'Email already in use' })
        }

        /**
         * Hashage du mot de passe
         * * 10 fois pour plus de sécurité
        */
        const hashedPassword = await bcrypt.hash(password, 10)

        // Création du compte
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword
            }
        })

        // Création du token
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.status(201).json({token})        
    } catch (error) {
        next(error)
    }
}

const login = async (req, res, next) => {
    // Validation données
    const result = authSchema.safeParse(req.body)
    if (!result.success) {
        return res.status(400).json({ error: result.error.errors })
    }

    const { email, password } = result.data

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        })
        if(!user) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        const verifyPassword = await bcrypt.compare(password, user.password)
        if (!verifyPassword) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

         // Création du token
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.status(200).json({token})    
    } catch (error) {
        next(error)
    }
}

module.exports = { register, login }