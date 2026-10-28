const store = require('../../utils/store');
const fmt = require('../../utils/format');

Page({
  data: { o: null, ev: null },
  onLoad(q) {
    store.refresh();
    const o = store.getOrder(q.id);
    if (!o) {
      wx.showToast({ title: '订单不存在', icon: 'none' });
      return;
    }
    const ev = store.getEvent(o.eventId);
    this.setData({
      o,
      ev: ev ? Object.assign({}, ev, { dateText: fmt.fmtDate(ev.date) }) : null
    });
  },
  goOrders() {
    wx.redirectTo({ url: '/pages/orders/orders' });
  },
  goEvents() {
    wx.switchTab({ url: '/pages/events/events' });
  }
});
