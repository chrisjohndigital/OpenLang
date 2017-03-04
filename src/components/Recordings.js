import React from 'react'
    
export class Recordings extends React.Component {
    constructor(props) {
        super();
    }
    render() {
        var fileList = [];
        var i=0;
        var files = this.props.files;
        for (var item in files) {
            fileList.push(<p key={i} className='file'><a download={files[item].filename} href={files[item].fileaddress}>{files[item].filename}</a></p>);
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
