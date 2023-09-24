# terraform-generator
Hackathon Project for generating terraform from resource def in a json

Step 1:
```
yarn install && yarn build && yarn generate-terraform
```

Step 2:
```
cd generated/aws/lambda
terraform init && terraform apply --auto-approve
```

Note: need to spin up associate localstack environment to spin up infra

