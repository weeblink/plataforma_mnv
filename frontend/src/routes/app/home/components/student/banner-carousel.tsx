import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'
import type { Banner } from '@/types/banner'

interface Props {
  banners: Banner[]
}

export default function BannerCarousel({ banners }: Props) {
  return (
    <div className="w-full">
      <Carousel
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem
                className={'h-[450px]'}
                key={banner.id}
                style={{
                  backgroundImage: `url('${banner.image_url}')`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                }}
            ></CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </div>    
  )
}
