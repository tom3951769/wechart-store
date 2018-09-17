// components/button-item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    items: {
      type: Array,
      value: [
        // {
        //   coupon_code: '123', coupon_name: '每日优惠卷', coupon_money: '25', min_order_money: '99', coupon_desc: '优惠卷说明', brief_desc: '简短说明', effective_time: '2018/08/17-08/30', expriry_time: '失效时间', use_time: '使用时间', description: '描述', status: '0', button_name: '立即使用'
        // },
        // {
        //   coupon_code: '123', coupon_name: '每日优惠卷', coupon_money: '25', min_order_money: '99', coupon_desc: '优惠卷说明', brief_desc: '简短说明', effective_time: '2018/08/17-08/30', expriry_time: '失效时间', use_time: '2018-03-15 08:40:40', description: '描述', status: '1', button_name: '立即使用'
        // },
        // {
        //   coupon_code: '123', coupon_name: '每日优惠卷', coupon_money: '25', min_order_money: '99', coupon_desc: '优惠卷说明', brief_desc: '简短说明', effective_time: '2018/08/17-08/30', expriry_time: '失效时间', use_time: '使用时间', description: '描述', status: '-1', button_name: '立即使用'
        // },
      ]
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    ontoNavigateUrl(e) {
      this.triggerEvent('toNavigateUrl', { id: e.currentTarget.dataset.items.id });
    },
  }
})
