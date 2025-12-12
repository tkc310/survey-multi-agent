import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Languages } from 'lucide-react';

export default function AdminPage() {
  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">管理画面</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/texts">
          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="h-6 w-6" />
                <CardTitle>テキスト管理</CardTitle>
              </div>
              <CardDescription>
                パーリ語の経典テキストを追加・編集・削除できます
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">テキスト管理を開く</Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/dictionary">
          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Languages className="h-6 w-6" />
                <CardTitle>辞書管理</CardTitle>
              </div>
              <CardDescription>
                パーリ語の単語と翻訳を追加・編集・削除できます
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">辞書管理を開く</Button>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}

