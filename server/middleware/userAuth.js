import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not Authorized. Login Again' });
    }

    const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!tokenDecoded.id) {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    req.userId = tokenDecoded.id; // ✅ Attach to req
    next();

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default userAuth;
