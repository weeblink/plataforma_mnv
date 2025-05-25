import { api } from "@/services/api";
import { HomeLayout } from "@/types/home-layout";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CreateModal } from "./components/create-modal";
import CardMenu from "./components/card-menu";
import { AxiosError } from "axios";
import { LoaderCircle } from "lucide-react";

export default function Menus(){

    const [homeLayouts, setHomeLayouts] = useState<HomeLayout[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    async function fetchData(  ){
        setIsLoading(true)

        try {
        const { data } = await api.get<{ layouts: HomeLayout[] }>(
            '/home-layout/list',
        )

            setHomeLayouts(data.layouts)
        } catch {
            setIsError(true)
            toast.error('Ocorreu um erro ao carregar os cursos')
        } finally {
            setIsLoading(false)
        }
    }

    async function handleSwap(direction: 'up' | 'down', layout: HomeLayout) {
        const index = homeLayouts.findIndex((item) => item.id === layout.id)

        if( ! homeLayouts[direction === 'up' ? index - 1 : index + 1] )
            return;

        const layout_1 = layout.id
        const layout_2 = homeLayouts[direction === 'up' ? index - 1 : index + 1].id        

        try {
            await api.patch(`/home-layout/swap-order`, {
                layout_1,
                layout_2,
            })

            fetchData()
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

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <div>
            <div className="flex justify-between gap-2">
                <h1 className="font-poppins text-2xl font-medium">Gerenciar área de membros</h1>
        
                <CreateModal onCreate={fetchData} />
            </div>
    
            {isLoading ? (
                <div className="mt-4 flex items-center justify-center">
                    <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="mt-12 flex flex-col gap-6">
                    {isError ? (
                        <p>Ocorreu um erro ao carregar os cursos</p>
                    ) : (
                        homeLayouts.map((layout) => (
                            <CardMenu 
                                layout={layout} 
                                handleSwap={handleSwap} 
                                onRefresh={fetchData}
                            />
                        ))
                    )}
                </div>
            )}            
        </div>
    );
}