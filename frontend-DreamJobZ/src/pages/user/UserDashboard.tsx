import { useEffect, useState } from "react";
import { Button, Spinner, Form, Modal, Card, Row, Col, Badge, InputGroup } from "react-bootstrap";
import ApiClient from "../../utils/ApiClient";
import { useNavigate } from "react-router-dom";

interface Lowongan {
  _id: string;
  perusahaan: string;
  posisi?: string;
  lokasi?: string;
  gaji?: string;
  status?: string;
  tanggalposting?: string;
}

export default function UserDashboard() {
  const [lowongan, setLowongan] = useState<Lowongan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedLowongan, setSelectedLowongan] = useState<Lowongan | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [form, setForm] = useState({
    namaMahasiswa: "",
    email: "",
    noTelp: "",
    universitas: "",
    jurusan: "",
    semester: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchLowongan();
  }, []);

  const fetchLowongan = async () => {
    setLoading(true);
    try {
      const res = await ApiClient.get("/lowongan");
      setLowongan(res.data?.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal memuat lowongan");
    } finally {
      setLoading(false);
    }
  };

  const filteredLowongan = lowongan.filter((l) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      l.perusahaan.toLowerCase().includes(q) ||
      (l.posisi || "").toLowerCase().includes(q) ||
      (l.lokasi || "").toLowerCase().includes(q)
    );
  });

  const openApply = (l: Lowongan) => {
    setSelectedLowongan(l);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedLowongan(null);
    setSubmitLoading(false);
    setForm({ namaMahasiswa: "", email: "", noTelp: "", universitas: "", jurusan: "", semester: "" });
  };

  const handleSubmitApply = async () => {
    if (!selectedLowongan) return;
    setSubmitLoading(true);
    try {
      await ApiClient.post("/pelamar", {
        IdLowongan: selectedLowongan._id,
        ...form,
        tanggalLamar: new Date().toISOString(),
      });
      alert("Lamaran berhasil dikirim");
      closeModal();
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal mengirim lamaran");
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-50">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-0">DreamJobZ</h1>
      <Card className="mb-4 shadow-sm border-0">
        <Card.Body className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <h3 className="mb-1">Lowongan Pekerjaan</h3>
            <small className="text-muted">Temukan dan lamar lowongan yang sesuai</small>
          </div>
          <div className="d-flex gap-2">
            <Button size="sm" onClick={() => navigate('/signin')}>
              Keluar
            </Button>
            <Button size="sm" variant="outline-secondary" onClick={() => navigate('/user/riwayat-lamaran')}>
              Informasi Lamaran
            </Button>
            <Button size="sm" variant="outline-primary" onClick={fetchLowongan}>Refresh</Button>
            
          </div>
        </Card.Body>
      </Card>

      {error && <div className="alert alert-danger">{error}</div>}

      <InputGroup className="mb-4 shadow-sm">
        <Form.Control
          placeholder="Cari perusahaan, posisi, atau lokasi..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button variant="outline-secondary" onClick={() => setQuery("")}>Reset</Button>
      </InputGroup>

      {filteredLowongan.length === 0 ? (
        <div className="text-center text-muted py-5">Tidak ada lowongan ditemukan</div>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {filteredLowongan.map((l) => (
            <Col key={l._id}>
              <Card className="h-100 shadow-sm border-0 hover-shadow">
                <Card.Body>
                  <div className="d-flex justify-content-between mb-2">
                    <h5 className="mb-0">{l.posisi}</h5>
                    <Badge bg={l.status === 'open' ? 'success' : 'secondary'}>
                      {l.status || 'Terbuka'}
                    </Badge>
                  </div>
                  <div className="fw-semibold">{l.perusahaan}</div>
                  <div className="text-muted small">📍 {l.lokasi || '-'}</div>
                  <div className="text-muted small mt-1">Rp. {l.gaji || '-'}</div>
                </Card.Body>
                <Card.Footer className="bg-white border-0 d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    {l.tanggalposting ? new Date(l.tanggalposting).toLocaleDateString() : '-'}
                  </small>
                  <Button size="sm" variant="primary" onClick={() => openApply(l)}>
                    Lamar
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Form Lamaran</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="row g-2">
            {Object.entries(form).map(([key, value]) => (
              <Form.Group key={key} className="col-12">
                <Form.Label className="text-capitalize">{key.replace(/([A-Z])/g, ' $1')}</Form.Label>
                <Form.Control
                  value={value}
                  onChange={(e) => setForm((s) => ({ ...s, [key]: e.target.value }))}
                />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal} disabled={submitLoading}>Batal</Button>
          <Button variant="success" onClick={handleSubmitApply} disabled={submitLoading}>
            {submitLoading ? 'Mengirim...' : 'Kirim Lamaran'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
