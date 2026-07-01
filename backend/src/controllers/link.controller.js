const { nanoid } = require('nanoid');
const prisma = require('../lib/prisma');

const createLink = async (req, res, next) => {
    const { originalUrl } = req.body;

    if (!originalUrl) {
        return res.status(400).json({ error: 'originalUrl is required' });
    }

    try {
        const link = await prisma.link.create({
            data: {
                slug: nanoid(8),
                originalUrl,
                userId: req.user.userId
            }
        })
        
        res.status(201).json({
            slug: link.slug,
            shortUrl: `${process.env.BASE_URL}/${link.slug}`,
            originalUrl: link.originalUrl,
        })
    } catch (error) {
        next(error)
    }
}

const redirectLink = async (req, res, next) => {
    const { slug } = req.params

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
        next(error)
    }
}

const getLinks = async (req, res, next) => {
    try {
        const links = await prisma.link.findMany({
            where: {
                userId: req.user.userId
            },
            include: {
                // _count évite de charger tous les clics en mémoire
                _count: {
                    select: { clicks: true }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        // On garde juste les champs necessaires
        const formatted = links.map(link => ({
            id: link.id,
            slug: link.slug,
            originalUrl: link.originalUrl,
            shortUrl: `${process.env.BASE_URL}/${link.slug}`,
            clicks: link._count.clicks,
            createdAt: link.createdAt
        }))

        res.status(200).json(formatted)
    } catch (error) {
        next(error)
    }
}

const getLinksStats = async (req, res, next) => {
    const { id } = req.params

    try {
        // Vérifie que le lien existe ET appartient à l'utilisateur connecté
        const link = await prisma.link.findUnique({
            where: { id }
        })

        if (!link) {
            return res.status(404).json({ error: 'Link not found' })
        }

        if (link.userId !== req.user.userId) {
            return res.status(403).json({ error: 'Forbidden' })
        }

        // Compte le total des clics
        const totalClicks = await prisma.click.count({
            where: { linkId: id }
        })

        /** Récupère tous les clics pour les grouper par jour en JS
         ** groupBy sur DateTime complet ne marche pas bien, on fait le calcul côté JS
        */
        const clicks = await prisma.click.findMany({
            where: { linkId: id },
            select: { clickedAt: true },
            orderBy: { clickedAt: 'asc' }
        })

        // Groupe les clics par jour
        const clicksByDay = clicks.reduce((acc, click) => {
            // Extrait juste la date sans l'heure (2024-01-15)
            const day = click.clickedAt.toISOString().split('T')[0]
            acc[day] = (acc[day] || 0) + 1
            return acc
        }, {})

        res.status(200).json({
            id: link.id,
            slug: link.slug,
            originalUrl: link.originalUrl,
            totalClicks,
            clicksByDay
        })
    } catch (error) {
        next(error)
    }
}

module.exports = { createLink, redirectLink, getLinks, getLinksStats }