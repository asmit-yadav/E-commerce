import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import * as z from "zod";

const authSchema = z.object({
  email: z.string().email("Invalid email format "),
  PasswordHash: z.string().min(6, "Password must be at least 6 characters"),
});

const AuthForm = ({ type }: { type: "login" | "register" }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(authSchema) });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`http://localhost:5176/api/auth/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Something went wrong");

      console.log("Success:", result);
      localStorage.setItem("token", result.token);
      localStorage.setItem("userId", result.userId);
      localStorage.setItem("userEmail", result.email);
      navigate("/"); // Redirect to home
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">{type === "login" ? "Login" : "Sign Up"}</h2>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <input
            {...register("email")}
            id="email"  // Add the 'id' to the input
            type="email"
            className="w-full p-2 border rounded"
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="PasswordHash" className="block text-sm font-medium">Password</label>
          <input
            {...register("PasswordHash")}
            id="PasswordHash"  // Ensure 'id' is present for proper association with label
            type="password"
            className="w-full p-2 border rounded"
            placeholder="Enter your password"  // Added placeholder
          />
          {errors.PasswordHash && <p className="text-red-500 text-xs">{errors.PasswordHash.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-[#326ed1] text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? "Processing..." : type === "login" ? "Login" : "Sign Up"}
        </button>

      </form>
    </div>
  );
};

export default AuthForm;
