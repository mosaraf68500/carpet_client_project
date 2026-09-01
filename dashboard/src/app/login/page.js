import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Admin Login | Doha Furniture أثاث الدوحة",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <h1 className="mb-8 text-center text-2xl font-semibold text-heading">Admin Login</h1>
        <LoginForm />
      </div>
    </div>
  );
}
