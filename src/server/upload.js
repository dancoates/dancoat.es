import AWS from 'aws-sdk';
import uuid from 'uuid/v4';
import path from 'path';

const s3 = new AWS.S3();

new AWS.Config({
    credientials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

export default function(request, reply) {
    const filename = uuid() + path.parse(request.payload.filename).ext;
    const stream = request.payload.file;
    const params = {
        Bucket: 'dancoates',
        Key: filename,
        Body: stream,
        ContentType: request.payload.filetype
    };

    const upload = s3.upload(params, {}, (err, data) => {
        if(err) {
            reply(err);
        } else {
            reply(data);
        }
    });

    upload.on('httpUploadProgress', function(progress) {
        console.log(progress);
    });
}