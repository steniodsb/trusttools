import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Login Admin",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen grid place-items-center px-6 py-12 bg-bg">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{ background: "var(--grad-aurora)" }}
      />
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="grid h-12 w-12 place-items-center rounded-xl text-white" style={{ background: "var(--grad-primary)" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <span className="font-display font-bold text-xl">Trust Tools</span>
          </div>
          <h1 className="h-section text-[1.75rem]">Painel administrativo</h1>
          <p className="text-ink-2 mt-2">Acesso restrito à equipe.</p>
        </div>

        <div className="bg-white border border-line rounded-[20px] shadow-md p-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
