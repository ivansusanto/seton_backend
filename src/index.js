const express = require("express");
const app = express();
const cors = require("cors");
const env = require("./config/env.config");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

const indexRouter = require("./routes/index.routes");

app.use("/api", indexRouter);
app.get("/api/checkConnection", (req, res) => {
    return res.status(200).json({
        status : "200",
        message: `Welcome to the API!`,
        data : ""
    });
})

app.all("*", async (req, res) => {
    return res.status(404).json({
        message: `Endpoint not found!`
    });
})

const port = env("PORT") ? env("PORT") : 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
});
