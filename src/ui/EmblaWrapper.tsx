import useEmblaCarousel from "embla-carousel-react";
import React from "react";

interface EmblaWrapperProps {
	multipleSlides: boolean;
	children: React.ReactNode;
}

export const EmblaWrapper: React.FC<EmblaWrapperProps> = ({ multipleSlides, children }) => {
	const [emblaRef] = useEmblaCarousel({
		loop: false,
		active: multipleSlides,
		containScroll: "keepSnaps",
		align: "start",
	});

	return (
		<div className="timeline-embla" ref={emblaRef}>
			<div className="timeline-embla__container">{children}</div>
		</div>
	);
};
