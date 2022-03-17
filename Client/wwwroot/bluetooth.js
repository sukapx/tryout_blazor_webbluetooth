let netRef;
async function setNetRef(ref) {
  netRef = ref;
}

let charac_writeable;
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

  charac_writeable = await service.getCharacteristic('00000004-5239-4069-806d-7e5c97393755');
  console.log({charac_writeable});

  charac_deviceTime.addEventListener('characteristicvaluechanged', (event) => {
    console.log(event.target);

    let value = event.target.value.getFloat32(0, true);
    console.log('> Characteristic is ' + value);

    if(netRef) {
      netRef.invokeMethodAsync('Status', 'Charac is: ' + value);
    }
  });

//  console.log((await charac_deviceTime.readValue()).getFloat32(0, true));
  await charac_deviceTime.startNotifications();
}

async function WriteToCharac(value) {
  if(!charac_writeable) {
    console.error(`Connect Device first`);
    return;
  }
  console.log(`Writing '${value}' to ${charac_writeable}'`)
  const encoder = new TextEncoder('utf-8')
  charac_writeable.writeValue(encoder.encode(value));
}
