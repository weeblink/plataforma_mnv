import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from "sonner";
import { AxiosError } from "axios";
import { api } from "@/services/api";
import { HomeLayout, HomeLayoutContent, HomeLayoutWithContents } from "@/types/home-layout";
import CreateContentModal from "./create-content-modal";
import { ChevronLeft, ChevronRight, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
    open: boolean,
    setOpen: (value:boolean) => void,
    layout: HomeLayout,
}

export function ContentModal({
    open,
    setOpen,
    layout
}: Props) {

    const [layoutHome, setLayoutHome] = useState<HomeLayoutWithContents>();
    const [isLoading, setIsLoading] = useState(false);

    async function fetchData(){
        setIsLoading(true);
        try{

            const {data} = await api.get(`/home-layout/show/${layout.id}`);
            setLayoutHome(data);

        }catch(error){
            let errorMessage = 'Ocorreu um erro ao buscar pelos conteúdos'

            if (error instanceof AxiosError) {
                if (error.response?.data?.message) {
                errorMessage = error.response.data.message
                }

                if (!error.response?.data?.message && error.response?.data?.error) {
                errorMessage = error.response.data.error
                }
            }

            toast.error(errorMessage)
        }finally{
            setIsLoading(false);
        }
    }

    function onOpenChange( value: boolean ){
        setOpen(value);
    }

    async function handleDeleteContent( id: number ){
        setIsLoading(true);
        try{

            await api.delete(`/home-layout-content/destroy/${id}`);

            toast.success("Conteúdo removido com sucesso!");
            fetchData();

        }catch(error){
            let errorMessage = 'Ocorreu um erro ao buscar pelos conteúdos'

            if (error instanceof AxiosError) {
                if (error.response?.data?.message) {
                errorMessage = error.response.data.message
                }

                if (!error.response?.data?.message && error.response?.data?.error) {
                errorMessage = error.response.data.error
                }
            }

            toast.error(errorMessage)
        }finally{
            setIsLoading(false);
        }
    }

    async function handleSwap(direction: 'up' | 'down', content: HomeLayoutContent) {

        if( layoutHome ){
            const index = layoutHome.contents.findIndex((item) => item.id === content.id)

            if( ! layoutHome.contents[direction === 'up' ? index - 1 : index + 1] )
                return;

            const layout_1 = content.id
            const layout_2 = layoutHome.contents[direction === 'up' ? index - 1 : index + 1].id        

            try {
                await api.patch(`/home-layout-content/swap-order`, {
                    layout_1,
                    layout_2,
                })

                fetchData();
                toast.success("Posição trocada com sucesso!");
            } catch (error) {
            let errorMessage = 'Ocorreu um erro ao trocar a posição das aulas'

            if (error instanceof AxiosError) {
                if (error.response?.data?.message) {
                errorMessage = error.response.data.message
                }

                if (!error.response?.data?.message && error.response?.data?.error) {
                errorMessage = error.response.data.error
                }
            }

            toast.error(errorMessage)
            }
        }        
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle className="font-poppins">Conteúdos do Menu</DialogTitle>
                </DialogHeader>
                <div className={'flex wrap items-center gap-6 my-8 max-h-[600px] overflow-y-auto p-6'}>
                    {layoutHome?.contents.map((content) => (
                        <div
                            className={'shadow-md border rounded-lg p-4 min-h-[300px] min-w-[200px] flex items-center justify-center relative'}
                            style={{backgroundImage: `url(${content.image_url})`, backgroundPosition: 'center', backgroundSize: 'cover'}}
                        >
                            <div
                                className="absolute bottom-0 left-0 right-0 flex flex-row items-center"
                            >
                                <div className="flex items-center p-4 gap-4">
                                    <button 
                                        className="bg-white rounded-lg p-2"
                                        onClick={() => handleSwap('up', content)}
                                    >
                                        <ChevronLeft />
                                    </button>
                                    <button 
                                        className="bg-white rounded-lg p-2"
                                        onClick={() => handleSwap('down', content)}
                                    >
                                        <ChevronRight />
                                    </button>
                                </div>
                                <div>
                                    <Button
                                        className="bg-red-700"
                                        onClick={() => handleDeleteContent(content.id)}
                                    >
                                        <TrashIcon className="size-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div
                        className={'shadow-md border rounded-lg p-4 min-h-[300px] min-w-[200px] flex items-center justify-center'}
                    >
                        <CreateContentModal parentHomeId={layout.id} onCreate={fetchData} />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}