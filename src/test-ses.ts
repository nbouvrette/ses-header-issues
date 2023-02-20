import {
  SendEmailCommand,
  SendEmailCommandInput,
  SESv2Client,
  SESv2ClientConfig,
} from "@aws-sdk/client-sesv2";
import * as dotenv from "dotenv";
import { randomUUID } from "node:crypto";
import * as fs from "node:fs";
import { TextEncoder } from "node:util";

// Load environment variables.
dotenv.config();

const sesV2ClientConfig: SESv2ClientConfig = {
  region: "us-east-2",
  credentials: {
    accessKeyId: process.env.AWS_SES_KEY_ID as string,
    secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY as string,
  },
};

const sesClient = new SESv2Client(sesV2ClientConfig);
const textEncoder = new TextEncoder();
const emailId = randomUUID();
const FROM_ADDRESS = process.env.FROM_ADDRESS as string;
const FROM_DOMAIN = FROM_ADDRESS.split("@").pop();
const TO_ADDRESS = process.env.TO_ADDRESS as string;

const rawEmail = fs
  .readFileSync("src/email.txt")
  .toString("utf-8")
  .replace(`{{FROM_ADDRESS}}`, FROM_ADDRESS)
  .replace(`{{TO_ADDRESS}}`, TO_ADDRESS)
  .replace(`{{MESSAGE_REFERENCE}}`, `<${emailId}@${FROM_DOMAIN}>`);

const sendEmailCommandInput: SendEmailCommandInput = {
  FromEmailAddress: process.env.FROM_ADDRESS as string,
  Destination: {
    ToAddresses: [process.env.TO_ADDRESS as string],
  },
  Content: {
    Raw: {
      Data: textEncoder.encode(rawEmail),
    },
  },
};

const sendEmailCommand = new SendEmailCommand(sendEmailCommandInput);
sesClient.send(sendEmailCommand);

console.log();
console.log("Raw email:");
console.log();
console.dir(rawEmail);
console.log();
console.log(
  `The test email has been sent to ${process.env.TO_ADDRESS as string}`
);
