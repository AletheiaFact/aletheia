# Adding users to the platform
## Why do we have a procedure to manually add users? 
Initially the platform won't be available for everyone while in beta test, to avoid potential vandalism the initial users will be selected through an application while better tools to assure the quality of the information being generated are developed.

## Maintenance scripts to seed users

### Needed environment variables

```shell
# The production web URL to be passed to the HTML templates
WEB_URL=http://localhost:1234

# The e-mail that will be used to send the e-mails
FROM_EMAIL=your@email.com

# Currently the script supports gmail SMTP only
GOOGLE_CREDENTIALS_GMAIL_SMTP=/path/to/google-credentials.json

# to seed the test user a development password shall be provided since this user won't be receiving an e-mail with the password
DEVELOPMENT_PASSWORD=123456
```

### Commands

Execute the script for users that will be added to production
```shell
yarn seedUser
```

To add the test user run the following script
```shell
yarn seedUser:test
```

If you're running locally
```shell
eval $(egrep -v '^#' .env | xargs) yarn seedUser
# or
eval $(egrep -v '^#' .env | xargs) yarn seedUser:test
```

### What if the e-mail wasn't sent correctly to the users?
TBD
