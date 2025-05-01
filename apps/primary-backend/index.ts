import express from "express"
import { envs } from "./utils/envs";
import { env } from "bun";
import { routes } from "./routes";


const app = express();
app.use(express.json())


// get the needed env
const {PORT} = env

// routes
app.get("/", (req, res) => {
    res.json({
        message: "This is the home route"
    })
});

app.use("/", routes)

// listen to the server
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}.`)
});

