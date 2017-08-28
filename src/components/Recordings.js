import React from 'react'
import { Thumbnail } from './Thumbnail'
    
export class Recordings extends React.Component {
    constructor(props) {
        super();
    }
    render() {
        var fileList = [];
        var i=0;
        var files = this.props.files;
        for (var item in files) {
            fileList.push(<div key={i} className='file'><Thumbnail fileaddress={files[item].fileaddress}></Thumbnail><p><a download={files[item].filename} href={files[item].fileaddress}>{files[item].filename}</a></p></div>);
            ++i;
        }
        if (fileList.length != 0) {
            return (
                <div>
                    {fileList}
                </div>
            )
        } else {
            return (
                null
            )
        }
    }
    componentDidMount() {
    }
}
