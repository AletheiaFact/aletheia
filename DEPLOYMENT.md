## Setting up the config files
NOTICE: config.yml and config.yaml are two different stuff that we need to fix in the future. The first ons is for the k8s deployment and the second is for the Nodejs server.

### Environement variables
Make sure to set the following environment variables:

```
PRODUCTION_AWS_ACCESS_KEY_ID=...
PRODUCTION_AWS_SECRET_ACCESS_KEY=...
```

## Troubleshooting

### Database connection error
Whenever the database connection fails and you need to change the configurations, a full re-build is needed, otherwise the config.yaml file will not be updated.