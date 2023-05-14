import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';


const productCollection = 'products'

const productSchema = new mongoose.Schema  ({

    title: { type: String, required: true, index: true},
    description: { type: String, required: true},
    code : { type: String, required: true, index: true},
    price : { type: Number, required: true},
    stock : { type: Number, required: true},
    category : { type: String, required: true},
    thumbnail : { type: String, required: true}

});
productSchema.plugin(paginate);





const productModel = mongoose.model(productCollection, productSchema);

export default productModel
