import twilio, { Twilio } from "twilio";

export const defaultTwilioConfig = (
  {
    TWILIO_SID = "",
    TWILIO_AUTH_TOKEN = "",
    TWILIO_TEST_SID = "",
    TWILIO_TEST_AUTH_TOKEN = ""
  } = process.env
): { dev: TwilioConfig; prd: TwilioConfig } => ({
  dev: {
    sid: TWILIO_TEST_SID,
    authToken: TWILIO_TEST_AUTH_TOKEN
  },
  prd: {
    sid: TWILIO_SID,
    authToken: TWILIO_AUTH_TOKEN
  }
});

const TWILIO_DOMAIN = "https://orchid-cow-1641.twil.io";
const FALLBACK_DOMAIN = "TODO.com";

export const FORWARD_URL = `${TWILIO_DOMAIN}/track-call-forward`;
export const FORWARD_FALLBACK_URL = `${FALLBACK_DOMAIN}/twilio/forward`;

export const AUTOMATED_MESSAGE_URL = `${TWILIO_DOMAIN}/deprecated`;
export const AUTOMATED_MESSAGE_FALLBACK_URL = `${TWILIO_DOMAIN}/twilio/deprecated`;

export default class TwilioService {
  constructor(private connection: Twilio, private config: TwilioConfig) {}
  readonly COUNTRY_CODE = "US";

  readonly FORWARD_URL = FORWARD_URL;
  readonly FORWARD_FALLBACK_URL = FORWARD_FALLBACK_URL;

  readonly AUTOMATED_MESSAGE_URL = AUTOMATED_MESSAGE_URL;
  readonly AUTOMATED_MESSAGE_FALLBACK_URL = AUTOMATED_MESSAGE_FALLBACK_URL;

  static async connect(config = defaultTwilioConfig().dev) {
    const connection = await twilio(config.sid, config.authToken);
    return new TwilioService(connection, config);
  }

  async updateForwardingNumber({
    sid,
    forwardTo
  }: {
    sid: string;
    forwardTo: string;
  }) {
    return this.connection.incomingPhoneNumbers(sid).update({
      voiceUrl: `${this.FORWARD_URL}?forward=${forwardTo}`,
      voiceFallbackUrl: `${this.FORWARD_FALLBACK_URL}?forward=${forwardTo}`
    });
  }

  async deprecateNumber({ sid }: { sid: string }) {
    return this.connection.incomingPhoneNumbers(sid).update({
      voiceUrl: this.AUTOMATED_MESSAGE_URL,
      voiceFallbackUrl: this.AUTOMATED_MESSAGE_FALLBACK_URL
    });
  }

  async createTwilioNumber(
    phoneNumbers: string[],
    config: { [s: string]: string } = {}
  ): Promise<any> {
    try {
      const phoneNumberToBuy = phoneNumbers[0];
      if (!phoneNumberToBuy) {
        const noValidNumbers = new Error(
          "\n💀 Of the available numbers, none were able to be purchased"
        );
        noValidNumbers.name = "no-valid-numbers";
        throw noValidNumbers;
      }

      console.log(`\n🤑 Attempting to puchase number: ${phoneNumberToBuy}`);

      const boughtNumber = await this.connection.incomingPhoneNumbers.create({
        phoneNumber: phoneNumberToBuy,
        ...config
      });

      return boughtNumber;
    } catch (err) {
      errorHandler(err);

      return this.createTwilioNumber(phoneNumbers.slice(1), config);
    }
  }

  async availableLocalNumbers(details: {
    areaCode: number;
    postalCode?: string;
  }) {
    const numbersByAreaCode = await this.availablePhoneNumbers({
      areaCode: details.areaCode
    });

    const numbersByPostalCode = details.postalCode
      ? await this.availablePhoneNumbers({ inPostalCode: details.postalCode })
      : [];

    const localNumbers = [...numbersByAreaCode, ...numbersByPostalCode];

    if (localNumbers.length > 0) return localNumbers;

    throw new Error(
      `Could not find available number for the provided details: ${JSON.stringify(
        details
      )}`
    );
  }

  async availablePhoneNumbers(query: { [s: string]: string | number }) {
    try {
      return await this.connection
        .availablePhoneNumbers(this.COUNTRY_CODE)
        .local.list({ ...query, limit: 20 });
    } catch (err) {
      console.error(err);
      return [];
    }
  }
}

export function parsePhoneNumber(inputNumber = "", DEFAULT_COUNTRY_CODE = "1") {
  const normalNumber = inputNumber.replace(/\D/g, "");

  const areaCode = parseAreaCode(normalNumber);

  if (normalNumber.length === 11) {
    return {
      countryCode: normalNumber.split("")[0],
      phoneNumber: `+${normalNumber}`,
      areaCode,
      inputNumber
    };
  }

  if (normalNumber.length === 10) {
    return {
      countryCode: DEFAULT_COUNTRY_CODE,
      phoneNumber: `+${DEFAULT_COUNTRY_CODE}${normalNumber}`,
      areaCode,
      inputNumber
    };
  }

  throw new Error(
    `Phone number should be 10 or 11 digits.
    Found: ${normalNumber.length} characters
    in number: ${normalNumber} ☎`
  );
}

const parseAreaCode = (phoneNumber: string) => {
  let areaCode = 0;
  if (phoneNumber.length === 10) {
    const firstThreeDigits = phoneNumber.substr(0, 3);
    areaCode = parseInt(firstThreeDigits, 10);
  } else if (phoneNumber.length === 11) {
    const secondToFourthDigits = phoneNumber.substr(1, 3);
    areaCode = parseInt(secondToFourthDigits, 10);
  }

  if (isNaN(areaCode))
    throw new Error(
      `Cannot Parse valid area code from phone number: ${phoneNumber}`
    );

  if (areaCode === 0) throw new Error(`Invalid phone number: ${phoneNumber}`);

  return areaCode;
};

function errorHandler(err: any) {
  if (err.code === 20404 || err.code == 20008) {
    console.warn(`👀 Are you using Test Credentials? 👀`);
  }

  if (err.name === "no-valid-numbers") {
    throw err;
  }

  console.error("\n Error :", err);
}
