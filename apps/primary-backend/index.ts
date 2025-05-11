import express from "express"
import { envs } from "./utils/envs";
import { env } from "bun";
import { routes } from "./routes";
import cookieParser from "cookie-parser";

export const app = express();
app.use(express.json())
app.use(cookieParser())

// get the needed env
const {PORT} = env
const port  = 4000;

// routes
app.get("/", (req, res) => {
    res.json({
        message: "This is the home route"
    })
});

app.use("/", routes)

// listen to the server
app.listen(port, () => {
    console.log(`Backend server running on port ${port}.`)
});

