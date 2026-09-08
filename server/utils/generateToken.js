import jwt from 'jsonwebtoken';
import { getJwtSecret } from '../config/auth.js';

const generateToken = (id) => {
  return jwt.sign({ id }, getJwtSecret(), {
    expiresIn: '30d',
  });
};

export default generateToken;
