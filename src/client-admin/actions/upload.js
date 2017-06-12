import {uploadEndpoint} from 'config/paths';

// Actions
export const UPLOAD_BEGIN = 'UPLOAD_BEGIN';




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

        // listen(UPLOAD_REQUEST_RECEIVED, (msg) => msg.tmpId === tmpId, (msg) => {
        //     console.log(msg);
        // });


        const xhr = new XMLHttpRequest();
        xhr.open('post', '/upload', true);

        xhr.setRequestHeader('x-filesize', file.size);
        xhr.setRequestHeader('x-filetype', file.type);
        xhr.setRequestHeader('x-filename', file.name);
        xhr.setRequestHeader('x-filetmpid', tmpId);

        xhr.send(file);

    }
};


