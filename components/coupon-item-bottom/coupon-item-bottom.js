// components/conpon-item-bottom/conpon-item-bottom.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    items: {
      type: Array,
      value: []
    },
    typenumber: {
      type: Int32Array,
      value: 1,
    },
    hidden: {
      type: Boolean,
      value: false,
    },
    isuse: {
      type: Boolean,
      value: true,
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    hidden: false,
    items: null,
    isuse: true,
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onAffirm(e) {
      this.triggerEvent('onAffirm', {
        item: e.currentTarget.dataset.items
      });
    },
    onSeletedCoupon(e) {
      var coupon = e.currentTarget.dataset.item
      var typenumber = e.currentTarget.dataset.typenumber
      this.triggerEvent('onSeletedCoupon', {
        item: coupon,
        typenumber: typenumber,
      });
    },
    onIsUse(e) {
      this.triggerEvent('onIsUse', {
        items: e.currentTarget.dataset.items,
        isuse: e.currentTarget.dataset.isuse,
        typenumber: e.currentTarget.dataset.typenumber
      });
    }
  }
})