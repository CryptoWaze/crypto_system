export type HashValueRow = { id: string; hash: string; value: string };

export type TrackingPayload = {
    caseName: string;
    entries: { hash: string; value?: number }[];
};
