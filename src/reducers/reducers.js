const initialState = () => ({
  devices: [],
  searchName: "",
  searchbyType: "ALL",
  searchbyCapacity: 0,
  devicetoedit: null,
});

const addDevice = (state, { device }) => ({
  ...state,
  devices: state.devices.concat(device)
});

const getDevices = (state, { devices }) => ({
  ...state,
  devices
});

const getDevice = (state, { device }) => ({
  ...state,
  devicetoedit: device
});

const removeDevice = (state, { device }) => ({
  ...state,
  devices: state.devices.filter(({ id }) => id !== device.id)
});

const updateDevices = (state, { device }) => (
  { ...state })

const filterCapacity = (state, { value }) => ({
  ...state,
  searchbyCapacity: value
});

const filterType = (state, { value }) => ({
  ...state,
  searchbyType: value
});

const filterName = (state, { value }) => ({
  ...state,
  searchName: value
});

function rootReducer(state = initialState(), action) {
  switch (action.type) {
    case "ADD_DEVICE":
      return addDevice(state, action)
    case "REMOVE_DEVICE":
      return removeDevice(state, action)
    case "GET_DEVICES":
      return getDevices(state, action)
    case "GET_DEVICE":
      return getDevice(state, action)
    case "UPDATE_DEVICES":
      return updateDevices(state, action)
    case "FILTER_CAPACITY":
      return filterCapacity(state, action)
    case "FILTER_TYPE":
      return filterType(state, action)
    case "FILTER_NAME":
      return filterName(state, action)
    default:
      return state;
  }
};
export default rootReducer;