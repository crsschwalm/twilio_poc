import express from "express";
import logger from "morgan";

import indexRouter from "./routes/index";
import twilioRouter from "./routes/twilio";

const app = express();

app.disable("x-powered-by");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/twilio", twilioRouter);

export default app;
