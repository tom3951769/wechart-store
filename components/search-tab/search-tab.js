// components/float-tab/float-tab.js
Component({
  properties: {
    search_word: {
      type: String,
      value: ''
    },
    search_word_input: {
      type: String,
      value: ''
    }
    ,
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
      this.triggerEvent('tabclick', {
        id: e.currentTarget.dataset.tabs.tag_id
      });
    },
    onScroll() {
      this.setData({
        showFixedBar: this.data.fixedBar
      });
    },
    onSearch(e) {
      this.triggerEvent('onSearch', {
        value: e.target.dataset.value
      });
    },
    onSearchinput(e)
    {
      this.triggerEvent('onSearchinput', {
        value: e.detail.value
      });
    }
  }
})