const store = require('../../utils/store');
const fmt = require('../../utils/format');

Page({
  data: {
    list: [],
    levels: store.LEVELS,
    showLevels: false
  },
  onShow() {
    store.refresh();
    this.setData({ list: store.openEvents().slice(0, 3).map(this.decorate) });
  },
  decorate(ev) {
    const left = store.seatsLeft(ev);
    return Object.assign({}, ev, {
      dateText: fmt.fmtDate(ev.date),
      timeShort: (ev.time || '').split('-')[0],
      left,
      full: left === 0
    });
  },
  goDetail(e) {
    wx.navigateTo({ url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id });
  },
  goEvents() { wx.switchTab({ url: '/pages/events/events' }); },
  goLevels() { this.setData({ showLevels: true }); },
  closeLevels() { this.setData({ showLevels: false }); },
  stop() { /* 阻止冒泡 */ },
  goTrial() {
    wx.showModal({
      title: '预约免费体验',
      content: '一次 40 分钟的真实课堂，孩子在里面上课，家长在后面看。\n不收试听费，上完觉得不合适直接走。\n\n电话：188 5844 4116',
      confirmText: '立即拨打',
      cancelText: '再想想',
      success: (r) => {
        if (r.confirm) wx.makePhoneCall({ phoneNumber: '18858444116' });
      }
    });
  },
  goContact() {
    wx.showModal({
      title: '联系老师',
      content: '英语探索空间 · 大同市华北星城跃动 2 楼\n188 5844 4116 / 173 9847 8467',
      confirmText: '拨打',
      success: (r) => {
        if (r.confirm) wx.makePhoneCall({ phoneNumber: '18858444116' });
      }
    });
  }
});
