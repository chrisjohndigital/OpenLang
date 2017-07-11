import React from 'react'
    
export class Preferences extends React.Component {
    constructor(props) {
        super();
        this.state = {
            value: false
        };
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(event) {
        this.props.onPreferences(!this.state.value);
        this.setState({
            value: !this.state.value
        });
    }
    render() {
        return (
            <div>
                <form onSubmit="" action="">
                    <label>
                    Record as simultaneous interpretation:
                    <input type="checkbox" name="dub" value="on" onChange={this.handleChange} />
                    </label>
                </form>
            </div>
        )
    }
    componentDidMount() {
    }
}
