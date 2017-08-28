import React from 'react'
import prefs from '../text/prefs.json'
    
export class LiveVideo extends React.Component {
    constructor(props) {
        super();
        this.mediaStream=null;
        this.cameraConnectAttempt=0;
        this.cameraConnectAttemptLimit=5;
         this.state = {
            cameraReady: false
        };
        this.cameraReady = this.cameraReady.bind(this);
        this.connectToCamera = this.connectToCamera.bind(this);
        this.fallbackResolution = this.fallbackResolution.bind(this);
        this.timer = null;
    }
    render() {
        return (
            <video className='camera' id="camera" width={prefs.config1.width} height={prefs.config2.height} autoPlay></video>
        )
    }
    cameraReady(pref=prefs.config1) {
        console.log ('cameraReady, cancelling all timers');
        console.log ('Connection attempts: ' + this.cameraConnectAttempt);
        clearInterval(this.timer);
        this.setState({
            cameraReady: true
        })
        this.props.onLocalStream(this.mediaStream);
    }
    componentDidMount() {
        if (document.getElementById('camera')!=undefined) {
            document.getElementById('camera').addEventListener('canplay', this.cameraReady);
            this.connectToCamera();
        }
    }
    connectToCamera(pref=prefs.config1) {
        console.log ('connectToCamera');
        ++this.cameraConnectAttempt;
        var _this = this;
        var video_constraints = {
            width: { min: pref.width, ideal: pref.width, max: pref.width },
            height: { min: pref.height, ideal: pref.height, max: pref.height }
        };
        var device = navigator.mediaDevices.getUserMedia({audio: false, video: video_constraints});
        device.then(function(mediaStream) {
            console.log ('Device response but camera not yet ready');
            //document.getElementById('camera').setAttribute('src', window.URL.createObjectURL(mediaStream)); //Deprecated
            document.getElementById('camera').srcObject = mediaStream;
            _this.mediaStream = mediaStream;
            console.log ('Setting interval to check camera is ready');
            _this.timer = setInterval(_this.fallbackResolution, 10000);
        });
        device.catch(function(err) {
            console.log ('Device connect error, Number of connect attempts: ' + _this.cameraConnectAttempt  + ' Total attempts allowed: ' + _this.cameraConnectAttemptLimit);
            if (_this.cameraConnectAttempt < _this.cameraConnectAttemptLimit) {
                console.log ('Attempting to connect again...');
                setTimeout(function(){ 
                    console.log ('Trying different camera resolution...');
                    if ((prefs['config'+(String(_this.cameraConnectAttempt+1))])!=undefined) {
                        _this.connectToCamera(prefs['config'+(String(_this.cameraConnectAttempt+1))]); 
                    } else {
                        _this.connectToCamera();   
                    }
                }, 3000);
            } else {
                console.log ('Giving up connection attempts');
                console.log ('Connection attempts: ' + _this.cameraConnectAttempt);
                alert (err);
            }
        }); 
    }
    fallbackResolution() {
        console.log ('fallbackResolution: cameraReady: ' + this.state.cameraReady);
        clearInterval(this.timer);
        if (this.state.cameraReady==false && this.cameraConnectAttempt < this.cameraConnectAttemptLimit) {
            console.log ('Starting again');
            this.mediaStream.getVideoTracks()[0].stop();
            this.mediaStream = null;
            document.getElementById('camera').setAttribute('src', null)
            this.connectToCamera(prefs.fallback);
        } else {
            console.log ('Giving up connection attempts');
            alert ('Unable to connect to camera');
        }
    }
}
