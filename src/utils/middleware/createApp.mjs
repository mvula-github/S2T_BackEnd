

import express from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import "./strategies/local-strategy.mjs";
import "./strategies/discord-strategy.mjs";

export function createApp() {
	const app = express();
	app.use(express.json());
	app.use(cookieParser("Hello, World"));
	app.use(
		session({
			secret: "s2t",
			saveUninitialized: true,
			resave: false,
			cookie: {
				maxAge: 60000 * 60, //1hrs
			},
			store: MongoStore.create({
				client: mongoose.connection.getClient(),
			}),
		})
	);

	app.use(passport.initialize());
	app.use(passport.session());

	app.use(routes);

	return app;
}
