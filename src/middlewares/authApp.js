
import * as dotenv from "dotenv";

dotenv.config();

import * as jose from "jose";

import pool from "../config/dbConfig.js";

import cryptApi from "../helpers/cryptApi.js";

const authApp = async (req, res, next) => {

  const authHeader = await req.header('authorization');

  if (!authHeader) return res.json({ error: true, data: "Authorization header not available!" });

  if (!authHeader.startsWith('Bearer')) return res.json({ error: true, data: "Not A Beader authorization header!" });

  const encryptedToken = authHeader.split(" ")[1];

  try {

    const sql = pool.promise();

    const [rows] = await sql.query("SELECT * FROM apitokens WHERE apitoken = ? AND status = ? AND deleted_at IS NULL", [encryptedToken, 1]);

    if (rows?.length === 0) return res.json({ error: true, data: "Invalid api key!" });

    const token = cryptApi.decrypt(encryptedToken);

    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY_NOTIFICATIONS_API_APP);

    const jwtVerifyData = await jose.jwtVerify(token, secret, {
      issuer: process.env.ISSUER,
      audience: process.env.AUDIENCE,
    });
    const payload = jwtVerifyData.payload;

    req.user_id = payload?.data[0]?.user_id ? +payload?.data[0]?.user_id : payload?.data[0]?.user_id;

    req.u_id = payload?.data[0]?.u_id ? payload?.data[0]?.u_id : 0;

    req.email = payload?.data[0]?.email;

    req.roles = payload?.data[0]?.roles ? JSON.parse(payload?.data[0]?.roles) : [];

    await next();

  } catch (error) {

    console.log(error)

    return res.json({ error: true, data: error?.message });

  }

}

export default authApp