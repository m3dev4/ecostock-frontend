import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/auth.store";
import { Loader2 } from "lucide-react";
import React from "react";
import { useState } from "react";
import {useNavigate} from "react-router-dom"

const Login = () => {
  const { login, loading, error } = useAuthStore();
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const success = await login(formData);
      if (success) {
        navigate("/")
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-cyan-900 via-slate-900 to-black text-white p-16">
        <div className="max-w-lg flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-cyan-500 flex items-center justify-center font-bold text-xl">
              E
            </div>

            <h1 className="text-3xl font-bold">EcoStock</h1>
          </div>

          <div className="space-y-6">
            <span className="text-cyan-400 uppercase tracking-widest text-sm">
              Warehouse Management
            </span>

            <h2 className="text-5xl font-bold leading-tight">
              Manage your inventory with confidence.
            </h2>

            <p className="text-slate-300 text-lg leading-8">
              Track warehouses, monitor stock levels, manage products and keep
              your entire inventory synchronized in one place.
            </p>
          </div>

          <div className="text-sm text-slate-400">
            © 2026 EcoStock. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex flex-1 items-center justify-center bg-slate-50 px-6 py-10">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border p-8">
          {/* Mobile Logo */}
          <div className="flex lg:hidden justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-700"></div>
              <span className="text-2xl font-bold">EcoStock</span>
            </div>
          </div>

          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>

            <p className="text-muted-foreground">
              Sign in to access your warehouse dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>

              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    username: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>

              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-cyan-700 hover:bg-cyan-800"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
