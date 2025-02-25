import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

// Serve static files from the 'public' folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(__dirname);
console.log(__filename);
console.log(path.join(__dirname, "./public"));

app.use(express.static(path.join(__dirname, "./dist")));
app.use(express.static(path.join(__dirname, "./public")));

app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});
