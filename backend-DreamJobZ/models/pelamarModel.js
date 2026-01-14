import mongoose from "mongoose";

const pelamarSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        namaMahasiswa:{
            type: String,
            unique: true,
            required: true,
            trim: true
        },

        email:{
            type: String,
            required: true,
            trim: true
        },

        noTelp:{
            type: String,
            required: true,
            trim: true
        },
        
        universitas:{
            type: String,
            required: true,
            trim: true
        },

        jurusan:{
            type: String,
            required: true,
            trim: true
        },

        semester:{
            type: String,
            required: true,
            trim: true
        },

        IdLowongan:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "lowongan",
            required: true
        },

        tanggalLamar:{
            type: Date,
            required: true,
            trim: true
        },

        statusLamaran:{
            type: String,
            enum: ["diproses", "diterima", "ditolak"],
            default: "diproses"
        }
    },
    
    { 
        timestamps: true,
    }
);

const pelamarModel = mongoose.model('pelamar', pelamarSchema);

export default pelamarModel