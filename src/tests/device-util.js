import fetch from "node-fetch";
import { t } from "testcafe";
import { ReactSelector } from "testcafe-react-selectors";

// Constant pointing to the API endpoint
const API_URL = "http://localhost:3000";

// Placeholder device data to use for tests
export const placeholderDevice = {
  system_name: "Test Workstation",
  type: "WINDOWS_WORKSTATION",
  hdd_capacity: "5",
};

// Properties used to modify a new device during tests
export const modifyDeviceData = {
  system_name: "Renamed Device",
  hdd_capacity: "10",
};

/**
 * Executes an API call to retrieve the list of available devices
 * @returns List of devices
 */
export function fetchDevices() {
  return fetch(API_URL + "/devices")
    .then((res) => res.json())
    .catch((e) => {
      console.error(e);
      throw e;
    });
}

/**
 * Executes an API request to create a device with the {@code data} inputted
 * @param {Object} data of the device
 * @returns Promise of request
 */
export function addDevice(data) {
  return fetch(API_URL + "/devices", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).catch((e) => {
    console.error(e);
    throw e;
  });
}

/**
 * Executes an API request to update a device with a matching {@code deviceId}
 * @param {String} deviceId id of the device to update
 * @param {Object} data new device data
 * @returns Promise of request
 */
export function updateDevice(deviceId, data) {
  return fetch(API_URL + `/devices/${deviceId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: deviceId, ...data }),
  }).catch((e) => {
    console.error(e);
    throw e;
  });
}

/**
 * Executes an API request to remove a device with a matching {@code deviceId}
 * @param {String} deviceId id of the device to update
 * @returns Promise of request
 */
export function removeDevice(deviceId) {
  return fetch(API_URL + `/devices/${deviceId}`, { method: "DELETE" }).catch(
    (e) => {
      console.error(e);
      throw e;
    }
  );
}

/**
 * Returns a {@link ReactSelector} of a Device component in the DOM by matching
 * the properties of the {@code data} prop passed to the component with the properties
 * of the {@code device} object inputted
 * @param {Object} properties properties to find component by
 * @returns ReactSelector of the Device component
 */
export function findDeviceComponentsByProperties(device) {
  const { id, system_name, type, hdd_capacity } = device;
  const data = Object.assign(
    {},
    id != null ? { id } : undefined,
    system_name != null ? { system_name } : undefined,
    type != null ? { type } : undefined,
    hdd_capacity != null ? { hdd_capacity } : undefined
  );
  return ReactSelector("Device").withProps({ data });
}

/**
 * Returns a {@link ReactSelector} of a Device component in the DOM by finding
 * a component with an {@code id} property matching the {@code deviceId} parameter
 * @param {String} deviceId id of the device
 * @returns ReactSelector of the Device component
 */
export function findDeviceComponentById(deviceId) {
  return findDeviceComponentsByProperties({ id: deviceId });
}

/**
 * Retrieves the prop {@code data} that was passed to the {@code deviceComponent}
 * @param {Component} deviceComponent component to retrieve data from
 * @returns Device data
 */
export async function getDeviceDataFromComponent(deviceComponent) {
  const component = await deviceComponent.getReact();
  return component.props.data;
}

/**
 * Parses the device capactiy from its display format
 * Ex:
 * "10 GB" => "10"
 * @param {String} capacity in its display format
 * @returns Parsed capacity
 */
function parseDeviceCapacity(capacity) {
  return capacity.split(" ")[0];
}

/**
 * Checks that the {@code deviceElement} inputted is displaying information
 * that matches the properties of the {@code device}
 * @param {HTMLElement} deviceElement
 * @param {Object} device object containing device data
 */
export async function displayMatchesDevice(deviceElement, device) {
  const {
    id,
    system_name: deviceName,
    type: deviceType,
    hdd_capacity: deviceCapacity,
  } = device;
  const deviceInfo = await deviceElement.child(".device-info");
  const displayName = deviceInfo.child(".device-name").innerText;
  const displayType = deviceInfo.child(".device-type").innerText;
  const displayCapacity = parseDeviceCapacity(
    await deviceInfo.child(".device-capacity").innerText
  );

  // Check that the device information being displayed is correct
  await t
    .expect(displayName)
    .eql(deviceName, `device system name displayed for ${id} matches`)
    .expect(displayType)
    .eql(deviceType, `device type displayed for ${id} matches`)
    .expect(displayCapacity)
    .eql(deviceCapacity, `device hdd capacity displayed for ${id} matches`);
}

/**
 * Checks if the {@code deviceElement} inputted contains both action buttons
 * and that they are visible
 * @param {HTMLElement} deviceElement element displaying the device
 * @param {Object} device object containing device data
 */
export async function hasDeviceActionButtons(deviceElement, device) {
  const { id } = device;
  const deviceOptions = deviceElement.child(".device-options");
  const editButton = deviceOptions.child(".device-edit");
  const remooveButton = deviceOptions.child(".device-remove");

  // Check that both action buttons exist and are visible
  await t
    .expect(editButton.exists)
    .ok(`edit button of device ${id} exists`)
    .expect(editButton.visible)
    .ok(`edit button of device ${id} is visible`)
    .expect(remooveButton.exists)
    .ok(`remove button of device ${id} exists`)
    .expect(remooveButton.visible)
    .ok(`remove button of device ${id} is visible`);
}
