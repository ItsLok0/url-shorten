const { nanoid } = require('nanoid');
const prisma = require('../lib/prisma');

const createLink = async (req, res) => {
    console.log('body:', req.body);
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
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { createLink };