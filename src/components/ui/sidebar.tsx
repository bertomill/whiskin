"use client";
import { cn } from "@/lib/utils";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconMenu2, IconX } from "@tabler/icons-react";

// Interface for sidebar navigation links
interface Links {
    label: string;
    href: string;
    icon: React.JSX.Element | React.ReactNode;
}

// Context props for sidebar state management
interface SidebarContextProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    animate: boolean;
}

// Create context for sidebar state
const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

// Custom hook to access sidebar context
export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
};

// Provider component to manage sidebar state
export const SidebarProvider = ({
    children,
    open: openProp,
    setOpen: setOpenProp,
    animate = true,
}: {
    children: React.ReactNode;
    open?: boolean;
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    animate?: boolean;
}) => {
    // Internal state for sidebar open/close
    const [openState, setOpenState] = useState(false);

    // Use external state if provided, otherwise use internal state
    const open = openProp !== undefined ? openProp : openState;
    const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

    return (
        <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
            {children}
        </SidebarContext.Provider>
    );
};

// Main sidebar wrapper component
export const Sidebar = ({
    children,
    open,
    setOpen,
    animate,
}: {
    children: React.ReactNode;
    open?: boolean;
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    animate?: boolean;
}) => {
    return (
        <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
            {children}
        </SidebarProvider>
    );
};

// Sidebar body that renders both desktop and mobile versions
export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
    return (
        <>
            <DesktopSidebar {...props} />
            <MobileSidebar {...(props as React.ComponentProps<"div">)} />
        </>
    );
};

// Desktop sidebar component with hover animations
export const DesktopSidebar = ({
    className,
    children,
    ...props
}: React.ComponentProps<typeof motion.div>) => {
    const { open, setOpen, animate } = useSidebar();
    return (
        <>
            <motion.div
                className={cn(
                    "h-full px-2 py-4 hidden md:flex md:flex-col w-[300px] shrink-0",
                    className
                )}
                // Animate width based on open state
                animate={{
                    width: animate ? (open ? "300px" : "70px") : "300px",
                }}
                // Open sidebar on mouse enter
                onMouseEnter={() => setOpen(true)}
                // Close sidebar on mouse leave
                onMouseLeave={() => setOpen(false)}
                {...props}
            >
                {children}
            </motion.div>
        </>
    );
};

// Mobile sidebar component with slide-in animation
export const MobileSidebar = ({
    className,
    children,
    ...props
}: React.ComponentProps<"div">) => {
    const { open, setOpen } = useSidebar();
    return (
        <>
            {/* Mobile header with menu button */}
            <div
                className={cn(
                    "h-10 px-4 py-4 flex flex-row md:hidden  items-center justify-between w-full"
                )}
                {...props}
            >
                <div className="flex justify-end z-20 w-full">
                    {/* Menu toggle button */}
                    <IconMenu2
                        className="text-stone-700"
                        onClick={() => setOpen(!open)}
                    />
                </div>
                {/* Animated mobile sidebar overlay */}
                <AnimatePresence>
                    {open && (
                        <motion.div
                            // Slide in from left animation
                            initial={{ x: "-100%", opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: "-100%", opacity: 0 }}
                            transition={{
                                duration: 0.3,
                                ease: "easeInOut",
                            }}
                            className={cn(
                                "fixed h-full w-full inset-0 bg-stone-50 p-6 z-[100] flex flex-col justify-between",
                                className
                            )}
                        >
                            {/* Close button */}
                            <div
                                className="absolute right-10 top-10 z-50 text-stone-700"
                                onClick={() => setOpen(!open)}
                            >
                                <IconX />
                            </div>
                            {children}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

// Individual sidebar link component
export const SidebarLink = ({
    link,
    className,
    onClick,
    ...props
}: {
    link: Links;
    className?: string;
    onClick?: (e: React.MouseEvent) => void;
}) => {
    const { open, animate } = useSidebar();
    return (
        <a
            href={link.href}
            className={cn(
                "flex items-center gap-2 group/sidebar py-2 cursor-pointer",
                animate ? (open ? "justify-start" : "justify-center") : "justify-start",
                className
            )}
            onClick={onClick}
            {...props}
        >
            {/* Link icon */}
            {link.icon}

            {/* Animated link label */}
            <motion.span
                // Show/hide label based on sidebar state
                animate={{
                    display: animate ? (open ? "inline-block" : "none") : "inline-block",
                    opacity: animate ? (open ? 1 : 0) : 1,
                }}
                className="text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
            >
                {link.label}
            </motion.span>
        </a>
    );
};