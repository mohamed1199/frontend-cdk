import * as cdk from 'aws-cdk-lib';
import { CfnCloudFrontOriginAccessIdentity, CfnOriginAccessControl, CloudFrontAllowedCachedMethods, CloudFrontAllowedMethods, CloudFrontWebDistribution, OriginAccessIdentity } from 'aws-cdk-lib/aws-cloudfront';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { BlockPublicAccess, Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';
import path = require('path');


export class FrontendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new Bucket(this, "Bucket", {
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "error.html",
      bucketName: "med.frontend.cdk",
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    })

    const deployment = new BucketDeployment(this, 'ReactAppDeployment', {
      sources: [Source.asset("./build")], // path to your React app build directory
      destinationBucket: bucket,
    });

    const oai = new OriginAccessIdentity(this, "oai");

    const cdn = new CloudFrontWebDistribution(this, 'CloudFrontDistribution', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket,
            originAccessIdentity: oai
          },
          behaviors: [{ isDefaultBehavior: true }],
        },
      ],
      defaultRootObject: 'index.html'
    });

    const cloudfrontAccessPolicy = new PolicyStatement();
    cloudfrontAccessPolicy.addActions("s3:GetObject");
    cloudfrontAccessPolicy.addPrincipals(oai.grantPrincipal);
    cloudfrontAccessPolicy.addResources(bucket.arnForObjects("*"));
    bucket.addToResourcePolicy(cloudfrontAccessPolicy);


  }
}
