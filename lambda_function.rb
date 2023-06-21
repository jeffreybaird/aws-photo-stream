require 'json'
require 'aws-sdk-s3'

def lambda_handler(event:, context:)
  s3_client = Aws::S3::Client.new(region: 'us-east-2')
  s3_resource = Aws::S3::Resource.new(client: s3_client)
  bucket_name = 'photo-stream-2'  # Replace with your bucket name
  page_size = 10  # Number of items to retrieve per page
  page_token = extract_page_token(event)
  page_token = page_token.empty? ? nil : page_token

  begin
    bucket = s3_resource.bucket(bucket_name)
    items = []

    # Retrieve photos with pagination
    response = s3_client.list_objects_v2(bucket: bucket_name, max_keys: page_size, continuation_token: page_token)

    response.contents.each do |object|
      presigned_url = bucket.object(object.key).presigned_url(:get_object)
      items << {
        url: presigned_url
      }
    end

    response = {
      statusCode: 200,
      body: {
                    items: items,
                    nextPageToken: response.next_continuation_token
                  }.to_json
    }
  rescue StandardError => e
    response = {
      statusCode: 500,
      body: { error: e.message }.to_json
    }
  end

  response
end

def extract_page_token(event)
  # Decode the Base64-encoded string
  decoded_body = Base64.decode64(event['body'])

  # Parse the URL-encoded string
  decoded_params = URI.decode_www_form(decoded_body)

  # Extract the pageToken parameter value
  page_token = decoded_params.find { |param| param[0] == 'pageToken' }&.[](1)

  # Return the extracted pageToken value
  page_token
end
