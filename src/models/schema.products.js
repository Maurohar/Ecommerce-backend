import mongoose from 'mongoose';
import mongoosePaginate from 'mongoo-paginate-v2';

const productSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    gender: String,
    grade: Number,
    group: String,

},{ timestamps: true });

productSchema.plugin(mongoosePaginate);
export default mongoose.model('Student', productSchema);
