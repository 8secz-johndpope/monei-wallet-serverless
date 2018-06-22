# MONEI-Wallet-Serverless

[![Build Status](https://travis-ci.org/MONEI/monei-wallet-serverless.svg?branch=master)](https://travis-ci.org/MONEI/monei-wallet-serverless)

Serverless back-end for MONEI Wallet
User interface can be found here - [monei-wallet-ui](https://github.com/MONEI/monei-wallet-ui)

## Setup and deployment

- `docker-compose up`
- `make shell` to enter interactive docker environment
- `yarn`
- `sls deploy`

## Local development:

- `make shell`
- `yarn`
- `sls dynamodb install`
- `serverless offline start --host 0.0.0.0 --migrate`

## Front-end integration

After successful deployment console will output

```
===================== FRONT-END CONFIG =====================
Add this to the .env file in the front-end app

REACT_APP_REGION=...
REACT_APP_IDENTITY_POOL_ID=...
REACT_APP_USER_POOL_ID=...
REACT_APP_USER_POOL_CLIENT_ID=...
REACT_APP_GRAPHQL_ENDPOINT=...
REACT_APP_API_ENDPOINT=...
```

Copy this variables to `.env.develop` in [monei-wallet-ui](https://github.com/MONEI/monei-wallet-ui)

## Create user in Cognito:

`aws cognito-idp sign-up  --region <REGION> --client-id <COGNITO_CLIENT_ID>  --username <USERNAME> --password <PASSWD> --user-attributes Name=email,Value=<EMAIL>`

## Confirm user in Cognito:

`aws cognito-idp confirm-sign-up --region <REGION> --client-id <COGNITO_CLIENT_ID> --username <USERNAME> --confirmation-code <EMAIL_RECEIVED_CODE>`
