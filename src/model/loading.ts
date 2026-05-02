import { createContext, useContext } from "react";

export interface LoadingController {
    isLoading: boolean;
    setIsLoading: (newState: boolean) => void;
}

export const LoadingContext = createContext<LoadingController>({
    isLoading: false,
    setIsLoading: () => {
        console.warn("LoadingContext not provided");
    },
});

export const useLoading = () => useContext(LoadingContext);
