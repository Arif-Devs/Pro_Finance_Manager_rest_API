import express from 'express';
const router = express.Router();

//Health route
router.get('/health', (_req, res) =>
    res.status(200).json({ code: 200, message: 'api health is ok' })
  );



export default router;