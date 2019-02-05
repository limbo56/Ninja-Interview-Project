import React, { PureComponent, lazy, Suspense } from 'react';
import { connect } from "react-redux";
// import Device from '../components/Device';

import { DEVICES } from '../actions';
import ListOPtions from '../components/ListOptions';
import { filter } from '../methods'

const Device = lazy(() => import('../components/Device'));

class ListDevices extends PureComponent {
  componentDidMount() {
    this.props.getDevices()
  }

  render() {
    const { devices, filter_by } = this.props
    const arr = filter(devices, "type", filter_by)

    return (
      <div className="list-box">
        <header className="App-header">
        </header>
        <ListOPtions />
        <div className="list-devices-main">
          <div className="list-devices">
            <Suspense fallback={<div>Loading...</div>}>
              {
                arr.map((device) =>

                  <Device data={device} key={device.id} />
                )
              }
            </Suspense>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  devices: state.devicesReducer.devices,
  fil_devices: state.devicesReducer.fil_devices,
  filter_by: state.devicesReducer.filter_by,
});
const mapDispatchToProps = dispatch => DEVICES(dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ListDevices);