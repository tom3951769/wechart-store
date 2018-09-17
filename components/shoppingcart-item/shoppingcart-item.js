// components/float-tab/float-tab.js
Component({
  properties: {
    items: {
      type: Array,
      value: [{ product_id: '123', product_name: '测试商品', product_img: '', price: '', original_price: '', product_count: 2, status:'1'},
      ],
    },
    buycount: {
      type: Number,
      value: 1,
    },
  },
  data: {
  },
  methods: {
    onToCommodity(e)
    {
      this.triggerEvent('toCommodity', { id: e.currentTarget.dataset.item.product_id, product_count: e.currentTarget.dataset.item.product_count })
    },
    onAddItemClick(e) {
      this.triggerEvent('addBuyCountClick', { id: e.currentTarget.dataset.item.product_id, product_count: e.currentTarget.dataset.item.product_count})
    },
    onLessenItemClick(e) {
      this.triggerEvent('lessenBuyCountClick', { id: e.currentTarget.dataset.item.product_id, product_count: e.currentTarget.dataset.item.product_count})
    },
    onCheckboxChange(e) {
      this.triggerEvent('checkboxChangeClick', { id: e.currentTarget.dataset.item.product_id, product_count: e.currentTarget.dataset.item.product_count })
    },
    onRemoveItemClick(e) {
      this.triggerEvent('removeItemClick', { id: e.currentTarget.dataset.item.product_id, product_count: e.currentTarget.dataset.item.product_count })
    },
  }
})
