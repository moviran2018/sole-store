"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/lib/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(pass)) {
      router.replace("/admin");
    } else {
      setError(true);
      setPass("");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4" dir="rtl">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">👟</div>
          <h1 className="text-2xl font-bold text-white mb-1">Sole Store</h1>
          <p className="text-sm text-gray-500">پنل مدیریت</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-6 space-y-4">
          <div>
            <label className="text-sm text-gray-400 block mb-2">رمز عبور</label>
            <input
              type="password"
              value={pass}
              onChange={(e) => { setPass(e.target.value); setError(false); }}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white text-center text-lg tracking-widest focus:outline-none focus:border-orange-500/50 transition-all"
              placeholder="••••••"
              autoFocus
            />
            {error && <p className="text-red-500 text-xs mt-2 text-center">رمز عبور اشتباه است</p>}
          </div>
          <button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-xl font-medium transition-all shadow-lg shadow-orange-600/25">
            ورود
          </button>
        </form>
      </div>
    </div>
  );
}
