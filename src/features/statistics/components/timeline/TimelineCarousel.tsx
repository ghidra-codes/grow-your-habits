import type { TimelineCarouselProps } from "@/types/carousel.types";
import { EmblaWrapper } from "@/ui/EmblaWrapper";
import useEmblaCarousel from "embla-carousel-react";
import DailyCarouselContent from "./carousel-content/DailyCarouselContent";
import MonthlyCarouselContent from "./carousel-content/MonthlyCarouselContent";
import WeeklyCarouselContent from "./carousel-content/WeeklyCarouselContent";

export const TimelineCarousel: React.FC<TimelineCarouselProps> = (props) => {
	const { data, frequency } = props;

	const multipleSlides = data.length > 1;

	const [emblaRef] = useEmblaCarousel({
		loop: false,
		active: multipleSlides,
		containScroll: "keepSnaps",
		align: "start",
	});

	switch (frequency) {
		case "daily":
			return (
				<EmblaWrapper emblaRef={emblaRef}>
					<DailyCarouselContent periods={data} compact={props.compact} mode={props.mode} />
				</EmblaWrapper>
			);

		case "weekly":
			return (
				<EmblaWrapper emblaRef={emblaRef}>
					<WeeklyCarouselContent weeks={data} />
				</EmblaWrapper>
			);

		case "monthly":
			return (
				<EmblaWrapper emblaRef={emblaRef}>
					<MonthlyCarouselContent months={data} />
				</EmblaWrapper>
			);

		case "custom":
			// temporary placeholder — will extend later
			return (
				<EmblaWrapper emblaRef={emblaRef}>
					<div className="summary-slide">Custom habits coming soon…</div>
				</EmblaWrapper>
			);
	}
};
