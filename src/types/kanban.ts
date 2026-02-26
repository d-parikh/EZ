export interface KanbanCard {
  id: string;
  title: string;
}

export type ColumnId = "todo" | "inProgress" | "done";

export interface KanbanColumn {
  id: ColumnId;
  title: string;
  cards: KanbanCard[];
}

export interface KanbanData {
  columns: KanbanColumn[];
}
