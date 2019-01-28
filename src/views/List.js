import React, { Component } from 'react';
import { connect } from "react-redux";
import Device from '../components/Device';
import { DEVICES } from '../actions';
import ListOPtions from '../components/ListOptions';
import { sortCapacity as sort, filterType, filterName } from '../methods'
import '../css/list.css'

class ListDevices extends Component {
  componentDidMount() {
    this.props.getDevices()
  }

  render() {
    var arr = filterType(filterName(this.props.devices, this.props.searchName), this.props.searchbyType)
    sort(arr, this.props.searchbyCapacity);
    return (
      <div className="list-box">
        <ListOPtions />
        <div className="list-devices-main">
          <div className="list-devices">
            {
              arr.map((device, index) => <Device data={device} index={index} key={device.id} />)
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