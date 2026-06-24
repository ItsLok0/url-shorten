const { nanoid } = require('nanoid');
const prisma = require('../lib/prisma');

const createLink = async (req, res) => {
    const { originalUrl } = req.body;

    if (!originalUrl) {
        return res.status(400).json({ error: 'originalUrl is required' });
    }

    try {
        const link = await prisma.link.create({
            data: {
                slug: nanoid(8),      // génère un slug unique de 8 caractères
                originalUrl,
            }
        })
        
        res.status(201).json({
            slug: link.slug,
            shortUrl: `${process.env.BASE_URL}/${link.slug}`,
            originalUrl: link.originalUrl,
        })
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

const redirectLink = async (req, res) => {
    const { slug } = req.params

    console.log(req.params)

    try {
        const link = await prisma.link.findUnique({
            where: { slug }
        })

        if (!link) {
            return res.status(404).json({ error: 'Link not found' })
        }

        // Enregistre le clic avant de rediriger
        await prisma.click.create({
            data: {
                linkId: link.id,
                ip: req.ip,
                userAgent: req.headers['user-agent'] ?? null,
            }
        })
        
        // 301 = redirection permanente
        res.redirect(301, link.originalUrl)
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' })
    }
}

module.exports = { createLink, redirectLink }