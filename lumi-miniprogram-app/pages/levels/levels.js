Page({
  data: {
    levels: require('../../utils/store').LEVELS
  },
  call() {
    wx.makePhoneCall({ phoneNumber: '18858444116' });
  }
});
