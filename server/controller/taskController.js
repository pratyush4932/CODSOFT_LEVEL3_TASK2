import User from '../model/UserSchema.js';

class TaskController{
    createTask=async(req,res)=>{
        const {userID,projectID,taskData}=req.body;
        const {title,description,assignTo,startDate,endDate,status}=taskData;

        if(!title || !startDate || !endDate) return res.status(400).json({ msg: 'Missing required task data (title, startDate, endDate)' });
        try{
            const user=await User.findById(userID);
            if (!user) return res.status(404).json({ msg: "User not found" });
            const project=user.projects.id(projectID);
            if(!project) return res.status(404).json({msg:"Projects not found"});
            const validStatuses = ['to-do', 'in-progress', 'done', 'overdue'];
            if(!validStatuses.includes(status)) {
                return res.status(400).json({ msg: 'Invalid status. Must be one of: pending, in-progress, completed, overdue' });
            }
            const newTask={
                title,
                description,
                assignTo,
                startDate,
                endDate,
                status:status || 'to-do' 
            }

            project.tasks.push(newTask);
            await user.save();
            res.status(201).json(newTask);
        }catch (err){
            res.status(500).json({ msg: "Error creating project", err });
            console.log(err)
        }
    }

    getTaskForProject=async (req,res)=>{
        const {userID,projectID}=req.params;
        try{
            const user = await User.findById(userID);
            if (!user) return res.status(404).json({ msg: "User not found" });
            const project=user.projects.id(projectID);
            if(!project) return res.status(404).json({msg:"Projects not found"});
            res.status(200).json(project.tasks);
        }catch(err){
            res.status(500).json({ msg: "Error creating project", err });
        }
    }

    updateTaskStatus=async (req,res)=>{
        const {userID,projectID,taskID,status}=req.body;
        
        if(!status) return res.status(400).json({ msg: 'Status is required' });

        const validStatuses = ['to-do', 'in-progress', 'done', 'overdue'];
        if(!validStatuses.includes(status)) {
            return res.status(400).json({ msg: 'Invalid status. Must be one of: to-do, in-progress, to-do, overdue' });
        }

        try{
            const user=await User.findById(userID);
            if (!user) return res.status(404).json({ msg: "User not found" });
            const project=user.projects.id(projectID);
            if(!project) return res.status(404).json({msg:"Projects not found"});
            const task=project.tasks.id(taskID);
            if(!task) return res.status(404).json({msg:"Task not found"});
            
            task.status=status;
            await user.save();
            res.status(200).json({ msg: "Task status updated successfully", task });           
        }catch(err){
            res.status(500).json({ msg: "Error updating task status", err });
        }
    }

    updateTaskTitle=async (req,res)=>{
        const {userID,projectID,taskID}=req.params;
        const {title}=req.body;
        
        if(!title) return res.status(400).json({ msg: 'Title is required' });
        
        try{
            const user=await User.findById(userID);
            if (!user) return res.status(404).json({ msg: "User not found" });
            const project=user.projects.id(projectID);
            if(!project) return res.status(404).json({msg:"Projects not found"});
            const task=project.tasks.id(taskID);
            if(!task) return res.status(404).json({msg:"Task not found"});
            
            task.title=title;
            await user.save();
            res.status(200).json({ msg: "Task title updated successfully", task });           
        }catch(err){
            res.status(500).json({ msg: "Error updating task title", err });
        }
    }

    updateTaskDescription=async (req,res)=>{
        const {userID,projectID,taskID}=req.params;
        const {description}=req.body;
        
        try{
            const user=await User.findById(userID);
            if (!user) return res.status(404).json({ msg: "User not found" });
            const project=user.projects.id(projectID);
            if(!project) return res.status(404).json({msg:"Projects not found"});
            const task=project.tasks.id(taskID);
            if(!task) return res.status(404).json({msg:"Task not found"});
            
            task.description=description;
            await user.save();
            res.status(200).json({ msg: "Task description updated successfully", task });           
        }catch(err){
            res.status(500).json({ msg: "Error updating task description", err });
        }
    }

    updateTaskAssignTo=async (req,res)=>{
        const {userID,projectID,taskID}=req.params;
        const {assignTo}=req.body;
        
        //if(!assignTo) return res.status(400).json({ msg: 'AssignTo user ID is required' });
        
        try{
            const user=await User.findById(userID);
            if (!user) return res.status(404).json({ msg: "User not found" });
            const project=user.projects.id(projectID);
            if(!project) return res.status(404).json({msg:"Projects not found"});
            const task=project.tasks.id(taskID);
            if(!task) return res.status(404).json({msg:"Task not found"}); 
            task.assignTo=assignTo;
            await user.save();
            res.status(200).json({ msg: "Task assignment updated successfully", task });           
        }catch(err){
            res.status(500).json({ msg: "Error updating task assignment", err });
        }
    }

    updateTaskStartDate=async (req,res)=>{
        const {userID,projectID,taskID}=req.params;
        const {startDate}=req.body;
        
        if(!startDate) return res.status(400).json({ msg: 'Start date is required' });
        
        const newStartDate = new Date(startDate);
        if(isNaN(newStartDate.getTime())) {
            return res.status(400).json({ msg: 'Invalid start date format' });
        }
        
        try{
            const user=await User.findById(userID);
            if (!user) return res.status(404).json({ msg: "User not found" });
            const project=user.projects.id(projectID);
            if(!project) return res.status(404).json({msg:"Projects not found"});
            const task=project.tasks.id(taskID);
            if(!task) return res.status(404).json({msg:"Task not found"});
            
            if(newStartDate >= new Date(task.endDate)) {
                return res.status(400).json({ msg: 'Start date must be before end date' });
            }
            
            task.startDate=newStartDate;
            await user.save();
            res.status(200).json({ msg: "Task start date updated successfully", task });           
        }catch(err){
            res.status(500).json({ msg: "Error updating task start date", err });
        }
    }

    updateTaskEndDate=async (req,res)=>{
        const {userID,projectID,taskID}=req.params;
        const {endDate}=req.body;
        
        if(!endDate) return res.status(400).json({ msg: 'End date is required' });
        
        const newEndDate = new Date(endDate);
        if(isNaN(newEndDate.getTime())) {
            return res.status(400).json({ msg: 'Invalid end date format' });
        }
        
        try{
            const user=await User.findById(userID);
            if (!user) return res.status(404).json({ msg: "User not found" });
            const project=user.projects.id(projectID);
            if(!project) return res.status(404).json({msg:"Projects not found"});
            const task=project.tasks.id(taskID);
            if(!task) return res.status(404).json({msg:"Task not found"});
            
            if(newEndDate <= new Date(task.startDate)) {
                return res.status(400).json({ msg: 'End date must be after start date' });
            }
            
            task.endDate=newEndDate;
            await user.save();
            res.status(200).json({ msg: "Task end date updated successfully", task });           
        }catch(err){
            res.status(500).json({ msg: "Error updating task end date", err });
        }
    }

    getTaskById=async (req,res)=>{
        const {userID,projectID,taskID}=req.params;
        try{
            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ msg: "User not found" });
            const project=user.projects.id(projectId);
            if(!project) return res.status(404).json({msg:"Projects not found"});
            const task=project.tasks.id(taskId);
            if(!task) return res.status(404).json({msg:"Task not found"});
            res.status(200).json(task);
        }catch(err){
            res.status(500).json({ msg: "Error fetching task", err });
        }
    }

    deleteTask=async (req,res)=>{
        const {userID,projectID,taskID}=req.params;
        try{
            const user=await User.findById(userID);
            if (!user) return res.status(404).json({ msg: "User not found" });
            const project=user.projects.id(projectID);
            if(!project) return res.status(404).json({msg:"Projects not found"});
            const task=project.tasks.id(taskID);
            if(!task) return res.status(404).json({msg:"Task not found"});
            
            project.tasks.pull(taskID);
            await user.save();
            res.status(200).json({ msg: "Task deleted successfully" });           
        }catch(err){
            res.status(500).json({ msg: "Error deleting task", err });
        }
    }

}

export default new TaskController();