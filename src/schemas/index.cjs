const Mongoose = require("mongoose");

module.exports = {
  Users: new Mongoose.Schema({
    name: String,
    mail: String,
    phone: Number,
    password: String,
    favorites: Array,
    cart: Array,
    viewed: Array,
    compare: Array,
  }),
  Products: new Mongoose.Schema({
    description: {
      title: String,
      content: String,
    },
    specification: {
      speed: Number,
      productName: String,
      typeP: String,
      power: Number,
      charge: Number,
      frontBrake: String,
      cruise: String,
      power1: Number,
      power2: Number,
      charge1: Number,
      frontBrake1: String,
      cruise1: String,
      power3: Number,
      charge2: Number,
      frontBrake2: String,
      cruise2: String,
      frontBrake3: String,
    },
    protection: Boolean,
    product: [String],
    comments: [
      {
        userId: String,
        rate: Number,
        date: Number,
        title: String,
        content: String,
      },
    ],
    hit: Boolean,
    news: Boolean,
    price: Number,
    sale: Number,
    productName: String,
    rates: Number,
  }),
  News: new Mongoose.Schema({
    bigContent: {
      ftitle: String,
      fcontent: String,
      stitle: String,
      scontent: String,
    },
    title: String,
    content: String,
    photo: String,
    to: String,
    date: String,
  }),
  Promos: new Mongoose.Schema({
    src: String,
    title: String,
    content: String,
    terms: [String],
  }),
  Customs: new Mongoose.Schema({
    recs: [],
    indexP: [
      {
        every: [
          {
            ...this.Products,
          },
        ],
        title: String,
        href: String,
      },
    ],
    indexPromos: [
      {
        title: String,
        img: String,
        href: null | String,
        with: null | Number,
      },
    ],
    daysToDeliv: [Number],
    timeToDeliv: {
      type: [Number],
      validate: {
        validator: (arr) => {
          return arr.length === 2 && arr.every((item) => item <= 24 && item > 0) && (arr[0] < arr[1])
        },
        message: 'Array length must be 2'
      },
    }
  }),
  AddressShops: new Mongoose.Schema({
    city: String,
    street: String,
    numberHome: Number,
    weekdays: {
      type: [Number],
      validate: {
        validator: (arr) => {
          return arr.length === 2 && arr.every((item) => item <= 7 && item > 0);
        },
        message: "Array length must be 2",
      },
    },
    times: {
      type: [Number],
      validate: {
        validator: (arr) => {
          return (
            arr.length === 2 && arr.every((item) => item <= 24 && item > 0)
          );
        },
        message: "Array length must be 2",
      },
    },
  }),
  Cities: new Mongoose.Schema({
    name: String,
  }),
};
