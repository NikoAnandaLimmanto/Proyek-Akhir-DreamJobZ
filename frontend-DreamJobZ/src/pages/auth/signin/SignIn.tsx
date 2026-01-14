import { useState, type ChangeEvent, type FormEvent } from "react"
import { Form, Alert, Spinner, Button } from "react-bootstrap"
import ApiClient from "../../../utils/ApiClient"
import { Link, useNavigate } from "react-router-dom"

interface SignInForm {
  email: string
  password: string
}

function SignIn() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const [form, setForm] = useState<SignInForm>({
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
    setIsLoading(true)

    try {
      const res = await ApiClient.post("/signin", form)
      const { token, role } = res.data.data

      localStorage.setItem("AuthToken", token)
      localStorage.setItem("userRole", role)

      navigate(role === "admin" ? "/admin" : "/user/dashboard", { replace: true })
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Login gagal"
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
              <small className="text-muted">Sign in to continue</small>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={onSubmit}>
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
                  "Sign In"
                )}
              </Button>
            </Form>

            <p className="text-center mt-3 small">
              Belum punya akun?{" "}
              <Link to="/signup" className="fw-semibold">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn
