const store = require('../../utils/store');
const fmt = require('../../utils/format');

Page({
  data: { ev: null, draft: null, dateText: '' },
  onLoad(q) {
    store.refresh();
    let draft = store.getDraft();
    let resumeOrderId = '';
    // 从「我的订单 → 继续支付」进入
    if (!draft && q.orderId) {
      const o = store.getOrder(q.orderId);
      if (o) {
        draft = {
          eventId: o.eventId, childName: o.childName, childAge: o.childAge,
          level: o.level, phone: o.phone, note: o.note || ''
        };
        resumeOrderId = o.id;
      }
    }
    if (!draft) {
      wx.showToast({ title: '订单信息丢失，请重新报名', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1200);
      return;
    }
    draft.resumeOrderId = resumeOrderId;
    const ev = store.getEvent(draft.eventId);
    this.setData({
      draft,
      ev: Object.assign({}, ev, { dateText: fmt.fmtDate(ev.date) })
    });
  },
  /* ---------------- 支付 ----------------
   * 当前为模拟支付：延时后直接置为已支付。
   * 接入真实微信支付时，把 doPay 中的 setTimeout 段替换为：
   *   1. wx.request 调你自己的后端「创建订单」接口
   *   2. 后端调微信统一下单，返回 paySign 等参数
   *   3. wx.requestPayment({ timeStamp, nonceStr, package, signType, paySign, success, fail })
   *   4. success 回调里再调后端确认，然后跳转成功页
   * -------------------------------------- */
  doPay() {
    const d = this.data;
    wx.showLoading({ title: '支付中…', mask: true });
    setTimeout(() => {
      wx.hideLoading();
      let orderId = '';
      if (d.draft.resumeOrderId) {
        const o = store.payOrder(d.draft.resumeOrderId);
        orderId = o.id;
      } else {
        const order = store.addOrder({
          id: 'LM' + Date.now(),
          eventId: d.draft.eventId,
          childName: d.draft.childName,
          childAge: d.draft.childAge,
          level: d.draft.level,
          phone: d.draft.phone,
          note: d.draft.note || '',
          amount: d.ev.price,
          status: 'paid',
          createdAt: fmt.nowStr(),
          code: Math.random().toString(36).slice(2, 8).toUpperCase()
        });
        orderId = order.id;
      }
      store.clearDraft();
      wx.redirectTo({ url: '/pages/success/success?id=' + orderId });
    }, 1100);
  }
});
