import MMKVStorage from "react-native-mmkv-storage";

const MMKV = new MMKVStorage.Loader()
  .withEncryption()
  .initialize();

export default MMKV;