import jwt from "jsonwebtoken";

const generateToken = (payload) => {
  const token = jwt.sign(payload, process.env.SECRET_KEY);
  return token;
};

export default generateToken;
