const bcrypt = require("bcrypt");

//10 : C’est le niveau de complexité utilisé pour le hashage du mot de passe.
exports.hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

exports.comparePassword = async (password, hashed) => {
  return await bcrypt.compare(password, hashed);
};