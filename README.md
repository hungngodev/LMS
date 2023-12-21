# Seamless LMS

Monolithic repo for Seamless LMS

# Development Environment Setup

## Prerequisites

-   A local installation of Docker is required to setup development environment. This project requires Localstack to emulate AWS S3 Bucket and MongoDB as the primary databases, both of which can be run using Docker.
-   You can install Docker to your local machine here: [docs.docker.com/engine/install/](https://docs.docker.com/engine/install/)

-   Terraform and Terraform local (note that these 2 packages are different and independent of each other )is required to setup AWS S3 Bucket emulation.
-   You can install Terraform to your local machine here: [developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli)
-   You can install Terraform local using the following command: `pip install terraform-local`, note that this requires a Python environment in your local machine.

-   AWS CLI is also required. This helps us obtain access key to our S3 bucket setup by Terraform.
-   You can install AWS CLI to your local machine here: [docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html#getting-started-install-instructions](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html#getting-started-install-instructions)

## Setup

First we need to run Localstack and MongoDB using Docker: `docker compose up -d`

Then we run our Terraform script to setup S3 bucket in our Localstack: `cd terraform && terraform init && tflocal apply -auto-approve && cd ..`

Then we obtain access key to our S3 bucket emulation using the following command: `aws --endpoint-url=http://localhost:4566 iam create-access-key --user-name seamless-lms-bucket-user`

Copy the value of the Access Key Id and Secret Access Key, we will need them in the next step.

Next we setup environment variables: `cp .env.example .env.local`. You can leave all the default value as is, except for `S3_ACCESS_KEY_ID` and `S3_SECRET_ACCESS_KEY` - refer to the Access Key Id and Access Key Secret values copied in previous step.

Run `yarn dev` and head to `http://localhost:3000` to view your application in dev mode. All the accounts credentials are not yet seeded, so you won't be able to login yet.

You can seed the database by sending a POST request to the `/api/seed` route using the following cUrl script:

```sh
curl  -X POST \
  'http://localhost:3000/api/seed' \
  --header 'Content-Type: application/json' \
  --data-raw '{
  "token": "SOME_SECRET"
}'
```

The seed users will have their credentials in the `.env.local` file, refer to those credentials to login to the appropriate user role.
# LMS
