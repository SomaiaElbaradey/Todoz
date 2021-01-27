//Determine Jwt Keys from the environment file
module.exports.jwtKeys = function () {
  const userJwt = process.env.CLAX_JWT_USER,
  if (!(userJwt)) {
    throw new Error("FATAL ERROR: jwtPrivateKey is not defined.");
  }
  return { userJwt };
};
