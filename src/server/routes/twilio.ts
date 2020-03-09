import express from "express";
import deprecatedMessageResponse from "../../../twilio/deprecated-message.handler";
import forwardResponse from "../../../twilio/forward.handler";
import { tryTrackCall } from "../../../twilio/ga-event";

const router = express.Router();

/* GET ga event details */
router.get("/collect", (req, res) => {
  console.log(`Logging Call Data! \n ${req.query}`);
  res.send(req.query);
});

/* Instruct Voice Response for Deprecated Numbers */
router.post("/deprecated", async (req, res) => {
  const { body: callEvent } = req;

  console.log(
    `Forwarding Call from ${
      callEvent.from
    }. Responding with Deprecated Number message.`
  );

  const response = deprecatedMessageResponse();

  if (callEvent) await tryTrackCall(callEvent);

  res.set("Content-Type", "text/xml");
  res.send(response);
});

/* Instruct Voice Response to Forward Numbers */
router.post("/forward", async (req, res) => {
  const {
    query: { forward },
    body: callEvent
  } = req;

  console.log(
    `Forwarding Call from ${callEvent.from}. Forwarding to ${forward}`
  );

  const response = forwardResponse(callEvent, forward);

  if (callEvent) await tryTrackCall(callEvent);

  res.set("Content-Type", "text/xml");
  res.send(response);
});

export default router;
