import axios from "axios";
import { pickBy } from "lodash";

export const tryTrackCall = async (
  event: CallEvent,
  GA_API_TOKEN = "UXXX-GA-TOKEN",
  GA_REST_ENDPOINT = "TODO.com/ga"
) => {
  const callDetails = pickBy({
    contact: event.From,
    fromCountry: event.CallerCountry,
    callStatus: event.CallStatus
  });

  const gaEvent = {
    v: "1",
    t: "event",
    tid: GA_API_TOKEN,
    ...callDetails
  };

  try {
    const googleAnalyticsURL = GA_REST_ENDPOINT + composeQueryString(gaEvent);

    await axios.get(googleAnalyticsURL);

    console.log("googleAnalyticsURL :", googleAnalyticsURL);
    console.log("GA Event: ", JSON.stringify(gaEvent));
  } catch (err) {
    console.error("Error sending to GA: ", err);
  }
};

const composeQueryString = (query: ObjectOfStrings) =>
  `?${Object.entries(query)
    .map(([key, val]) => `${key}=${val}`)
    .join("&")}`;
