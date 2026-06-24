const { PrismaClient } = require('@prisma/client');

/*
 *  Initialisation de Prisma
 *  Évite les doublons à la création de connexion
*/
const prisma = new PrismaClient();

module.exports = prisma;