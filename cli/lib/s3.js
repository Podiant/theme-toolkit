const AWS = require('aws-sdk');
const fs = require('fs');

const getEndpointURL = () => {
    const protocol = process.env.PODIANT_SSL === 'false' ? 'http' : 'https';;
    const host = process.env.AWS_S3_HOST || 's3.amazonaws.com';

    return `${protocol}://${host}/`;
};

module.exports = {
    putFile: async (filename, keyName) => {
        const bucketName = process.env.AWS_S3_BUCKET || 'com-podiant';
        const s3 = new AWS.S3(
            {
                apiVersion: '2006-03-01',
                endpoint: getEndpointURL()
            }
        );

        return await s3.putObject(
            {
                Bucket: bucketName,
                Key: keyName,
                Body: fs.readFileSync(filename),
                ACL: 'public-read'
            }
        ).promise();
    }
}
