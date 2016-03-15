org=<org>
username=<username>

curl -u $username https://api.enterprise.apigee.com/v1/o/$org/vaults \
	-H "Content-Type: application/json" \
        -d '{"name": "awscreds"}' -X POST

curl -u $username https://api.enterprise.apigee.com/v1/o/$org/vaults/awscreds/entries \
	-H "Content-Type: application/json" \
        -d '{"name": "access_key", "value": "<access_key>" }' -X POST

curl -u $username https://api.enterprise.apigee.com/v1/o/$org/vaults/awscreds/entries \
	-H "Content-Type: application/json" \
        -d '{"name": "secret_key", "value": "<secret_key>"}' -X POST

curl -u $username https://api.enterprise.apigee.com/v1/o/$org/vaults/awscreds/entries \
	-H "Content-Type: application/json" \
        -d '{"name": "region", "value": "<region>" }' -X POST
