# Adding users to the platform
## Why do we have a procedure to manually add users? 
Initially the platform won't be available for everyone while in beta test, to avoid potential vandalism the initial users will be selected through an application while better tools to assure the quality of the information being generated are developed.

## Maintenance scripts to seed users

### Needed environment variables and configuration
Add the following environment variables to the `.env` file:
```shell
# The production web URL to be passed to the HTML templates
WEB_URL=http://localhost:3000
# to seed the test user a development password shall be provided since this user won't be receiving an e-mail with the password
DEVELOPMENT_PASSWORD=123456
```

The following configuration is needed in the `config.seed.yaml` file, please copy `config.seed.example.yaml` to `config.seed.yaml`:
```yaml
conf:
  web_url: http://localhost:3000
  smtp_host: smtp.example.com
  smtp_port: 587
  smtp_secure: false
  smtp_email_user: user
  smtp_email_pass: password
  users:
    - name: Test User
      email: test@aletheiafact.org
      sendAuthDetails: false
      isTestUser: true
```

### Commands
```shell
yarn seed
```

### What if the e-mail isn't sent correctly to the users?
TBD
