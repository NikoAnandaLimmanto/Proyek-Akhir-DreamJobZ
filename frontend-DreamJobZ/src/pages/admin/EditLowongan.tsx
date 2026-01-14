import { useCallback, useEffect, useState, type FormEvent } from "react"
import { Button, Form, Alert, Container } from "react-bootstrap"
import { useNavigate, useParams } from "react-router-dom"
import ApiClient from "../../utils/ApiClient"

interface FormLowongan {
    perusahaan: string,
    lokasi: string,
    gaji: string,
    status: string,
    tanggalposting: string
}

interface ResponseData {
    data: {
        _id: string,
        perusahaan: string,
        lokasi: string,
        gaji: string,
        status: string,
        tanggalposting: string,
        createdAt: string,
        updatedAt: string,
    },
}

function EditLowongan() {
    const params = useParams()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string>("")
    const [success, setSuccess] = useState<string>("")
    const [form, setForm] = useState<FormLowongan>({
        perusahaan: "",
        lokasi: "",
        gaji: "",
        status: "aktif",
        tanggalposting: ""
    })

    const fetchLowongan = useCallback(async () => {
        try {
            const response = await ApiClient.get(`/lowongan/${params.id}`)

            if (response.status === 200) {
                const responseData: ResponseData = response.data
                setForm({
                    perusahaan: responseData.data.perusahaan,
                    lokasi: responseData.data.lokasi,
                    gaji: responseData.data.gaji,
                    status: responseData.data.status,
                    tanggalposting: responseData.data.tanggalposting
                })
            }
        } catch (err: any) {
        }
    }, [params])

    const handleInputChange = (event: any) => {
        const { name, value } = event.target

        setForm({
            ...form,
            [name]: value
        })
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError("")
        setSuccess("")
        setIsLoading(true)

        try {
            const response = await ApiClient.put(`/lowongan/${params.id}`, form)

            if (response.status === 200) {
                setSuccess("Lowongan berhasil diperbarui!")
                setTimeout(() => {
                    navigate("/admin", { replace: true })
                }, 2000)
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Gagal memperbarui lowongan"
            setError(errorMessage)
            console.log(err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchLowongan()
    }, [fetchLowongan])

    return (
        <Container className="mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h4>Edit Lowongan</h4>
                                <Button variant="secondary" onClick={() => navigate("/admin")}>
                                    Kembali
                                </Button>
                            </div>

                            {error && <Alert variant="danger">{error}</Alert>}
                            {success && <Alert variant="success">{success}</Alert>}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="formPerusahaan">
                                    <Form.Label>Nama Perusahaan</Form.Label>
                                    <Form.Control
                                        value={form.perusahaan}
                                        onChange={handleInputChange}
                                        name="perusahaan"
                                        type="text"
                                        placeholder="Masukkan nama perusahaan"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formLokasi">
                                    <Form.Label>Lokasi</Form.Label>
                                    <Form.Control
                                        value={form.lokasi}
                                        onChange={handleInputChange}
                                        name="lokasi"
                                        type="text"
                                        placeholder="Masukkan lokasi"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formGaji">
                                    <Form.Label>Gaji</Form.Label>
                                    <Form.Control
                                        value={form.gaji}
                                        onChange={handleInputChange}
                                        name="gaji"
                                        type="text"
                                        placeholder="Contoh: 3-4 juta"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formStatus">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Select
                                        value={form.status}
                                        onChange={handleInputChange}
                                        name="status"
                                        required
                                    >
                                        <option value="aktif">Aktif</option>
                                        <option value="nonaktif">Non-aktif</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formTanggalPosting">
                                    <Form.Label>Tanggal Posting</Form.Label>
                                    <Form.Control
                                        value={form.tanggalposting}
                                        onChange={handleInputChange}
                                        name="tanggalposting"
                                        type="date"
                                        required
                                    />
                                </Form.Group>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-100"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Menyimpan..." : "Simpan"}
                                </Button>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default EditLowongan