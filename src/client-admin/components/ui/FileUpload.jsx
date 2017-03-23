import React from 'react';
import {connect} from 'react-redux';
import * as uploadActions from 'client-admin/actions/upload';

class FileUpload extends React.Component {
    constructor(props) {
        super(props);
        this.handleFileSelect = this.handleFileSelect.bind(this);
    }

    handleFileSelect(ee) {
        const files = ee.target.files;

        Array.prototype.forEach.call(files, (file) => {
            this.props.dispatch(uploadActions.uploadFile(file));
        });
    }

    render() {
        console.log(this.props.uploads);
        return <div>
            <input type="file" multiple={true} onChange={this.handleFileSelect}/>
        </div>;
    }
}

export default connect((state) => {
    return {
        uploads: state.upload.files
    };
})(FileUpload);