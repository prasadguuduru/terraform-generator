# Localstack Spinup Steps
Spinning up Local Stack Locally and provisioning sample infra

Step 1:
```
export DOCKER_API_VERSION=1.43
```
Step 2:
```
export LOCALSTACK_API_KEY=77jinYX1gE
```

Step 3:
```
docker network create  innovation-sprint
```

Step 4:
```
docker-compose up -d
```

Step 5:
```

docker-compose logs -f localstack
```

Step 6:
Open another terminal and try to provision main.tf.json terraform
```
terraform init && terraform apply --auto-approve
```

Step 6:

```
aws apigateway get-rest-apis --region us-east-1 --endpoint-url http://localhost:4566
```


Step 7:
Get associated api gateway code and try to render the endpoint

```
http://localhost:4566/restapis/<<APIGATEWAYCODE>>/test/_user_request_/sample
```