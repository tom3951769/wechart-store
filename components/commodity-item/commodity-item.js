// components/float-tab/float-tab.js
Component({
  properties: {
    items: {
      type: Array,
      value: [],
    },
  },
  data: {},
  methods: {
    onTabItemClick(e) {
      this.triggerEvent('tabclick', {
        id: e.currentTarget.dataset.tabs.id
      });
    },
    goPay(e) {
      this.triggerEvent('goPay', {
        item: e.currentTarget.dataset.item
      });
    }
  }
})