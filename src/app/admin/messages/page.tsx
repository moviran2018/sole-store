"use client";

import { useState, useEffect } from "react";
import { getMessages } from "@/lib/shoe-store";

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => { (async () => setMessages(await getMessages()))(); }, []);

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-6">
        <span className="text-orange-400 font-semibold text-sm">—— پیام‌های دریافتی ——</span>
        <h1 className="text-2xl font-bold text-white mt-1">{messages.length} پیام</h1>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <span className="text-4xl block mb-3">✉️</span>
          <p>هیچ پیامی دریافت نشده</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className="bg-gray-900/50 rounded-2xl p-5 border border-gray-800">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-white font-medium">{msg.name}</p>
                  <p className="text-xs text-gray-500">{msg.email} · {msg.createdAt}</p>
                </div>
              </div>
              {msg.subject && <p className="text-sm text-orange-400 mb-1">{msg.subject}</p>}
              <p className="text-sm text-gray-300 leading-relaxed">{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
