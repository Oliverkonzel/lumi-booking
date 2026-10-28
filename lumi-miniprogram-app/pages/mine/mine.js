const store = require('../../utils/store');
const fmt = require('../../utils/format');

Page({
  data: {
    child: store.CHILD,
    paidCount: 0,
    pendingCount: 0,
    recent: []
  },
  onShow() {
    store.refresh();
    const orders = store.getOrders().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const recent = orders.slice(0, 2).map((o) => {
      const ev = store.getEvent(o.eventId);
      return Object.assign({}, o, ev ? {
        title: ev.title,
        dateText: fmt.fmtDate(ev.date),
        emoji: ev.emoji, c1: ev.c1, c2: ev.c2, levelTag: ev.level
      } : {});
    });
    this.setData({
      paidCount: orders.filter((o) => o.status === 'paid').length,
      pendingCount: orders.filter((o) => o.status === 'pending').length,
      recent
    });
  },
  goOrders() { wx.navigateTo({ url: '/pages/orders/orders' }); },
  goDetail(e) { wx.navigateTo({ url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id }); },
  goLevels() { wx.navigateTo({ url: '/pages/levels/levels' }); },
  goAdmin() { wx.navigateTo({ url: '/pages/admin-home/admin-home' }); },
  goTrial() {
    wx.showModal({
      title: '预约免费体验',
      content: '一次 40 分钟的真实课堂，家长可旁听。\n电话：188 5844 4116',
      confirmText: '立即拨打',
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
  },
  showChild() {
    const c = store.CHILD;
    wx.showModal({
      title: '孩子档案',
      content: '姓名：' + c.name + '\n年龄：' + c.age + '\n当前级别：' + c.level + '\n家长：' + c.parent + '\n电话：' + c.phone,
      showCancel: false,
      confirmText: '完成'
    });
  }
});
