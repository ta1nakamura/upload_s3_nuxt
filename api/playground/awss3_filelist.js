const aws = require('aws-sdk');
require("dotenv").config(); 
// aws.config.region = 'ap-southeast-1';
aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region:'ap-southeast-1',
})
const S3_BUCKET = process.env.S3_BUCKET;
const s3 = new aws.S3();
const s3Params = {
    'Bucket': S3_BUCKET,
    'Prefix': '002',
    // 'StartAfter': '002',
};
s3.listObjectsV2(s3Params, function(err, data) {
    if(err){
        console.log('--err--',err)
    }
    // console.log(data.Contents)
    //pluck [Key]
    let res = data.Contents.map(value => {
        let filepath=value['Key']
        return  `https://${S3_BUCKET}.s3.amazonaws.com/${filepath}`
    })
    console.log(res)
    //make url
});