# terraform-generator
Hackathon Project for generating terraform from resource def in a json


Step 1:
```
yarn install && yarn build && yarn generate-tf
```

Step 2:
```
export AWS_ACCESS_KEY_ID='test'
export AWS_SECRET_ACCESS_KEY='test'
AWS_DEFAULT_REGION='us-east-1'
cd generated/aws/lambda
terraform init && terraform apply --auto-approve
```

Note: need to spin up associate localstack environment to spin up infra

Step 3:

Get items.id by executing below command and replace in below Step 4 URL and render the page.
```
 aws apigateway get-rest-apis --region us-east-1 --endpoint-url http://localhost:4566
```
Step 4:
336j3th7jt is the  items.id in Step 3 command.
```
http://localhost:4566/restapis/336j3th7jt/test/_user_request_/sample
```