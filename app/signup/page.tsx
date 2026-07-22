import Link from 'next/link';
import AuthForm from '@/components/AuthForm';

export const metadata = {
  title: 'Create an account — APParattus',
};

export default function SignupPage() {
  return (
    <main className="authShell">
      <div className="panel authPanel">
        <p className="eyebrow">Start a launch</p>
        <h1 className="authTitle">Create your account</h1>
        <AuthForm mode="signup" />
        <p className="authSwitch">
          Already have an account? <Link href="/login">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
