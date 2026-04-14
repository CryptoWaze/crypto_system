'use client';

import { FlowGraphReadOnly } from '@/components/flow/FlowGraphReadOnly';
import { DEMO_TRACKING_FLOW_GRAPH } from '@/lib/landing/demo-tracking-flow-graph';

export function LandingHowItWorksDemoGraph() {
    return (
        <div className="landing-animate-in landing-animate-in-delay-2 mt-14 w-full">
            <div className="w-screen max-w-[100vw] shrink-0 ml-[calc(50%-50vw)] box-border px-[50px]">
                <div className="h-[min(48rem,calc(100dvh-10rem))] w-full min-h-[32rem] overflow-hidden rounded-none border border-border/60 bg-card/20 sm:rounded-xl sm:h-[min(52rem,calc(100dvh-8rem))] sm:min-h-[36rem]">
                    <FlowGraphReadOnly
                        graph={DEMO_TRACKING_FLOW_GRAPH}
                        className="h-full w-full rounded-none border-0 !min-h-0 sm:rounded-xl"
                        fitViewOnMount
                        fillContainer
                        endpointExchangeName="Exchange"
                    />
                </div>
            </div>
        </div>
    );
}
