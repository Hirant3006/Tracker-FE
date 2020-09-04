import Vue from 'vue'
import helper from './helper'

Vue.filter('money', function (value, { rounded = 5, currency }) {
    if (isNaN(value)) {
        return 0
    }
    if (currency) {
        switch (currency.toLowerCase()) {
            case 'vnd':
                return new Intl.NumberFormat().format(value) + ' VND'
            case 'dolar':
                return '$' + helper.toFixedNumberic(value, rounded)
        }
    }
    return new Intl.NumberFormat().format(value)
})

Vue.filter('formatDate', function (value) {
    if (value) {
        return moment(value).format('MMM D,YYYY')
    }
    return ''
})