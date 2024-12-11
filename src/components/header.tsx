"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function Header() {
  const pathname = usePathname();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
  };

  // ログイン画面ではヘッダーを表示しない
  if (pathname === "/login") {
    return null;
  }

  return (
    <header className="bg-white border-b">
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold text-gray-900 hover:text-gray-700"
          >
            英語リスニング練習
          </Link>

          <nav className="flex items-center space-x-4">
            <Link
              href="/sentences/add"
              className={`text-sm ${
                pathname === "/sentences/add"
                  ? "text-indigo-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              英文追加
            </Link>
            <Link
              href="/incorrect"
              className={`text-sm ${
                pathname === "/incorrect"
                  ? "text-indigo-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              マイ英文リスト
            </Link>
            <button
              onClick={handleSignOut}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ログアウト
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
