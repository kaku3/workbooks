'use client';

import SignInForm from './SignInForm';
import styles from './SignInContainer.module.css';

export default function SignInContainer() {
  return (
    <main className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>サインイン</h1>
        <SignInForm />
      </div>
    </main>
  );
}
