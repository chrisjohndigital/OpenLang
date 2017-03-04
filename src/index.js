import React from 'react'
import { render } from 'react-dom'
import { LiveVideo  } from './components/LiveVideo'
import { ControlPanel  } from './components/ControlPanel'
import { Recordings  } from './components/Recordings'
import { Picker  } from './components/Picker'
import './stylesheets/styles.scss'

const log = console.log;
    
class App extends React.Component {
    constructor(props) {
        super();
        this.mediaStream=null;
        this.currRecording;
        this.recorder=null;
        this.blobArray = [];
        this.blob=null;
        this.mime = 'video/webm';
        this.ext = '.webm',
        this.isRecording = false;
        this.state = {
            cameraReady: false,
            recordings: []
        };
        this.toggleRecording= this.toggleRecording.bind(this);
        this.localStreamAvailable= this.localStreamAvailable.bind(this);
        this.recordStart = this.recordStart.bind(this);
        this.recordStop = this.recordStop.bind(this);
        this.readBlob = this.readBlob.bind(this);
        this.calculateScaling = this.calculateScaling.bind(this);
        this.onResize = this.onResize.bind(this);
        this.setScale = this.setScale.bind(this);
        this.setScalePosition = this.setScalePosition.bind(this);
        window.addEventListener('resize', this.onResize, false)
    }
    render() {
        return (
            <div className='container'>
                <div className='panel-left'>
                    <LiveVideo onLocalStream={this.localStreamAvailable}></LiveVideo>
                    <div className={'panel-control-panel visibility-' + Number(this.state.cameraReady)}>
                        <ControlPanel onToggleRecording={this.toggleRecording}></ControlPanel>
                    </div>
                </div>
                <div className='panel-right'>
                    <div className={'panel-file-import visibility-' + Number(this.state.cameraReady)}>
                        <Picker></Picker>
                    </div>
                    <div className={'panel-file-export visibility-' + Number(this.state.cameraReady)}>
                        <Recordings files={this.state.recordings}></Recordings>
                    </div> 
                </div>
            </div>
        );
    }
    localStreamAvailable(mediaStream) {
        this.mediaStream = mediaStream;
        this.setState({
            cameraReady: true
        })
    }
    toggleRecording() {
        if (this.isRecording==false) {
            this.isRecording=true;
            this.recordStart();
        } else {
            this.isRecording=false;
            this.recordStop();
        }
    }
    recordStart() {
        this.blobArray = []
        this.recorder = new window.MediaRecorder(this.mediaStream);
        var _this = this;
		  this.recorder.ondataavailable = function(event) {
              if (event.data.size > 0) {
                  _this.blobArray.push(event.data);
              }
          };
        this.recorder.onstop = function() {
            _this.recorder = null;
            if (_this.blobArray.length > 0) {
                var blob = new window.Blob(_this.blobArray, {
				  type: _this.mime
			  	});
                _this.readBlob(blob);
            }
        };
    	this.recorder.start();
    }
    recordStop() {
        this.recorder.stop();
    }
    readBlob(blob) {
        this.blob=blob;
        var d = new Date();
		var n = d.getTime(); 
		blob.lastModifiedDate = d;
    	blob.name = (String(n)) + (String(Math.floor((Math.random() * 100000) + 1)) +this.ext);
		var blobURL = window.URL.createObjectURL(blob);
        var recordings = this.state.recordings;
        recordings[recordings.length] = {filename: blob.name, fileaddress: blobURL}
        this.setState({
            recordings: recordings
        })
    }
    componentDidMount() {
        this.calculateScaling();
    }
    onResize (){
        this.calculateScaling();
    }
    calculateScaling (){
        if (document.getElementById('react-container')!=undefined) {
            if ((((window.innerWidth*100)/document.getElementById('react-container').clientWidth)/100) > 1) {
                this.setScale(document.getElementById('react-container'));
                this.setScalePosition (document.getElementById('react-container'));
            } else {
                this.setScale (document.getElementById('react-container'), (((window.innerWidth*100)/document.getElementById('react-container').clientWidth)/100));
                this.setScalePosition (document.getElementById('react-container'), 'left top 0');
            }
        }
    }
    setScale (target, scaleAmount=1){
        target.style.transform = 'scale('+scaleAmount+')';
        target.style.WebkitTransform = 'scale('+scaleAmount+')';
        target.style.msTransform = 'scale('+scaleAmount+')';
    }
    setScalePosition(target, scaleAmount='center top 0') {
        target.style.transformOrigin = scaleAmount;
        target.style.WebkitTransformOrigin = scaleAmount;
        target.style.msTransformOrigin = scaleAmount;
    }
}

render(
    <App></App>,
    document.getElementById('react-container')
);