import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { api } from '@/services/api';
import { AxiosError } from 'axios';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface Props {
    text: string,
    open: boolean,    
    url: string;
    layoutId: number;
    setOpen: (value:boolean) => void;
    onDelete: () => void;
}

export default function ConfirmationModal({
    open,
    setOpen,
    text,
    url,
    layoutId,
    onDelete
}: Props){

    const [isLoading, setIsLoading] = useState(false)
    
    async function deleteLayout(  ){
        setIsLoading(true)

        try {
            await api.delete(`${url}/${layoutId}`);
            onDelete();
            setOpen(false)
            toast.success('Layout removido com sucesso')
        } catch (error) {
            let errorMessage = 'Ocorreu um erro ao deletar os layouts'

            if (error instanceof AxiosError) {
                if (error.response?.data?.message) {
                errorMessage = error.response.data.message
                }

                if (!error.response?.data?.message && error.response?.data?.error) {
                errorMessage = error.response.data.error
                }
            }

            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {text}
                    </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>
                            Fechar
                    </AlertDialogCancel>
                    <Button 
                        onClick={deleteLayout} 
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <LoaderCircle className="h-4 animate-spin text-white" />
                        ) : (
                            'Confirmar'
                        )}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}