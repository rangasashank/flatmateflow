import RoommateGroup from '../models/RoommateGroup.js';
import {User} from '../models/User.js';
import { sendCookie } from "../utils/features.js"
import bcrypt from'bcrypt';

// function to create a group

export const createGroup = async(req, res) => {
    const {groupName, password, userEmail} = req.body;


    try{
        const existingGroup = await RoommateGroup.findOne({name: groupName});
        if (existingGroup) {
            return res.status(400).json({message: 'Group name already exists, Please choose another name'})
        }

    

    const group = await RoommateGroup.create({name: groupName, password: password});
    const user = await User.findOne({ email: userEmail });
    user.group = group._id;
    await user.save();
    const member = {_id: user._id, name: user.name}
    group.members.push(member);
    group.admins.push(member); 
    await group.save();

    res.status(201).json({
        id: group._id,
        name: group.name,
        })
    } catch (error) {
        res.status(500).json({error: error.message})
    }

};

export const getMembers = async(req, res) => {
  try {
    const group = await RoommateGroup.findById(req.params.groupId)
    res.status(200).json(group.members);
  }
  catch {
    res.status(500).json({error: error.message})
  }

}

// function to delete a group

export const deleteGroup = async(req, res) => {
    const {groupId, groupPassword, admin_email} = req.body;


    try{
        const existingGroup = await RoommateGroup.findOne({_id: groupId});
        if (!existingGroup) {
            return res.status(400).json({message: 'Group name does not exists, Please choose another name'})
        }
        const admin = await User.findOne({ email: admin_email });
        var isAdmin = false;
        for (let index = 0; index < existingGroup.admins.length; index++) {
          let id = existingGroup.admins[index]._id;
          if (id.toString().trim() === admin._id.toString().trim()) {
            isAdmin = true
            return res.status(200).json({isAdmin})
            break;
          }
        }
        if (!isAdmin) {
            return res.status(400).json({ message: 'Only Admin has rights to delete' });
          }
    
        const isPasswordMatch = await bcrypt.compare(groupPassword, existingGroup.password);
        if (!isPasswordMatch ) {
            return res.status(401).json({ message: 'Incorrect group password' });
        }

        await RoommateGroup.deleteOne({_id: groupId})
    res.status(201).json({
        id: existingGroup._id,
        name: existingGroup.name,
        })
    } catch (error) {
        res.status(500).json({error: error.message})
    }

};

// Add a user to the group by their email
export const addMember = async (req, res) => {
    const { email } = req.body;
    const groupId = req.user.group;  // Assuming the user is already part of a group
  
    try {
      // Find the user by email
      const userToAdd = await User.findOne({ email });
      if (!userToAdd) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check if the user is already in a group
      const group = await RoommateGroup.findById(groupId);
      if ((userToAdd.group) || (userToAdd.group.groupName != "" )) {
        return res.status(400).json({ message: 'User is already in a group, first they need to leave the group' });
      }
  
      // Add the user to the group
      group.members.push({_id: userToAdd._id, name: userToAdd.name});
      await group.save();
  
      // Update user's group reference
      userToAdd.group = group._id;
      await userToAdd.save();
  
      res.status(200).json({ message: 'User added to the group successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Join a group using group name and password
export const joinGroup = async (req, res) => {
    const { groupName, groupPassword } = req.body;
    const userId = req.user.id;
    const userName = req.user.name;
      // JWT authentication middleware provides the user ID
  
    try {
      // Find the group by name
      const group = await RoommateGroup.findOne({ name: groupName });
      if (!group) {
        return res.status(404).json({ message: 'Group not found' });
      }
  
      // Check if the group password matches
      const isMatch = await bcrypt.compare(groupPassword, group.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
      // Check if the user is already a member
      if (group.members.includes(userId)) {
        return res.status(400).json({ message: 'User is already in the group' });
      }
      const member = {_id: userId, name:userName}
      // Add the user to the group
      group.members.push(member);
      await group.save();
  
      // Add group reference to the user model
      const user = await User.findById(userId);
      user.group = group._id;
      await user.save();
  
      res.status(200).json({ message: 'Joined group successfully', groupId: group._id, groupName: group.name });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// function to remove a member to a group / join a group, need a group password

export const removeMember = async(req, res) => {
    const {groupId, userEmail, admin_email} = req.body;
    const userId = req.user.id;
    try {
        const group = await RoommateGroup.findOne({_id: groupId});
        if (!group) {
            return res.status(404).json({message: 'Group does not exist'})
        }
       
        const admin = await User.findOne({ email: admin_email });
        var isAdmin = false;
        for (let index = 0; index < group.admins.length; index++) {
          let id = group.admins[index]._id;
          if (id.toString().trim() === admin._id.toString().trim()) {
            isAdmin = true
            
            break;
          }
        }
        if (!isAdmin) {
            return res.status(400).json({ message: 'Only Admin has rights to remove a user' });
          }
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({message: 'User does not exist'})
        }

        var isMember = false;
        for (let index = 0; index < group.members.length; index++) {
          let id = group.members[index]._id;
          if (id.toString().trim() === user._id.toString().trim()) {
            isMember = true
            break;
          }
        }
        if (!isMember) {
            return res.status(400).json({ message: 'User is not in the group' });
          }
          if (user.group) {
            const group = await RoommateGroup.findOne({_id:user.group});
            if (group) {
              group.members = group.members.filter(member => member._idtoString().trim() !== userId.toString().trim());
              await group.save();
            }
          }
          user.group = null;
          await user.save();

        res.status(200).json({ message: 'Removed user from group successfully', groupId: group._id, groupName: group.name });
        
    } catch (error) {
        res.status(500).json({error: error.message})
    }
};

