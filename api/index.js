const express = require("express");
const aws = require('aws-sdk');
const router = express.Router();
const app = express()
// [url is for get req.query]
//  https://github.com/nuxt/nuxt.js/issues/1909
const url = require('url')
router.use((req, res, next) => {
  Object.setPrototypeOf(req, app.request)
  Object.setPrototypeOf(res, app.response)
  req.res = res
  res.req = req
  //add
  req.query = url.parse(req.url, true).query
  next()
})
/*
 * Configure the AWS region of the target bucket.
 * Remember to change this to the relevant region.
 */
aws.config.region = 'ap-southeast-1';
/*
 * Load the S3 information from the environment variables.
 */
const S3_BUCKET = process.env.S3_BUCKET;
console.log('--target S3_BUCKET:',S3_BUCKET)

/*
 * Respond to GET requests to /sign-s3.
 * Upon request, return JSON containing the temporarily-signed S3 request and
 * the anticipated URL of the image.
 */
router.get('/sign-s3', (req, res) => {
  console.log('--sign-s3--')
  const s3 = new aws.S3();
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    console.log('--signedURL:',returnData.url)
    res.write(JSON.stringify(returnData));
    res.end();
  });
});

//====================================================
/**
 * GET TEST
 */
router.get("/test/:id", (req, res) => {
   console.log("--test get");
   console.log("--id " ,req.params.id)
   res.status(200).json({message:`test_id = ${req.params.id}`});
});

module.exports = {
  path: '/api',
  handler: router
}