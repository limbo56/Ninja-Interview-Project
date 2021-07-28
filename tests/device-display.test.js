import { Selector } from "testcafe";
import {
  displayMatchesDevice,
  fetchDevices,
  findDeviceComponentById,
  hasDeviceActionButtons,
} from "./device-util";

fixture`Device list display`.page`http://localhost:3001/`;

test("Device list exists and is visible", async (t) => {
  // Find device list element, then check if it exists and is visible
  const deviceList = Selector(".list-devices");
  await t
    .expect(deviceList.exists)
    .ok("device list element exists")
    .expect(deviceList.visible)
    .ok("device list is visible");
});

test("Device information is displayed correctly", async (t) => {
  // Fetch device list and check if the list is not null
  const devices = await fetchDevices();
  await t.expect(devices).notEql(null, "device list fetched is not null");

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
