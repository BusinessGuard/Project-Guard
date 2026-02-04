'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from '@/lib/navigation';

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

export function AuthPromptModal({ 
  isOpen, 
  onClose,
  title = "Sign Up Required",
  message = "Please sign up to access this feature and unlock all capabilities."
}: AuthPromptModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-md space-y-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-slate-600">{message}</p>
        <div className="flex gap-3">
          <Button onClick={() => router.push('/login')} className="flex-1">
            Sign Up
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
