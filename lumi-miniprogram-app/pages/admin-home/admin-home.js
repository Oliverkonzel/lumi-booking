const store = require('../../utils/store');
const fmt = require('../../utils/format');

Page({
  data: {
    revenue: 0,
    paidCount: 0,
    peopleCount: 0,
    pendingCount: 0,
    openCount: 0,
    usage: 0,
    pending: [],
    upcoming: []
  },
  onShow() {
    store.refresh();
    const open = store.openEvents();
    const orders = store.getOrders();
    const paid = orders.filter((o) => o.status === 'paid');
    const pending = orders.filter((o) => o.status === 'pending');
    const totalSeats = open.reduce((s, e) => s + store.enrolled(e), 0);
    const totalCap = open.reduce((s, e) => s + e.capacity, 0);

    const upcoming = open
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 3)
      .map((ev) => {
        const done = store.enrolled(ev);
        return {
          id: ev.id, emoji: ev.emoji, title: ev.title,
          dateText: fmt.fmtDate(ev.date), timeShort: ev.time.split('-')[0],
          done, cap: ev.capacity,
          pct: Math.min(100, Math.round((done / ev.capacity) * 100))
        };
      });

    this.setData({
      revenue: store.revenue(),
      paidCount: paid.length,
      peopleCount: totalSeats,
      pendingCount: pending.length,
      openCount: open.length,
      usage: totalCap ? Math.round((totalSeats / totalCap) * 100) : 0,
      pending: pending.slice(0, 3).map((o) => {
        const ev = store.getEvent(o.eventId);
        return {
          id: o.id, childName: o.childName, amount: o.amount, createdAt: o.createdAt,
          evTitle: ev ? ev.title.slice(0, 16) + (ev.title.length > 16 ? '…' : '') : ''
        };
      }),
      upcoming
    });
  },
  goOrders() { wx.navigateTo({ url: '/pages/admin-orders/admin-orders' }); },
  goAdminEvents() { wx.navigateTo({ url: '/pages/admin-events/admin-events' }); },
  goRegs(e) { wx.navigateTo({ url: '/pages/admin-orders/admin-orders?evId=' + e.currentTarget.dataset.id }); },
  goNew() { wx.navigateTo({ url: '/pages/admin-edit/admin-edit' }); },
  goHome() { wx.switchTab({ url: '/pages/home/home' }); }
});
