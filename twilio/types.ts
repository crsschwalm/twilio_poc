interface Webhook extends LocationDetails {
  changeType: "create" | "update" | "delete";
}

type LocationDetails = {
  postalCode?: string;
  phoneNumber: string;
  twilioNumberSID?: string;
};

type TwilioConfig = { sid: string; authToken: string };

type CallEvent = {
  Called: string;
  ToState: string;
  CallerCountry: string;
  Direction: string;
  CallerState: string;
  ToZip: string;
  CallSid: string;
  To: string;
  CallerId: string;
  CallerZip?: string;
  ToCountry: string;
  ApiVersion: string;
  CalledZip: string;
  CalledCity: string;
  CallStatus: string;
  From: string;
  AccountSid: string;
  CalledCountry: string;
  CallerCity?: string;
  Caller: string;
  FromCountry: string;
  ToCity: string;
  FromCity?: string;
  CalledState: string;
  FromZip?: string;
  FromState: string;
  DialCallDuration?: string;
  DialCallStatus?: string;
  timeout: string | number;
};

type ObjectOfStrings = { [s: string]: string };
