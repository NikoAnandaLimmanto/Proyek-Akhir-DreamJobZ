import { useEffect, useState } from "react"
import { Button, Table, Spinner, Form, Modal } from "react-bootstrap"
import ApiClient from "../../utils/ApiClient"
import { useNavigate } from "react-router-dom"

interface Lowongan {
  _id: string
  perusahaan: string
  lokasi?: string
  gaji?: string
  status?: string
  tanggalposting?: string
}

interface Pelamar {
  _id: string
  userId?: string
  namaMahasiswa?: string
  email?: string
  noTelp?: string
  universitas?: string
  jurusan?: string
  semester?: string
  IdLowongan?: Lowongan | string
  tanggalLamar?: string
  statusLamaran?: string
}

export default function AdminDashboard() {
  const navigate = useNavigate()

  const [lowongan, setLowongan] = useState<Lowongan[]>([])
  const [pelamar, setPelamar] = useState<Pelamar[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [selectedPelamar, setSelectedPelamar] = useState<Pelamar | null>(null)

  useEffect(() => {
    fetchAll()
    const listener = () => fetchAll()
    window.addEventListener("pelamar:changed", listener)
    return () => window.removeEventListener("pelamar:changed", listener)
  }, [])

  const fetchAll = async () => {
    setLoading(true)
    setError("")
    try {
      const [lowRes, pelRes] = await Promise.all([
        ApiClient.get("/lowongan"),
        ApiClient.get("/pelamar"),
      ])
      setLowongan(lowRes.data?.data || [])
      setPelamar(pelRes.data?.data || [])
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal memuat data")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteLowongan = async (id: string) => {
  const ok = window.confirm("Hapus lowongan ini?")
  if (!ok) return

  try {
    await ApiClient.delete(`/lowongan/${id}`)
    setLowongan(list => list.filter(l => l._id !== id))
  } catch (err: any) {
    alert(err.response?.data?.message || "Gagal menghapus lowongan")
  }
}

  const openPelamarModal = (p: Pelamar) => {
    setSelectedPelamar(p)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedPelamar(null)
  }

  const updateStatus = async () => {
    if (!selectedPelamar) return
    try {
      await ApiClient.put(`/pelamar/${selectedPelamar._id}`, {
        statusLamaran: selectedPelamar.statusLamaran || "diproses",
      })
      setPelamar(list =>
        list.map(p =>
          p._id === selectedPelamar._id
            ? { ...p, statusLamaran: selectedPelamar.statusLamaran }
            : p
        )
      )
      closeModal()
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal mengubah status")
    }
  }

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <Spinner animation="border" />
      </div>
    )
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="m-0">DreamJobZ</h1>
          <tr> </tr>
          <tr> </tr>
          <h5 className="mb-1">Admin Dashboard</h5>
          <small className="text-muted">Kelola lowongan dan pelamar</small>
        </div>
        <div className="d-flex gap-2">
          <Button size="sm" onClick={() => navigate('/signin')}>
            Keluar
          </Button>
          <Button size="sm" onClick={() => navigate("/admin/create-lowongan")}>
            + Lowongan
          </Button>
          <Button variant="outline-secondary" onClick={fetchAll}>
            Refresh
          </Button>

        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-3 mb-4">
        {[
          { label: "Pelamar", value: pelamar.length },
          {
            label: "Diproses",
            value: pelamar.filter(
              p => p.statusLamaran === "diproses" || !p.statusLamaran
            ).length,
          },
          {
            label: "Diterima",
            value: pelamar.filter(p => p.statusLamaran === "diterima").length,
          },
          { label: "Ditolak",
            value: pelamar.filter(p => p.statusLamaran === "ditolak").length 
          },
          { label: "Lowongan", value: lowongan.length },
          {
            label: "Aktif", value: lowongan.filter(l => l.status === "aktif").length,
          },
          {
            label: "Non-Aktif", value: lowongan.filter(l => l.status !== "aktif").length,
          },
        ].map((item, i) => (
          <div key={i} className="col-md-3 col-sm-6">
            <div className="card shadow-sm h-120">
              <div className="card-body text-center">
                <small className="text-muted">{item.label}</small>
                <h3 className="fw-bold mb-0">{item.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card shadow-sm mb-5">
        <div className="card-header fw-semibold">Daftar Lowongan</div>
        <div className="table-responsive">
          <Table hover className="mb-0 align-middle">
            <thead>
              <tr>
                <th>Perusahaan</th>
                <th>Lokasi</th>
                <th>Gaji</th>
                <th>Status</th>
                <th>Tanggal</th>
                <th className="text-end">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {lowongan.map(l => (
                <tr key={l._id}>
                  <td>{l.perusahaan}</td>
                  <td>{l.lokasi || "-"}</td>
                  <td>{l.gaji || "-"}</td>
                  <td>{l.status || "-"}</td>
                  <td>
                    {l.tanggalposting
                      ? new Date(l.tanggalposting).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="text-end">
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      className="me-2"
                      onClick={() =>
                        navigate(`/admin/edit-lowongan/${l._id}`)
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleDeleteLowongan(l._id)}
                    >
                      Hapus
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header fw-semibold">Daftar Pelamar</div>
        <div className="table-responsive">
          <Table hover className="mb-0 align-middle small">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Email</th>
                <th>Universitas</th>
                <th>Jurusan</th>
                <th>Semester</th>
                <th>Perusahaan</th>
                <th>Status</th>
                <th>Tgl Lamar</th>
                <th className="text-end">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {pelamar.map(p => (
                <tr key={p._id}>
                  <td>{p.namaMahasiswa || "-"}</td>
                  <td>{p.email || "-"}</td>
                  <td>{p.universitas || "-"}</td>
                  <td>{p.jurusan || "-"}</td>
                  <td>{p.semester || "-"}</td>
                  <td>
                    {typeof p.IdLowongan === "object"
                      ? (p.IdLowongan as Lowongan).perusahaan
                      : "-"}
                  </td>
                  <td>{p.statusLamaran || "diproses"}</td>
                  <td>
                    {p.tanggalLamar
                      ? new Date(p.tanggalLamar).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="text-end">
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={() => openPelamarModal(p)}
                    >
                      Kelola
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Kelola Pelamar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPelamar && (
            <>
              <p><strong>Nama:</strong> {selectedPelamar.namaMahasiswa}</p>
              <p><strong>Email:</strong> {selectedPelamar.email}</p>
              <p><strong>Universitas:</strong> {selectedPelamar.universitas}</p>
              <p><strong>Jurusan:</strong> {selectedPelamar.jurusan}</p>
              <p><strong>Semester:</strong> {selectedPelamar.semester}</p>

              <Form.Group>
                <Form.Label>Status Lamaran</Form.Label>
                <Form.Select
                  value={selectedPelamar.statusLamaran || "diproses"}
                  onChange={e =>
                    setSelectedPelamar({
                      ...selectedPelamar,
                      statusLamaran: e.target.value,
                    })
                  }
                >
                  <option value="diproses">Diproses</option>
                  <option value="diterima">Diterima</option>
                  <option value="ditolak">Ditolak</option>
                </Form.Select>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={closeModal}>
            Batal
          </Button>
          <Button onClick={updateStatus}>Simpan</Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}