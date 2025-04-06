'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './SignInForm.module.css';

export default function SignInForm() {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('メールアドレスまたはパスワードが正しくありません');
        return;
      }

      router.push('/');
      router.refresh();
    } catch (error) {
      setError('エラーが発生しました。もう一度お試しください。');
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formContent}>
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}
          <div className={styles.inputGroup}>
            <input
              required
              id="email"
              type="email"
              name="email"
              placeholder="メールアドレス"
              autoComplete="email"
              autoFocus
              className={styles.input}
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              required
              type="password"
              name="password"
              id="password"
              placeholder="パスワード"
              autoComplete="current-password"
              className={styles.input}
            />
          </div>
          <button
            type="submit"
            className={styles.submitButton}
          >
            サインイン
          </button>
        </div>
      </form>
    </div>
  );
}
