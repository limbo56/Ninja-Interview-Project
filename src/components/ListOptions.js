import React, { Component } from 'react';
import { connect } from "react-redux";
import { DEVICES } from '../actions';
import { Link } from 'react-router-dom';


class ListOPtions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            system_name: "",
            type: "",
            hdd_capacity: ""
        }
    }
    handleChangeName = (event) => {
        this.setState({ system_name: event.target.value }, () => this.props.filterName(this.state.system_name));
    }
    handleChangeType = (event) => {
        this.setState({ type: event.target.value }, () => this.props.filterType(this.state.type));
    }
    handleChangeCapacity = (event) => {
        this.setState({ hdd_capacity: event.target.value }, () => this.props.filterCapacity(this.state.hdd_capacity));
    }
    render() {
        return (
            <div className="list-box">
                <div className="list-options">
                    <Link to="/devices/add" className="submitButton">ADD DEVICE</Link>
                    <div className="list-filters">
                        <div className="filetrname">
                            <label htmlFor="system_name">System Name: </label>
                            <input id="system_name" name="system_name" value={this.state.system_name} onChange={this.handleChangeName} />
                        </div>
                        <div className="filtertype">
                            <label htmlFor="type">Device Type: </label>
                            <select id="type" name="type" value={this.state.type} onChange={this.handleChangeType}>
                                <option value="ALL">ALL</option>
                                <option value="WINDOWS_WORKSTATION">WINDOWS WORKSTATION</option>
                                <option value="WINDOWS_SERVER">WINDOWS SERVER</option>
                                <option value="MAC">MAC</option>
                            </select>
                        </div>
                        <div className="filtercapacity">
                            <label htmlFor="hdd_capacity">Short by: </label>
                            <select id="hdd_capacity" name="hdd_capacity" value={this.state.hdd_capacity} onChange={this.handleChangeCapacity}>
                                <option value="HDD CAPACITY">HDD CAPACITY</option>
                                <option value="LOW TO HIGH">LOW TO HIGH</option>
                                <option value="HIGH To LOW">HIGH To LOW</option>
                            </select>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

const mapStateToProps = state => ({ devices: state.devices });
const mapDispatchToProps = dispatch => DEVICES(dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ListOPtions);