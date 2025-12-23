import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files if any (CSS/images)
app.use(express.static(path.join(__dirname, "public")));

// 🔹 GET / → show form
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 🔹 POST /generate-pdf → SHOW PAGE (NO PDF)
app.post("/generate-pdf", (req, res) => {
  try {
    const heroName = (req.body.heroName || "HERO").toUpperCase();

    let html = fs.readFileSync(
      path.join(__dirname, "template.html"),
      "utf8"
    );

    // Inject name
    html = html.replace(/{{NAME}}/g, heroName);

    // 🔥 Just show the page
    res.send(html);

  } catch (error) {
    console.error("PAGE ERROR:", error);
    res.status(500).send("Something went wrong");
  }
});

// Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
