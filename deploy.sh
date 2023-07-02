#!/bin/bash

# Source the .env file
source .env

# Check if the deployment is successful
function check_deployment_status() {
    if [ $? -ne 0 ]; then
        echo "Deployment failed. Aborting..."
        exit 1
    fi
}

echo "Syncing photos directory with S3 bucket..."
aws s3 sync "$LOCAL_PHOTOS_DIRECTORY" "s3://$S3_PHOTO_BUCKET" --delete --exclude ".*" --region $AWS_REGION --profile $AWS_PROFILE
check_deployment_status

# Retrieve the previous tag
previous_tag=$(git describe --abbrev=0 --tags)

# Increment the version
version=$(echo $previous_tag | awk -F. -v OFS=. '{$NF = $NF + 1;} 1')

# Check for changes in Lambda code
git diff --quiet $previous_tag -- lambda_function.rb
lambda_changes=$?

# Deploy Lambda code
if [ $lambda_changes -ne 0 ]; then
    echo "Deploying Lambda function..."
    zip -r lambda-deployment-package.zip lambda_function.rb  # Package Lambda code
    aws lambda update-function-code --function-name $LAMBDA_FUNCTION_NAME --zip-file fileb://lambda-deployment-package.zip --region $AWS_REGION --profile $AWS_PROFILE
    check_deployment_status

    rm lambda-deployment-package.zip
else
    echo "No changes in Lambda code. Skipping Lambda deployment."
fi

# Deploy Static Files to S3 Bucket
echo "Deploying static files to S3 bucket..."
aws s3 sync . "s3://${S3_BUCKET_NAME}" --delete --exclude ".git/*" --exclude ".DS_Store" --exclude ".*" --exclude "Gemfile" --exclude "lambda_function.rb" --exclude "Gemfile.lock" --exclude "photos/*" --exclude "*.rb" --profile ${AWS_PROFILE}

check_deployment_status

# Tag the deployment commit
if [ $lambda_changes -eq 0 ]; then
    echo "No changes in Lambda code. Skipping tagging."
else
    echo "Tagging the deployment commit..."
    git tag $version
fi

echo "Deployment complete!"
