import type { JSX } from "react";

import { MenuBar } from "./menu-bar.js";

export const App = (): JSX.Element => {
    return (
        <main className="bg-background h-screen w-screen">
            <MenuBar />
        </main>
    );
};
