import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../../service/AuthService";

export const SignUp = () => {
  const [form, setForm] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "CUSTOMER",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleOnChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = (): string => {
    if (!form.userName.trim() || !form.email.trim() || !form.password.trim()) {
      return "All fields are required.";
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      return "Please enter a valid email address.";
    }
    if (form.password.length < 6) {
      return "Password must be at least 6 characters.";
    }
    if (form.password !== form.confirmPassword) {
      return "Passwords do not match.";
    }
    return "";
  };

  const handleOnSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const message = validate();
    if (message) {
      setError(message);
      return;
    }

    try {
      setLoading(true);
      setError("");
      await AuthService.signUp({
        userName: form.userName,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      navigate("/sign-in");
    } catch (err) {
      setError("Sign up failed. The email may already be registered.");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div
    className="flex min-h-screen justify-center items-center px-6 py-12 bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: "url('/movie-background-collage_23-2149876019.avif')" }}
  >
    <form
      onSubmit={handleOnSubmit}
      className="bg-white/90 p-8 rounded-lg shadow-md w-full max-w-sm"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

      {error && (
        <p className="mb-4 p-2 text-sm text-red-700 bg-red-100 rounded">
          {error}
        </p>
      )}

      <label className="block mb-1 text-sm font-medium">User name</label>
      <input
        name="userName"
        value={form.userName}
        onChange={handleOnChange}
        className="w-full mb-4 p-2 border rounded"
      />

      <label className="block mb-1 text-sm font-medium">Email</label>
      <input
        type="email"
        name="email"
        value={form.email}
        onChange={handleOnChange}
        className="w-full mb-4 p-2 border rounded"
      />

      <label className="block mb-1 text-sm font-medium">Password</label>
      <input
        type="password"
        name="password"
        value={form.password}
        onChange={handleOnChange}
        className="w-full mb-4 p-2 border rounded"
      />

      <label className="block mb-1 text-sm font-medium">Confirm password</label>
      <input
        type="password"
        name="confirmPassword"
        value={form.confirmPassword}
        onChange={handleOnChange}
        className="w-full mb-4 p-2 border rounded"
      />

      <label className="block mb-1 text-sm font-medium">Role</label>
      <select
        name="role"
        value={form.role}
        onChange={handleOnChange}
        className="w-full mb-6 p-2 border rounded"
      >
        <option value="CUSTOMER">Customer</option>
        <option value="ADMIN">Admin</option>
      </select>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700 disabled:opacity-50"
      >
        {loading ? "Creating account..." : "Sign Up"}
      </button>

      <p className="mt-4 text-sm text-center">
        Already registered?{" "}
        <Link to="/sign-in" className="text-blue-600 underline">
          Sign In
        </Link>
      </p>
    </form>
  </div>
);
}