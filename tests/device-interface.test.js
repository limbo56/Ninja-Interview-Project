import { Selector, t } from "testcafe";
import {
  getDeviceDataFromComponent,
  findDeviceComponentById,
  findDeviceComponentsByProperties,
  placeholderDevice,
  modifyDeviceData,
  displayMatchesDevice,
} from "./device-util";

function normalizeDeviceType(type) {
  return type.split("_").join(" ");
}

async function submitDeviceForm(data) {
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
    await t
      .click(typeSelect)
      .click(typeOptions.withText(normalizeDeviceType(deviceType)))
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

fixture`Modify device list using interface`.page`http://localhost:3001/`;

test("Add new device", async (t) => {
  // Check if the add button exists and then click it
  const addDeviceButton = Selector(".list-filters .submitButton");
  await t
    .expect(addDeviceButton.exists)
    .ok("add device button exists")
    .click(addDeviceButton);

  // Input placeholder data to create form and submit
  await submitDeviceForm(placeholderDevice);

  // Check if the new device exists and is visible
  const newDeviceComponent = await findDeviceComponentsByProperties(
    placeholderDevice
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
  await submitDeviceForm(modifyDeviceData);

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
