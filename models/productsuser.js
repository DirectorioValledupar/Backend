const {Schema, model} = require('mongoose');

const ProductsUserSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
    },
    category: {
        type: Schema.Types.ObjectId,
        required:true
    },
    price: {
        type:String,
        default: ''
    },
    img:{
        type:String,
        default: 'https://res.cloudinary.com/drkqwwoxd/image/upload/v1670199170/149071_xlo4ob.png',
    },
    description: {
        type: String,
        default: ''
    },
    idea:{
        type: String,
        default:''
    },
    state: {
        type: Boolean,
        default: true, 
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

ProductsUserSchema.methods.toJSON = function() {
    const {__v, state, _id, ...productNameUser} = this.toObject();
    productNameUser.uid = _id;
    return productNameUser;
}


module.exports = model('ProductsUser', ProductsUserSchema)