'use client';

import { createContext } from 'react';

export type FlowGraphEditContextValue = {
    openEditNameTag: (nodeId: string) => void;
    openDeleteNode: (nodeId: string) => void;
} | null;

export const FlowGraphEditContext = createContext<FlowGraphEditContextValue>(null);
