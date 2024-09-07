import express, { json } from "express";

//This is to run the express app
const app = express();

//middleware which help in extrating request bodies from browser in json
app.use(express.json);
const PORT = process.env.PORT || 2000;

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});
