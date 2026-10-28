const store = require('../../utils/store');
const fmt = require('../../utils/format');

Page({
  data: { list: [] },
  onShow() {
    store.refresh();
    const list = store.getOrders()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map((o) => {
        const ev = store.getEvent(o.eventId);
        return Object.assign({}, o, ev ? {
          title: ev.title,
          dateText: fmt.fmtDate(ev.date),
          time: ev.time,
          place: ev.place,
          emoji: ev.emoji,
          c1: ev.c1,
          c2: ev.c2,
          levelTag: ev.level
        } : {});
      });
    this.setData({ list });
  },
  resumePay(e) {
    wx.navigateTo({ url: '/pages/pay/pay?orderId=' + e.currentTarget.dataset.id });
  },
  goDetail(e) {
    wx.navigateTo({ url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id });
  },
  viewTicket(e) {
    const o = store.getOrder(e.currentTarget.dataset.id);
    const ev = store.getEvent(o.eventId);
    wx.showModal({
      title: '报名凭证 · ' + o.code,
      content:
        ev.title + '\n' +
        fmt.fmtDate(ev.date) + ' ' + ev.time + '\n' +
        ev.place + '\n' +
        o.childName + ' · ' + o.childAge + '\n' +
        '实付 ¥' + o.amount,
      showCancel: false,
      confirmText: '完成'
    });
  }
});
