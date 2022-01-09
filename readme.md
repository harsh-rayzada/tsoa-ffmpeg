## This is the assignment project of PixCap

### Objective of the project
1. Create an Dockerized API using ExpressJs in Typescript. The purpose of the API is to use ffmpeg to extract an image at a given timestamp for a given video.
2. The API should have an endpoint at `GET http://localhost:8070/ffmpeg/image?timestamp=${TIMESTAMP_IN_SECONDS}&url=${VIDEO_URL}`.
3. A url to a video (mp4/webm) and timestamp in seconds will be provided as the url query parameters. The API must extract an image at the given timestamp without downloading the video to disk or any directory within the container. The image should be base64 encoded and returned in the response body.
4. A valid request is: `http://localhost:8070/ffmpeg/image?timestamp=1&url=https://public-anios-dev.s3.ap-southeast-1.amazonaws.com/jungle_3s.mp4`
5. Timestamp: 1 seconds
6. Video URL: https://public-anios-dev.s3.ap-southeast-1.amazonaws.com/jungle_3s.mp4
7. There should be an npm command for me to build the docker image locally.

#### This project is built on Typesript using tsoa and Express

### The command to run this project is "npm run live"

### The command to generate the docker image locally is "npm run generate-image"

### The API endpoint is 
`http://localhost:8070/ffmpeg/image/{TIMESTAMP_IN_SECONDS}?videoUrl={VIDEO_URL}`