import { registerSheet, SheetDefinition } from 'react-native-actions-sheet';
import QuickActionsSheet from './components/ActionSheets/QuickActionsSheet';
import SubTaskActionSheet from './components/ActionSheets/SubTaskActionSheet';
import TodoActionSheet from './components/ActionSheets/TodoActionSheet';

registerSheet('todo-actions', TodoActionSheet);
registerSheet('subtask-actions', SubTaskActionSheet);
registerSheet('quick-actions', QuickActionsSheet);

// Extend the sheets interface for better TypeScript support
declare module 'react-native-actions-sheet' {
  interface Sheets {
    'todo-actions': SheetDefinition;
    'subtask-actions': SheetDefinition;
    'quick-actions': SheetDefinition;
  }
}

export { };
