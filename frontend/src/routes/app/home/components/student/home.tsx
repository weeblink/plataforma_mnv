import BannerCarousel from './banner-carousel'
import type { Course } from '@/types/course'
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import type { ExtraProduct } from '@/types/extra'
import type { Banner } from '@/types/banner'
import { useEffect, useState } from 'react'
import { api } from '@/services/api'
import { toast } from 'sonner'
import { LoaderCircle, LockIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { HomeLayoutWithContents } from '@/types/home-layout'
import { Link } from 'react-router-dom'
import ProductDetails from '@/components/ProductDetails'
import { TypeUrl } from '@/routes/app/payment'

interface MentoringProps {
  id: string
  image_url: string
}

export interface StudentData {
  courses: Course[]
  banners: Banner[]
  extras: ExtraProduct[]
  mentorings_groups: MentoringProps[]
}

export default function StudentHomePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)
  const [data, setData] = useState<StudentData>({
    banners: [],
    courses: [],
    extras: [],
    mentorings_groups: [],
  } as StudentData);

  const [menus, setMenus] = useState<HomeLayoutWithContents[]>([]);

  async function fetchData() {
    setIsLoading(true)

    try {

      const { data } = await api.get(
          '/dashboard/student',
      )

      setData(data.data);
      setMenus(data.data.menus);

    } catch {
      setIsError(true)
      toast.error('Ocorreu um erro ao carregar as informações')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="mt-4 flex items-center justify-center">
        <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="mt-4">
        <p>Ocorreu um erro ao carregar as informações</p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'relative -my-5 -m-5',
      )}
    >
      <BannerCarousel banners={data.banners} />

      <div className="mt-8 pb-20 space-y-8 p-4">
        {menus?.length > 0 && (
          <div className="space-y-6">
            {menus.map((menu) => (
              <>
                <div>
                  <h2 className="text-xl font-medium font-poppins">{menu.title}</h2>
                </div>
                <Carousel className="w-full relative pt-6">
                  <CarouselContent>
                    {menu.contents.map((content) => {

                      let urlToGo;
                      let type;

                      switch(content.type){
                        case 'course':
                          urlToGo = `/courses/${content.product_id}`;
                          type = TypeUrl.Course;
                        break;
                        case 'mentoring':
                          urlToGo = `/mentoring-details/${content.product_id}`;
                          type = TypeUrl.Mentoring;
                        break;
                        case 'extra':
                          urlToGo = `/extra/${content.product_id}`;
                          type = TypeUrl.Extra;
                        break;
                      }

                      return (
                        <Link to={content.is_lock ? "" : urlToGo} className='mx-2'>
                          <div
                              className={'shadow-md border rounded-lg p-4 min-h-[300px] min-w-[200px] flex items-center justify-center relative'}
                              style={{backgroundImage: `url(${content.image_url})`, backgroundPosition: 'center', backgroundSize: 'cover'}}
                          >
                            {content.is_lock && (
                              <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl rounded-b-none bg-black bg-opacity-50">
                                <LockIcon className="h-12 w-12 text-white" />
                                <div className={'mt-3'}>
                                  <ProductDetails
                                      title={content.title || ""}
                                      price={content.price}
                                      promotional_price={content.price_promotional}
                                      image_url={content.image_url}
                                      linkBuy={`/payment/${type}/${content.product_id}`}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </Link>
                      )                                            
                    })}
                  </CarouselContent>
                  <div className='absolute top-0 right-0 z-[100000]'>
                    <CarouselPrevious className="absolute -translate-x-1/2 -translate-y-1/2" />
                    <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 translate-x-1/2" />
                  </div>                  
                </Carousel>                        
              </>          
            ))}      
          </div>
        )}
      </div>
    </div>
  )
}
