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
            'Hoje suportamos Ethereum, BSC, Polygon, Arbitrum, Avalanche, Bitcoin e Solana. Novas redes são integradas conforme demanda. O rastreio considera transferências nativas e de tokens (ERC-20 e equivalentes) em cada chain.',
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
        <section
            className="relative landing-section"
            style={{ background: 'rgba(10, 11, 14, 0.62)' }}
            aria-labelledby="faq-heading"
        >
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
                <div className="chains-life-beam absolute left-1/2 top-1/2 h-[300px] w-[62vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-65" />
            </div>
            <LandingAnimateOnScroll className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
                <div className="landing-animate-in flex justify-center">
                    <span className="rounded-full border border-primary/20 bg-primary/8 px-4 py-1 text-[10px] font-semibold tracking-[0.18em] text-primary/85 sm:text-xs">
                        FAQ OPERACIONAL
                    </span>
                </div>
                <h2 id="faq-heading" className="landing-animate-in text-center landing-h2">
                    Perguntas frequentes
                </h2>
                <p className="landing-animate-in landing-animate-in-delay-1 mx-auto mt-4 max-w-[70ch] text-center landing-body-sm">
                    Dúvidas comuns sobre a plataforma e o rastreio on-chain.
                </p>
                <Accordion type="single" defaultValue="faq-0" collapsible={false} className="landing-stagger relative z-10 mx-auto mt-12 max-w-4xl space-y-4 pb-4">
                    {FAQ_ITEMS.map((item, i) => (
                        <AccordionItem
                            key={i}
                            value={`faq-${i}`}
                            className="overflow-hidden rounded-xl border border-white/8 bg-[#111218]/65 px-4 transition-colors duration-300 hover:border-primary/25 hover:bg-[#161922]/70 sm:px-5"
                        >
                            <AccordionTrigger className="cursor-pointer py-4 text-left text-base font-semibold text-foreground hover:no-underline">
                                {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="landing-body-sm pb-4 pr-7 text-white/72 sm:pb-5">
                                {item.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </LandingAnimateOnScroll>
        </section>
    );
}
