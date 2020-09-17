import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.set("Content-Type", "text/html");
  res.send(new Buffer("<h2>Test String</h2>"));
});

app.listen(3000, () => {
  console.log("App working on http://localhost:3000");
});
