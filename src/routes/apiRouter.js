import { Router } from "express";

import mw from "../middlewares/mw.js";

import ApiController from "../controllers/ApiController.js";

const apiController = new ApiController();

const apiRouter = new Router();

apiRouter.post('/notifications', mw?.authApp, apiController?.addNotifications);

apiRouter.get('/notification/:notification_id', mw?.authApp, apiController?.getNotification);

apiRouter.get('/notifications', mw?.authApp, apiController?.getNotifications);

apiRouter.get('/allnotification', mw?.authApp, apiController?.getAllNotification);

apiRouter.put('/notification/:notification_id', mw?.authApp, apiController?.updateNotification);

apiRouter.put('/notifications', mw?.authApp, apiController?.updateNotifications);

apiRouter.delete('/notification/:notification_id', mw?.authApp, apiController?.deleteNotification);

apiRouter.delete('/notifications', mw?.authApp, apiController?.deleteNotifications);

apiRouter.delete('/allnotification', mw?.authApp, apiController?.deleteAllNotification);

//apiRouter.get('/createtable', apiController?.createTable);

//apiRouter.get('/droptable', apiController?.dropTable);

//apiRouter.get('/test', apiController.test);

//apiRouter.get('/app', apiController?.app);

//apiRouter.get('/cron', apiController?.cron);

export default apiRouter