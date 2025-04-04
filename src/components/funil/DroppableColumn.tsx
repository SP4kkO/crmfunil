// components/funil/DroppableColumn.tsx
"use client";
import { ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";

type Props = {
  id: string;
  label: string;
  children: ReactNode;
};

export default function DroppableColumn({ id, label, children }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 min-w-[250px] transition-all ${
        isOver ? "border-2 border-blue-500" : "border border-gray-200"
      }`}
    >
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
        {label}
      </h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
