import Task from "../models/Task.js"

// create a task
export const createTask = async(req, res) => {

    const {title, description, assignedTo, group, dueDate} = req.body;

    try{
        const task = new Task({
            title,
            description,
            assignedTo,
            group,
            dueDate
        })

        await task.save();
        res.status(201).json(task);

    }catch (error) {
        res.status(500).json({ message: 'Error creating task', error: error.message });
      }

}

export const createRecurringTask = async(req, res) => {
  const { title, description, assignedTo , dueDate, group, recurrenceInterval } = req.body;
try {
    // Create the recurring task
    const task = new Task({
      title,
      description,
      dueDate,
      assignedTo,
      group,
      isRecurring: true,
      recurrenceInterval,
      recurrenceNextDueDate: dueDate,
      createdBy: req.user._id,
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }

}

export const processRecurringTasks = async () => {
  try {
    const today = new Date();

    // Get all recurring tasks due today or earlier
    const tasks = await Task.find({
      isRecurring: true,
      recurrenceNextDueDate: { $lte: today },
    });

    for (let task of tasks) {
      const group = await RoommateGroup.findById(task.group);
      if (!group || !group.members || group.members.length === 0) continue;

      // Rotate assignedTo (find next person in cycle)
      const currentIndex = group.members.findIndex((m) => m.toString() === task.assignedTo.toString());
      const nextIndex = (currentIndex + 1) % group.members.length;
      const nextUserId = group.members[nextIndex];

      // Update due date
      const nextDueDate = new Date(task.recurrenceNextDueDate);
      nextDueDate.setDate(nextDueDate.getDate() + task.recurrenceInterval);

      // Create new task instance (optional, if you want history of instances)
      await Task.create({
        title: task.title,
        description: task.description,
        assignedTo: nextUserId,
        group: task.group,
        dueDate: nextDueDate,
        isRecurring: false, // this one is a one-off instance
        createdBy: task.createdBy,
      });

      // Update recurrenceNextDueDate on original task
      task.recurrenceNextDueDate = nextDueDate;
      task.assignedTo = nextUserId;
      await task.save();
    }

    console.log("Recurring tasks processed.");
  } catch (err) {
    console.error("Error processing recurring tasks:", err);
  }
};

//getTasks for the group
export const getTasks = async (req, res) => {
try {
    const tasks = await Task.find({ group: req.params.groupId }).populate('assignedTo');
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

// Update a task (e.g., mark as completed)
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.taskId, req.body, { new: true });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
};

export const markTaskComplete = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.completed = true;
    await task.save();

    res.json({ message: 'Task marked as complete' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.taskId);
    res.status(200).json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
};
