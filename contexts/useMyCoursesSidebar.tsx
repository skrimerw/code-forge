"use client";

import {
    createContext,
    ReactNode,
    SetStateAction,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarClose, SidebarOpen } from "lucide-react";
import Sidebar from "@/components/my-courses/Sidebar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarContextValue {
    open: boolean;
    setOpen: (val: SetStateAction<boolean>) => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function SidebarProvider({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    function handleOverlayClick(e: PointerEvent) {
        const target = e.target as Element;

        if (!target.closest("#my-courses-sidebar-overlay")) {
            setOpen(false);
        }
    }

    useEffect(() => {
        document.addEventListener("click", handleOverlayClick);

        return () => {
            document.removeEventListener("click", handleOverlayClick);
        };
    }, [open]);

    return (
        <SidebarContext.Provider value={{ open, setOpen }}>
            <Sheet open={open}>
                <SheetContent
                    side="left"
                    id="my-courses-sidebar-overlay"
                    className="w-fit"
                    showCloseButton={false}
                >
                    <SheetTitle className="absolute" />
                    <SheetClose asChild>
                        <Button
                            onClick={() => setOpen(false)}
                            className={cn(
                                "absolute -right-11 top-5 mb-5 bg-bg-2! border p-0 size-8 h-11 hover:bg-bg-2/50 shadow-xs text-foreground!",
                                !open && "",
                            )}
                        >
                            <SidebarClose />
                        </Button>
                    </SheetClose>
                    <Sidebar className="mr-auto w-[250px] ml-0 border-0 p-4" />
                </SheetContent>
            </Sheet>
            {children}
        </SidebarContext.Provider>
    );
}

export function useMyCoursesSidebar() {
    const ctx = useContext(SidebarContext);

    if (!ctx) {
        throw new Error(
            "useMyCoursesSidebar must be used within SidebarContext",
        );
    }

    return ctx;
}
