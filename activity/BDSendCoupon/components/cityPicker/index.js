//Component Object
import regionData from "../../../../utils/region"

Component({
  properties: {
    location: {
      type: String
    }
  },
  data: {
    region: [],
    provinceList: [],
    cityList: [],
    province: {
      address: "",
      code: ""
    },
    city: {
      address: "",
      code: ""
    },
    showProvince: false,
    showCity: false
  },
  lifetimes: {
    attached: function () {
      let cityData = regionData,
        provinceList = []
      for (let i = 0; i < cityData.length; i++) {
        provinceList.push({
          address: cityData[i].name,
          code: cityData[i].code
        });
      }
      this.setData({
        region: cityData,
        provinceList: provinceList
      })
      // console.log(this.data.provinceList)
    }
  },
  methods: {
    // 父组件调用-关闭选择器
    closeSelect() {
      this.setData({
        province: {
          ...this.data.province
        },
        city: {
          ...this.data.city
        },
        showProvince: false,
        showCity: false
      })
    },
    // 打开选择器
    handleShowSelect(e) {
      let {
        type
      } = e.currentTarget.dataset
      console.log(">>>>", this.data.location)
      switch (type) {
        case "province":
          this.setData({
            showProvince: !this.data.showProvince,
            showCity: false
          })
          break;

        default:
          if (this.data.province.code == "") {
            wx.showToast({
              title: '请选择省份',
              icon: 'none',
              duration: 1500
            });
            return
          }
          this.setData({
            showProvince: false,
            showCity: !this.data.showCity
          })
          break;
      }
    },
    // 选择省份
    selectProvince(e) {
      let {
        item,
        index
      } = e.currentTarget.dataset
      // console.log("item >>", item, index, this.data.region[index].children)
      let cityList = []
      for (let i = 0; i < this.data.region[index].children.length; i++) {
        cityList.push({
          address: this.data.region[index].children[i].name,
          code: this.data.region[index].children[i].code
        });
      }
      this.setData({
        province: item,
        cityList: cityList,
        showProvince: false,
        showCity: true,
        city: {
          address: this.data.region[index].children[0].name,
          code: this.data.region[index].children[0].code
        }
      })
      let regionData = {
        province: this.data.province.address,
        provinceCode: this.data.province.code,
        city: this.data.region[index].children[0].name,
        cityCode: this.data.region[index].children[0].code
      }
      this.triggerEvent('getRegion', regionData);
      // console.log("cityList >>", cityList)
    },
    // 选择城市
    selectCity(e) {
      let {
        item
      } = e.currentTarget.dataset
      this.setData({
        city: item,
        showProvince: false,
        showCity: false
      })
      let regionData = {
        province: this.data.province.address,
        provinceCode: this.data.province.code,
        city: item.address,
        cityCode: item.code
      }
      console.log("city picker >>", regionData)
      // 父组件获取地址信息
      this.triggerEvent('getRegion', regionData);
    },
  },
  created: function () {

  },
  attached: function () {

  },
  ready: function () {

  },
  moved: function () {

  },
  detached: function () {

  },
});
