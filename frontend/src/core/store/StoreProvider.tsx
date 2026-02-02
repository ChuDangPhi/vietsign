"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./index";
import { restoreAuth } from "./slices/adminSlice";

function AuthRestorer({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        store.dispatch(restoreAuth());
    }, []);

    return <>{children}</>;
}

export default function StoreProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Provider store={store}>
            <AuthRestorer>{children}</AuthRestorer>
        </Provider>
    );
}
