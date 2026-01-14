import { useState, type ChangeEvent, type FormEvent } from "react"
import { Form, Alert, Spinner, Button } from "react-bootstrap"
import ApiClient from "../../../utils/ApiClient"
import { Link, useNavigate } from "react-router-dom"

interface SignUpForm {
  username: string
  email: string
  password: string
}

function SignUp() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [form, setForm] = useState<SignUpForm>({
    username: "",
    email: "",
    password: "",
  })

  const onHandleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      const res = await ApiClient.post("/signup", form)

      if (res.status === 200 || res.status === 201) {
        setSuccess("Signup berhasil! Silakan login.")
        setForm({ username: "", email: "", password: "" })

        setTimeout(() => {
          navigate("/signin", { replace: true })
        }, 2000)
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Signup gagal, coba lagi"
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center">
      <div className="col-md-5 col-lg-4">
        <div className="card shadow-sm rounded-4">
          <div className="card-body p-4">
            <div className="text-center mb-4">
              <h2 className="fw-bold mb-1">DreamJobZ</h2>
              <small className="text-muted">Create your account</small>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={onSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={form.username}
                  onChange={onHandleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={onHandleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={onHandleChange}
                  required
                />
              </Form.Group>

              <Button
                type="submit"
                className="w-100"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Loading...
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </Form>

            <p className="text-center mt-3 small">
              Sudah punya akun?{" "}
              <Link to="/signin" className="fw-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp
