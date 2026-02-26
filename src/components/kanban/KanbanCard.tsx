import { useState, useRef, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2, GripVertical } from "lucide-react";
import type { KanbanCard as KanbanCardType } from "../../types/kanban";

interface KanbanCardProps {
  card: KanbanCardType;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string) => void;
}

const KanbanCard = ({ card, onDelete, onEdit }: KanbanCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(card.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    const trimmed = editValue.trim();
    if (trimmed) {
      onEdit(card.id, trimmed);
    } else {
      setEditValue(card.title);
    }
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-2 rounded-lg bg-white rounded-lg p-3 shadow-sm border border-gray-200 transition-shadow hover:shadow-md ${
        isDragging ? "opacity-50 shadow-lg" : ""
      }`}
    >
      <button
        className="cursor-grab  opacity-0 group-hover:opacity-100 transition-opacity shrink-0 touch-none !border-none"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={16} />
      </button>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
              if (e.key === "Escape") {
                setEditValue(card.title);
                setIsEditing(false);
              }
            }}
            className="w-full bg-transparent text-sm outline-none border-b border-green-500 focus:border-green-500"
          />
        ) : (
          <p
            className="text-sm truncate cursor-pointer"
            onDoubleClick={() => setIsEditing(true)}
          >
            {card.title}
          </p>
        )}
      </div>

      <button
        onClick={() => onDelete(card.id)}
        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity !border-none"
      >
        <Trash2 size={14} className="text-red-500"/>
      </button>
    </div>
  );
};

export default KanbanCard;
