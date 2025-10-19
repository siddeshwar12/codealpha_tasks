const path = require('path');
const fs = require('fs');
const express = require('express');
const multer = require('multer');
const prisma = require('../prismaClient');
const auth = require('../middleware/auth');
const { isConfigured, uploadVideoBuffer } = require('../utils/cloudinary');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', async (req, res) => {
  try {
    const videos = await prisma.video.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, username: true, avatarUrl: true } },
        _count: { select: { likes: true, comments: true } },
      },
    });

    res.json(
      videos.map((v) => ({
        id: v.id,
        title: v.title,
        description: v.description,
        url: v.url,
        thumbnailUrl: v.thumbnailUrl,
        createdAt: v.createdAt,
        user: v.user,
        likesCount: v._count.likes,
        commentsCount: v._count.comments,
      }))
    );
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

router.post('/upload', auth, upload.single('video'), async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!req.file) return res.status(400).json({ error: 'Missing video file' });
    if (!title) return res.status(400).json({ error: 'Missing title' });

    let videoUrl = '';
    let thumbnailUrl = null;

    if (isConfigured()) {
      const result = await uploadVideoBuffer(req.file.buffer, req.file.originalname || 'video');
      videoUrl = result.secure_url;
      thumbnailUrl = result.thumbnail_url || null; // may not be present
    } else {
      const uploadsPath = path.join(__dirname, '..', '..', 'uploads');
      if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath, { recursive: true });
      const fileName = `${Date.now()}_${req.file.originalname.replace(/\s+/g, '_')}`;
      const dest = path.join(uploadsPath, fileName);
      fs.writeFileSync(dest, req.file.buffer);
      videoUrl = `/uploads/${fileName}`;
    }

    const video = await prisma.video.create({
      data: {
        title,
        description: description || null,
        url: videoUrl,
        thumbnailUrl,
        userId: req.user.id,
      },
    });

    res.json(video);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Upload failed' });
  }
});

router.post('/:id/like', auth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.like.create({ data: { userId: req.user.id, videoId: id } });
    res.json({ ok: true });
  } catch (e) {
    if (e.code === 'P2002') {
      return res.status(200).json({ ok: true }); // already liked
    }
    console.error(e);
    res.status(500).json({ error: 'Failed to like' });
  }
});

router.post('/:id/comment', auth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'Missing content' });

    const comment = await prisma.comment.create({
      data: { content, userId: req.user.id, videoId: id },
    });

    res.json(comment);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to comment' });
  }
});

module.exports = router;
