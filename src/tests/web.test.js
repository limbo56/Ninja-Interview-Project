import { Selector } from "testcafe";
import { sort } from "../methods";
import {
  CREATE_DEVICE_DATA,
  MODIFY_DEVICE_DATA,
  WEB_URL,
  getDeviceDataFromComponent,
  findDeviceComponentById,
  findDeviceComponentsByProperties,
  displayMatchesDevice,
  assertFetchDevices,
  hasDeviceActionButtons,
  filterDevicesByType,
  selectOption,
  deviceDisplayMatchesOrder,
  submitDeviceForm,
} from "../utils";

fixture`Device list display`.page(WEB_URL);

/**
 * Extra
 */
test("Device list existence and visibility", async (t) => {
  // Find device list element, then check if it exists and is visible
  const deviceList = Selector(".list-devices");
  await t
    .expect(deviceList.exists)
    .ok("device list element exists")
    .expect(deviceList.visible)
    .ok("device list is visible");
});

/**
 * Test 1
 */
test("Device information display", async (t) => {
  const devices = await assertFetchDevices();

  for (const device of devices) {
    const deviceComponent = await findDeviceComponentById(device.id);

    // Perform checks on the device element
    // 1 - Device element exists and is visible
    // 2 - Device information being displayed is correct
    // 3 - Device element contains both action buttons
    await t
      .expect(deviceComponent.exists)
      .ok(`device ${device.id} exists`)
      .expect(deviceComponent.visible)
      .ok(`device ${device.id} is visible`);
    await displayMatchesDevice(deviceComponent, device);
    await hasDeviceActionButtons(deviceComponent, device);
  }
});

/**
 * Extra
 */
test("Filter devices by type", async (t) => {
  // Select device list filter and select filter options
  // Check if both the select element and options exist
  const typeFilterSelect = Selector(
    ".list-options-box .list-options .list-filters .filter1 select"
  );
  const typeFilterOptions = typeFilterSelect.child("option");
  await t
    .expect(typeFilterSelect.exists)
    .ok("device list filter exists")
    .expect(typeFilterOptions.exists)
    .ok("device list filter options exist");

  // Fetch devices and apply default sort to device list
  const devices = await assertFetchDevices();
  const sortedDevices = sort(devices, "hdd_capacity");

  // Apply windows workstation filter and check if order matches
  const windowsWorkstationFilter = filterDevicesByType(
    sortedDevices,
    "WINDOWS_WORKSTATION"
  );
  await selectOption(
    typeFilterSelect,
    typeFilterOptions,
    "WINDOWS WORKSTATION"
  );
  await deviceDisplayMatchesOrder(windowsWorkstationFilter);

  // Apply windows server filter and check if order matches
  const windowsServerFilter = filterDevicesByType(
    sortedDevices,
    "WINDOWS_SERVER"
  );
  await selectOption(typeFilterSelect, typeFilterOptions, "WINDOWS SERVER");
  await deviceDisplayMatchesOrder(windowsServerFilter);

  // Apply windows server filter and check if order matches
  const macFilter = filterDevicesByType(sortedDevices, "MAC");
  await selectOption(typeFilterSelect, typeFilterOptions, "MAC");
  await deviceDisplayMatchesOrder(macFilter);
});

/**
 * Extra
 */
test("Sort devices by property", async (t) => {
  // Select device list sorter and select device sorter options
  // Check if both the select element and options exist
  const deviceSortSelect = Selector(
    ".list-options-box .list-options .list-filters .filter2 select"
  );
  const deviceSortOptions = deviceSortSelect.child("option");
  await t
    .expect(deviceSortSelect.exists)
    .ok("device list sorter exists")
    .expect(deviceSortOptions.exists)
    .ok("device list sorter options exist");

  // Fetch device list
  const devices = await assertFetchDevices();

  // Apply hdd capacity sort to device list and check if the order of the components match
  const sortedByCapacity = sort([...devices], "hdd_capacity");
  await selectOption(deviceSortSelect, deviceSortOptions, "HDD CAPACITY");
  await deviceDisplayMatchesOrder(sortedByCapacity);

  // Apply system name sort to device list and check if the order of the components match
  const sortedByName = sort([...devices], "system_name");
  await selectOption(deviceSortSelect, deviceSortOptions, "SYSTEM NAME");
  await deviceDisplayMatchesOrder(sortedByName);
});

fixture`Modify device list using interface`.page(WEB_URL);

/**
 * Test 2
 */
test("Add new device", async (t) => {
  // Check if the add button exists and then click it
  const addDeviceButton = Selector(".list-filters .submitButton");
  await t
    .expect(addDeviceButton.exists)
    .ok("add device button exists")
    .click(addDeviceButton);

  // Input placeholder data to create form and submit
  await submitDeviceForm(CREATE_DEVICE_DATA);

  // Check if the new device exists and is visible
  const newDeviceComponent = await findDeviceComponentsByProperties(
    CREATE_DEVICE_DATA
  );
  await t
    .expect(newDeviceComponent.exists)
    .ok("new device exists")
    .expect(newDeviceComponent.visible)
    .ok("new device is visible");

  // Check if the new device element matches the new device data
  const newDeviceData = await getDeviceDataFromComponent(newDeviceComponent);
  await displayMatchesDevice(newDeviceComponent, newDeviceData);

  // Assign new context variable with the device id for the other tests
  t.fixtureCtx.newDeviceId = newDeviceData.id;
});

/**
 * Extra
 */
test("Modify new device", async (t) => {
  // Check if the first device exists
  const newDeviceId = t.fixtureCtx.newDeviceId;
  const newDeviceComponent = findDeviceComponentById(newDeviceId);
  await t.expect(newDeviceComponent.exists).ok("new device element exists");

  // Check if the edit button exists and ten click it
  const editDeviceButton = newDeviceComponent.find(
    ".device-options .device-edit"
  );
  await t
    .expect(editDeviceButton.exists)
    .ok("edit button exists")
    .click(editDeviceButton);

  // Input new name to edit form and submit
  await submitDeviceForm(MODIFY_DEVICE_DATA);

  // Find the first device and check if it exists
  const modifiedDeviceComponent = findDeviceComponentById(newDeviceId);
  await t
    .expect(modifiedDeviceComponent.exists)
    .ok("modified device element exists");

  // Check if the modified device is being displayed correctly using the new data
  const modifiedDeviceData = await getDeviceDataFromComponent(
    modifiedDeviceComponent
  );
  await displayMatchesDevice(modifiedDeviceComponent, modifiedDeviceData);
});

/**
 * Extra
 */
test("Remove modified device", async (t) => {
  // Find the added device and check if it exists
  const newDeviceId = t.fixtureCtx.newDeviceId;
  const newDeviceComponent = findDeviceComponentById(newDeviceId);
  await t.expect(newDeviceComponent.exists).ok("new device element exists");

  // Find the remove device button, then check if it exists and click it
  const removeDeviceButton = newDeviceComponent.find(
    ".device-options .device-remove"
  );
  await t
    .expect(removeDeviceButton.exists)
    .ok("remove button exists")
    .click(removeDeviceButton);

  // Find the removed device and check if it's no longer present in the DOM
  const removedDeviceComponent = await findDeviceComponentById(newDeviceId);
  await t
    .expect(removedDeviceComponent.exists)
    .notOk("removed device does not exist");
});
