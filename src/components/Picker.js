import React from 'react'
    
export class Picker extends React.Component {
    constructor(props) {
        super();
        this.fileDragOver = this.fileDragOver.bind(this);
        this.fileDragDrop = this.fileDragDrop.bind(this);
    }
    render() {
        return (
        <div>
        <div id='picker' className='picker'>
        </div>
        <div id='player' className='player'>
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
        if (file.type=="audio/mp3" || file.type=="audio/mpeg") {          
            var reader = new FileReader();
            reader.onloadend = (function(event) {
                if (event.target.readyState == FileReader.DONE) {    
                    var sourceTag='<source src="'+event.target.result+'" type="audio/mp3">';
                    var mediatag = '<audio controls autoplay>'+sourceTag+'</audio>';
                    document.getElementById('player').innerHTML = mediatag;
                }
                reader = null;
            });
		  reader.readAsDataURL(file);
        } else {
            alert ('Sorry, only mp3 files allowed');
        }
    }
}
