import type { KanbanData } from "../types/kanban";

export const initialData: KanbanData = {
  columns: [
    {
      id: "todo",
      title: "Todo",
      cards: [
        { id: "card-1", title: "Create initial project plan" },
        { id: "card-2", title: "Design landing page" },
        { id: "card-3", title: "Review codebase structure" },
      ],
    },
    {
      id: "inProgress",
      title: "In Progress",
      cards: [
        { id: "card-4", title: "Implement authentication" },
        { id: "card-5", title: "Set up database schema" },
        { id: "card-6", title: "Fix navbar bugs" },
      ],
    },
    {
      id: "done",
      title: "Done",
      cards: [
        { id: "card-7", title: "Organize project repository" },
        { id: "card-8", title: "Write API documentation" },
      ],
    },
  ],
};
