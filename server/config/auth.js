export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32 || new Set(secret).size < 12) {
    throw new Error('JWT_SECRET must contain at least 32 characters of varied random data.');
  }
  if (/change_in_production|replace_with|example|development_only/i.test(secret)) {
    throw new Error('JWT_SECRET must not use a placeholder value.');
  }
  return secret;
};
