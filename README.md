# Twilio POC Notes:

## Tasks

#### Generate Phone Numbers:

This is the preliminary task. If this doesn't work then there is no point continuing. We want to write a very simple Node.js script that:

1. accepts a real phone number
2. Takes the area code from real phone number and asks Twilio for another phone number in the same area code
3. Setup up call forwarding from Twilio Phone Number to Real phone number
   _Completion Criteria_: Call Twilio phone number and connect to Real phone number
   ​

#### Track Call:

- Setup log info webhook in Twilio that will call either local dev server or Heroku demo server with call data
- Check if call tracking data coming in is close to real time or can we do daily or weekly snapshots
- If we can get call tracking data in our servers, it will be straightforward to send that data to Google Analytics(GA). No need to send the actual data to a GA instance.
- _Completion Criteria_: View call tracking data within our infrastructure (local dev server or heroku demo server)
  ​

#### Simulate change/deprecation:

- Write simple (no bells and whistles) Node.js script to remove existing Twilio phone number.
- If time permits, check if we can "deprecate" a phone number; i.e., stop call forwarding and add short message saying this number is no longer being used.
- If time permits, check if we can "reuse" a phone number; i.e., setup new call forwarding to a different Real phone number.
- _Completion Criteria_: Ability to delete Twilio Phone number and stop call forwarding.

## Implementation

### Twilio Platform Setup

**Twilio Functions (implemented as primary call handling strategy)**

- /twilio/forward.twilio-function.js
- Templated plain javascript to forward phone calls.
- https://www.twilio.com/console/functions/manage/ZHbb9b41fc24889e341189af08c06ebf0f

**Twiml Bin (implemented as fallback strategy)**

- /twilio/forward.twiml-bin.js
- XML instructions to forward calls
- https://www.twilio.com/console/functions/manage/ZHbb9b41fc24889e341189af08c06ebf0f

**Steps to configure new number**

1. Setup Twilio Call handler. Twiml/Functions
2. Find Twilio Numbers based on given # or address
3. Buy a Twilio number
4. Configure Twilio number to point to call handler (step 1)
5. 💵💵💵💵

## Caveats

**Trial Accounts limitations**

- Only call verified numbers- https://www.twilio.com/console/debugger/NO429b735346d3ba58e6de1b016948dbaa
- Cannot purchase live phone numbers, can only hit `magic` numbers - https://www.twilio.com/docs/iam/test-credentials
- Limited to one live twilio phone number. `+1 (205) 551-6682`
