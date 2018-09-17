// components/float-tab/float-tab.js
Component({
  properties: {
    items: {
      type: Array,
      value: [],
    },
    curTabId: {
      type: Int32Array,
      value: 0,
    },
    fixedBar: {
      type: Boolean,
      value: false,
      observer: "onScroll"
    }
  },

  data: {
    showFixedBar: false
  },

  methods: {
    onTabItemClick(e) {
      this.triggerEvent('tabclick', { id: e.currentTarget.dataset.tabs.tag_id });
    },
    onScroll() {
      this.setData({
        showFixedBar: this.data.fixedBar
      });
    }
  }
})
