import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

async function authMiddleware(req: any, res: any, next: any) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY as string);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Unauthorized' });
  }
}

export { authMiddleware };
