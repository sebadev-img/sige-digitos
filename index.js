const express = require("express");
const fileUpload = require("express-fileupload");
const pdfParse = require("pdf-parse");

const app = express();
const port = process.env.PORT || 5000;

app.use("/", express.static("public"));
app.use(fileUpload());

app.post("/extract-text", (req, res) => {
  if (!req.files && !req.files.pdfFile) {
    res.status(400);
    res.end();
  }
  pdfParse(req.files.pdfFile).then((result) => {
    res.send(result.text);
  });
});

app.listen(port);
