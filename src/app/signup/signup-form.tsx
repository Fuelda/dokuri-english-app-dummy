"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SIGNUP_AUTH_CODE } from "@/constants/auth";

const signUpSchema = z.object({
  email: z
    .string()
    .min(1, { message: "メールアドレスを入力してください" })
    .email({ message: "正しいメールアドレスを入力してください" }),
  username: z
    .string()
    .min(2, { message: "ユーザー名は2文字以上で入力してください" })
    .max(20, { message: "ユーザー名は20文字以下で入力してください" }),
  password: z
    .string()
    .min(8, { message: "パスワードは8文字以上で入力してください" })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/, {
      message: "パスワードは英字と数字を含める必要があります",
    }),
  authCode: z
    .string()
    .min(1, { message: "認証コードを入力してください" })
    .refine((code) => code === SIGNUP_AUTH_CODE, {
      message: "認証コードが正しくありません",
    }),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormValues) => {
    setLoading(true);
    setServerError(null);

    try {
      const supabase = createClient();

      // ユーザーの作成
      const { error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username,
          },
        },
      });

      if (signUpError) throw signUpError;

      // 成功したらログインページへ
      router.push("/login?message=signup-success");
    } catch (error) {
      console.error("Error signing up:", error);
      setServerError(
        error instanceof Error ? error.message : "予期せぬエラーが発生しました"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
          htmlFor="username"
          className="block text-sm font-medium text-gray-700"
        >
          ユーザー名
        </label>
        <div className="mt-1">
          <input
            id="username"
            type="text"
            {...register("username")}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">
              {errors.username.message}
            </p>
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
            autoComplete="new-password"
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
        <label
          htmlFor="authCode"
          className="block text-sm font-medium text-gray-700"
        >
          認証コード
        </label>
        <div className="mt-1">
          <input
            id="authCode"
            type="text"
            {...register("authCode")}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.authCode && (
            <p className="mt-1 text-sm text-red-600">
              {errors.authCode.message}
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
          {loading ? "アカウント作成中..." : "アカウントを作成"}
        </button>
      </div>
    </form>
  );
}
