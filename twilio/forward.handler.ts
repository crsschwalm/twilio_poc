import { pickBy } from "lodash";
import { twiml } from "twilio";

export default function forwardResponse(
  incomingCall: CallEvent,
  forwardTo: string
) {
  const response = new twiml.VoiceResponse();

  const dialParams = pickBy({
    callerId: incomingCall.CallerId,
    timeout: incomingCall.timeout
  });

  response.dial(dialParams, forwardTo);

  return response.toString();
}
