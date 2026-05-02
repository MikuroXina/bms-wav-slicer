import { Spinner } from "@heroui/react/spinner";

export const LoadingCover = () => (
    <div className="z-100 flex h-screen w-screen items-center">
        <Spinner size="xl" />
        <span className="text-muted text-xs">Loading…</span>
    </div>
);
