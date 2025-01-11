import { Pencil, Trash2 } from "lucide-react";
import { Task } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onComplete: (id: number, completed: boolean) => void;
}

export function TaskCard({ task, onEdit, onDelete, onComplete }: TaskCardProps) {
  return (
    <Card className={`task-card ${task.completed ? 'opacity-60' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={task.completed}
            onCheckedChange={(checked) => onComplete(task.id, checked as boolean)}
            className="h-5 w-5"
          />
          <CardTitle className={`text-lg font-semibold ${task.completed ? 'line-through' : ''}`}>
            {task.title}
          </CardTitle>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(task)}
            className="h-8 w-8"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(task.id)}
            className="h-8 w-8 text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className={task.completed ? 'line-through' : ''}>
          {task.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}