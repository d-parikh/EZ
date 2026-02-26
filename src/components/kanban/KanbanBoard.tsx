import { useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import KanbanColumn from "./KanbanColumn";
import { initialData } from "../../data/kanban";
import type { KanbanCard, KanbanColumn as KanbanColumnType, ColumnId } from "../../types/kanban";

let nextId = 9;

const KanbanBoard = () => {
  const [columns, setColumns] = useState<KanbanColumnType[]>(initialData.columns);
  const [activeCard, setActiveCard] = useState<KanbanCard | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  const findColumn = useCallback(
    (cardId: string) => columns.find((col) => col.cards.some((c) => c.id === cardId)),
    [columns]
  );

  const handleDragStart = (event: DragStartEvent) => {
    const col = findColumn(String(event.active.id));
    const card = col?.cards.find((c) => c.id === event.active.id);
    if (card) setActiveCard(card);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const sourceCol = findColumn(activeId);
    // over could be a card or a column id
    const destCol = findColumn(overId) || columns.find((c) => c.id === overId);

    if (!sourceCol || !destCol || sourceCol.id === destCol.id) return;

    setColumns((prev) =>
      prev.map((col) => {
        if (col.id === sourceCol.id) {
          return { ...col, cards: col.cards.filter((c) => c.id !== activeId) };
        }
        if (col.id === destCol.id) {
          const card = sourceCol.cards.find((c) => c.id === activeId)!;
          const overIndex = col.cards.findIndex((c) => c.id === overId);
          const newCards = [...col.cards];
          if (overIndex >= 0) {
            newCards.splice(overIndex, 0, card);
          } else {
            newCards.push(card);
          }
          return { ...col, cards: newCards };
        }
        return col;
      })
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const col = findColumn(activeId);
    if (!col) return;

    const oldIndex = col.cards.findIndex((c) => c.id === activeId);
    const newIndex = col.cards.findIndex((c) => c.id === overId);

    if (oldIndex !== newIndex && newIndex >= 0) {
      setColumns((prev) =>
        prev.map((c) =>
          c.id === col.id
            ? { ...c, cards: arrayMove(c.cards, oldIndex, newIndex) }
            : c
        )
      );
    }
  };

  const addCard = (columnId: ColumnId) => {
    const newCard: KanbanCard = {
      id: `card-${nextId++}`,
      title: "New card",
    };
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, cards: [...col.cards, newCard] } : col
      )
    );
  };

  const deleteCard = (cardId: string, columnId: ColumnId) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId
          ? { ...col, cards: col.cards.filter((c) => c.id !== cardId) }
          : col
      )
    );
  };

  const editCard = (cardId: string, title: string) => {
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        cards: col.cards.map((c) => (c.id === cardId ? { ...c, title } : c)),
      }))
    );
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col md:flex-row gap-4 p-4 md:p-6 overflow-x-auto min-h-screen bg-background w-full">
        {/* Decorative left bar */}
        <div className="hidden md:block w-1.5 rounded-full bg-gray-100 shrink-0 self-stretch" />

        {columns.map((col) => (
          <KanbanColumn
            key={col.id}
            column={col}
            onAddCard={addCard}
            onDeleteCard={deleteCard}
            onEditCard={editCard}
          />
        ))}
      </div>

      <DragOverlay>
        {activeCard ? (
          <div className="rounded-lg bg-card p-3 shadow-lg border border-border text-sm opacity-90">
            {activeCard.title}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;
