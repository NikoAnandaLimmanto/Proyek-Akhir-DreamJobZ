import mongoose from "mongoose";

const lowonganSchema = new mongoose.Schema(
    {
        perusahaan:{
            type: String,
            required: true,
            trim: true
        },

        posisi:{
            type: String,
            required: true,
            trim: true
        },

        lokasi:{
            type: String,
            required: true,
            trim: true
        },

        gaji:{
            type: String,
            required: true,
            trim: true
        },
        
        status:{
            type: String,
            enum: ["aktif", "nonaktif"],
            default: "aktif"
        },

        tanggalposting:{
            type: String,
            required: true,
            trim: true
        }
    },

    { 
        timestamps: true,
    }
);

const lowonganModel = mongoose.model('lowongan', lowonganSchema);

export default lowonganModel