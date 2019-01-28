import { fetcher } from '../methods';

const server = "http://localhost:3000";

export const DEVICES = (dispatch) => ({
  getDevices: async () => {
    const devices = await fetcher(server + "/devices", "GET")
    if (devices) {
      dispatch({ type: "GET_DEVICES", devices })
    }
  },
  getDevice: async (id, callback) => {
    const device = await fetcher(server + "/devices/" + id, "GET")
    if (device) {
      dispatch({ type: "GET_DEVICE", device })
      callback()
    }
  },
  addDevice: async (new_device) => {
    const device = await fetcher(server + "/devices", "POST", new_device)
    if (device) {
      dispatch({ type: "ADD_DEVICE", device })
    }
  },
  removeDevice: async (device, index) => {
    const response = await fetcher(server + "/devices/" + device.id, "DELETE")
    if (response === 1) {
      dispatch({ type: "REMOVE_DEVICE", index })
    }
  },
  updateDevice: async (device) => {
    const response = await fetcher(server + "/devices/" + device.id, "PUT", device)
    if (response === 1) {
      dispatch({ type: "UPDATE_DEVICES", device })
    }
  },
  indexEdit: (index) => {
    dispatch({ type: "INDEX_EDIT", index });
  },
  filterCapacity: (value) => {
    dispatch({ type: "FILTER_CAPACITY", value })
  },
  filterType: (value) => {
    dispatch({ type: "FILTER_TYPE", value })
  },
  filterName: (value) => {
    dispatch({ type: "FILTER_NAME", value })
  },
});

