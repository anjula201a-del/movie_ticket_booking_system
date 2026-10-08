import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { SignIn } from "../../models/SignIn";
import AuthService from "../../service/AuthService";

export const LogIn = () => {
    const [signIn, setSignIn] = useState<SignIn>({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSignIn((prev) => ({ ...prev, [name]: value }));
    };

    const handleReset = () => {
        setSignIn({
            email: "",
            password: "",
        });
        setError("");
    };

    const { login } = useAuth();
    const navigate = useNavigate();

    const validate = (): string => {
        if (!signIn.email.trim() || !signIn.password.trim()) {
            return "Email and password are required.";
        }
        if (!/^\S+@\S+\.\S+$/.test(signIn.email)) {
            return "Please enter a valid email address.";
        }
        return "";
    };

    const handleOnSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        const message = validate();
        if (message) {
            setError(message);
            return;
        }

        try {
            setLoading(true);
            setError("");
            const token = await AuthService.signIn(signIn);
            login(token);
            handleReset();
            navigate("/movies");
        } catch (err) {
            setError("Invalid email or password.");
        } finally {
            setLoading(false);
        }
    };

   return (
   <div
    className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: "url('/movie-background-collage_23-2149876019.avif')" }}
>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm bg-black/60 rounded-xl px-6 py-8">
            <h2 className="text-center text-2xl/9 font-bold tracking-tight text-white">
                Login to Movie Ticket Booking
            </h2>

            <form className="mt-8 space-y-6" onSubmit={handleOnSubmit}>
                {error && (
                    <p className="p-2 text-sm text-red-700 bg-red-100 rounded">
                        {error}
                    </p>
                )}

                <div>
                    <label htmlFor="email" className="block text-sm/6 font-medium text-white">
                        Email
                    </label>
                    <div className="mt-2">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={signIn.email}
                            onChange={handleOnChange}
                            required
                            className="block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm/6 font-medium text-white">
                        Password
                    </label>
                    <div className="mt-2">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={signIn.password}
                            onChange={handleOnChange}
                            required
                            className="block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full justify-center rounded-md bg-green-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-green-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 mb-4 disabled:opacity-50"
                    >
                        {loading ? "Signing in..." : "Login"}
                    </button>
                    <button
                        type="button"
                        onClick={handleReset}
                        className="flex w-full justify-center rounded-md bg-red-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
                    >
                        Reset
                    </button>
                </div>
            </form>

            <p className="mt-8 text-center text-sm/6 text-gray-300">
                Not a member?{" "}
                <Link to="/sign-up" className="font-semibold text-blue-400 hover:text-blue-300">
                    Sign Up
                </Link>
            </p>
        </div>
    </div>
);
}