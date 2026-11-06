import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000";

// Password strength calculator (0–4)
function getPasswordStrength(pwd) {
  let score = 0;
  if (pwd.length >= 8)                     score++;
  if (/[A-Z]/.test(pwd))                  score++;
  if (/[0-9]/.test(pwd))                  score++;
  if (/[^A-Za-z0-9]/.test(pwd))          score++;
  return score;
}

const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLORS = ["", "#e53935", "#fb8c00", "#fdd835", "#43a047"];

function Register() {
  const navigate = useNavigate();

  const passwordRef        = useRef(null);
  const confirmPasswordRef = useRef(null);

  const [formData, setFormData] = useState({
    name:            "",
    email:           "",
    password:        "",
    confirmPassword: "",
  });

  const [showPassword,        setShowPassword]        = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error,               setError]               = useState("");
  const [loading,             setLoading]             = useState(false);

  const pwd      = formData.password;
  const strength = getPasswordStrength(pwd);

  const checks = {
    length:  pwd.length >= 8,
    number:  /[0-9]/.test(pwd),
    special: /[^A-Za-z0-9]/.test(pwd),
    match:   pwd.length > 0 && pwd === formData.confirmPassword,
  };

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const password        = passwordRef.current?.value        || formData.password;
    const confirmPassword = confirmPasswordRef.current?.value || formData.confirmPassword;
    const name            = formData.name.trim();
    const email           = formData.email.trim().toLowerCase();

    if (!name) {
      setError("Please enter your name.");
      return;
    }
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    if (!password) {
      setError("Please enter a password.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError("Password must contain at least one number.");
      return;
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      setError("Password must contain at least one special character.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const params = new URLSearchParams({ name, email, password });

      const response = await fetch(
        `${API_BASE_URL}/register?${params.toString()}`,
        {
          method:  "POST",
          headers: { Accept: "application/json" },
        }
      );

      const data = await response.json();

      if (!response.ok || data.status !== "success") {
        throw new Error(data.message || "Registration failed.");
      }

      // Auto-login: store with remember-me by default
      localStorage.setItem("ecosort_user", JSON.stringify(data.user));
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
      <div className="auth-hero auth-hero-sm">
        <div className="auth-hero-icon">♻️</div>
        <h1 className="auth-hero-title">EcoSort AI</h1>
        <p className="auth-hero-subtitle">Join the green revolution</p>
      </div>

      {/* Card */}
      <div className="auth-card-mobile">
        <h2 className="auth-card-heading">Create Account</h2>
        <p className="auth-card-sub">Start sorting smarter today</p>

        <form onSubmit={handleSubmit} className="auth-form-mobile">

          <div className="auth-field">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your full name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </div>

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
                placeholder="Min 8 chars, 1 number, 1 symbol"
                value={formData.password}
                onChange={handleChange}
                onInput={handleChange}
                ref={passwordRef}
                autoComplete="new-password"
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

            {/* Strength bar */}
            {pwd.length > 0 && (
              <div className="auth-strength-wrap">
                <div className="auth-strength-track">
                  <div
                    className="auth-strength-fill"
                    style={{
                      width:      `${(strength / 4) * 100}%`,
                      background: STRENGTH_COLORS[strength],
                    }}
                  />
                </div>
                <span
                  className="auth-strength-label"
                  style={{ color: STRENGTH_COLORS[strength] }}
                >
                  {STRENGTH_LABELS[strength]}
                </span>
              </div>
            )}

            {/* Requirements checklist */}
            {pwd.length > 0 && (
              <ul className="auth-checklist">
                <li className={checks.length  ? "check-ok" : "check-no"}>
                  {checks.length  ? "✅" : "⬜"} 8+ characters
                </li>
                <li className={checks.number  ? "check-ok" : "check-no"}>
                  {checks.number  ? "✅" : "⬜"} At least one number
                </li>
                <li className={checks.special ? "check-ok" : "check-no"}>
                  {checks.special ? "✅" : "⬜"} One special character (!@#...)
                </li>
              </ul>
            )}
          </div>

          <div className="auth-field">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="auth-password-wrap">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                onInput={handleChange}
                ref={confirmPasswordRef}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="auth-eye-btn"
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-label={showConfirmPassword ? "Hide" : "Show"}
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {formData.confirmPassword.length > 0 && (
              <p className={checks.match ? "check-match-ok" : "check-match-no"}>
                {checks.match ? "✅ Passwords match" : "❌ Passwords do not match"}
              </p>
            )}
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
                Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>

        </form>

        <p className="auth-switch-text">
          Already have an account?{" "}
          <Link to="/login" className="auth-switch-link">
            Sign In
          </Link>
        </p>
      </div>

    </div>
  );
}

export default Register;
