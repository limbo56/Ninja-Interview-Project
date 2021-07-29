import { t } from "testcafe";
import { ReactSelector } from "testcafe-react-selectors";
import {
  CREATE_DEVICE_DATA,
  MODIFY_DEVICE_DATA,
  WEB_URL,
  addDevice,
  displayMatchesDevice,
  findDeviceComponentById,
  getDeviceDataFromComponent,
  removeDevice,
  updateDevice,
} from "../utils";

function reloadCurrentPage() {
  return t.navigateTo("/");
}

async function removeAddedDevice() {
  // Removing the device used by the previous test
  const newDeviceId = t.fixtureCtx.newDeviceId;
  const response = await removeDevice(newDeviceId);
  await t
    .expect(response.status)
    .eql(200, "remove device request is successful");

  // Clean up context
  t.fixtureCtx.newDeviceId = undefined;
}

async function resetModifiedDevice(t) {
  // Restore default state of the renamed device
  const originalDevice = t.fixtureCtx.originalDevice;
  const response = await updateDevice(originalDevice.id, originalDevice);
  await t
    .expect(response.status)
    .eql(200, "update device request is successful");

  // Clean up context
  t.fixtureCtx.originalDevice = undefined;
}

async function regenerateRemovedDevice(t) {
  // Regenerate removed device
  const removedDeviceData = t.fixtureCtx.removedDevice;
  const response = await addDevice(removedDeviceData);
  await t
    .expect(response.status)
    .eql(200, "regenerate removed device successful");

  // Clean up context
  t.fixtureCtx.removedDevice = undefined;
}

fixture`Modify device list using API`.page(WEB_URL);

/**
 * Extra
 */
test("Add new device", async (t) => {
  // Add placeholder device and check that the request was successful
  const response = await addDevice(CREATE_DEVICE_DATA);
  await t.expect(response.status).eql(200, "add device request is successful");

  // Reload the current page
  await reloadCurrentPage();

  // Find new device, then check if it exists and is visible
  const newDeviceData = await response.json();
  const newDeviceComponent = findDeviceComponentById(newDeviceData.id);
  await t
    .expect(newDeviceComponent.exists)
    .ok("new device exists")
    .expect(newDeviceComponent.visible)
    .ok("new device is visible");

  // Check if the new device is being displayed correctly
  await displayMatchesDevice(newDeviceComponent, newDeviceData);

  // Assign new context variable with the new device id for clean up
  t.fixtureCtx.newDeviceId = newDeviceData.id;
}).after(removeAddedDevice);

/**
 * Test 3
 */
test("Rename first device of list", async (t) => {
  // Retrieve first device of list and check if it exists
  const firstDeviceComponent = ReactSelector("Device").nth(0);
  await t.expect(firstDeviceComponent.exists).ok("first device element exists");

  // Rename first device and check if the request was successful
  const firstDeviceData = await getDeviceDataFromComponent(
    firstDeviceComponent
  );
  const response = await updateDevice(firstDeviceData.id, {
    ...firstDeviceData,
    system_name: MODIFY_DEVICE_DATA.system_name,
  });
  await t.expect(response.status).eql(200, "update device request successful");

  // Reload the current page
  await reloadCurrentPage();

  // Retrieve the renamed device and check if it exists
  const renamedDevice = findDeviceComponentById(firstDeviceData.id);
  await t.expect(renamedDevice.exists).ok("renamed device exists");

  // Retrieve renamed device data and check if the name changed
  const renamedDeviceData = await getDeviceDataFromComponent(renamedDevice);
  await t
    .expect(renamedDeviceData.name)
    .eql(MODIFY_DEVICE_DATA.name, "renamed device name matches");

  // Check if the device is displaying the updated information correclty
  await displayMatchesDevice(renamedDevice, renamedDeviceData);

  // Assign new context variable with the original device data for restoring
  t.fixtureCtx.originalDevice = firstDeviceData;
}).after(resetModifiedDevice);

/**
 * Test 4
 */
test("Remove last device of list", async (t) => {
  // Retrieve last device of list and check if it exists
  const lastDeviceComponent = ReactSelector("Device").nth(-1);
  await t.expect(lastDeviceComponent.exists).ok("last device element exists");

  // Remove last device and check if the request was successful
  const lastDeviceData = await getDeviceDataFromComponent(lastDeviceComponent);
  const response = await removeDevice(lastDeviceData.id);
  await t.expect(response.status).eql(200, "remove device request successful");

  // Reload the current page
  await reloadCurrentPage();

  // Retrieve the removed device and check if it does not exist
  const removedDevice = findDeviceComponentById(lastDeviceData.id);
  await t.expect(removedDevice.exists).notOk("removed device does not exists");

  // Asign new context variable containing the data of the removed device to regenerate it
  t.fixtureCtx.removedDevice = lastDeviceData;
}).after(regenerateRemovedDevice);
