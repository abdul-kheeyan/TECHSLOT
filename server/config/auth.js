const developmentFallbackSecret = 'techslot_development_only_jwt_secret';

export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be configured in production.');
  }
  return developmentFallbackSecret;
};
