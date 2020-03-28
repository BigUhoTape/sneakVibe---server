const {Schema, model} = require('mongoose');

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: String,
  gender: {
    type: String,
    required: true
  },
  country: String,
  city: String,
  address: String,
  phonenumber: String,
  cityIndex: String,
  cart: {
    items: [
      {
        count: {
          type: Number,
          required: true,
          default: 1
        },
        productId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: 'Product'
        }
      }
    ]
  },
  liked: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: 'Product'
        }
      }
    ]
  }
});

module.exports = model('User', userSchema);