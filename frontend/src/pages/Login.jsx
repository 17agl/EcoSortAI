import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000";

function Login() {
  const navigate    = useNavigate();
  const passwordRef = useRef(null);

  const [formData, setFormData] = useState({
    email:    "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe,   setRememberMe]   = useState(true);
  const [error,        setError]        = useState("");
  const [loading,      setLoading]      = useState(false);

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const email    = formData.email.trim().toLowerCase();
    const password = passwordRef.current?.value || formData.password;

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const params = new URLSearchParams({ email, password });

      const response = await fetch(
        `${API_BASE_URL}/login?${params.toString()}`,
        {
          method:  "POST",
          headers: { Accept: "application/json" },
        }
      );

      const data = await response.json();

      if (!response.ok || data.status !== "success") {
        throw new Error(data.message || "Login failed.");
      }

      // Store user with session token (or plain user if backend doesn't support it yet)
      const userPayload = JSON.stringify(data.user);
      if (rememberMe) {
        localStorage.setItem("ecosort_user", userPayload);
      } else {
        sessionStorage.setItem("ecosort_user", userPayload);
      }

      navigate("/dashboard");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-mobile">

      {/* Hero section */}
      <div className="auth-hero">
        <div className="auth-hero-icon">♻️</div>
        <h1 className="auth-hero-title">EcoSort AI</h1>
        <p className="auth-hero-subtitle">Smart waste. Cleaner planet.</p>
      </div>

      {/* Card */}
      <div className="auth-card-mobile">
        <h2 className="auth-card-heading">Welcome back</h2>
        <p className="auth-card-sub">Sign in to continue</p>

        <form onSubmit={handleSubmit} className="auth-form-mobile">

          <div className="auth-field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <div className="auth-password-wrap">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                value={formData.password}
                onChange={handleChange}
                onInput={handleChange}
                ref={passwordRef}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="auth-eye-btn"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div className="auth-remember-row">
            <label className="auth-remember-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
          </div>

          {error && (
            <div className="auth-error-box">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span className="auth-btn-loading">
                <span className="auth-spinner" />
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>

        </form>

        <p className="auth-switch-text">
          Don&#39;t have an account?{" "}
          <Link to="/register" className="auth-switch-link">
            Create Account
          </Link>
        </p>
      </div>

    </div>
  );
}

export default Login;
