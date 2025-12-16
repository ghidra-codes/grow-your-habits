import { createContext, useContext, useState } from "react";

type TooltipContextValue = {
	openId: string | null;
	setOpenId: (id: string | null) => void;
};

const TooltipContext = createContext<TooltipContextValue | null>(null);

export const TooltipProvider = ({ children }: { children: React.ReactNode }) => {
	const [openId, setOpenId] = useState<string | null>(null);

	return <TooltipContext.Provider value={{ openId, setOpenId }}>{children}</TooltipContext.Provider>;
};

export const useTooltipController = () => {
	const ctx = useContext(TooltipContext);

	if (!ctx) throw new Error("useTooltipController must be used inside TooltipProvider");

	return ctx;
};
