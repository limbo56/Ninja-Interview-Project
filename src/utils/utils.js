import fetch from "node-fetch";
import { Selector, t } from "testcafe";
import { ReactSelector } from "testcafe-react-selectors";
import { filter } from "../methods";
import { API_URL } from "./constants";

/**
 * Executes an API call to retrieve the list of available devices
 * @returns List of devices
 */
export function fetchDevices() {
  return fetch(API_URL + "/devices").catch((e) => {
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

/**
 * Filters a list of devices by their {@code type} property.
 * @see {@link filter}
 * @param {Array} devices list of devices
 * @param {String} type property to only include in the resulting array
 * @returns Filtered array
 */
export function filterDevicesByType(devices, type) {
  return filter(Array.from(devices), "type", type);
}

/**
 * Selects the option containing the {@code text} inputted in a select element
 * @param {*} selectElement selector pointing to the select element
 * @param {*} options selector of avaialble options of the select
 * @param {String} text string value of one of the options
 * @returns Promise
 */
export function selectOption(selectElement, options, text) {
  return t.click(selectElement).click(options.withText(text));
}

/**
 * Executes an API call to retrieve the list of available devices
 * while asserting that the response was succesful and that the results are not null
 * @returns List of retrieved devices
 */
export async function assertFetchDevices() {
  // Fetch device list and check if the request was succesful
  const response = await fetchDevices();
  await t
    .expect(response.status)
    .eql(200, "device list fetch request is succesful");

  // Parse json response and check if device list is not null
  const devices = await response.json();
  await t.expect(devices).notEql(null, "device list fetched is not null");
  return devices;
}

/**
 * Retrieves all the Device components from the DOM and asserts if the order in which
 * the components are rendered matches the order of the {@code devices} list inputted
 * @param {Array} devices array of devices with expected order
 */
export async function deviceDisplayMatchesOrder(devices) {
  // Retrieve all Device components and check if the length matches
  const deviceComponents = await ReactSelector("ListDevices").findReact(
    "Device"
  );
  await t.expect(deviceComponents.count).eql(devices.length);

  // Check if the devices are on the same order as the device list inputted
  for (let i = 0; i < devices.length; i++) {
    const device = devices[i];
    const component = deviceComponents.nth(i);
    const componentData = await getDeviceDataFromComponent(component);

    // Check if the id of the device from the list matches the one in the component data
    await t
      .expect(componentData.id)
      .eql(device.id, `device id matches with component id at index ${i}`);
  }
}

function normalizeDeviceType(type) {
  return type.split("_").join(" ");
}

/**
 * Optionally fills the fields provided in the {@code data} if they are present and
 * then submits the form
 * @param {Object} data object containing the data to fill out the form
 */
export async function submitDeviceForm(data) {
  const {
    system_name: deviceName,
    type: deviceType,
    hdd_capacity: deviceCapacity,
  } = data;
  const deviceForm = Selector(".device-form");

  // Check that the create device form exists
  await t.expect(deviceForm.exists).ok("create device form exists");

  // Fill system name
  const nameInput = Selector("#system_name");
  if (deviceName != null) {
    await t
      .selectText(nameInput)
      .pressKey("delete")
      .typeText(nameInput, deviceName)
      .expect(nameInput.value)
      .eql(deviceName, "device name of create device form matches");
  }

  // Select system type
  const typeSelect = Selector("#type");
  const typeOptions = typeSelect.find("option");
  if (deviceType != null) {
    await selectOption(typeSelect, typeOptions, normalizeDeviceType(deviceType))
      .expect(typeSelect.value)
      .eql(deviceType, "device type of create device form matches");
  }

  // Fill system capacity
  const capacityInput = Selector("#hdd_capacity");
  if (deviceCapacity != null) {
    await t
      .selectText(capacityInput)
      .pressKey("delete")
      .typeText(capacityInput, deviceCapacity)
      .expect(capacityInput.value)
      .eql(deviceCapacity, "device capacity of create device form matches");
  }

  // Check that the submit button exists and submit the form
  const submitButton = deviceForm.find(".changebutton .submitButton");
  await t
    .expect(submitButton.exists)
    .ok("submit button of device form exists")
    .click(submitButton);
}
