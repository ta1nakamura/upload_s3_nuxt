
const aws = require('aws-sdk');
aws.config.region = 'ap-southeast-1';

/*
 * Configure the AWS region of the target bucket.
 * Remember to change this to the relevant region.
 */
aws.config.region = 'ap-southeast-1';
/*
 * Load the S3 information from the environment variables.
 */
const S3_BUCKET = process.env.S3_BUCKET;

/*
 * Respond to GET requests to /sign-s3.
 * Upon request, return JSON containing the temporarily-signed S3 request and
 * the anticipated URL of the image.
 */
signs3 = (req,res)=>{
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
}

/**
 * Test Function
 */
test1 = (req,res)=>{
    console.log("--test 1 get separated");
    console.log("--id " ,req.params.id)
    res.status(200).json({message:`test1_id = ${req.params.id}`});
}

test2 = (req,res)=>{
    console.log("--test 2 get separated");
    console.log("--id " ,req.params.id)
    res.status(200).json({message:`test2_id = ${req.params.id}`});
}


module.exports = {
    signs3,
    test1 , 
    test2 ,
}