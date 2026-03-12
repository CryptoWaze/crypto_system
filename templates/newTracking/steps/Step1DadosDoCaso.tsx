'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PageHeader } from '@/components/common/pageHeader';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { CircleHelp, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { HashValueRow } from '../types';
import { maskNumericValue } from '../utils';
import type { CreateCaseMode } from '@/lib/services/cases/create-case.service';

function FieldLabelWithTooltip({ id, label, tooltip }: { id?: string; label: string; tooltip: string }) {
    return (
        <div className="flex items-center gap-1.5">
            <Label htmlFor={id} className="text-sm font-medium text-foreground">
                {label}
            </Label>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        type="button"
                        className="inline-flex size-4 shrink-0 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2"
                        aria-label={tooltip}
                    >
                        <CircleHelp className="size-4" aria-hidden />
                    </button>
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={6}>
                    {tooltip}
                </TooltipContent>
            </Tooltip>
        </div>
    );
}

type Step1DadosDoCasoProps = {
    caseName: string;
    setCaseName: (v: string) => void;
    mode: CreateCaseMode;
    setMode: (v: CreateCaseMode) => void;
    rows: HashValueRow[];
    caseNameError: string | null;
    setCaseNameError: (v: string | null) => void;
    dadosError: string | null;
    setDadosError: (v: string | null) => void;
    onAddRow: () => void;
    onRemoveRow: (index: number) => void;
    onUpdateRow: (index: number, field: 'hash' | 'value', value: string) => void;
    onSubmit: () => void;
};

export function Step1DadosDoCaso({
    caseName,
    setCaseName,
    mode,
    setMode,
    rows,
    caseNameError,
    setCaseNameError,
    dadosError,
    setDadosError,
    onAddRow,
    onRemoveRow,
    onUpdateRow,
    onSubmit,
}: Step1DadosDoCasoProps) {
    return (
        <>
            <PageHeader
                className="mx-auto mt-5"
                title="Iniciar rastreamento"
                description="Preencha o nome do caso e os pares de hash e valor para rastrear."
            />
            <form
                id="rastreio-novo-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit();
                }}
                className="mt-8 flex flex-col gap-6"
            >
                <div className="space-y-2">
                    <FieldLabelWithTooltip
                        id="case-name"
                        label="Nome do caso"
                        tooltip="Informe um nome para identificar este caso de investigação."
                    />
                    <Input
                        id="case-name"
                        type="text"
                        placeholder="Ex.: nome da pessoa"
                        value={caseName}
                        onChange={(e) => {
                            setCaseName(e.target.value);
                            setCaseNameError(null);
                        }}
                        onFocus={() => setCaseNameError(null)}
                        className={cn('rounded-[6px]', caseNameError && 'border-destructive')}
                        aria-invalid={!!caseNameError}
                        aria-describedby={caseNameError ? 'case-name-error' : undefined}
                    />
                    {caseNameError && (
                        <p id="case-name-error" className="text-xs text-destructive">
                            {caseNameError}
                        </p>
                    )}
                    <div className="space-y-2 pt-4">
                        <FieldLabelWithTooltip
                            label="Modo de rastreamento"
                            tooltip="Escolha o modo de rastreamento: Básico para uma análise mais rápida ou Avançado para uma investigação mais detalhada."
                        />
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant={mode === 'basic' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setMode('basic')}
                                className="min-w-26 rounded-[6px] border"
                            >
                                Básico
                            </Button>
                            <Button
                                type="button"
                                variant={mode === 'advanced' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setMode('advanced')}
                                className="min-w-26 rounded-[6px] border"
                            >
                                Avançado
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <FieldLabelWithTooltip
                        label="Dados para rastreio"
                        tooltip="Adicione um ou mais pares: hash (endereço ou transação na blockchain) e o valor em criptoativo associado."
                    />
                    <div className={cn('rounded-lg border bg-muted/20', dadosError ? 'border-destructive' : 'border-border')}>
                        <div className="grid grid-cols-[1fr_10rem_2.5rem] gap-2 border-b border-border bg-muted/40 px-3 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:grid-cols-[1fr_12rem_2.5rem]">
                            <div className="flex items-center gap-1">
                                <span>Hash da transação</span>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            type="button"
                                            className="inline-flex size-3.5 shrink-0 rounded-full text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                                            aria-label="Hash da transação na blockchain que deseja rastrear."
                                        >
                                            <CircleHelp className="size-3.5" aria-hidden />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" sideOffset={6}>
                                        Hash da transação na blockchain que deseja rastrear.
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <div className="flex items-center gap-1">
                                <span>Valor da transação</span>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button
                                            type="button"
                                            className="inline-flex size-3.5 shrink-0 rounded-full text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                                            aria-label="Valor em criptoativo associado (número decimal, ex.: 0.5)."
                                        >
                                            <CircleHelp className="size-3.5" aria-hidden />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" sideOffset={6}>
                                        Valor em criptoativo associado a este hash.
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <span className="sr-only">Ações</span>
                        </div>
                        {rows.map((row, index) => (
                            <div
                                key={row.id}
                                className="grid grid-cols-[1fr_10rem_2.5rem] gap-2 border-b border-border/60 px-3 py-2 last:border-b-0 sm:grid-cols-[1fr_12rem_2.5rem]"
                            >
                                <Input
                                    id={`hash-${row.id}`}
                                    type="text"
                                    placeholder="Ex.: 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890..."
                                    value={row.hash}
                                    onChange={(e) => onUpdateRow(index, 'hash', e.target.value)}
                                    onFocus={() => setDadosError(null)}
                                    className="h-10 rounded-[6px] border-border/80 text-sm"
                                    aria-label="Hash"
                                />
                                <Input
                                    id={`value-${row.id}`}
                                    type="text"
                                    inputMode="decimal"
                                    placeholder="Ex.: 9931.45"
                                    value={row.value}
                                    onChange={(e) => onUpdateRow(index, 'value', maskNumericValue(e.target.value))}
                                    onFocus={() => setDadosError(null)}
                                    className="h-10 rounded-[6px] border-border/80 text-sm"
                                    aria-label="Valor"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onRemoveRow(index)}
                                    className="h-10 w-10 shrink-0 rounded-[6px] text-destructive hover:bg-destructive/10 hover:text-destructive"
                                    aria-label="Remover linha"
                                >
                                    <Trash2 className="size-4" aria-hidden />
                                </Button>
                            </div>
                        ))}
                    </div>
                    {dadosError && <p className="text-xs text-destructive">{dadosError}</p>}
                    <Button type="button" variant="outline" size="sm" onClick={onAddRow} className="h-10 gap-1.5 rounded-[6px] border-dashed text-sm">
                        <Plus className="size-4" aria-hidden />
                        Adicionar
                    </Button>
                </div>
            </form>
        </>
    );
}
