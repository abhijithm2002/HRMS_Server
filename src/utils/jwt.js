import jwt from "jsonwebtoken";

export const generateRefreshToken = (payload) => {
  return new Promise((resolve, reject) => {
    const options = { expiresIn: "1d" };
    jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET,
      options,
      (err, refreshToken) => {
        if (err) return reject(err);
        resolve(refreshToken);
      }
    );
  });
};

export const generateAccessToken = (payload) => {
  return new Promise((resolve, reject) => {
    const options = { expiresIn: "8h" };
    jwt.sign(
      payload,
      process.env.JWT_KEY_SECRET,
      options,
      (err, accessToken) => {
        if (err) return reject(err);
        resolve(accessToken);
      }
    );
  });
};

export const generateJwt = async (data) => {
  try {
    const tokens = { accessToken: "", refreshToken: "" };
    const payload = {};

    if (data && data._id) {
      payload.userId = String(data._id);
    } else if (data && data.email) {
      payload.email = data.email;
    }

    const accessToken = await generateAccessToken(payload);
    tokens.accessToken = accessToken;

    const refreshToken = await generateRefreshToken(payload);
    tokens.refreshToken = refreshToken;

    return tokens;
  } catch (error) {
    throw error;
  }
};

export default generateJwt;


