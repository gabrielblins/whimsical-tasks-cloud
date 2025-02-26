import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { TaskCard } from "@/components/TaskCard";
import { TaskForm } from "@/components/TaskForm";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
  updateTaskCompletion,
  type Task,
  type CreateTaskInput,
} from "@/lib/api";

export default function Index() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tasksData, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
    initialData: [],
  });

  const tasks = Array.isArray(tasksData) ? tasksData : [];

  const createMutation = useMutation({
    mutationFn: (task: CreateTaskInput) => createTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({ title: "Task created successfully" });
    },
    onError: () => {
      toast({
        title: "Error creating task",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...task }: Task) => updateTask(id, task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({ title: "Task updated successfully" });
    },
    onError: () => {
      toast({
        title: "Error updating task",
        variant: "destructive",
      });
    },
  });

  const completeMutation = useMutation({
    mutationFn: ({ id, completed }: { id: number; completed: boolean }) =>
      updateTaskCompletion(id, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({ title: "Task status updated" });
    },
    onError: () => {
      toast({
        title: "Error updating task status",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({ title: "Task deleted successfully" });
    },
    onError: () => {
      toast({
        title: "Error deleting task",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleComplete = (id: number, completed: boolean) => {
    completeMutation.mutate({ id, completed });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-foreground">Tasks</h1>
        <Button
          onClick={() => {
            setEditingTask(undefined);
            setIsFormOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-[200px] animate-pulse rounded-lg bg-muted"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task: Task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEdit}
              onDelete={(id) => deleteMutation.mutate(id)}
              onComplete={handleComplete}
            />
          ))}
        </div>
      )}

      <TaskForm
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTask(undefined);
        }}
        onSubmit={async (task) => {
          if (editingTask) {
            await updateMutation.mutateAsync({ ...task, id: editingTask.id });
          } else {
            await createMutation.mutateAsync(task);
          }
        }}
        initialTask={editingTask}
      />
    </div>
  );
}