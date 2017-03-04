import React from 'react'
    
export class ControlPanel extends React.Component {
    constructor(props) {
        super();
        this.state = {
            toggleClick: false,
        };
        this.handleClick = this.handleClick.bind(this);
    }
    render() {
        return (
            <div className={'icon pulse-' + Number(this.state.toggleClick)} onClick={this.handleClick}><img src='assets/images/icon-record.png' alt='' title=''/> </div>
        )
    }
    handleClick() {
        this.props.onToggleRecording();
        this.setState({
            toggleClick: !this.state.toggleClick
        })
    }
    componentDidMount() {
    }
}
