'use client';

import type { FlowGraph } from '@/lib/types/tracking';
import type { FlowGraphWithTimestamps, SoftDeleteTransactionItem } from '@/lib/utils/flow-track-graph';
import type { EditCaseWalletPayload } from '@/lib/services/cases/edit-case.service';
import { FlowGraphReadOnly } from './FlowGraphReadOnly';
import { FlowGraphViewInteractive } from './FlowGraphViewInteractive';

export type FlowGraphViewProps = {
    graph: FlowGraph | FlowGraphWithTimestamps;
    className?: string;
    readOnly?: boolean;
    caseName?: string | null;
    endpointExchangeName?: string | null;
    endpointHotWalletLabel?: string | null;
    caseId?: string | null;
    onEditWallets?: (wallets: EditCaseWalletPayload[]) => Promise<void>;
    onSoftDeleteTransactions?: (items: SoftDeleteTransactionItem[]) => Promise<void>;
};

export function FlowGraphView(props: FlowGraphViewProps) {
    if (props.readOnly) {
        return (
            <FlowGraphReadOnly
                graph={props.graph}
                className={props.className}
                caseName={props.caseName}
                endpointExchangeName={props.endpointExchangeName}
                endpointHotWalletLabel={props.endpointHotWalletLabel}
            />
        );
    }
    return (
        <FlowGraphViewInteractive
            graph={props.graph}
            className={props.className}
            caseName={props.caseName}
            endpointExchangeName={props.endpointExchangeName}
            endpointHotWalletLabel={props.endpointHotWalletLabel}
            caseId={props.caseId}
            onEditWallets={props.onEditWallets}
            onSoftDeleteTransactions={props.onSoftDeleteTransactions}
        />
    );
}
