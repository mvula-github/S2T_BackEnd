import passport from "passport";
import { Strategy } from "passport-local";
import { mockContributors } from "../utils/mockContributors";
import { Contributor } from "../mongoose/schemas/contributor.mjs";
import { comparePassword } from "../utils/helpers.mjs";

passport.serializeUser((contributor, done) => {
	done(null, contributor.id);
});

passport.deserializeUser(async (id, done) => {
	try {
		const findContributor = await Contributor.findById(id);
		if (!findContributor) throw new Error("User Not Found");
		done(null, findContributor);
	} catch (err) {
		done(err, null);
	}
});

export default passport.use(
	new Strategy(async (fname, password, done) => {
		try {
			const findContributor = await Contributor.findOne({ fname });
			if (!findContributor) throw new Error("User not found");
			if (!comparePassword(password, findContributor.password))
				throw new Error("Bad Credentials");
			done(null, findContributor);
		} catch (err) {
			done(err, null);
		}
	})
);