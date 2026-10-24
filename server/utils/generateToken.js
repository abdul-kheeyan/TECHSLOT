import jwt from 'jsonwebtoken';
import { getJwtSecret } from '../config/auth.js';

const generateToken = (id) => {
  return jwt.sign({ id }, getJwtSecret(), {
    expiresIn: '8h',
  });
};

export default generateToken;
