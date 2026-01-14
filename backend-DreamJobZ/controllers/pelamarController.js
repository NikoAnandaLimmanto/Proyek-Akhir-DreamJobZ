import pelamarModel from "../models/pelamarModel.js";

export const listPelamar = async (req, res) => {
  try {
    const data = await pelamarModel
      .find({})
      .populate("IdLowongan", "perusahaan posisi")
    .then(res => res.filter(p => p.IdLowongan !== null));

    res.status(200).json({
      message: "List Pelamar Magang",
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      data: null,
    });
  }
};


export const listPelamarByUser = async (req, res) => {
  try {
    const userId = req.user?.user_id;
    const data = await pelamarModel.find({ userId }).populate("IdLowongan");
    return res.status(200).json({ message: "Daftar lamaran saya", data });
  } catch (error) {
    return res.status(500).json({ message: error.message, data: null });
  }
};

export const createPelamar = async (req, res) => {
    try {
        const userId = req.user?.user_id;
        const request = req.body;

        const response = await pelamarModel.create({
            userId,
            namaMahasiswa: request.namaMahasiswa,
            email: request.email,
            noTelp: request.noTelp,
            universitas: request.universitas,
            jurusan: request.jurusan,
            semester: request.semester,
            IdLowongan: request.IdLowongan,
            tanggalLamar: request.tanggalLamar,
            statusLamaran: request.statusLamaran,
        })

        res.status(201).json({
            message: "Pelamar berhasil ditambahkan",
            data: response
        })
    }catch (error) {
        res.status(500).json({
            message: error.message,
            data: null
        })
    }
}

export const updatePelamar = async (req, res) => {
    try {
        const id = req.params?.id
        const request = req.body

    if (!id) {
        return res.status(400).json({
            message: "ID wajib diisi",
            data: null
        })
    }

    const response = await pelamarModel.findByIdAndUpdate(id, {
        namaMahasiswa: request.namaMahasiswa,
        email: request.email,
        noTelp: request.noTelp,
        universitas: request.universitas,
        jurusan: request.jurusan,
        semester: request.semester,
        IdLowongan: request.IdLowongan,
        tanggalLamar: request.tanggalLamar,
        statusLamaran: request.statusLamaran,
    })

    if (!response) {
        return res.status(404).json({
            message: "Data pelamar tidak ditemukan",
            data: null
        })
    }

    return res.status(200).json({
        message: "Data pelamar berhasil diupdate",
        data: response
    })

    }catch (error) {
        res.status(500).json({
            message: error.message,
            data: null
        })
    }
}

export const deletePelamar = async (req, res) => {
    try {
        const id = req.params.id

    if (!id) {
        return res.status(400).json({
            message: "ID wajib diisi",
            data: null
        })
    }

    const response = await pelamarModel.findByIdAndDelete(id);

    if (response) {
        return res.status(200).json({
            message: "Data pelamar berhasil dihapus",
            data: response
        })
    }

    return res.status(404).json({
        message: "Data pelamar tidak ditemukan",
        data: null
    })
    }catch (error) {
        res.status(500).json({
            message: error.message,
            data: null,
        })
    }
}