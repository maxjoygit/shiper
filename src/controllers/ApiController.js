import * as dotenv from "dotenv";

dotenv.config();

import zod from "zod";

import * as jose from "jose";

import pool from "../config/dbConfig.js";

import cryptApi from "../helpers/cryptApi.js";

class ApiController {

  constructor() {

    this.sql = pool.promise();

  }

  addNotifications = async (req, res) => {

    try {

      const user_id = req?.user_id;

      const notifications_data = req.body.notifications_data;

      const reqBody = { user_id, notifications_data }

      const zodObj = zod.object({
        user_id: zod.number().int(),
        notifications_data: zod.array(zod.array(zod.any())),
      });

      zodObj.parse(reqBody);

      const notifications = notifications_data.map((notifications) => {
        notifications.unshift(user_id);
        while (notifications.length < 5) {
          notifications.push(null);
        }
        return notifications;
      })

      const [rows] = await this.sql.query("INSERT INTO notifications(user_id, message, type, group_name, other) VALUES ?", [notifications]);

      if (rows?.affectedRows === 0) return res.json({ error: true, data: "Unable to add notifications!" });

      return res.json({ error: false, data: 'notifications added successfully!' });

    } catch (error) {

      console.log(error);

      if (error?.issues) {

        const zodErrorData = JSON.parse(error?.message).map((errorMessage) => {

          if (errorMessage.message) return { message: `"${errorMessage?.path}" is ${errorMessage?.message}` };

        })

        return res.json({ error: true, data: zodErrorData[0]?.message });

      } else {

        console.log(error?.message.fields);

        if (error?.message?.fields) return res.json({ error: true, data: error?.message.fields?.message });

        if (error?.message.fields) return res.json({ error: true, data: error?.message.fields?.message });

        return res.json({ error: true, data: error?.message });

      }

    }

  }

  getNotification = async (req, res) => {

    try {

      const user_id = req?.user_id;

      const notification_id = req.params.notification_id ? (typeof req.params.notification_id == "string") ? +req.params.notification_id.trim() : req.params.notification_id : req.params.notification_id;

      const reqBody = { user_id, notification_id }

      const zodObj = zod.object({
        user_id: zod.number().int(),
        notification_id: zod.number().int(),
      });

      zodObj.parse(reqBody);

      const [rows] = await this.sql.query("SELECT * FROM notifications WHERE user_id = ? AND notification_id = ? AND deleted_at IS NULL", [user_id, notification_id]);

      return res.json({ error: false, data: rows });

    } catch (error) {

      console.log(error);

      if (error?.issues) {

        const zodErrorData = JSON.parse(error?.message).map((errorMessage) => {

          if (errorMessage.message) return { message: `"${errorMessage?.path}" is ${errorMessage?.message}` };

        })

        return res.json({ error: true, data: zodErrorData[0]?.message });

      } else {

        console.log(error?.message.fields);

        if (error?.message?.fields) return res.json({ error: true, data: error?.message.fields?.message });

        if (error?.message.fields) return res.json({ error: true, data: error?.message.fields?.message });

        return res.json({ error: true, data: error?.message });

      }
    }

  }

  getNotifications = async (req, res) => {

    try {

      const offset = typeof req.query.offset === 'undefined' ? 0 : (typeof req.query.offset == "string") ? +req.query.offset.trim() : req.query.offset;

      const limit = typeof req.query.limit === 'undefined' ? Number.MAX_SAFE_INTEGER : (typeof req.query.limit == "string") ? +req.query.limit.trim() : req.query.limit;

      const user_id = req?.user_id;

      const reqBody = { user_id, offset, limit }

      const zodObj = zod.object({
        user_id: zod.number().int(),
        offset: zod.number().optional(),
        limit: zod.number().optional()
      });

      zodObj.parse(reqBody);

      const [rows] = await this.sql.query("SELECT * FROM notifications WHERE user_id = ? AND deleted_at IS NULL LIMIT ?, ?", [user_id, offset, limit]);

      return res.json({ error: false, data: rows });

    } catch (error) {

      console.log(error);

      if (error?.issues) {

        const zodErrorData = JSON.parse(error?.message).map((errorMessage) => {

          if (errorMessage.message) return { message: `"${errorMessage?.path}" is ${errorMessage?.message}` };

        })

        return res.json({ error: true, data: zodErrorData[0]?.message });

      } else {

        console.log(error?.message.fields);

        if (error?.message?.fields) return res.json({ error: true, data: error?.message.fields?.message });

        if (error?.message.fields) return res.json({ error: true, data: error?.message.fields?.message });

        return res.json({ error: true, data: error?.message });

      }
    }

  }

  getAllNotification = async (req, res) => {

    try {

      const offset = typeof req.query.offset === 'undefined' ? 0 : (typeof req.query.offset == "string") ? +req.query.offset.trim() : req.query.offset;

      const limit = typeof req.query.limit === 'undefined' ? Number.MAX_SAFE_INTEGER : (typeof req.query.limit == "string") ? +req.query.limit.trim() : req.query.limit;

      const reqBody = { offset, limit }

      const zodObj = zod.object({
        offset: zod.number().optional(),
        limit: zod.number().optional()
      });

      zodObj.parse(reqBody);

      const [rows] = await this.sql.query("SELECT * FROM notifications WHERE deleted_at IS NULL LIMIT ?, ?", [offset, limit]);

      return res.json({ error: false, data: rows });

    } catch (error) {

      console.log(error);

      if (error?.issues) {

        const zodErrorData = JSON.parse(error?.message).map((errorMessage) => {

          if (errorMessage.message) return { message: `"${errorMessage?.path}" is ${errorMessage?.message}` };

        })

        return res.json({ error: true, data: zodErrorData[0]?.message });

      } else {

        console.log(error?.message.fields);

        if (error?.message?.fields) return res.json({ error: true, data: error?.message.fields?.message });

        if (error?.message.fields) return res.json({ error: true, data: error?.message.fields?.message });

        return res.json({ error: true, data: error?.message });

      }
    }

  }

  updateNotification = async (req, res) => {

    try {


      const user_id = req?.user_id;

      const read_status = req.params.read_status ? (typeof req.params.read_status == "string") ? req.params.read_status.trim().toUpperCase() : req.params.read_status : req.params.read_status;

      const notification_id = req.params.notification_id ? (typeof req.params.notification_id == "string") ? +req.params.notification_id.trim() : req.params.notification_id : req.params.notification_id;

      const reqBody = { user_id, read_status, notification_id }

      const zodObj = zod.object({
        user_id: zod.number().int(),
        read_status: zod.string().min(1).max(1),
        notification_id: zod.number().int(),
      });

      zodObj.parse(reqBody);

      const result = await this.sql.query("SELECT * FROM notifications WHERE notification_id = ?", [notification_id]);

      if (result[0]?.length === 0) return res.json({ error: true, data: "Notifications does not exist!" });

      const [rows] = await this.sql.query("UPDATE notifications SET read_status = ? WHERE user_id = ? AND notification_id = ? AND deleted_at IS NULL", [read_status, user_id, notification_id]);

      return res.json({ error: false, data: 'Notification updated successfully!' });

    } catch (error) {

      console.log(error);

      if (error?.issues) {

        const zodErrorData = JSON.parse(error?.message).map((errorMessage) => {

          if (errorMessage.message) return { message: `"${errorMessage?.path}" is ${errorMessage?.message}` };

        })

        return res.json({ error: true, data: zodErrorData[0]?.message });

      } else {

        console.log(error?.message.fields);

        if (error?.message?.fields) return res.json({ error: true, data: error?.message.fields?.message });

        if (error?.message.fields) return res.json({ error: true, data: error?.message.fields?.message });

        return res.json({ error: true, data: error?.message });

      }

    }

  }

  updateNotifications = async (req, res) => {

    try {

      const user_id = req.params.user_id ? (typeof req.params.user_id == "string") ? +req.params.user_id.trim() : req.params.user_id : req.params.user_id;

      const type = req.params.type ? (typeof req.params.type == "string") ? req.params.type.trim().toLowerCase() : req.params.type : req.params.type;

      const reqBody = { user_id, type }

      const zodObj = zod.object({
        user_id: zod.number().int(),
        type: zod.string().min(1).max(100)
      });

      zodObj.parse(reqBody);

      const result = await this.sql.query("SELECT * FROM notifications WHERE user_id = ? AND type = ?", [user_id, type]);

      if (result[0]?.length === 0) return res.json({ error: true, data: "Notifications does not exist!" });

      const [rows] = await this.sql.query("UPDATE notifications SET deleted_at = NULL WHERE user_id = ? AND type = ? AND created_at < NOW() - INTERVAL 30 DAY", [user_id, type]);

      return res.json({ error: false, data: 'Notifications updated successfully!' });

    } catch (error) {

      console.log(error);

      if (error?.issues) {

        const zodErrorData = JSON.parse(error?.message).map((errorMessage) => {

          if (errorMessage.message) return { message: `"${errorMessage?.path}" is ${errorMessage?.message}` };

        })

        return res.json({ error: true, data: zodErrorData[0]?.message });

      } else {

        console.log(error?.message.fields);

        if (error?.message?.fields) return res.json({ error: true, data: error?.message.fields?.message });

        if (error?.message.fields) return res.json({ error: true, data: error?.message.fields?.message });

        return res.json({ error: true, data: error?.message });

      }

    }

  }

  deleteNotification = async (req, res) => {

    try {

      const user_id = req?.user_id;

      const notification_id = req.params.notification_id ? (typeof req.params.notification_id == "string") ? +req.params.notification_id.trim() : req.params.notification_id : req.params.notification_id;

      const reqBody = { user_id, notification_id }

      const zodObj = zod.object({
        user_id: zod.number().int(),
        notification_id: zod.number().int(),
      });

      zodObj.parse(reqBody);

      const result = await this.sql.query("SELECT * FROM notifications WHERE notification_id = ?", [notification_id]);

      if (result[0]?.length === 0) return res.json({ error: true, data: "Notification does not exist!" });

      const [rows] = await this.sql.query("DELETE FROM notifications WHERE user_id = ? AND notification_id = ? AND deleted_at IS NOT NULL", [user_id, notification_id]);

      if (rows?.affectedRows === 0) return res.json({ error: true, data: 'Notification must marked as deleted!' });

      return res.json({ error: false, data: 'Notification deleted successfully!' });

    } catch (error) {

      console.log(error);

      if (error?.issues) {

        const zodErrorData = JSON.parse(error?.message).map((errorMessage) => {

          if (errorMessage.message) return { message: `"${errorMessage?.path}" is ${errorMessage?.message}` };

        })

        return res.json({ error: true, data: zodErrorData[0]?.message });

      } else {

        console.log(error?.message.fields);

        if (error?.message?.fields) return res.json({ error: true, data: error?.message.fields?.message });

        if (error?.message.fields) return res.json({ error: true, data: error?.message.fields?.message });

        return res.json({ error: true, data: error?.message });

      }

    }

  }

  deleteNotifications = async (req, res) => {

    try {

      const user_id = req?.user_id;

      const reqBody = { user_id }

      const zodObj = zod.object({
        user_id: zod.number().int(),
      });

      zodObj.parse(reqBody);

      const result = await this.sql.query("SELECT * FROM notifications WHERE user_id = ? AND deleted_at IS NOT NULL", [user_id]);

      if (result[0]?.length === 0) return res.json({ error: true, data: "Notifications does not exist!" });

      const [rows] = await this.sql.query("DELETE FROM notifications WHERE user_id = ? AND deleted_at IS NOT NULL", [user_id]);

      if (rows?.affectedRows === 0) return res.json({ error: true, data: 'Notifications must marked as deleted!' });

      return res.json({ error: false, data: 'Notifications deleted successfully!' });

    } catch (error) {

      console.log(error);

      if (error?.issues) {

        const zodErrorData = JSON.parse(error?.message).map((errorMessage) => {

          if (errorMessage.message) return { message: `"${errorMessage?.path}" is ${errorMessage?.message}` };

        })

        return res.json({ error: true, data: zodErrorData[0]?.message });

      } else {

        console.log(error?.message.fields);

        if (error?.message?.fields) return res.json({ error: true, data: error?.message.fields?.message });

        if (error?.message.fields) return res.json({ error: true, data: error?.message.fields?.message });

        return res.json({ error: true, data: error?.message });

      }

    }

  }

  deleteAllNotification = async (req, res) => {

    try {

      const result = await this.sql.query("SELECT * FROM notifications WHERE deleted_at IS NOT NULL", []);

      if (result[0]?.length === 0) return res.json({ error: true, data: "Notifications does not exist!" });

      const [rows] = await this.sql.query("DELETE FROM notifications WHERE deleted_at IS NOT NULL", []);

      if (rows?.affectedRows === 0) return res.json({ error: true, data: 'Notifications must marked as deleted!' });

      return res.json({ error: false, data: 'Notifications deleted successfully!' });


    } catch (error) {

      console.log(error);

      if (error?.issues) {

        const zodErrorData = JSON.parse(error?.message).map((errorMessage) => {

          if (errorMessage.message) return { message: `"${errorMessage?.path}" is ${errorMessage?.message}` };

        })

        return res.json({ error: true, data: zodErrorData[0]?.message });

      } else {

        console.log(error?.message.fields);

        if (error?.message?.fields) return res.json({ error: true, data: error?.message.fields?.message });

        if (error?.message.fields) return res.json({ error: true, data: error?.message.fields?.message });

        return res.json({ error: true, data: error?.message });

      }

    }

  }

  createTable = async (req, res) => {

    try {

      await this.sql.query(`DROP TABLE IF EXISTS apitokens`, []);

      const [rows] = await this.sql.query(`
      CREATE TABLE apitokens (
          id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
          apitoken longtext NOT NULL,
          status TINYINT NOT NULL DEFAULT '1',
          created_by BIGINT NULL DEFAULT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          deleted_at TIMESTAMP NULL DEFAULT NULL,
          PRIMARY KEY (id)
          ) ENGINE = InnoDB CHARSET=utf8mb4 COLLATE utf8mb4_unicode_ci`, []);

      return res.json({ error: false, data: `Table apitokens created successfully!` });

    } catch (error) {

      console.log(error);

      if (error?.issues) {

        const zodErrorData = JSON.parse(error?.message).map((errorMessage) => {

          if (errorMessage?.message) return { message: `"${errorMessage?.path}" is ${errorMessage?.message}` };

        })

        return res.json({ error: true, data: zodErrorData[0]?.message });

      } else {

        console.log(error?.message.fields);

        if (error?.message?.fields) return res.json({ error: true, data: error?.message.fields?.message });

        if (error?.message.fields) return res.json({ error: true, data: error?.message.fields?.message });

        return res.json({ error: true, data: error?.message });

      }

    }

  }

  dropTable = async (req, res) => {

    try {

      await this.sql.query(`DROP TABLE IF EXISTS apitokens`, []);

      return res.json({ error: false, data: `Table apitokens deleted successfully` });

    } catch (error) {

      console.log(error);

      if (error?.issues) {

        const zodErrorData = JSON.parse(error?.message).map((errorMessage) => {

          if (errorMessage?.message) return { message: `"${errorMessage?.path}" is ${errorMessage?.message}` };

        })

        return res.json({ error: true, data: zodErrorData[0]?.message });

      } else {

        console.log(error?.message.fields);

        if (error?.message?.fields) return res.json({ error: true, data: error?.message.fields?.message });

        if (error?.message.fields) return res.json({ error: true, data: error?.message.fields?.message });

        return res.json({ error: true, data: error?.message });

      }

    }

  }

  test = async (req, res) => {

    try {

      const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY_NOTIFICATIONS_API);

      const rows = [
        {
          user_id: 0,

          email: `app@lcapis.app`,

          roles: JSON.stringify(["APP"]),
        }
      ]

      const jwtToken = await new jose.SignJWT({ data: rows })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setIssuer(process.env.ISSUER)
        .setAudience(process.env.AUDIENCE)
        .setExpirationTime(Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 * 12)
        .sign(secret)

      return res.json({ error: false, data: cryptApi.encrypt(jwtToken) });

    } catch (error) {

      console.log(error);

      if (error?.issues) {

        const zodErrorData = JSON.parse(error?.message).map((errorMessage) => {

          if (errorMessage?.message) return { message: `"${errorMessage?.path}" is ${errorMessage?.message}` };

        })

        return res.json({ error: true, data: zodErrorData[0]?.message });

      } else {

        console.log(error?.message.fields);

        if (error?.message?.fields) return res.json({ error: true, data: error?.message.fields?.message });

        if (error?.message.fields) return res.json({ error: true, data: error?.message.fields?.message });

        return res.json({ error: true, data: error?.message });

      }

    }

  }

  app = async (req, res) => {

    try {

      const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY_NOTIFICATIONS_API_APP);

      const rows = [
        {
          user_id: 0,

          u_id: `0`,

          email: `app@lcapis.app`,

          roles: JSON.stringify(["APP"]),
        }
      ]

      const jwtToken = await new jose.SignJWT({ data: rows })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setIssuer(process.env.ISSUER)
        .setAudience(process.env.AUDIENCE)
        .setExpirationTime(Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 * 12)
        .sign(secret)

      const result = await this.sql.query("SELECT * FROM apitokens WHERE apitoken = ?", [cryptApi.encrypt(jwtToken)]);

      if (result[0].length !== 0) return res.json({ error: true, data: 'Api token already exist!' });

      const resultApiTokens = await this.sql.query("INSERT INTO apitokens (apitoken, created_by) VALUES (?, ?)", [cryptApi.encrypt(jwtToken), 0]);

      if (resultApiTokens[0]?.affectedRows === 0) return res.json({ error: true, data: "Unbale to add api token!" });

      return res.json({ error: false, data: cryptApi.encrypt(jwtToken) });

    } catch (error) {

      console.log(error);

      if (error?.issues) {

        const zodErrorData = JSON.parse(error?.message).map((errorMessage) => {

          if (errorMessage?.message) return { message: `"${errorMessage?.path}" is ${errorMessage?.message} ` };

        })

        return res.json({ error: true, data: zodErrorData[0]?.message });

      } else {

        console.log(error?.message.fields);

        if (error?.message?.fields) return res.json({ error: true, data: error?.message.fields?.message });

        if (error?.message.fields) return res.json({ error: true, data: error?.message.fields?.message });

        return res.json({ error: true, data: error?.message });

      }

    }

  }

  cron = async (req, res) => {

    try {

      const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY_NOTIFICATIONS_API_CRON);

      const rows = [
        {
          user_id: 0,

          u_id: `0`,

          email: `cron@lcapis.app`,

          roles: JSON.stringify(["CRON"]),
        }
      ]

      const jwtToken = await new jose.SignJWT({ data: rows })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setIssuer(process.env.ISSUER)
        .setAudience(process.env.AUDIENCE)
        .setExpirationTime(Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30 * 12)
        .sign(secret)

      const result = await this.sql.query("SELECT * FROM apitokens WHERE apitoken = ?", [cryptApi.encrypt(jwtToken)]);

      if (result[0].length !== 0) return res.json({ error: true, data: 'Api token already exist!' });

      const resultApiTokens = await this.sql.query("INSERT INTO apitokens (apitoken, created_by) VALUES (?, ?)", [cryptApi.encrypt(jwtToken), 0]);

      if (resultApiTokens[0]?.affectedRows === 0) return res.json({ error: true, data: "Unbale to add api token!" });

      return res.json({ error: false, data: cryptApi.encrypt(jwtToken) });

    } catch (error) {

      console.log(error);

      if (error?.issues) {

        const zodErrorData = JSON.parse(error?.message).map((errorMessage) => {

          if (errorMessage?.message) return { message: `"${errorMessage?.path}" is ${errorMessage?.message} ` };

        })

        return res.json({ error: true, data: zodErrorData[0]?.message });

      } else {

        console.log(error?.message.fields);

        if (error?.message?.fields) return res.json({ error: true, data: error?.message.fields?.message });

        if (error?.message.fields) return res.json({ error: true, data: error?.message.fields?.message });

        return res.json({ error: true, data: error?.message });

      }

    }

  }

}

export default ApiController