import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from "@/components/ui/button";
import { LoaderCircle, Plus } from "lucide-react";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { Input } from "@/components/ui/input";
import { api } from "@/services/api";

const formSchema = z.object({
    title: z.string({required_error: "Esse campo é obrigatório para prosseguir"})
});

interface Props {
    onCreate: (  ) => void
}

export function CreateModal({onCreate}: Props) {

    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)

        try {
            
            await api.post(`/home-layout/store`, {
                title: values.title
            });

            onCreate()
            toast.success('Curso criado com sucesso')
            setOpen(false)
        } catch (error) {
            let errorMessage = 'Ocorreu um erro ao criar o curso'

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

    function onOpenChange(value: boolean) {
        if (!value) {
            form.reset();
        }

        setOpen(value)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Criar novo menu
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                <DialogTitle className="font-poppins">Criar menu</DialogTitle>
                <DialogDescription>
                    Preencha os campos abaixo para criar um novo menu.
                </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        id="updateCourseform"
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Título</FormLabel>
                                <FormControl>
                                    <Input placeholder="Título do layout" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
                <DialogFooter>
                    <Button form="updateCourseform" type="submit" disabled={isLoading}>
                        {isLoading ? (
                        <LoaderCircle className="h-4 w-4 animate-spin text-white" />
                        ) : (
                        'Criar'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
            </Dialog>
    )
}