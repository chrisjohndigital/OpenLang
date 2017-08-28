import React from 'react';
import { render } from 'react-dom';
import { LiveVideo  } from './components/LiveVideo';
import { ControlPanel  } from './components/ControlPanel';
import { Recordings  } from './components/Recordings';
import { Picker  } from './components/Picker';
import { Preferences  } from './components/Preferences';
import './stylesheets/styles.scss';

const log = console.log;
    
class App extends React.Component {
    constructor(props) {
        super();
        this.localStream=null;
        this.remoteStreamElement=null;
        this.currRecording;
        this.recorder=null;
        this.blobArray = [];
        this.blob=null;
        this.mime = ['video/webm', 'audio/ogg'];
        this.ext = ['.webm', '.ogg'],
        this.isRecording = false;
        this.audioCtx = null;
        this.combineRecordings=false;
        this.state = {
            cameraReady: false,
            showPreferences: false,
            recordings: []
        };
        this.toggleRecording= this.toggleRecording.bind(this);
        this.localStreamAvailable= this.localStreamAvailable.bind(this);
        this.remoteStreamElementAvailable= this.remoteStreamElementAvailable.bind(this);
        this.preferencesAvailable= this.preferencesAvailable.bind(this);
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
                        <Picker onRemoteStreamElement={this.remoteStreamElementAvailable}></Picker>
                    </div>
                    <div className={'panel-file-export visibility-' + Number(this.state.cameraReady)}>
                        <div className={'preferences-panel visibility-' + Number(this.state.showPreferences)}>
                            <Preferences onPreferences={this.preferencesAvailable}></Preferences>
                        </div>
                        <Recordings files={this.state.recordings}></Recordings>
                    </div> 
                </div>
            </div>
        );
    }
    localStreamAvailable(mediaStream) {
        if (mediaStream!=null) {
            this.localStream = mediaStream;
            this.setState({
                cameraReady: true
            })
        }
    }
    remoteStreamElementAvailable(ele) {
        if (ele!=undefined) {
            this.remoteStreamElement = ele;
            this.setState({
                showPreferences: true
            })
        }
    }
    preferencesAvailable(preferences) {
        this.combineRecordings=preferences;
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
        if (this.remoteStreamElement==null && this.combineRecordings==false) {
            this.recorder = new window.MediaRecorder(this.localStream);
        } else {
            if (this.audioCtx!=null) {
                (this.audioCtx).close();
            }
            this.audioCtx = new AudioContext();
            var destination = (this.audioCtx).createMediaStreamDestination();
            var sourceNode = (this.audioCtx).createMediaElementSource(this.remoteStreamElement);
            sourceNode.connect(destination);
            sourceNode.connect((this.audioCtx).destination);
            var trackArray = [];
            trackArray = trackArray.concat((this.localStream).getTracks());
            trackArray = trackArray.concat((destination.stream).getAudioTracks()[0]);
            var stream = new MediaStream(trackArray);
            this.recorder = new window.MediaRecorder(stream);   
        }
        var _this = this;
        this.recorder.ondataavailable = event => {
            if (event.data.size > 0) {
                log ('ondataavailable');
                //log (event.data);
                  _this.blobArray.push(event.data);
              }
        }
        this.recorder.onstop = () => {
            _this.recorder = null;
            if (_this.blobArray.length > 0) {
                var blob = new window.Blob(_this.blobArray, {
				  type: _this.mime[0]
			  	});
                _this.readBlob(blob);
            }
        }
    	this.recorder.start();
    }
    recordStop() {
        this.recorder.stop();
    }
    readBlob(blob) {
        log ('readblob');
        log (blob);
        this.blob=blob;
        var d = new Date();
		var n = d.getTime(); 
		blob.lastModifiedDate = d;
    	blob.name = (String(n)) + (String(Math.floor((Math.random() * 100000) + 1)) +this.ext[0]);
		var blobURL = window.URL.createObjectURL(blob);
        var recordings = this.state.recordings;
        recordings.unshift({filename: ((String(recordings.length+1)) + ') ' + blob.name), fileaddress: blobURL});
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