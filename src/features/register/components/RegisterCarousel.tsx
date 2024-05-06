import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function RegisterCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 2500, stopOnInteraction: false })
  );

  // URLs of the images
  const images = [
    "https://sso.eu.edenred.io/assets/ae-c3pay-client-portal/images/p_big1.png",
    "https://sso.eu.edenred.io/assets/ae-c3pay-client-portal/images/p_big2.png"
  ];

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full max-w-md"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent className="bg-none">
        {images.map((src, index) => (
          <CarouselItem key={index}>
            <div className="p-8">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <img src={src} alt={`Carousel Image ${index + 1}`} className="max-w-full h-auto" />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
