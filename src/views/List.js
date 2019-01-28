import React, { Component } from 'react';
import { connect } from "react-redux";
import Device from '../components/Device';
import { DEVICES } from '../actions';
import ListOPtions from '../components/ListOptions';
import { sortCapacity as sort, filterType, filterName } from '../methods'


class ListDevices extends Component {
  componentDidMount() {
    this.props.getDevices()
  }
  
  render() {
    const { devices, searchName, searchbyType, searchbyCapacity} = this.props
    const arr = filterType(filterName(devices, searchName), searchbyType)
    sort(arr, searchbyCapacity);
    return (
      <div className="list-box">
        <ListOPtions />
        <div className="list-devices-main">
          <div className="list-devices">
            {
              arr.map((device) => <Device data={device} key={device.id} />)
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  devices: state.devices,
  searchbyCapacity: state.searchbyCapacity,
  searchbyType: state.searchbyType,
  searchName: state.searchName
});
const mapDispatchToProps = dispatch => DEVICES(dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ListDevices);