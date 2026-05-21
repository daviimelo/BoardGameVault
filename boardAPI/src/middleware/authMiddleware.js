import jwt from 'jsonwebtoken';

export default function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token não informado." });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token inválido." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "raimudoviski_melhorprofessor");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token expirado ou inválido." });
  }
}
