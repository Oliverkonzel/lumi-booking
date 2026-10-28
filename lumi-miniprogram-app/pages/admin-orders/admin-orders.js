const store = require('../../utils/store');
const fmt = require('../../utils/format');

Page({
  data: {
    evId: '',
    ev: null,
    isSingle: false,
    list: [],
    paidCount: 0,
    pendingCount: 0,
    totalPaid: 0,
    seatsText: ''
  },
  onLoad(q) {
    this.evId = q.evId || '';
  },
  onShow() {
    store.refresh();
    const all = store.getOrders().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const isSingle = !!this.evId;
    const ev = isSingle ? store.getEvent(this.evId) : null;
    const scope = isSingle ? all.filter((o) => o.eventId === this.evId) : all;

    const list = scope.map((o) => {
      const evOfOrder = store.getEvent(o.eventId);
      return Object.assign({}, o, {
        initial: (o.childName || '?').slice(0, 1),
        evTitle: evOfOrder ? evOfOrder.title : '活动已删除',
        evDate: evOfOrder ? fmt.fmtDate(evOfOrder.date) + ' ' + evOfOrder.time.split('-')[0] : ''
      });
    });

    const paid = list.filter((o) => o.status === 'paid');

    this.setData({
      isSingle,
      ev: ev ? Object.assign({}, ev, { dateText: fmt.fmtDate(ev.date) }) : null,
      list,
      paidCount: paid.length,
      pendingCount: list.length - paid.length,
      totalPaid: paid.reduce((s, o) => s + Number(o.amount), 0),
      seatsText: ev ? store.enrolled(ev) + '/' + ev.capacity : ''
    });
  },
  markPaid(e) {
    store.markPaid(e.currentTarget.dataset.id);
    wx.showToast({ title: '已标记为已支付', icon: 'none' });
    this.onShow();
  },
  exportRegs() {
    // 上线时在这里调用后端导出 Excel，或用云函数生成文件
    wx.showToast({ title: '已生成签到表（演示）', icon: 'none' });
  },
  goEvents() { wx.navigateTo({ url: '/pages/admin-events/admin-events' }); }
});
