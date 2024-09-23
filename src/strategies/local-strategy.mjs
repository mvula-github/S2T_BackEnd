import passport from "passport";
import { Strategy } from "passport-local";
import { User } from "../mongoose/schemas/user.mjs";

passport.serializeUser((user, done) => {
  console.log("Inside Serialze user");
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log("Inside Deserialize user");
  console.log(`Deseialize user ID : ${id}`);
  try {
    const findUser = await User.findById(id);
    if (!findUser) throw new Error("User does not exist");
    done(null, findUser);
  } catch (err) {
    done(err, null);
  }
});

//authenticating or verifying if user exists
export default passport.use(
  new Strategy({ usernameField: "email" }, async (email, password, done) => {
    console.log(email);
    console.log(password);
    try {
      const findUser = await User.findOne({ email });
      console.log(findUser);
      if (!findUser) throw new Error("User does not exist");
      if (findUser.password !== password)
        throw new Error("Invalid Credentials");

      done(null, findUser);
    } catch (err) {
      done(err, null);
    }
  })
);
