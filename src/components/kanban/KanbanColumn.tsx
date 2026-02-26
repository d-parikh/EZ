import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import KanbanCard from "./KanbanCard";
import type { KanbanColumn as KanbanColumnType, ColumnId } from "../../types/kanban";

const columnColors: Record<ColumnId, string> = {
  todo: "bg-blue-500",
  inProgress: "bg-orange-700",
  done: "bg-green-500",
};

interface KanbanColumnProps {
  column: KanbanColumnType;
  onAddCard: (columnId: ColumnId) => void;
  onDeleteCard: (cardId: string, columnId: ColumnId) => void;
  onEditCard: (cardId: string, title: string) => void;
}

const KanbanColumn = ({
  column,
  onAddCard,
  onDeleteCard,
  onEditCard,
}: KanbanColumnProps) => {
  const { setNodeRef } = useDroppable({ id: column.id });

  return (
    <div className="flex flex-col bg-gray-200 rounded-xl min-w-[280px] w-full md:w-80 shrink-0">
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 rounded-lg ${columnColors[column.id]}`}>
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-200 text-sm">{column.title}</h3>
          <span
            className={`${columnColors[column.id]} bg-white opacity-50  text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center`}
          >
            {column.cards.length}
          </span>
        </div>
        <button
          onClick={() => onAddCard(column.id)}
          className={`${columnColors[column.id]} rounded-md p-1 hover:opacity-90 transition-opacity`}
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Add Card text button */}
      <button
        onClick={() => onAddCard(column.id)}
        className="mx-3 my-2 !inline-flex items-center gap-1 bg-white text-sm !border-none hover:bg-gray-200 rounded-md px-2 py-1 opacity-80 hover:opacity-100 transition-opacity"
      >
        <Plus size={14} />
        Add Card
      </button>

      {/* Cards list */}
      <div ref={setNodeRef} className="flex flex-col gap-2 px-3 pb-3 min-h-[60px]">
        <SortableContext
          items={column.cards.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.cards.map((card) => (
            <KanbanCard
              key={card.id}
              card={card}
              onDelete={(id) => onDeleteCard(id, column.id)}
              onEdit={onEditCard}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default KanbanColumn;
