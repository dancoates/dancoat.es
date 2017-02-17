import React from 'react';

export default class Home extends React.Component {
    render() {
        return <div>
            param is {this.props.params.param}
        </div>;
    }
}

