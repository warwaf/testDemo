// components/common/dateRange/dateRange.js
const date = new Date()
const years = []
const months = []
const days = []
const startTimes = []
const endTimes = []
const currentYear = date.getFullYear();
const currentMonth = date.getMonth() + 1;
const currentDay = date.getDate();
const currentHour = date.getHours();
const currentEndHour = currentHour + 1;
console.info(currentEndHour)
for (let i = date.getFullYear(); i <= date.getFullYear() + 20; i++) {
    years.push(i)
}

for (let i = 1; i <= 12; i++) {
    months.push(i)
}

for (let i = 1; i <= 31; i++) {
    days.push(i)
}

for (let i = 0; i <= 24; i++) {
    if (i < 10) i = "0" + i;
    startTimes.push(i + ":00")
    endTimes.push(i + ":00")
}
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        // value: Array,
        visibile: {
            type: Boolean,
            value: false
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        years: [],
        year: date.getFullYear(),
        months: [],
        month: 2,
        days: [],
        day: 2,
        startTimes: [],
        startTime: 1,
        endTime: 1,
        endTimes: [],
        // value: [9999, 1, 1, '00:00', '00:00'],
        text: `${currentYear}-${currentMonth}-${currentDay} ${currentHour<10 ? "0"+currentHour: currentHour}:00-${currentEndHour<10 ? "0"+currentEndHour: currentEndHour}:00`,
        temp: [currentYear + "-" + currentMonth + '-' + currentDay, `${currentHour<10 ? "0"+currentHour: currentHour}:00`, `${currentEndHour<10 ? "0"+currentEndHour: currentEndHour}:00`]
    },
    ready() {
        const years = this.getYears(currentYear, currentYear + 10);
        const months = this.getMonths(currentMonth);
        const days = this.getDays(currentDay);
        const startTimes = this.getStartTime(currentHour);
        const endTimes = this.getEndTime(currentHour + 1);
        this.setData({
            years,
            months,
            days,
            startTimes,
            endTimes
        })
    },
    /**
     * 组件的方法列表
     */
    methods: {
        /**
         * 根据 开始年 和 结束 年 计算出 years
         * @param {*} start 
         * @param {*} end 
         */
        getYears(start, end) {
            const years = []
            for (let i = start; i <= end; i++) {
                years.push(i)
            }
            return years
        },

        /**
         * 根据 开始月份 和 开始月份 计算出 months
         * @param {*} start 
         * @param {*} end 
         */
        getMonths(start, end = 12) {
            const months = []
            for (let i = start; i <= end; i++) {
                months.push(i)
            }
            return months
        },
        /**
         * 根据 开始天 和 结束天 计算出 months
         * @param {*} start 
         * @param {*} end 
         */
        getDays(start, end = 31) {
            const days = []
            for (let i = start; i <= end; i++) {
                days.push(i)
            }
            return days
        },

        /**
         * 
         * @param {*} start 
         * @param {*} end 
         */
        getStartTime(start, end = 23) {
            const startTimes = []
            for (let i = start; i <= end; i++) {
                if (i < 10) i = "0" + i;
                startTimes.push(i + ":00")
            }
            return startTimes
        },

        /**
         * 
         * @param {*} start 
         * @param {*} end 
         */
        getEndTime(start, end = 24) {
            const endTimes = []
            for (let i = start; i <= end; i++) {
                if (i < 10) i = "0" + i;
                endTimes.push(i + ":00")
            }
            return endTimes
        },

        changeItem(year, month, day, startTime, endTime) {
            startTime = parseInt(startTime.split(':')[0])
                // 如果是今年
            let c_month = 1;
            let c_day = 1;
            let c_startTime = 1;
            let c_endTime = startTime + 1;
            if (year == currentYear) c_month = currentMonth;
            if (year == currentYear && month == currentMonth) c_day = currentDay;
            if (year == currentYear && month == currentMonth && day == currentDay) {
                c_startTime = currentHour;
            }
            const months = this.getMonths(c_month);
            const days = this.getDays(c_day);
            const startTimes = this.getStartTime(c_startTime);
            const endTimes = this.getEndTime(c_endTime);
            this.setData({ months, days, startTimes, endTimes })
        },
        tapComfirm() {
            const { temp, text } = this.data;
            console.info(temp, text)
            this.triggerEvent('comfirm', { value: temp, text });
        },
        bindChange: function(e) {
            const val = e.detail.value
            const year = this.data.years[val[0]];
            const month = this.data.months[val[1]];
            const day = this.data.days[val[2]];
            const startTime = this.data.startTimes[val[3]];
            const endTime = this.data.endTimes[val[4]];
            this.changeItem(year, month, day, startTime, endTime)
                // this.triggerEvent('change', [year + '-' + month + '-' + day, startTime, endTime]);
            this.setData({
                temp: [year + '-' + month + '-' + day, startTime, endTime],
                text: year + '-' + month + '-' + day + " " + startTime + "-" + endTime,
            })
        }
    }
})