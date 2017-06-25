// @flow
// import AWS from 'aws-sdk';
import uuid from 'uuid/v4';
import path from 'path';
import os from 'os';
import fs from 'fs';
import Request from 'hapi/lib/request';
import Reply from 'hapi/lib/request';

// const s3 = new AWS.S3();

// new AWS.Config({
//     credientials: {
//         accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//         secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
//     }
// });

/*

Next steps:

- Identify client from auth token
- Get upload progress working
- Get gzip working on nginx??
- Get a message reporting back to the client

- resumable uploads?

- Need to work out where application state is kept... what happens when you
  are halfway through image processing and you reload the page?

- Also need to restructure files as there is going to be a bunch of overlap between server/client and api

*/


export default function(request: Request, reply: Reply) {

    const fileInfo = {
        name: request.headers['x-filename'],
        type: request.headers['x-filetype'],
        size: request.headers['x-filesize'],
        tmpId: request.headers['x-filetmpid']
    };

    console.log(fileInfo);

    let sizeRead = 0;

    const stream = request.payload;
    const filename = uuid() + path.parse(fileInfo.name).ext;
    const tmpPath = path.resolve(os.tmpdir(), filename);

    console.log('uploading to ' + tmpPath);

    stream.on('data', (chunk: Buffer) => {
        sizeRead += chunk.byteLength;

        console.log((sizeRead / fileInfo.size) * 100);
    });

    stream.on('end', () => reply({success: 'true'}));
    stream.pipe(fs.createWriteStream(tmpPath));
    
    // const params = {
    //     Bucket: 'dancoates',
    //     Key: filename,
    //     Body: stream,
    //     ContentType: request.payload.filetype
    // };

    // const upload = s3.upload(params, {}, (err, data) => {
    //     if(err) {
    //         reply(err);
    //     } else {
    //         reply(data);
    //     }
    // });

    // upload.on('httpUploadProgress', function(progress) {
    //     console.log(progress);
    // });
}