import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            パーリ語学習
          </Link>
          <div className="flex gap-4">
            <Link href="/">
              <Button variant="ghost">ホーム</Button>
            </Link>
            <Link href="/admin">
              <Button variant="ghost">管理画面</Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

