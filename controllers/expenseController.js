
import Expense from '../models/Expense.js';
import { User } from '../models/User.js'; // Import User model
import RoommateGroup from '../models/RoommateGroup.js'; // Import RoommateGroup model


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
      // Corrected: Use Expense model instead of Note model
      // The original provided `expenseController.js` snippet used `Note.findByIdAndDelete`.
      // Assuming 'Note' was a typo and it should be 'Expense'.
      await Expense.findByIdAndDelete(req.params.expenseId);
      res.status(200).json({ message: 'Expense deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting Expense', error: error.message });
    }
  };


// Get balances for a group
export const getGroupBalances = async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const expenses = await Expense.find({ group: groupId }).populate('paidBy splitAmong');
    const group = await RoommateGroup.findById(groupId).populate('members'); // Populate members

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const members = group.members; // Get members from the populated group
    const balances = {};

    // Initialize balances for all group members to 0
    members.forEach(member => {
      balances[member._id.toString()] = 0;
    });

    expenses.forEach(expense => {
      const paidBy = expense.paidBy._id.toString();
      const amount = expense.amount;
      // Use splitAmong if present, otherwise default to all group members
      const effectiveSplitAmongIds = expense.splitAmong.length > 0
        ? expense.splitAmong.map(user => user._id.toString())
        : members.map(member => member._id.toString());

      const share = amount / effectiveSplitAmongIds.length;

      // The person who paid should have the total amount added to their balance first.
      // Then, subtract each person's share from their respective balance.
      // This way, if the payer is also part of the split, their share cancels out.
      balances[paidBy] += amount; // The payer is owed the full amount they paid initially.

      effectiveSplitAmongIds.forEach(personId => {
        balances[personId] -= share; // Each person involved in the split (including the payer if they are part of it) owes their share.
      });
    });

    // Format balances for response, including user names
    const formattedBalances = Object.keys(balances).map(userId => {
      const user = members.find(member => member._id.toString() === userId);
      return {
        userId: userId,
        name: user ? user.name : 'Unknown User',
        balance: balances[userId],
      };
    });

    res.status(200).json(formattedBalances);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching group balances', error: error.message });
  }
};