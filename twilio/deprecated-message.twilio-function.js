exports.handler = handleDeprecatedNumber;

async function handleDeprecatedNumber(context, event, callback) {
  const twiml = new Twilio.twiml.VoiceResponse();
  twiml.say(
    "We're Sorry, the Number you are trying to reach has ended. Goodbye"
  );

  await tryTrackCall(context, event);

  callback(null, twiml);
}

const tryTrackCall = async ({ GA_API_TOKEN: tid, GA_REST_ENDPOINT }, event) => {
  const _ = require("lodash");
  const fetch = require("axios").get;

  const callMetrics = _.pickBy({
    contact: event.From,
    duration: event.DialCallDuration,
    callStatus: event.DialCallStatus
  });

  const gaEvent = {
    v: "1",
    t: "event",
    tid,
    ...callMetrics
  };

  try {
    const googleAnalyticsURL = GA_REST_ENDPOINT + composeQueryString(gaEvent);

    await fetch(googleAnalyticsURL);

    console.log("googleAnalyticsURL :", googleAnalyticsURL);
    console.log("GA Event: ", JSON.stringify(gaEvent));
  } catch (err) {
    console.error("Error sending to GA: ", err);
  }
};

const composeQueryString = query =>
  `?${Object.entries(query)
    .map(([key, val]) => `${key}=${val}`)
    .join("&")}`;
