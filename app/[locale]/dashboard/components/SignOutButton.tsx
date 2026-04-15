'use client';

import { CiLogout, CiLogin } from 'react-icons/ci';
import { useRouter } from '@/lib/navigation';
import { Link } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { useTranslations } from 'next-intl';

interface SignOutButtonProps {
  isAuthenticated: boolean;
  onSignOut?: () => void;
}

export function SignOutButton({ isAuthenticated, onSignOut }: SignOutButtonProps) {
  const tAuth = useTranslations('auth');
  const tNav = useTranslations('nav');
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    onSignOut?.();
    router.push('/');
  };

  if (!isAuthenticated) {
    return (
      <Link href="/">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 cursor-pointer px-4 h-13 shadow-none"
        >
          <CiLogin className="size-6" />
          <span>{tNav('home')}</span>
        </Button>
      </Link>
    );
  }

  return (
    <Button
      onClick={handleSignOut}
      variant="outline"
      className="w-full flex items-center justify-center gap-2 cursor-pointer px-4 h-13 shadow-none"
    >
      <CiLogout className="size-6" />
      <span>{tAuth('signOut')}</span>
    </Button>
  );
}
