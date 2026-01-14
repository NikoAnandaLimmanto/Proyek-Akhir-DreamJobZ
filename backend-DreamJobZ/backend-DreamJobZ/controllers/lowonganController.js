import lowonganModel from "../models/lowonganModel.js";

export const listLowongan = async (req, res) => {
    try {
        const data = await lowonganModel.find({})
        
        res.status(200).json({
            message: "List Lowongan Magang",
            data: data
        })
    }catch (error) {
        res.status(500).json({
            message: error,
            data: null,
        })
    }
}

export const createLowongan = async (req, res) => {
    try {
        const request = req.body

        const response = await lowonganModel.create({
            perusahaan: request.perusahaan,
            posisi: request.posisi,
            lokasi: request.lokasi,
            gaji: request.gaji,
            status: request.status,
            tanggalposting: request.tanggalposting,
        })

        res.status(201).json({
            message: "Lowongan berhasil ditambahkan",
            data: response
        })
    }catch (error) {
        res.status(500).json({
            message: error.message,
            data: null
        })
    }
}

export const updateLowongan = async (req, res) => {
    try {
        const id = req.params?.id
        const request = req.body

    if (!id) {
        return res.status(400).json({
            message: "ID wajib diisi",
            data: null
        })
    }

    const response = await lowonganModel.findByIdAndUpdate(id, {
        perusahaan: request.perusahaan,
        posisi: request.posisi,
        lokasi: request.lokasi,
        gaji: request.gaji,
        status: request.status,
        tanggalposting: request.tanggalposting,
    })

    if (!response) {
        return res.status(404).json({
            message: "Data lowongan tidak ditemukan",
            data: null
        })
    }

    return res.status(200).json({
        message: "Data lowongan berhasil diupdate",
        data: response
    })

    }catch (error) {
        res.status(500).json({
            message: error.message,
            data: null
        })
    }
}

export const deleteLowongan = async (req, res) => {
    try {
        const id = req.params.id

    if (!id) {
        return res.status(400).json({
            message: "ID wajib diisi",
            data: null
        })
    }

    const response = await lowonganModel.findByIdAndDelete(id);

    if (response) {
        return res.status(200).json({
            message: "Data lowongan berhasil dihapus",
            data: response
        })
    }

    return res.status(404).json({
        message: "Data lowongan tidak ditemukan",
        data: null
    })
    }catch (error) {
        res.status(500).json({
            message: error.message,
            data: null,
        })
    }
}