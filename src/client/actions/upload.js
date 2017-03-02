import {listen, unlisten} from 'client/util/ws';
import {uploadEndpoint} from 'client/config/paths';

// Actions
export const UPLOAD_BEGIN = 'UPLOAD_BEGIN';


// Message Events
const UPLOAD_REQUEST_RECEIVED = 'UPLOAD_REQUEST_RECEIVED';


export function uploadFile(file) {

    const blobURL = URL.createObjectURL(file);
    const tmpId = new URL(blobURL.replace(/^blob:/, '')).pathname.replace(/^\//, '');

    return function(dispatch) {
        dispatch({
            type: UPLOAD_BEGIN,
            payload: {
                tmpId: tmpId,
                file: file
            }
        });

        listen(UPLOAD_REQUEST_RECEIVED, (msg) => msg.tmpId === tmpId, (msg) => {
            console.log(msg);
        });


        const xhr = new XMLHttpRequest();
        xhr.open('post', '/upload', true);

        xhr.setRequestHeader('x-filesize', file.size);
        xhr.setRequestHeader('x-filetype', file.type);
        xhr.setRequestHeader('x-filename', file.name);
        xhr.setRequestHeader('x-filetmpid', tmpId);

        xhr.send(file);

    }
};


