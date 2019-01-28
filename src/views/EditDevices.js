import React, { Component } from 'react';
import { connect } from "react-redux";
import { DEVICES } from '../actions';
import { Link } from 'react-router-dom';
import { withAlert } from 'react-alert'
import '../css/deviceform.css';

class EditDevice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            system_name: "",
            type: "",
            hdd_capacity: ""
        }
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }
    onSubmit = (event) => {
        if (this.state.system_name.length > 0 && parseInt(this.state.hdd_capacity) > 0) {
            this.props.updateDevice({
                id: this.state.id,
                system_name: this.state.system_name,
                type: this.state.type,
                hdd_capacity: this.state.hdd_capacity
            })
        }
        else {
            event.preventDefault();
            this.props.alert.show('No empty fields allowed!')
        }
    }


    componentWillMount() {

        this.props.getDevice(this.props.match.params.id, () => {
            var device_edit = this.props.devicetoedit
            this.setState({
                id: device_edit.id,
                system_name: device_edit.system_name,
                type: device_edit.type,
                hdd_capacity: device_edit.hdd_capacity
            })
        })


    }
    render() {

        return (
            <div className="device-form-container">
                <div className="device-form">
                    <h3>UPDATE DEVICE</h3>
                    <label htmlFor="system_name">System Name</label>
                    <input id="system_name" name="system_name" value={this.state.system_name} onChange={this.handleChange} />
                    <label htmlFor="type">Type</label>
                    <select id="type" name="type" value={this.state.type} onChange={this.handleChange}>
                        <option value="WINDOWS_WORKSTATION">WINDOWS WORKSTATION</option>
                        <option value="WINDOWS_SERVER">WINDOWS SERVER</option>
                        <option value="MAC">MAC</option>
                    </select>
                    <label htmlFor="hdd_capacity">HDD Capacity(GB)</label>
                    <input id="hdd_capacity" name="hdd_capacity" value={this.state.hdd_capacity} onChange={this.handleChange} />
                    <Link className="changebutton" to="/">
                        <button className="submitButton" onClick={this.onSubmit}>UPDATE</button>
                    </Link>
                </div>
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {
        devices: state.devices,
        devicetoedit: state.devicetoedit
    };
};
const mapDispatchToProps = dispatch => DEVICES(dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(withAlert(EditDevice));