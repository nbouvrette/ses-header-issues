# This repo is meant to test inline images with SES

Full details here: https://github.com/aws/aws-sdk-js-v3/issues/4440

## How to use

1. run `npm install`
2. Copy `.env.example` to `.env`
3. Enter the desired values in the 4 variables (ideally the `TO_ADDRESS` should be a gmail account - I didn't test on non-gmail addresses)
4. run `npm run build`

## How to verify the issue

- Send the email to a gmail account
- Click on the "show original" in the email option on
- Check the email headers - you should see the AWS SES headers inserted in the middle of the `Content-Type` header:

```txt
Content-Type: multipart/related;
    boundary="000000000000b7969b05f4993f7a"
Message-ID: <010f01866fbd5e20-edefdd5d-2a73-48b8-96ae-64deea8d1102-000000@us-east-2.amazonses.com>
Date: Mon, 20 Feb 2023 16:52:06 +0000
Feedback-ID: 1.us-east-2.RmJih6tMkq3QnkXTAN7+oKgfUqUlV7zRkdXuMYUVXWg=:AmazonSES
X-SES-Outgoing: 2023.02.20-23.251.226.3

--000000000000b7969b05f4993f7a
Content-Type: text/html; charset=UTF-8

<div>
  <img src="cid:ii_le3604mx0" alt="image.png" width="208" height="79" style="margin-right: 0px" />
  Hello world
</div>
```

Unlike the original issue opened on GitHub, the image still displays (I suspect I had a problem with my image which was causing the display isuse).

But unless I am mistaken those email headers are not valid?
