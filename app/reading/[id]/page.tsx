import { notFound } from 'next/navigation';
import { textsApi } from '@/lib/api/texts';
import { TextReader } from '@/components/TextReader';

interface ReadingPageProps {
  params: Promise<{ id: string }>;
}

async function getText(id: string) {
  try {
    return await textsApi.getById(id);
  } catch (error) {
    console.error('Error fetching text:', error);
    return null;
  }
}

export default async function ReadingPage({ params }: ReadingPageProps) {
  const { id } = await params;
  const text = await getText(id);

  if (!text) {
    notFound();
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <TextReader text={text} />
    </div>
  );
}

