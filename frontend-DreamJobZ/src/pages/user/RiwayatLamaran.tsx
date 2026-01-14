import { useEffect, useState } from "react";
import { Card, Row, Col, Badge, Button, Spinner } from "react-bootstrap";
import ApiClient from "../../utils/ApiClient";
import { useNavigate } from "react-router-dom";

interface Pelamar {
  _id: string;
  namaMahasiswa?: string;
  email?: string;
  noTelp?: string;
  universitas?: string;
  jurusan?: string;
  semester?: string;
  IdLowongan?: { perusahaan?: string; posisi?: string } | string;
  tanggalLamar?: string;
  statusLamaran?: string;
}

export default function InformasiLamaran() {
  const [list, setList] = useState<Pelamar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const fetchMyApplications = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await ApiClient.get("/pelamar/mine");
      setList(res.data?.data || []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal memuat informasi lamaran");
    } finally {
      setLoading(false);
    }
  };

  const statusColor = (s?: string) => {
    const st = (s || "").toLowerCase();
    if (st === "diterima") return "success";
    if (st === "ditolak") return "danger";
    return "warning";
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
      <h1 className="mb-4">DreamJobZ</h1>
      <Card className="mb-4 shadow-sm border-0">
        <Card.Body className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <h3 className="mb-1">Informasi Lamaran</h3>
            <small className="text-muted">Pantau status lamaran pekerjaanmu</small>
          </div>
          <div className="d-flex gap-2">
            <Button size="sm" variant="outline-primary" onClick={fetchMyApplications}>
              Refresh
            </Button>
            <Button size="sm" variant="outline-secondary" onClick={() => navigate(-1)}>
              Kembali
            </Button>
          </div>
        </Card.Body>
      </Card>

      {error && <div className="alert alert-danger">{error}</div>}

      {list.length === 0 ? (
        <div className="text-center text-muted py-5">Belum ada lamaran yang dikirim</div>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {list.map((p) => {
            const lowongan = typeof p.IdLowongan === "object" ? p.IdLowongan : null;
            return (
              <Col key={p._id}>
                <Card className="h-100 shadow-sm border-0 hover-shadow">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h6 className="mb-0 fw-semibold">
                          {lowongan?.perusahaan || "-"}
                        </h6>
                        <small className="text-muted">
                          {lowongan?.posisi || "-"}
                        </small>
                      </div>
                      <Badge bg={statusColor(p.statusLamaran)}>
                        {p.statusLamaran || "Diproses"}
                      </Badge>
                    </div>

                    <div className="small mt-3">Universitas {p.universitas || "-"}</div>
                    <div className="small text-muted">Jurusan {p.jurusan || "-"}</div>
                    <div className="small text-muted mt-1"> {p.email || "-"}</div>
                  </Card.Body>

                  <Card.Footer className="bg-white border-0 d-flex justify-content-between align-items-center small text-muted">
                    <span>
                      {p.tanggalLamar
                        ? new Date(p.tanggalLamar).toLocaleDateString("id-ID")
                        : "-"}
                    </span>
                  </Card.Footer>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </div>
  );
}
