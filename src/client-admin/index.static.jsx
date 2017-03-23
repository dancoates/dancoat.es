import React from 'react';
import manifest from '../../public/manifest.json';

export default class Index extends React.Component {
    render() {
        return <html lang='en'>
            <head>
                <meta charset='UTF-8'/>
                <title>Document</title>
                {process.env.NODE_ENV === 'production' && <link rel='stylesheet' href={`/${manifest['admin.css']}`}/>}
            </head>
            <body>
                <div id='app' dangerouslySetInnerHTML={{__html: this.props.content}}></div>
                {process.env.NODE_ENV === 'production'
                    ? <script src={`/${manifest['admin.js']}`}/>
                    : <script src={`/admin.js`}/>
                }
                
            </body>
        </html>;
    }
}
