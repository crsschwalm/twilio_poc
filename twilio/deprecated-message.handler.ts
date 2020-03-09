import { twiml } from "twilio";

export default function deprecatedMessageResponse() {
  const voiceResponse = new twiml.VoiceResponse();
  voiceResponse.say(
    "We're Sorry, the Number you are trying to reach has ended their Trial. Goodbye"
  );

  return voiceResponse.toString();
}
