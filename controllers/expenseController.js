// controllers/expenseController.js
import Expense from '../models/Expense.js';

// Create an expense
export const createExpense = async (req, res) => {
  const { description, amount, paidBy, group, splitAmong } = req.body;

  try {
    const expense = new Expense({
      description,
      amount,
      paidBy,
      group,
      splitAmong,
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Error creating expense', error: error.message });
  }
};

// Get expenses for a group
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ group: req.params.groupId }).populate('paidBy splitAmong');
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expenses', error: error.message });
  }
};

// Delete an expense
export const deleteExpense = async (req, res) => {
    try {
      await Note.findByIdAndDelete(req.params.expenseId);
      res.status(200).json({ message: 'Expense deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting Expense', error: error.message });
    }
  };