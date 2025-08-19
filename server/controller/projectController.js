import User from "../model/UserSchema.js";

class ProjectController {
  createProject = async (req, res) => {
    const { userID, projectData } = req.body;
    const { name, description, startDate, endDate, status, tasks } =
      projectData;
    if (!name || !startDate || !endDate)
      return res.status(400).json({
        msg: "Missing required project data (name, startDate, endDate)",
      });

    try {
      console.log("Looking for user with ID:", userID);
      console.log("UserID type:", typeof userID);

      const user = await User.findById(userID);
      console.log("User found:", user);

      if (!user) return res.status(404).json({ msg: "User not found" });
      const newProject = {
        name,
        description,
        startDate,
        endDate,
        status: status || "active",
        tasks: tasks || [],
      };
      user.projects.push(newProject);
      await user.save();
      res.status(201).json(newProject);
    } catch (err) {
      console.error("Error in createProject:", err);
      res.status(500).json({ msg: "Error creating project", err: err.message });
    }
  };

  getProjectForUser = async (req, res) => {
    const { userID } = req.params;
    try {
      const user = await User.findById(userID).select("projects");
      if (!user) return res.status(404).json({ msg: "User not found" });
      res.status(200).json(user.projects);
    } catch (err) {
      res
        .status(500)
        .json({ msg: "Error fetching projects", err: err.message });
    }
  };

  getProjectByID = async (req, res) => {
    const { userID, projectID } = req.params;

    try {
      const user = await User.findById(userID);
      if (!user) return res.status(404).json({ msg: "User not found" });
      const project = user.projects.id(projectID);
      if (!project) return res.status(404).json({ msg: "Project not found" });
      res.status(200).json(project);
    } catch (err) {
      res.status(500).json({ msg: "Error fetching project", err: err.message });
    }
  };

  updateProjectTitle = async (req, res) => {
    const { userID, projectID } = req.params;
    const { name } = req.body;

    if (!name) return res.status(400).json({ msg: "Name is required" });

    try {
      const user = await User.findById(userID);
      if (!user) return res.status(404).json({ msg: "User not found" });
      const project = user.projects.id(projectID);
      if (!project) return res.status(404).json({ msg: "Projects not found" });

      project.name = name;
      await user.save();
      res
        .status(200)
        .json({ msg: "Project name updated successfully", project });
    } catch (err) {
      res.status(500).json({ msg: "Error updating Project name", err });
    }
  };

  updateProjectDescription = async (req, res) => {
    const { userID, projectID } = req.params;
    const { description } = req.body;

    try {
      const user = await User.findById(userID);
      if (!user) return res.status(404).json({ msg: "User not found" });
      const project = user.projects.id(projectID);
      if (!project) return res.status(404).json({ msg: "Projects not found" });

      project.description = description;
      await user.save();
      res
        .status(200)
        .json({ msg: "Project description updated successfully", project });
    } catch (err) {
      res.status(500).json({ msg: "Error updating Project description", err });
    }
  };

  updateProjectStartDate = async (req, res) => {
    const { userID, projectID } = req.params;
    const { startDate } = req.body;

    if (!startDate)
      return res.status(400).json({ msg: "Start date is required" });

    const newStartDate = new Date(startDate);
    if (isNaN(newStartDate.getTime())) {
      return res.status(400).json({ msg: "Invalid start date format" });
    }

    try {
      const user = await User.findById(userID);
      if (!user) return res.status(404).json({ msg: "User not found" });
      const project = user.projects.id(projectID);
      if (!project) return res.status(404).json({ msg: "Projects not found" });

      if (newStartDate >= new Date(project.endDate)) {
        return res
          .status(400)
          .json({ msg: "Start date must be before end date" });
      }

      project.startDate = newStartDate;
      await user.save();
      res
        .status(200)
        .json({ msg: "Project start date updated successfully", project });
    } catch (err) {
      res.status(500).json({ msg: "Error updating Project start date", err });
    }
  };

  updateProjectEndDate = async (req, res) => {
    const { userID, projectID } = req.params;
    const { endDate } = req.body;

    if (!endDate) return res.status(400).json({ msg: "End date is required" });

    const newEndDate = new Date(endDate);
    if (isNaN(newEndDate.getTime())) {
      return res.status(400).json({ msg: "Invalid end date format" });
    }

    try {
      const user = await User.findById(userID);
      if (!user) return res.status(404).json({ msg: "User not found" });
      const project = user.projects.id(projectID);
      if (!project) return res.status(404).json({ msg: "Projects not found" });

      if (newEndDate <= new Date(project.startDate)) {
        return res
          .status(400)
          .json({ msg: "End date must be after start date" });
      }

      project.endDate = newEndDate;
      await user.save();
      res
        .status(200)
        .json({ msg: "Project end date updated successfully", project });
    } catch (err) {
      res.status(500).json({ msg: "Error updating Project end date", err });
    }
  };

  updateStatus = async (req, res) => {
    const { userID, projectID } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ msg: "Status is required" });
    const validStatuses = ["active", "completed", "pending"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        msg: "Invalid status. Must be one of: active, completed, on-hold, cancelled" 
      });
    }

    try {
      const user = await User.findById(userID);
      if (!user) return res.status(404).json({ msg: "User not found" });
      const project = user.projects.id(projectID);
      if (!project) return res.status(404).json({ msg: "Project not found" });

      project.status = status;
      await user.save();
      res
        .status(200)
        .json({ msg: "Project status updated successfully", project });
    } catch (err) {
      res.status(500).json({ msg: "Error updating Project status", err });
    }
  };

  deleteProject = async (req, res) => {
    const { userID, projectID } = req.params;
    try {
      const user = await User.findById(userID);
      if (!user) return res.status(404).json({ msg: "User not found" });
      const project = user.projects.id(projectID);
      if (!project) return res.status(404).json({ msg: "Projects not found" });
      user.projects.pull(projectID);
      await user.save();
      res.status(200).json({ msg: "Project deleted successfully" });
    } catch (err) {
      res.status(500).json({ msg: "Error deleting Project", err });
    }
  };
}

export default new ProjectController();
