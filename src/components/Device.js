import React, { Component } from 'react';
import { connect } from "react-redux";
import { DEVICES } from '../actions';
import { Link } from 'react-router-dom';

class Device extends Component {

  deleteDevice = (device, index) => {
    this.props.removeDevice(device, index)
  }
  indexEdit = (device, index) => {
    this.props.indexEdit(index)
  }
  render() {
    var device = this.props.data;
    var index = this.props.index;
    return (
      <div className="device-main-box">
        <div className="device-info">
          <span className="device-name">{device.system_name}</span>
          <span className="device-type">{device.type}</span>
          <span className="device-capacity">{device.hdd_capacity} GB</span>
        </div>
        <div className="device-options">
          <Link to={"/devices/edit/"+device.id}>
            <button className="device-edit" onClick={e => this.indexEdit(device, index)}>Edit</button>
          </Link>
          <button className="device-remove" onClick={e => this.deleteDevice(device, index)}>Remove</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({ devices: state.devices });
const mapDispatchToProps = dispatch => DEVICES(dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Device);
