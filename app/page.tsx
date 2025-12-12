import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

async function getTexts() {
  try {
    const { textsApi } = await import('@/lib/api/texts');
    return await textsApi.getAll();
  } catch (error) {
    console.error('Error fetching texts:', error);
    return [];
  }
}

export default async function Home() {
  const texts = await getTexts();

  return (
    <div className="container mx-auto p-8 pb-20 font-[family-name:var(--font-noto-sans-jp)]">
      <main className="max-w-6xl mx-auto">
        <section className="mb-12">
          <h1 className="text-4xl font-bold mb-4">パーリ語学習サイト</h1>
          <p className="text-lg text-muted-foreground">
            パーリ語の主要な経典を題材としたテキスト読解と音声読み上げを中心とした学習サイトです。
          </p>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-semibold">テキスト一覧</h2>
            <Link href="/admin/texts">
              <Button variant="outline">テキストを管理</Button>
            </Link>
          </div>

          {texts.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  テキストがまだ登録されていません。管理画面から追加してください。
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {texts.map((text) => (
                <Link key={text.id} href={`/reading/${text.id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle>{text.title}</CardTitle>
                      {text.source && (
                        <CardDescription>{text.source}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm line-clamp-3">{text.content}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

