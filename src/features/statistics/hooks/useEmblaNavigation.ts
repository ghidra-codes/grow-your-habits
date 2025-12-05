import type { EmblaCarouselType } from "embla-carousel";
import { useEffect, useState } from "react";

const useEmblaNavigation = (emblaApi: EmblaCarouselType | null) => {
	const [canPrev, setCanPrev] = useState(false);
	const [canNext, setCanNext] = useState(false);

	useEffect(() => {
		if (!emblaApi) return;

		const updateButtons = () => {
			setCanPrev(emblaApi.canScrollPrev());
			setCanNext(emblaApi.canScrollNext());
		};

		updateButtons();

		emblaApi.on("select", updateButtons);
		emblaApi.on("reInit", updateButtons);

		return () => {
			emblaApi.off("select", updateButtons);
			emblaApi.off("reInit", updateButtons);
		};
	}, [emblaApi]);

	const onPrev = () => emblaApi?.scrollPrev();
	const onNext = () => emblaApi?.scrollNext();

	return { canPrev, canNext, onPrev, onNext };
};

export default useEmblaNavigation;
