import React from "react";

interface EmblaWrapperProps {
	emblaRef: React.RefCallback<HTMLDivElement>;
	children: React.ReactNode;
}

export const EmblaWrapper: React.FC<EmblaWrapperProps> = ({ emblaRef, children }) => {
	return (
		<div className="timeline-embla" ref={emblaRef}>
			<div className="timeline-embla__container">{children}</div>
		</div>
	);
};
