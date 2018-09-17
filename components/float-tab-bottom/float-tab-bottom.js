// components/float-tab/float-tab.js
Component({
  properties: {
    items: {
      type: Object,
      value: null
    },
    fixedBar: {
      type: Boolean,
      value: false
    },
    isAddCart: {
      type: Boolean,
      value: false
    },
    
    buycount: {
      type: Int32Array,
      value: 1
    },
    selecteproperty: {
      type: String,
      value: ''
    }
  },
  data: {
    isAddCart:true,
    showFixedBar: false,
    buycount: 1,
    items: null,
    selecteproperty: ''
  },
  methods: {
    onSelected(e) {
      this.triggerEvent('onSelected', {
        spec_value_id: e.target.dataset.item.spec_value_id,
      })
      var id = e.target.dataset.item.spec_value_id;
      this.data.selecteproperty = '';
      var lsit = this.data.items.spec_list.filter((item) => {
        item.spec_value_list.map((spec_value_list_item, index) => {
          if (spec_value_list_item.is_selected == 1 && spec_value_list_item.spec_value_id == id) {
            spec_value_list_item.is_selected = 0;
          } else if (spec_value_list_item.is_selected == 0 && spec_value_list_item.spec_value_id == id) {
            spec_value_list_item.is_selected = 1;
            this.data.selecteproperty += " " + spec_value_list_item.spec_value_name;
            this.setData({
              selecteproperty: this.data.selecteproperty
            })
          } else {
            spec_value_list_item.is_selected = 0;
          }
        })
        return item;
      })
      this.data.items.spec_list = lsit;
      this.setData({
        items: this.data.items
      })
    },
    onAddToShoppingCart(e) {
      this.triggerEvent('addToShoppingCart', {
        id: e.currentTarget.dataset.item.product_id,
      })
    },
    onAddItemClick(e) {
      this.triggerEvent('addBuyCountClick', {
        id: e.currentTarget.dataset.item.product_id
      })
    },
    onLessenItemClick(e) {
      this.triggerEvent('lessenBuyCountClick', {
        id: e.currentTarget.dataset.item.product_id
      })
    },
    onCancel() {
      this.triggerEvent('onCancel', {
        // id: e.currentTarget.dataset.tabs.id
      });
    },
    onInputBuyCount(e) {
      this.triggerEvent('inputBuyCount', {
        value: e.detail.value
      })
    }
  }
})