Component({
  properties: {
    items: {
      type: Array,
      value: [

      ],
    },

  },
  data: {},
  methods: {
    setDefultAddress(e) {
      this.triggerEvent('setDefultAddress', {
        id: e.currentTarget.dataset.item.address_id,
        item: e.currentTarget.dataset.item
      })
    },
    seletedAddress(e) {
      this.triggerEvent('seletedAddress', {
        id: e.currentTarget.dataset.item.address_id,
        item: e.currentTarget.dataset.item
      })
    },
    redactAddress(e) {
      this.triggerEvent('redactAddress', {
        id: e.currentTarget.dataset.item.address_id,
        item: e.currentTarget.dataset.item
      })
    },
    removeAddress(e) {
      this.triggerEvent('removeAddress', {
        id: e.currentTarget.dataset.item.address_id,
        item: e.currentTarget.dataset.item
      })
    },
  }
})