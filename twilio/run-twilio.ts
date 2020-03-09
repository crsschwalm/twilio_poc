import TwilioService, {
  defaultTwilioConfig,
  parsePhoneNumber,
  FORWARD_URL,
  FORWARD_FALLBACK_URL
} from "./twilio-service";

const {
  PROJECT_ROOM_1_PHONE = "",
  CARSON_NUMBER = "",
  DEV_LAB_PHONE = "",
  TWILIO_NUM = "",
  TWILIO_NUM_SID = ""
} = process.env;

const MAGIC_AVAILABLE_NUMBERS = [
  "+15005550001", // invalid
  "+15005550007", // not owned by this account
  "+15005550008", // SMS message queue that is full,
  "+15005550006" // valid number ✅
];

handleLocationChange({
  changeType: "update",
  postalCode: "46037",
  phoneNumber: CARSON_NUMBER,
  twilioNumberSID: TWILIO_NUM_SID
})
  .then(console.log)
  .catch(console.error);

async function handleLocationChange(
  { changeType, ...locationDetails }: Webhook,
  twilioConfig = defaultTwilioConfig().prd
) {
  const { twilioNumberSID: sid, phoneNumber: forwardTo } = locationDetails;

  switch (changeType) {
    case "create":
      return simulateCreateTwilioNumber(locationDetails);

    case "update":
      //run with twilio account credentials to update real numbers
      if (sid) {
        const twilio = await TwilioService.connect(twilioConfig);

        const updatedTwilioNumber = await twilio.updateForwardingNumber({
          forwardTo,
          sid
        });

        console.log(`
        ☎️ - Call: ${updatedTwilioNumber.friendlyName}
        🔔 - Ring️: ${forwardTo}
        `);
        break;
      }

      throw new Error(
        `Not a valid Twilio phone SID.
        Provided: ${sid}`
      );

    case "delete":
      //run with twilio account credentials to update real numbers
      if (sid) {
        const twilio = await TwilioService.connect(twilioConfig);

        const updatedTwilioNumber = await twilio.deprecateNumber({
          sid
        });

        console.log(`
        ☎️ - Call: ${updatedTwilioNumber.friendlyName}
        🙉 - "We're Sorry, the Number you are trying to reach is no longer available. Goodbye"
        `);
        break;
      }

      throw new Error(
        `Not a valid Twilio phone SID.
        Provided: ${locationDetails.twilioNumberSID}`
      );

    default:
      throw new Error(
        `Not a valid Change Type
        Provided: ${changeType}`
      );
  }
}

async function simulateCreateTwilioNumber(location: LocationDetails) {
  try {
    //Simulating GET available #s. test accounts disable buying these
    const twilioLive = await TwilioService.connect(defaultTwilioConfig().prd);

    //run with twilio test credentials to buy magic numbers
    const twilioTest = await TwilioService.connect(defaultTwilioConfig().dev);

    const { areaCode, phoneNumber } = parsePhoneNumber(location.phoneNumber);

    console.log(`\n 1️⃣ - Location Params to find a twilio number:
    areaCode: ${areaCode}
    postalCode: ${location.postalCode || "none provided"}`);

    const availableNumbers = await twilioLive.availableLocalNumbers({
      areaCode,
      postalCode: location.postalCode
    });

    console.log(
      `\n 2️⃣ - Based on the provided location details, Twilio found ${
        availableNumbers.length
      } available numbers`
    );

    console.warn(`\n 🙊 Sorry, in this POC we have to use some fake numbers due to credential limitations
    These will do:
    [
      "+15005550001" expect = invalid
      "+15005550007" expect = not owned by this account
      "+15005550008" expect = SMS message queue that is full,
      "+15005550006" expect = valid number ✅
    ]
    `);

    const configuredNumber = await twilioTest.createTwilioNumber(
      MAGIC_AVAILABLE_NUMBERS,
      {
        voiceUrl: `${FORWARD_URL}?forward=${phoneNumber}`,
        voiceFallbackUrl: `${FORWARD_FALLBACK_URL}?forward=${phoneNumber}`
      }
    );

    console.log(`\n 3️⃣ - 🏁🏁🏁
    Twilio Number: ${configuredNumber.friendlyName},
    Will Forward to ${phoneNumber}
    ==================================
    Configured to Twilio Function at: ${configuredNumber.voiceUrl}.
    Fallback Instruction at Twiml Bin: ${configuredNumber.voiceFallbackUrl}.
    `);
  } catch (err) {
    console.error("\n Simulation Failed 🤦‍");
    console.error("Error: ", err);
  }
}
