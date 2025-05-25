import { Button } from "@/components/ui/button"
import { HomeLayout } from "@/types/home-layout"
import { ChevronDown, ChevronUp, EditIcon, Plus, Trash } from "lucide-react"
import { useState } from "react"
import ConfirmationModal from "./confirmation-modal"
import { EditModal } from "./edit-modal"
import { ContentModal } from "./contents/content-modal"


interface Props {
    layout: HomeLayout,
    handleSwap: (direction: 'up' | 'down', layout: HomeLayout) => void,
    onRefresh: () => void
}

export default function CardMenu({
    layout,
    handleSwap,
    onRefresh
}: Props) {

    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [contentModalOpen, setContentModalOpen] = useState(false);

    return (
        <>
            <div
                className={'flex flex-row items-center w-full shadow-md p-4 bg-card rounded-md border'}
            >
                <div 
                    className={'w-[10%]'}
                >
                    <div className="flex flex-col">
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                handleSwap('up', layout)
                            }}
                            className="group-first"
                        >
                            <ChevronUp className="h-3.5 w-3.5" />
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                handleSwap('down', layout)
                            }}
                            className="group-last"
                        >
                            <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>
                <div
                    className={'w-[70%]'}
                >
                    <h5 className={'font-bold'}>{layout.title}</h5>
                </div>
                <div className={'w-[20%] flex flex-row items-center justify-center gap-2 pe-4'}>
                    <Button
                        variant={'outline'}
                        onClick={() => setEditModalOpen(true)}
                    >
                        <EditIcon className="size-4" />
                    </Button>
                    <Button
                        variant={'outline'}
                        onClick={() => setContentModalOpen(true)}
                    >
                        <Plus className="size-4" />
                    </Button>
                    <Button
                        variant={'outline'}
                        onClick={() => setConfirmModalOpen(true)}
                    >
                        <Trash className="size-4" />
                    </Button>
                </div>
            </div>

            <EditModal
                open={editModalOpen}
                setOpen={setEditModalOpen}
                onCreate={onRefresh}
                layout={layout}
            />

            <ContentModal
                open={contentModalOpen}
                setOpen={setContentModalOpen}
                layout={layout}
            />

            <ConfirmationModal
                text={`Tem certeza que deseja remover o layout: ${layout.title}?`}
                open={confirmModalOpen}
                url={`/home-layout/destroy`}
                layoutId={layout.id}
                setOpen={setConfirmModalOpen}
                onDelete={onRefresh}
            />
        </>        
    )
}