import AsyncStorage from '@react-native-community/async-storage';

const Helper = {
  async getLocalStorageItem(key) {
    AsyncStorage.getItem(key).then(res => {
      if (!res) return null;
      return JSON.parse(res);
    });
  },
};

export default Helper;
