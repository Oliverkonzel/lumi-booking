const store = require('../../utils/store');
const fmt = require('../../utils/format');

const FILTERS = [['all', '全部'], ['open', '报名中'], ['draft', '草稿'], ['closed', '已下架']];

Page({
  data: {
    filters: FILTERS.map((f) => ({ key: f[0], label: f[1] })),
    active: 'all',
    list: [],
    total: 0
  },
  onShow() {
    store.refresh();
    this.apply(this.data.active);
  },
  apply(key) {
    const list = store.allEvents()
      .filter((e) => key === 'all' || e.status === key)
      .sort((a, b) => b.date.localeCompare(a.date))
      .map((ev) => {
        const done = store.enrolled(ev);
        return Object.assign({}, ev, {
          dateText: fmt.fmtDate(ev.date),
          timeShort: ev.time.split('-')[0],
          done,
          est: done * ev.price,
          statusText: ev.status === 'open' ? '报名中' : ev.status === 'draft' ? '草稿' : '已下架'
        });
      });
    this.setData({ list, total: store.allEvents().length });
  },
  onFilter(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ active: key });
    this.apply(key);
  },
  goRegs(e) { wx.navigateTo({ url: '/pages/admin-orders/admin-orders?evId=' + e.currentTarget.dataset.id }); },
  goEdit(e) { wx.navigateTo({ url: '/pages/admin-edit/admin-edit?id=' + e.currentTarget.dataset.id }); },
  onToggle(e) {
    const ev = store.toggleEvent(e.currentTarget.dataset.id);
    wx.showToast({
      title: ev.status === 'open' ? '已上线，家长端可见' : '已下架',
      icon: 'none'
    });
    this.apply(this.data.active);
  },
  goNew() { wx.navigateTo({ url: '/pages/admin-edit/admin-edit' }); }
});
