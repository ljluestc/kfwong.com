[![Netlify Status](https://api.netlify.com/api/v1/badges/99d80486-7cde-48c2-bbf6-f21bc67ea29c/deploy-status)](https://app.netlify.com/sites/kfwong-com/deploys)

My humble blog source.

## Installation

1. This humble repo may needs following tools:
 - `yarn` for better dependency management
 - `git-secret` for encrypting dark secrets
 - `terraform` for deployment
2. Clone this humble repo and install dependencies:
```
yarn install
```

## Development
1. Run the following command:
```
yarn start
```

## Deployment
1. Decrypt the secrets as `terraform` requires token access from github and netlify
```
# hack my secrets, i dare you! HA!
git secret reveal
```

2. Executes `terraform` script
```
terraform apply
```