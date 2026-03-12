import { ExchangeTemplate } from '@/templates/exchange';

type Props = {
  params: {
    slug: string;
  };
};

export default function ExchangePage({ params }: Props) {
  return <ExchangeTemplate slug={params.slug} />;
}

