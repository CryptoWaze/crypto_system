'use client';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { LandingAnimateOnScroll } from './landing-animate-on-scroll';

const FAQ_ITEMS = [
    {
        question: 'O que é o rastreio de transações?',
        answer:
            'É o mapeamento do fluxo de valores em blockchain: a partir de um hash de transação ou endereço, o sistema identifica os saltos entre carteiras até o destino final, incluindo exchanges e hot wallets, com suporte a múltiplas chains e milhares de tokens.',
    },
    {
        question: 'Quais blockchains são suportadas?',
        answer:
            'Hoje suportamos Ethereum, BSC, Polygon, Arbitrum, Base e Avalanche. Novas redes são integradas conforme demanda. O rastreio considera transferências nativas e de tokens (ERC-20 e equivalentes) em cada chain.',
    },
    {
        question: 'Em que formato são os relatórios?',
        answer:
            'Os relatórios podem ser exportados para uso em processos e perícias. Incluem o grafo de fluxo de fundos, detalhes de transações, endereços e valores, em formato adequado para documentação técnica e jurídica.',
    },
    {
        question: 'Os dados ficam armazenados?',
        answer:
            'Os casos e o histórico de rastreios ficam associados à sua conta, com acesso restrito. Você pode editar nomes, organizar o grafo e exportar relatórios quando precisar.',
    },
    {
        question: 'Preciso de conhecimento técnico em blockchain?',
        answer:
            'Não é obrigatório. A interface guia o preenchimento (hash da transação, valor reportado). O resultado é apresentado em grafo e tabelas. Para laudos e uso jurídico, recomendamos o suporte de um profissional com experiência em criptoativos.',
    },
] as const;

export function LandingFaq() {
    return (
        <section className="relative landing-section" aria-labelledby="faq-heading">
            <LandingAnimateOnScroll className="mx-auto max-w-3xl px-4 sm:px-6">
                <h2 id="faq-heading" className="landing-animate-in text-center landing-h2">
                    Perguntas frequentes
                </h2>
                <p className="landing-animate-in landing-animate-in-delay-1 mx-auto mt-4 max-w-[70ch] text-center landing-body-sm">
                    Dúvidas comuns sobre a plataforma e o rastreio on-chain.
                </p>
                <Accordion type="single" collapsible className="landing-stagger mt-10">
                    {FAQ_ITEMS.map((item, i) => (
                        <AccordionItem key={i} value={`faq-${i}`}>
                            <AccordionTrigger className="text-left text-foreground hover:no-underline">
                                {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="landing-body-sm">
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </LandingAnimateOnScroll>
        </section>
    );
}
