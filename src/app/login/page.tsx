import Link from "next/link";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">ログイン</h1>
          <p className="text-gray-600 mt-2">英語リスニング練習を始めましょう</p>
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <LoginForm />

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              アカウントをお持ちでないですか？{" "}
              <Link
                href="/signup"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                新規登録
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
