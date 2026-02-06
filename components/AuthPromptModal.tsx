'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from '@/lib/navigation';
import { useTranslations } from 'next-intl';

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export function AuthPromptModal({ 
  isOpen, 
  onClose,
  title,
  message
}: AuthPromptModalProps) {
  const t = useTranslations('auth.promptModal');
  const tAuth = useTranslations('auth');
  const tCommon = useTranslations('common');
  const router = useRouter();

  if (!isOpen) return null;

  const modalTitle = title || t('defaultTitle');
  const modalMessage = message || t('defaultMessage');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-md space-y-4">
        <h2 className="text-2xl font-bold">{modalTitle}</h2>
        <p className="text-slate-600">{modalMessage}</p>
        <div className="flex gap-3">
          <Button onClick={() => router.push('/login')} className="flex-1">
            {tAuth('signUp')}
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1">
            {tCommon('cancel')}
          </Button>
        </div>
      </div>
    </div>
  );
}
