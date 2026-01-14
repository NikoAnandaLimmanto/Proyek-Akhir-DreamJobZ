import { useState, type ChangeEvent, type FormEvent } from "react";
import { Form, Button, Alert, Container } from "react-bootstrap";
import ApiClient from "../../utils/ApiClient";
import { useNavigate } from "react-router-dom";

interface CreateLowonganForm {
  perusahaan: string;
  lokasi: string;
  gaji: string;
  status: string;
  tanggalposting: string;
  posisi: string;
}

function CreateLowongan() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const [form, setForm] = useState<CreateLowonganForm>({
    perusahaan: "",
    lokasi: "",
    posisi: "",
    gaji: "",
    status: "aktif",
    tanggalposting: new Date().toISOString().split("T")[0],
  });

  const onHandleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const response = await ApiClient.post("/lowongan", form);

      if (response.status === 201 || response.status === 200) {
        setSuccess("Lowongan berhasil dibuat!");
        setForm({
          perusahaan: "",
          lokasi: "",
          posisi: "",
          gaji: "",
          status: "aktif",
          tanggalposting: new Date().toISOString().split("T")[0],
        });

        setTimeout(() => {
          navigate("/admin", { replace: true });
        }, 2000);
      }
    } catch (error: any) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Gagal membuat lowongan";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h1 className="mb-4 text-center">Buat Lowongan Baru</h1>

              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nama Perusahaan</Form.Label>
                  <Form.Control
                    onChange={onHandleChange}
                    value={form.perusahaan}
                    name="perusahaan"
                    type="text"
                    placeholder="Masukkan nama perusahaan"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Lokasi</Form.Label>
                  <Form.Control
                    onChange={onHandleChange}
                    value={form.lokasi}
                    name="lokasi"
                    type="text"
                    placeholder="Masukkan lokasi"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Posisi</Form.Label>
                  <Form.Control
                    onChange={onHandleChange}
                    value={form.posisi}
                    name="posisi"
                    type="text"
                    placeholder="Masukkan posisi"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Gaji</Form.Label>
                  <Form.Control
                    onChange={onHandleChange}
                    value={form.gaji}
                    name="gaji"
                    type="text"
                    placeholder="Contoh: 3-4 juta"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    onChange={onHandleChange}
                    value={form.status}
                    name="status"
                    required
                  >
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Non-aktif</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Tanggal Posting</Form.Label>
                  <Form.Control
                    onChange={onHandleChange}
                    value={form.tanggalposting}
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
                  {isLoading ? "Menyimpan..." : "Buat Lowongan"}
                </Button>

                <Button
                  variant="secondary"
                  className="w-100 mt-2"
                  onClick={() => navigate("/admin")}
                >
                  Batal
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default CreateLowongan;