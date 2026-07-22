import Link from 'next/link';
import AuthForm from '@/components/AuthForm';

export const metadata = {
  title: 'Sign in — APParattus',
};

export default function LoginPage() {
  return (
    <main className="authShell">
      <div className="panel authPanel">
        <p className="eyebrow">Welcome back</p>
        <h1 className="authTitle">Sign in</h1>
        <AuthForm mode="login" />
        <p className="authSwitch">
          New to APParattus? <Link href="/signup">Create an account</Link>
        </p>
      </div>
    </main>
  );
}
