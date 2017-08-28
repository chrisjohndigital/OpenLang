import React from 'react'
import prefs from '../text/prefs.json'
    
export class Thumbnail extends React.Component {
    constructor(props) {
        super();
    }
    render(pref=prefs.thumbnail) {
        var fileaddress = this.props.fileaddress;
        return (
            <div>
            <video width={pref.width} height={pref.height} src={fileaddress}></video>
            </div>
        )
    }
    componentDidMount() {
    }
}
