import { createRoot } from "react-dom/client";

import { App } from "./view/app.js";

let mounted = false;

function mount() {
    if (mounted) {
        return;
    }
    mounted = true;
    createRoot(document.getElementById("root")!).render(<App />);
}

if (document.readyState === "complete") {
    mount();
} else {
    document.addEventListener("DOMContentLoaded", mount);
}
