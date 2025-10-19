const express = require('express');
const prisma = require('../prismaClient');

const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        videos: {
          orderBy: { createdAt: 'desc' },
          select: { id: true, title: true, url: true, thumbnailUrl: true, createdAt: true },
        },
        _count: { select: { videos: true } },
      },
    });

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

module.exports = router;
