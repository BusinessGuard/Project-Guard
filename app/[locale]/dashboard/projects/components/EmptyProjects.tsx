'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function EmptyProjects() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="max-w-md space-y-6">
        <div className="space-y-3">
          <h2 className="text-4xl font-bold text-gray-900">No Projects Yet</h2>
          <p className="text-gray-600 text-lg">
            Start your journey by creating your first project. 
            Get AI-powered analysis and insights to help your business grow.
          </p>
        </div>
        <Link href="/create">
          <Button size="lg" className="text-base px-8">
            Create Project
          </Button>
        </Link>
      </div>
    </div>
  );
}
