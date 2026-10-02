import express from 'express';
const router = express.Router();

// Simple secure admin login check
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

 const validUsername = process.env.ADMIN_USERNAME;
 const validPassword = process.env.ADMIN_PASSWORD;

  if (username === validUsername && password === validPassword) {
    res.json({ success: true, message: 'Logged in successfully', token: 'mock-jwt-token-123' });
  } else {
    res.status(401).json({ success: false, error: 'Invalid username or password' });
  }
});

export default router;