"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "メールアドレスを入力してください" })
    .email({ message: "正しいメールアドレスを入力してください" }),
  password: z.string().min(1, { message: "パスワードを入力してください" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // サインアップ成功時のメッセージを表示
    if (searchParams.get("message") === "signup-success") {
      setSuccessMessage("アカウントが作成されました。ログインしてください。");
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setServerError(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        // エラーメッセージを日本語に変換
        let japaneseErrorMessage = "予期せぬエラーが発生しました";
        if (error.message === "Invalid login credentials") {
          japaneseErrorMessage =
            "メールアドレスまたはパスワードが正しくありません";
        } else if (error.message === "Email not confirmed") {
          japaneseErrorMessage = "メールアドレスが確認されていません";
        }
        throw new Error(japaneseErrorMessage);
      }

      // 成功したらダッシュボードへ
      router.push("/");
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "予期せぬエラーが発生しました"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {serverError}
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          メールアドレス
        </label>
        <div className="mt-1">
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register("email")}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          パスワード
        </label>
        <div className="mt-1">
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register("password")}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? "ログイン中..." : "ログイン"}
        </button>
      </div>
    </form>
  );
}
