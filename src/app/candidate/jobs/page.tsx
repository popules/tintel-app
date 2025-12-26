"use client";

import { Suspense } from "react";
import { JobMarketplace } from "@/components/dashboard/JobMarketplace";

export default function CandidateJobsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <JobMarketplace mode="candidate" />
        </Suspense>
    );
}
