const express = require("express");
const urlRouter = require("./routes/url");
const { connectToMongoDB } = require("./connect");
const URL = require("./models/url");
const { handleGetAllUrls } = require("./controllers/url");

const app = express();
const PORT = 8000;
const MONGODB_URL = "mongodb://127.0.0.1:27017/shortify";

connectToMongoDB(MONGODB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log("MongoDB error: ", error));

app.set("view engine", "ejs");
app.use(express.json());
app.use("/api/url", urlRouter);

app.get("/", handleGetAllUrls);
app.get("/api/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    { shortId },
    {
      $push: {
        visitHistory: { timestamp: Date.now() },
      },
    }
  );

  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
