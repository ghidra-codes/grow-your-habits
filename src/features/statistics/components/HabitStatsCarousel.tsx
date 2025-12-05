import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType } from "embla-carousel";
import React, { useEffect } from "react";

interface HabitStatsCarouselProps {
	children: React.ReactElement[];
	onApi: (api: EmblaCarouselType | null) => void;
}

const HabitStatsCarousel: React.FC<HabitStatsCarouselProps> = ({ children, onApi }) => {
	const slideCount = Array.isArray(children) ? children.length : 1;

	const [emblaRef, emblaApi] = useEmblaCarousel({
		loop: false,
		containScroll: "trimSnaps",
		align: "start",
		watchDrag: false,
		active: slideCount > 1,
	});

	useEffect(() => {
		if (emblaApi) onApi(emblaApi);
	}, [emblaApi, onApi]);

	return (
		<div className="habit-stats-embla" ref={emblaRef}>
			<div className="habit-stats-embla__container">{children}</div>
		</div>
	);
};

export default HabitStatsCarousel;
