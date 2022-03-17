async function ConnectBluetooth() {
  if(!navigator.bluetooth) {
    console.error("No access to bluetooth");
    return;
  }

  let device = await navigator.bluetooth.requestDevice({
    filters: [{
      services: ['00000001-5239-4069-806d-7e5c97393755'],
    }]
  });
  console.log({device});

  let server = await device.gatt.connect();
  console.log({server});

  let service = await server.getPrimaryService('00000001-5239-4069-806d-7e5c97393755');
  console.log({service});

  let charac_deviceTime = await service.getCharacteristic('00000002-5239-4069-806d-7e5c97393755');
  console.log({charac_deviceTime});

  charac_deviceTime.addEventListener('characteristicvaluechanged', (event) => {
    console.log(event.target);

    let value = event.target.value.getFloat32(0, true);
    console.log('> Characteristic is ' + value);
  });

//  console.log((await charac_deviceTime.readValue()).getFloat32(0, true));
  await charac_deviceTime.startNotifications();
}
