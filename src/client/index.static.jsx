import React from 'react';

export default class Index extends React.Component {
    render() {
        return <html lang="en">
            <head>
                <meta charset="UTF-8"/>
                <title>Document</title>
            </head>
            <body>
                <div id="app" dangerouslySetInnerHTML={{__html: this.props.content}}>
                </div>
                
                <script src='/bundle.js'/>
            </body>
        </html>;
    }
}
