# MONEI-Wallet-Serverless

[![Build Status](https://travis-ci.org/MONEI/monei-wallet-serverless.svg?branch=master)](https://travis-ci.org/MONEI/monei-wallet-serverless)

Use docker container to test and deploy the app

- `docker-compose up`
- `make shell` to enter interactive docker environment
- `yarn`
- `sls deploy`

Running:

- `make shell`
- `yarn`
- `sls dynamodb install`
- `serverless offline start --host 0.0.0.0 --migrate`

Create user in Cognito:

`aws cognito-idp sign-up  --region <REGION> --client-id <COGNITO_CLIENT_ID>  --username <USERNAME> --password <PASSWD> --user-attributes Name=email,Value=<EMAIL>`

Confirm user in Cognito:

`aws cognito-idp confirm-sign-up --region <REGION> --client-id <COGNITO_CLIENT_ID> --username <USERNAME> --confirmation-code <EMAIL_RECEIVED_CODE>`
