// components/button-item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    items:{
    type:Array,
    value:[
      { id: '0', nodeName:'身份证号',navigateUrl:''}
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
