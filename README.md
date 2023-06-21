# AWS Photo Stream

AWS Photo Stream is a serverless photo stream application built using AWS services (Lambda, API Gateway, S3) and JavaScript. It allows you to display photos and videos stored in an S3 bucket, with support for pagination and multiple file formats. I built this as a way to get my head around how API Gateway and Lambdas worked together.

## Features

- Serverless AWS backend
- Static frontend hosted on S3
- Paginated photo retrieval
- Support for JPEG images and MOV videos

## Architecture

The photo stream architecture consists of multiple AWS services and a client-side frontend application.

**Frontend:**

The frontend is a simple HTML, CSS, and JavaScript application hosted on an Amazon S3 bucket configured as a static website. The JavaScript code uses jQuery to make HTTP POST requests to an AWS Lambda function exposed through Amazon API Gateway. The Lambda function is responsible for listing the photos stored in another S3 bucket.

The frontend includes a "Load More" button that triggers a new HTTP POST request with the next page token to fetch more photos. The page token is obtained from the previous Lambda function response, ensuring efficient pagination and reducing the load on the Lambda function.

**Backend:**

The backend consists of an AWS Lambda function, an Amazon API Gateway, and an S3 bucket.

- **Lambda function:** The Ruby-based Lambda function uses the AWS SDK for Ruby (aws-sdk-ruby) to list objects stored in the S3 bucket. It supports pagination by accepting a page token and returning the next page token in the response.

- **Amazon API Gateway:** This acts as a proxy between the frontend and the Lambda function, exposing the Lambda function as a RESTful API. The frontend makes HTTP POST requests to this API to load photos.

- **S3 Bucket:** The bucket stores the photos and videos. The Lambda function retrieves the photos from this bucket and generates pre-signed URLs for each of them. These URLs enable the frontend to display the photos without requiring a separate download.

## Setup

### Prerequisites

Before deploying the application, make sure to complete the following steps and configurations:

**AWS Setup:**

1. **AWS Account:** Sign up for an AWS account at https://aws.amazon.com if you don't have one.

2. **Lambda Function:** Create a Lambda function with an execution role that has read access to the S3 bucket storing the photos. The Lambda function should run in the same region as your S3 buckets.

3. **S3 Buckets:**

   - **Website Bucket:** Create an S3 bucket to host your static website files (HTML, CSS, JavaScript). Configure the bucket as follows:
      - Enable static website hosting and specify "index.html" as the Index document.
      - Modify the bucket policy to allow public read access to objects. Example policy:

        ```json
        {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Sid": "PublicReadGetObject",
                    "Effect": "Allow",
                    "Principal": "*",
                    "Action": "s3:GetObject",
                    "Resource": "arn:aws:s3:::[YOUR_BUCKET_NAME]/*"
                }
            ]
        }
        ```

      - Optionally, enable CORS if you want resources to be accessed from a different domain.

   - **Photos Bucket:** Create an S3 bucket to store your photos. No need to enable static website hosting or public access for this bucket. The Lambda function will access this bucket to retrieve the photos.

**Amazon API Gateway:**

- Create a new REST API.
- Create a new resource and add a POST method for it.
- In the setup for the POST method, choose "Lambda Function" as the Integration type and select the previously created Lambda function.
- Enable "Use Lambda Proxy integration" to forward the entire request and let the Lambda function handle routing.
- Deploy the API to a new or existing stage.
- Note down the Invoke URL provided after deployment. This is the endpoint that you will call from your website's JavaScript code.

Remember to replace the placeholders in your `.env` file with your actual bucket names and Lambda function ARN. Also, update the `main.js` file with the Invoke URL of your API Gateway POST method.

4. **Local Setup:**

- Install the AWS CLI (Command Line Interface) on your local machine, which is used by the deployment script to upload files to S3 and update the Lambda function.
- Ensure you have Ruby installed on your local machine. Run `ruby -v` in your terminal to check. If Ruby is not installed, download it from https://www.ruby-lang.org.
- Create an `.env` file in the project root directory based on the provided `.env.sample` file. Fill in the necessary variables for the deployment script's configuration.

5. **Uploading Photos and Videos:**

- Store your photos and videos in the `photos` directory on your local machine. They should be in JPEG or MOV format and named in the desired order for display on the website.
- Use the provided Ruby script (`rename.rb`) to rename the files based on their creation date and optionally reverse their order. Execute the script as follows:

```bash
ruby rename.rb --file-path 'photos'
```

If you want the files to be displayed in reverse order (latest first), use the `--reverse` flag:

```bash
ruby rename.rb --reverse
```

### Usage

To display your photos and videos on the website, follow these steps:

1. Add your photos and videos to the `photos` directory in your local environment.
2. Run the deployment script (`deploy.sh`) in the project directory. This script syncs the `photos` directory with the S3 bucket specified in the `S3_PHOTO_BUCKET` variable. It uploads new files and deletes files that have been removed.
   - Make sure to give execute permissions to the script using `chmod +x deploy.sh` if needed.
3. After running the deployment script, your website will be available at the public URL of your S3 bucket.

**Renaming and Ordering Files:**

S3 displays photos in ascending order based on file names (from smallest to largest, or a to z). To control the display order, ensure your file names reflect the desired order. Here's an example naming strategy:

- For displaying files in the order of creation, prefix the file names with a timestamp: `2023-01-01-01-my-photo.jpg`. The photos will be displayed in ascending order of the timestamp, reflecting their creation order.

Remember to re-run the deployment script whenever you add, remove, or rename files in the `photos` directory to reflect the changes on your website.

## Limitations

- The provided renaming script supports JPEG and MOV file formats. If your photos or videos are in a different format, you may need to convert them or modify the script accordingly.
- The renaming script assumes that JPEG files contain EXIF metadata, and MOV files contain Apple QuickTime metadata for the creation date. If your files lack this metadata or it's incorrect, they may not be sorted correctly.
- In case of files with the same creation time, the renaming script attempts to rename the second file with the same name as the first, resulting in an error. In such cases, manual renaming is required to resolve the conflict.
- The renaming operation performed by the script is not reversible. If you want to revert to the original file names, manual renaming is necessary.
- The script does not support directories or subdirectories and expects all photos and videos to be directly placed in the `photos` directory.
- The script may not handle large numbers of files efficiently, especially if you have thousands of photos or videos. In such cases, it may be slower or fail due to memory constraints.

Feel free to explore and modify the provided script to suit your specific requirements and file formats.

## Conclusion

AWS Photo Stream provides a serverless solution for displaying photos and videos stored in an S3 bucket. With a static frontend hosted on S3, paginated retrieval, and support for multiple file formats, it offers a seamless user experience.

Follow the setup and usage instructions to deploy the application and showcase your photo collection with ease.

We hope you find AWS Photo Stream useful and enjoy displaying your memories in an elegant and interactive way!

## Contributing

Contributions are welcome! If you have any suggestions, feature requests, or bug reports, please open an issue or submit a pull request on the GitHub repository.

## License

This project is licensed under the [MIT License](LICENSE).