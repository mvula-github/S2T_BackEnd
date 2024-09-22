import passport from "passport";
import { Strategy } from "passport-local";
import { userList } from "../utils/USERS/usersData.mjs";

passport.serializeUser((user, done) => {
  console.log("Inside Serialze user");
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log("Inside Deserialize user");
  console.log(`Deseialize user ID : ${id}`);
  try {
    const findUser = userList.find((user) => user.id === id);
    if (!findUser) throw new Error("User does not exist");
    done(null, findUser);
  } catch (err) {
    done(err, null);
  }
});

//authenticating or verifying if user exists
export default passport.use(
  new Strategy({ usernameField: "email" }, (username, password, done) => {
    console.log(`username : ${username}`);
    console.log(`password: ${password}`);
    try {
      const findUser = userList.find((user) => user.email === username);
      if (!findUser) throw new Error("User does not exist");
      if (findUser.password !== password)
        throw new Error("Invalid Credentials");

      done(null, findUser);
    } catch (err) {
      done(err, null);
    }
  })
);
