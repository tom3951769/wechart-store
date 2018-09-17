

Component({
  properties: {
    items: {
      type: Array,
      value: [
      ],
    },
  },
  data: {
  },
  methods: {
    onClick(e) {
      this.triggerEvent('Click', { id: e.currentTarget.dataset.item.product_id })
    },
  }
})
