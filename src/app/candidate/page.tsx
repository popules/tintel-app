import { redirect } from "next/navigation";

export default function CandidateLandingPage() {
    // For now, redirect straight to signup/onboarding
    // Later this can be a marketing landing page for candidates
    redirect("/candidate/signup");
}
