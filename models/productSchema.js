const {Schema, model} = require('mongoose');

const productSchema = new Schema({
    model: {
        type: String,
        required: true
    },
    article: {
      type: String,
      required: true,
        unique: true
    },
    price: {
        type: String,
        required: true
    },
    gender: {
        type: String,
    },
    images: [],
    color: String,
    description: String,
    discountPrice: String,
});

module.exports = model('Product', productSchema);