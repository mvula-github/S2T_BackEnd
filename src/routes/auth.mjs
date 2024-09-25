import passport from "passport";
import { Router } from "express";

const router = Router();

router.post(
	"/api/auth",
	passport.authenticate("local"),
	(request, response) => {
		response.sendStatus(200);
	}
);

router.get("/api/auth/status", (request, response) => {
	return request.contributor ? response.send(request.contributor) : response.sendStatus(401);
});

router.post("/api/auth/logout", (request, response) => {
	if (!request.contributor) return response.sendStatus(401);
	request.logout((err) => {
		if (err) return response.sendStatus(400);
		response.send(200);
	});
});

router.get("/api/auth/contributorModel", passport.authenticate("contributorModel"));
router.get(
	"/api/auth/contributorModel/redirect",
	passport.authenticate("contributorModel"),
	(request, response) => {
		response.sendStatus(200);
	}
);

export default router;