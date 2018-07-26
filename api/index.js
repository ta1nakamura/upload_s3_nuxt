const express = require("express");
// const aws = require('aws-sdk');
const router = express.Router();
const app = express()
const router_func = require('./func/functions')

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
 * Respond to GET requests to /sign-s3.
 * Upon request, return JSON containing the temporarily-signed S3 request and
 * the anticipated URL of the image.
 */
router.get('/sign-s3', router_func.signs3 )
//====================================================
/**
 * GET TEST
 */
router.get("/test1/:id", router_func.test1);
router.get("/test2/:id", router_func.test2);


module.exports = {
  path: '/api',
  handler: router
}