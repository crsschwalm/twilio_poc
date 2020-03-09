/*
    manage function
    https://www.twilio.com/console/functions/manage/ZHbb9b41fc24889e341189af08c06ebf0f

    configure Environment variables (ga token)
    https://www.twilio.com/console/functions/configure
*/

/**
 *  Call Forward Template
 *
 * Google Analytics
 * https://www.twilio.com/blog/capture-call-tracking-metrics-google-analytics-twilio-programmable-voice
 *
 *  This Function will forward a call to another phone number. If the call isn't answered or the line is busy,
 *  the call is optionally forwarded to a specified URL. You can optionally restrict which calling phones
 *  will be forwarded.
 */

exports.handler = forwardNumberWithTracking;

async function forwardNumberWithTracking(context, event, callback) {
  const _ = require("lodash");
  const phoneNumber = event.forward;

  const twiml = new Twilio.twiml.VoiceResponse();

  const dialParams = _.pickBy({
    callerId: event.CallerId,
    timeout: event.timeout
  });

  twiml.dial(dialParams, phoneNumber);

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
