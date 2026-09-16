"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  registerSchema,
  LoginInput,
  RegisterInput,
} from "@/lib/validation/auth";

function CustomerAuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isSignup, setIsSignup] = useState(
    searchParams.get("mode") === "signup"
  );

  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loginForm = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  async function onLogin(data: LoginInput) {
    setServerError(null);
    setSubmitting(true);

    const res = await signIn("customer-login", {
      ...data,
      redirect: false,
    });

    setSubmitting(false);

    if (res?.error) {
      setServerError("Incorrect email or password.");
      return;
    }

    router.push(searchParams.get("callbackUrl") || "/account");
    router.refresh();
  }

  async function onSignup(data: RegisterInput) {
    setServerError(null);
    setSubmitting(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setServerError(
        body.error || "Something went wrong. Please try again."
      );
      setSubmitting(false);
      return;
    }

    const loginRes = await signIn("customer-login", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    setSubmitting(false);

    if (loginRes?.error) {
      setServerError(
        "Account created successfully. Please login."
      );
      setIsSignup(false);
      return;
    }

    router.push("/account");
    router.refresh();
  }

  function switchMode(signup: boolean) {
    setServerError(null);
    setIsSignup(signup);
  }

  return (
    <main className="min-h-screen bg-[#f8f6f2] flex items-center justify-center px-4 py-8">
      <div
        className="
          relative
          w-full
          max-w-[950px]
          min-h-[600px]
          overflow-hidden
          rounded-[28px]
          bg-white
          shadow-[0_20px_60px_rgba(0,0,0,0.12)]
        "
      >
        {/* LOGIN FORM */}
        <div
          className={`
            absolute
            top-0
            left-0
            h-full
            w-1/2
            flex
            items-center
            justify-center
            px-10
            transition-all
            duration-700
            ease-in-out
            ${
              isSignup
                ? "translate-x-full opacity-0 pointer-events-none"
                : "translate-x-0 opacity-100"
            }
          `}
        >
          <div className="w-full max-w-[360px]">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-semibold text-[#181512]">
                Welcome Back
              </h1>

              <p className="mt-2 text-sm text-[#77716b]">
                Login to continue to your account
              </p>
            </div>

            <form
              onSubmit={loginForm.handleSubmit(onLogin)}
              noValidate
              className="space-y-4"
            >
              {serverError && !isSignup && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                  {serverError}
                </p>
              )}

              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  autoComplete="email"
                  className="w-full rounded-xl border border-[#ded9d3] bg-[#faf9f7] px-4 py-3.5 outline-none transition focus:border-[#bd542d] focus:ring-2 focus:ring-[#bd542d]/10"
                  {...loginForm.register("email")}
                />

                {loginForm.formState.errors.email && (
                  <p className="mt-1 text-xs text-red-500">
                    {loginForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Password"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-[#ded9d3] bg-[#faf9f7] px-4 py-3.5 outline-none transition focus:border-[#bd542d] focus:ring-2 focus:ring-[#bd542d]/10"
                  {...loginForm.register("password")}
                />

                {loginForm.formState.errors.password && (
                  <p className="mt-1 text-xs text-red-500">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="text-right">
                <Link
                  href="/forgot-password"
                  className="text-sm text-[#bd542d] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-[#181512] py-3.5 font-medium text-white transition hover:bg-[#302b27] disabled:opacity-60"
              >
                {submitting ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#77716b] md:hidden">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => switchMode(true)}
                className="font-medium text-[#bd542d]"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>

        {/* SIGNUP FORM */}
        <div
          className={`
            absolute
            top-0
            left-0
            h-full
            w-1/2
            flex
            items-center
            justify-center
            px-10
            transition-all
            duration-700
            ease-in-out
            ${
              isSignup
                ? "translate-x-full opacity-100"
                : "translate-x-0 opacity-0 pointer-events-none"
            }
          `}
        >
          <div className="w-full max-w-[360px]">
            <div className="mb-6 text-center">
              <h1 className="text-3xl font-semibold text-[#181512]">
                Create Account
              </h1>

              <p className="mt-2 text-sm text-[#77716b]">
                Create your account and get started
              </p>
            </div>

            <form
              onSubmit={registerForm.handleSubmit(onSignup)}
              noValidate
              className="space-y-3"
            >
              {serverError && isSignup && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                  {serverError}
                </p>
              )}

              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  autoComplete="name"
                  className="w-full rounded-xl border border-[#ded9d3] bg-[#faf9f7] px-4 py-3.5 outline-none transition focus:border-[#bd542d] focus:ring-2 focus:ring-[#bd542d]/10"
                  {...registerForm.register("name")}
                />

                {registerForm.formState.errors.name && (
                  <p className="mt-1 text-xs text-red-500">
                    {registerForm.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  autoComplete="email"
                  className="w-full rounded-xl border border-[#ded9d3] bg-[#faf9f7] px-4 py-3.5 outline-none transition focus:border-[#bd542d] focus:ring-2 focus:ring-[#bd542d]/10"
                  {...registerForm.register("email")}
                />

                {registerForm.formState.errors.email && (
                  <p className="mt-1 text-xs text-red-500">
                    {registerForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="tel"
                  placeholder="Phone (optional)"
                  autoComplete="tel"
                  className="w-full rounded-xl border border-[#ded9d3] bg-[#faf9f7] px-4 py-3.5 outline-none transition focus:border-[#bd542d] focus:ring-2 focus:ring-[#bd542d]/10"
                  {...registerForm.register("phone")}
                />

                {registerForm.formState.errors.phone && (
                  <p className="mt-1 text-xs text-red-500">
                    {registerForm.formState.errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Password"
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-[#ded9d3] bg-[#faf9f7] px-4 py-3.5 outline-none transition focus:border-[#bd542d] focus:ring-2 focus:ring-[#bd542d]/10"
                  {...registerForm.register("password")}
                />

                {registerForm.formState.errors.password ? (
                  <p className="mt-1 text-xs text-red-500">
                    {registerForm.formState.errors.password.message}
                  </p>
                ) : (
                  <p className="mt-1 text-xs text-[#8b847e]">
                    At least 8 characters, with a letter and a number.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-[#181512] py-3.5 font-medium text-white transition hover:bg-[#302b27] disabled:opacity-60"
              >
                {submitting
                  ? "Creating account..."
                  : "Sign Up"}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-[#77716b] md:hidden">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => switchMode(false)}
                className="font-medium text-[#bd542d]"
              >
                Login
              </button>
            </p>
          </div>
        </div>

        {/* SLIDING PANEL */}
        <div
          className={`
            absolute
            top-0
            right-0
            h-full
            w-1/2
            overflow-hidden
            rounded-[28px]
            transition-all
            duration-700
            ease-in-out
            ${
              isSignup
                ? "-translate-x-full"
                : "translate-x-0"
            }
          `}
        >
          <div className="relative h-full w-full bg-[#bd542d] text-white">
            {/* LOGIN SIDE */}
            <div
              className={`
                absolute
                inset-0
                flex
                flex-col
                items-center
                justify-center
                px-12
                text-center
                transition-all
                duration-500
                ${
                  isSignup
                    ? "translate-x-full opacity-0"
                    : "translate-x-0 opacity-100"
                }
              `}
            >
              <h2 className="text-4xl font-semibold">
                Hello, Friend!
              </h2>

              <p className="mt-4 max-w-[300px] text-sm leading-6 text-white/85">
                Don't have an account?
                <br />
                Create one and get started today.
              </p>

              <button
                type="button"
                onClick={() => switchMode(true)}
                className="mt-8 rounded-xl border border-white px-10 py-3 font-medium transition hover:bg-white hover:text-[#bd542d]"
              >
                Sign Up
              </button>
            </div>

            {/* SIGNUP SIDE */}
            <div
              className={`
                absolute
                inset-0
                flex
                flex-col
                items-center
                justify-center
                px-12
                text-center
                transition-all
                duration-500
                ${
                  isSignup
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-full opacity-0"
                }
              `}
            >
              <h2 className="text-4xl font-semibold">
                Welcome Back!
              </h2>

              <p className="mt-4 max-w-[300px] text-sm leading-6 text-white/85">
                Already have an account?
                <br />
                Login and continue your journey.
              </p>

              <button
                type="button"
                onClick={() => switchMode(false)}
                className="mt-8 rounded-xl border border-white px-10 py-3 font-medium transition hover:bg-white hover:text-[#bd542d]"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CustomerLoginPage() {
  return (
    <Suspense fallback={null}>
      <CustomerAuthForm />
    </Suspense>
  );
}