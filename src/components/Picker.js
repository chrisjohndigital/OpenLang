import React from 'react'
    
export class Picker extends React.Component {
    constructor(props) {
        super();
        this.srcWidth=640;
        this.srcHeight=360;
        this.mimeTypes = ['audio/mp3', 'audio/mpeg', 'video/mp4']
        this.fileDragOver = this.fileDragOver.bind(this);
        this.fileDragDrop = this.fileDragDrop.bind(this);
    }
    render() {
        return (
        <div>
            <div id='player' className='player'>
            </div>
            <div id='picker' className='picker'>
        </div>
        </div>
        )
    }
    componentDidMount() {
        if (document.getElementById('picker')!=null) {
            document.getElementById('picker').addEventListener('dragover', this.fileDragOver);
            document.getElementById('picker').addEventListener('drop', this.fileDragDrop);
        }
    }
    fileDragOver(event) {
        event.stopPropagation();
    	event.preventDefault();
		if (event.dataTransfer!=undefined) {
			event.dataTransfer.dropEffect = 'copy';
		} else if (event.originalEvent.dataTransfer!=undefined) {
			event.originalEvent.dataTransfer.dropEffect = 'copy';
		}
    }
    fileDragDrop(event) {
        event.stopPropagation();
    	event.preventDefault();
        if (event.dataTransfer!=undefined) {
            var files = event.dataTransfer.files;
		} else if (event.originalEvent.dataTransfer!=undefined) {
            var files = event.originalEvent.dataTransfer.files;
		}
		if (files.length > 0) {
            var file = files[0];
            this.processFile(file);
		}
    }
    processFile(file) {
        if (file.type==this.mimeTypes[0] || file.type==this.mimeTypes[1]) {   
            this.loadFile(file, file.type, 'audio');
        } else if (file.type==this.mimeTypes[2]) {
            this.loadFile(file, file.type, 'video');
        } else {
            alert ('Sorry, only mp3 or mp4 files allowed');
        }
    }
    loadFile(file, mimeType, fileType) {
        var reader = new FileReader();
        reader.onloadend = event => {
            if (event.target.readyState == FileReader.DONE) {
                console.log (event.target.result);
                var sourceTag='<source src="'+event.target.result+'" type="'+mimeType+'">';
                var mediatag = '<' + fileType + ' id="picker-media" width="'+this.srcWidth+'" height="'+this.srcHeight+'" controls autoplay>'+sourceTag+'</' + fileType + '>';
                document.getElementById('player').innerHTML = mediatag;
            }
            reader = null;
            this.props.onRemoteStreamElement(document.getElementById('picker-media'));
        }
        reader.readAsDataURL(file);
    }
}
