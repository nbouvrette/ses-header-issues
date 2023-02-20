"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var client_sesv2_1 = require("@aws-sdk/client-sesv2");
var dotenv = require("dotenv");
var node_crypto_1 = require("node:crypto");
var fs = require("node:fs");
var node_util_1 = require("node:util");
// Load environment variables.
dotenv.config();
var sesV2ClientConfig = {
    region: "us-east-2",
    credentials: {
        accessKeyId: process.env.AWS_SES_KEY_ID,
        secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
    },
};
var sesClient = new client_sesv2_1.SESv2Client(sesV2ClientConfig);
var textEncoder = new node_util_1.TextEncoder();
var emailId = (0, node_crypto_1.randomUUID)();
var FROM_ADDRESS = process.env.FROM_ADDRESS;
var FROM_DOMAIN = FROM_ADDRESS.split("@").pop();
var TO_ADDRESS = process.env.TO_ADDRESS;
var rawEmail = fs
    .readFileSync("src/email.txt")
    .toString("utf-8")
    .replace("{{FROM_ADDRESS}}", FROM_ADDRESS)
    .replace("{{TO_ADDRESS}}", TO_ADDRESS)
    .replace("{{MESSAGE_REFERENCE}}", "<".concat(emailId, "@").concat(FROM_DOMAIN, ">"));
var sendEmailCommandInput = {
    FromEmailAddress: process.env.FROM_ADDRESS,
    Destination: {
        ToAddresses: [process.env.TO_ADDRESS],
    },
    Content: {
        Raw: {
            Data: textEncoder.encode(rawEmail),
        },
    },
};
var sendEmailCommand = new client_sesv2_1.SendEmailCommand(sendEmailCommandInput);
sesClient.send(sendEmailCommand);
console.log();
console.log("Raw email:");
console.log();
console.dir(rawEmail);
console.log();
console.log("The test email has been sent to ".concat(process.env.TO_ADDRESS));
