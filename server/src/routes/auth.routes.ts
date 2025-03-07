import * as express from 'express';
import { User } from '../schemas/user';

interface AuthenticatedRequest extends express.Request {
  user?: {
    _id: string;
  };
}

export const authRouter = express.Router();
authRouter.use(express.json());

authRouter.post('/signup', async (req, res) => {
  try {
    const user = new User(req.body);
    user.save().then(
      () => {
        res.status(200).json({ message: 'User created successfully.' });
      },
      error => res.status(400).json({ error })
    );
  } catch (error) {
    res
      .status(500)
      .send(error instanceof Error ? error.message : 'Unknown error');
  }
});

authRouter.post('/signin', async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const existingUser = await User.findByCredentials(email, password);
    if (!existingUser) {
      res
        .status(401)
        .json({ message: 'Authentication failed. Invalid user or password.' });
    } else {
      const token = await existingUser.generateAuthToken();
      res.status(200).json({ token });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error(message);
    res.status(500).send(message);
  }
});

authRouter.get('/logout', async (req: AuthenticatedRequest, res) => {
  try {
    if (req.user) {
      const authHeader = req.header('Authorization');
      const token = authHeader ? [authHeader.replace('Bearer ', '')] : [];
      const user = await User.removeToken(req.user._id, token);
      res.status(200).json({ message: 'User logged out successfully.' });
    } else {
      res.status(400).json({ message: 'User not authenticated.' });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).send(message);
  }
});

authRouter.get('/logoutAll', async (req: AuthenticatedRequest, res) => {
  try {
    if (req.user) {
      const user = await User.removeToken(req.user._id, []);
      res.status(200).json({ message: 'User Logout ' });
    } else {
      res.status(400).json({ message: 'User not authenticated.' });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).send(message);
  }
});
