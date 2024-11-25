import Task from "../models/Task.js"

// create a task
export const createTask = async(req, res) => {

    const {description, assignedTo, group, dueDate} = req.body;

    try{
        const task = new Task({
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
  const { title, description, assignedTo , dueDate, groupId, recurrenceInterval } = req.body;

  try {
    // Check if the group exists
    const group = await RoommateGroup.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Create the recurring task
    const task = new Task({
      title,
      description,
      dueDate,
      assignedTo,
      group: groupId,
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
