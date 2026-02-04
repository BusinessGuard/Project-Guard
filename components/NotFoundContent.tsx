'use client';

import { Button } from '@/components/ui/button';

interface NotFoundContentProps {
  onBack: () => void;
}

export function NotFoundContent({ onBack }: NotFoundContentProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">Страница не найдена</h1>
        <p className="text-gray-600 text-lg">Запрашиваемая страница не существует</p>
        <Button 
          onClick={onBack}
          size="lg"
        >
          Назад
        </Button>
      </div>
    </div>
  );
}
