const device_info_keyname = "deviceInfo";
const discover_keyname = "discover";
const params_keyname = "params"; // Added missing constant

/**
 * Clear the cache of discovered devices
 */
const clearDiscoveredDevices = () => {
  if (localStorage.getItem(discover_keyname)) {
    localStorage.removeItem(discover_keyname);
  }
};

/**
 * Clear the cache of deviceInfo
 */
const clearDeviceInfos = () => {
  if (localStorage.getItem(device_info_keyname)) {
    localStorage.removeItem(device_info_keyname);
  }
};

/**
 * cache discoveredDevices against the port no.
 * @param {int} port
 * @param {*} discoveredDevices
 */
const addDiscoveredDevices = (port, discoveredDevices) => {
  let discover = {};

  // Initialize if empty
  if (!localStorage.getItem(discover_keyname)) {
    localStorage.setItem(discover_keyname, JSON.stringify(discover));
  }

  discover = JSON.parse(localStorage.getItem(discover_keyname));
  discover[port] = discoveredDevices;
  localStorage.setItem(discover_keyname, JSON.stringify(discover));
};

/**
 * cache deviceInfo against the port no.
 * @param {int} port
 * @param {*} decodedDeviceInfo
 */
const addDeviceInfos = (port, decodedDeviceInfo) => {
  let deviceInfo = {};

  // Initialize if empty
  if (!localStorage.getItem(device_info_keyname)) {
    localStorage.setItem(device_info_keyname, JSON.stringify(deviceInfo));
  }

  deviceInfo = JSON.parse(localStorage.getItem(device_info_keyname));
  deviceInfo[port] = decodedDeviceInfo;
  localStorage.setItem(device_info_keyname, JSON.stringify(deviceInfo));
};

/**
 * @returns deviceInfoList
 */
const getDeviceInfos = () => {
  return JSON.parse(localStorage.getItem(device_info_keyname));
};

/**
 * retrieves cookie from the browser 
 * @param {string} key
 * @returns cookie value
 */
function getCookie(key) {
  var b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
  return b ? b.pop() : "";
}

const addParam = (key, value) => {
  let params = {};

  // Load existing params if they exist
  if (localStorage.getItem(params_keyname)) {
    params = JSON.parse(localStorage.getItem(params_keyname));
  }

  // Update/add the parameter
  params[key] = value;
  localStorage.setItem(params_keyname, JSON.stringify(params));
};

const getParam = (key) => {
  const params = JSON.parse(localStorage.getItem(params_keyname) || '{}');
  return params[key] || null;
};

const clearParam = (key) => {
  const params = JSON.parse(localStorage.getItem(params_keyname) || '{}');
  delete params[key];
  localStorage.setItem(params_keyname, JSON.stringify(params));
};

const clearAllParams = () => {
  localStorage.removeItem(params_keyname);
};

const localStorageService = {
  addDeviceInfos: addDeviceInfos,
  getDeviceInfos: getDeviceInfos,
  clearDeviceInfos: clearDeviceInfos,
  clearDiscoveredDevices: clearDiscoveredDevices,
  addDiscoveredDevices: addDiscoveredDevices,
  getCookie: getCookie,
  addParam,
  getParam,
  clearParam,
  clearAllParams
};

export default localStorageService;