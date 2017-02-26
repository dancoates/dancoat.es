import React from 'react';

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.handleFileSelect = this.handleFileSelect.bind(this);
    }

    handleFileSelect(ee) {
        const files = ee.target.files;

        Array.prototype.forEach.call(files, (file) => {
            const data = new FormData();
            data.append('file', file);
            data.append('filename', file.name);
            data.append('filetype', file.type);
            data.append('filesize', file.size);

            const xhr = new XMLHttpRequest();

            xhr.open('post', '/upload', true);

            xhr.onprogress = function(ee) {
                var percentComplete = (ee.loaded / ee.total)*100;
                console.log(percentComplete);
            };

            xhr.send(data);

            
        });


    }

    render() {
        return <div>
            <input type="file" multiple={true} onChange={this.handleFileSelect}/>
        </div>;
    }
}
