const {Router} = require('express');
const Product = require('../models/productSchema');

const router = Router();

router.get('/', async (req, res) => {
    try {
        res.json(await Product.find());
    } catch (e) {
        console.log(e);
    }
});

router.get('/:id', async (req, res) => {
    try {
        res.json(await Product.findById(req.params.id));
    } catch (e) {
        console.log(e);
    }
});

router.post('/', async (req, res) => {
    try {
        const product = new Product({
            model: req.body.model,
            article: req.body.article,
            price: req.body.price,
            gender: req.body.gender,
            images: req.body.images,
            color: req.body.color,
            discountPrice: req.body.discountPrice,
            description: req.body.description
        });

        await product.save();
        res.json({ state: 'success' });
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;