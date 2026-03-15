import { ExchangeTemplate } from '@/templates/exchange';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ExchangePage({ params }: Props) {
  const { slug } = await params;
  return <ExchangeTemplate slug={slug} />;
}

