const RoommateGroup = require('../models/RoommateGroup');
const User = require('../models/User');

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
    group.members.push(user._id);
    group.admins.push(user._id); 
    res.status(201).json({
        id: group._id,
        name: group.name,
        })
    } catch (error) {
        res.status(500).json({error: error.message})
    }

};

// function to add a member to a group / join a group, need a group password

export const addMember = async(req, res) => {
    const {groupName, groupPassword, userEmail} = req.body;

    try {
        const group = await RoommateGroup.findOne({name: groupName});
        if (!group) {
            return res.status(404).json({message: 'Group does not exist'})
        }
        const isPasswordMatch = await group.matchPassword(groupPassword);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Incorrect group password' });
        }
        const user = await User.findOne({ email: userEmail });
        user.group = group._id;
        await user.save()
        group.members.push(user._id);
        await group.save();

            res.status(201).json({
                id: group._id,
                name: group.name,

                })
        
    } catch (error) {
        res.status(500).json({error: error.message})
    }
};
