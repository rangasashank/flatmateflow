import cron from 'node-cron';
import Task from '../models/Task.js';
import RoommateGroup from '../models/RoommateGroup.js';

// Cron job to run every day at midnight
const taskScheduler = () => {
  cron.schedule('0 0 * * *', async () => {
    console.log('Running daily task scheduler...');

    try {
      // Find all recurring tasks that are completed
      const tasks = await Task.find({ isRecurring: true, completed: true });

      for (const task of tasks) {
        const group = await RoommateGroup.findById(task.group);

        if (group) {
          // Get all users in the group
          const users = group.members;

          // Assign task to the next user
          const currentUserIndex = users.findIndex(user => user.equals(task.assignedTo));
          const nextUserIndex = (currentUserIndex + 1) % users.length;
          const nextUser = users[nextUserIndex];

          // Update task with new user and new due date
          task.assignedTo = nextUser;
          task.completed = false; // Reset task to incomplete
          task.dueDate = new Date(Date.now() + task.recurrenceInterval * 24 * 60 * 60 * 1000); // Set new due date
          task.recurrenceNextDueDate = task.dueDate;

          await task.save();
        }
      }
    } catch (error) {
      console.error('Error in task scheduler:', error);
    }
  });
};

export default taskScheduler;