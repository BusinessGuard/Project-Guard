'use client';

import { Button } from '@/components/ui/button';
import styles from './NotFoundContent.module.css';

interface NotFoundContentProps {
  onBack: () => void;
}

export function NotFoundContent({ onBack }: NotFoundContentProps) {
  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <p className={styles.eyebrow}>ERROR 404</p>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.subtitle}>
          Sorry, the page you are looking for does not exist or has been moved.
        </p>
        <div className={styles.actions}>
          <Button onClick={onBack} size="lg">
            Go back
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="/dashboard/projects">Go to dashboard</a>
          </Button>
        </div>
      </section>
    </main>
  );
}
