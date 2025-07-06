import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    console.error(" JWT_SECRET is not defined in environment!");
    throw new Error("JWT_SECRET is missing");
  }

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

export default generateToken;
