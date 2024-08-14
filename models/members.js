import mongoose from 'mongoose';

const  memberSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    batchid: { type: mongoose.Schema.Types.ObjectId, ref: 'batch', required: true, index: true },
    courseid: [{ type: mongoose.Schema.Types.ObjectId, ref: 'course' }], // Array of course IDs
    profilepicture: String,
    birthdate: { type: Date, required: true },
    registrationday: { type: Date, default: Date.now },
    city: String,
    subcity: String,
    kebele: String,
    woreda: String,
    postalnumber: String,
    email: { type: String, required: true, unique: true, index: true },
    christianname: String,
    previoussundayschoolstart: Date,
    previoussundayschoolend: Date,
    highereducation: String,
    institutionname: String,
    highereducationstart: Date,
    graduated: { type: Boolean, default: false },
    employmenttype: String,
    companyname: String,
    companyaddress: String,
    maritalstatus: String,
    livewith: String,
    talentinterest: String
});

export default mongoose.models.member || mongoose.model('member', memberSchema);