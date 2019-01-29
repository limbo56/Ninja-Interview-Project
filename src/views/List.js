import React, { Component } from 'react';
import { connect } from "react-redux";
import Device from '../components/Device';
import { DEVICES } from '../actions';
import ListOPtions from '../components/ListOptions';
import {  sort, filter } from '../methods'


class ListDevices extends Component {
  componentDidMount() {
    this.props.getDevices()
  }
  
  render() {
    const { devices, filter_by, sort_by} = this.props
    const filter_arr = filter(devices,"type", filter_by)
    const sort_arr = sort(filter_arr, sort_by)


    return (
      <div className="list-box">
        <ListOPtions />
        <div className="list-devices-main">
          <div className="list-devices">
            {
              sort_arr.map((device) => <Device data={device} key={device.id} />)
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  devices: state.devices,
  filter_by: state.filter_by,
  sort_by: state.sort_by
});
const mapDispatchToProps = dispatch => DEVICES(dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ListDevices);