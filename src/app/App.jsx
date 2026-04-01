import { useEffect, useMemo, useState } from "react";
import taskManager from "../features/enhancer/api/taskManager.js";
import UploadPanel from "../features/enhancer/ui/UploadPanel.jsx";
import TaskList from "../features/enhancer/ui/TaskList.jsx";
import PreviewPane from "../features/enhancer/ui/PreviewPane.jsx";

export default function App() {
  const [tasks, setTasks] = useState(taskManager.listTasks());
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  useEffect(() => {
    const unsubscribe = taskManager.subscribe(() => {
      const updatedTasks = taskManager.listTasks();
      setTasks(updatedTasks);

      if (!selectedTaskId && updatedTasks.length) {
        setSelectedTaskId(updatedTasks[0].id);
      }
    });

    const initialTasks = taskManager.listTasks();
    setTasks(initialTasks);

    if (!selectedTaskId && initialTasks.length) {
      setSelectedTaskId(initialTasks[0].id);
    }

    return unsubscribe;
  }, [selectedTaskId]);

  const selectedTask = useMemo(
    () => tasks.find((task) => task.id === selectedTaskId) ?? null,
    [tasks, selectedTaskId]
  );

  const handleFilesSelected = (files) => {
    const newIds = files.map((file) => taskManager.submitTask(file));
    if (newIds.length) {
      setSelectedTaskId(newIds[0]);
      setTasks(taskManager.listTasks());
    }
  };

  const handleCancelTask = (taskId) => {
    taskManager.cancelTask(taskId);
  };

  return (
    <div className="page">
      <header className="page__header">
        <div>
          <h1>ML-модель для улучшения изображений</h1>
          <p className="hint" style={{ whiteSpace: 'pre-line' }}>
            Черных Роман Александрович 334041 P3422 {'\n'}
            НАЦИОНАЛЬНЫЙ ИССЛЕДОВАТЕЛЬСКИЙ УНИВЕРСИТЕТ ИТМО
          </p>
        </div>
      </header>

      <main className="layout">
        <div className="layout__left">
          <UploadPanel onFilesSelected={handleFilesSelected} />
          <TaskList
            tasks={tasks}
            selectedTaskId={selectedTaskId}
            onSelectTask={setSelectedTaskId}
            onCancelTask={handleCancelTask}
          />
        </div>

        <div className="layout__right">
          <PreviewPane task={selectedTask} />
        </div>
      </main>
    </div>
  );
}