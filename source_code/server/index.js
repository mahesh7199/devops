const express = require('express');
const mongoose = require('mongoose');
const User = require('./schemas/userschema.js');
const Team = require('./schemas/Teamnameschema.js'); 
const Project = require('./schemas/projectschema.js');
const TeamRoster = require('./schemas/TeamRostersSchema.js'); 
const UserStory = require('./schemas/UserStorySchema.js')
const Assigned = require('./schemas/AssignedSchema.js');
const Task = require('./schemas/TaskSchema.js');

const app = express();
const cors = require('cors');
const port = 9000;

// MongoDB connection setup
const MONGODB_URI = 'mongodb+srv://nanimahesh1999:Nani7199@cluster0.vzwpvqi.mongodb.net/Mylabs';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,

});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB Atlas !!');
});

app.use(express.json());

app.use(cors());



// Route to create a new user
app.post('/createUser', async (req, res) => {
  try {
      const newUser = new User({
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          username: req.body.username,
          password: req.body.password
      });

      await newUser.save();
      res.status(201).send({ message: 'User created successfully' });
  } catch (error) {
      console.error('Error in user creation:', error);
      res.status(500).send({ message: 'Error creating user', error });
  }
});


app.get('/getUser', async (req, res) => {
  const { username, password } = req.query;
  try {
      const user = await User.findOne({ username, password });
      if (!user) {
          res.status(404).send('User not found');
      } else {
          res.send({ username: user.username });
      }
  } catch (error) {
      res.status(500).send(error);
  }
});

// Route to get the details of all users
app.get('/getUsers', async (req, res) => {
  try {
    const users = await User.find({}, 'firstname lastname');
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/getUserId', async (req, res) => {
  try {
    const { username } = req.query;
    const user = await User.findOne({ username: username });
    if (!user) {
      res.status(404).send('User not found');
    } else {
      res.send({ userId: user._id });
    }
  } catch (error) {
    console.error("Error fetching user ID:", error);
    res.status(500).send(error);
  }
});




// Route to create a new team
app.post('/createTeam', async (req, res) => {
  try {
    const { team_name } = req.body;
    const team = new Team({ team_name });
    await team.save();
    res.status(201).send(team);
  } catch (error) {
    res.status(500).send(error);
  }
});


// Route to get the details of all teams
app.get('/getTeams', async (req, res) => {
  try {
    const teams = await Team.find({}, 'team_name');
    // console.log('Fetched teams:', teams);
    res.status(200).send(teams);
  } catch (error) {
    res.status(500).send(error);
  }
});



// Route to create a new project
app.post('/createProject', async (req, res) => {
  try {
    const { proj_name, proj_desc, mgr_id, prod_owner_id, team_id } = req.body;

    if (!proj_name || !proj_desc || !mgr_id || !prod_owner_id || !team_id) {
      return res.status(400).send('All fields are required');
    }

    const project = new Project({
      proj_name,
      proj_desc,
      mgr_id,
      prod_owner_id,
      team_id,
    });

    await project.save();
    res.status(201).send(project);
  } catch (error) {
    res.status(500).send(error);
  }
});


// Route to get the details of all projects
app.get('/getProjects', async (req, res) => {
  try {
    const projects = await Project.find();
    let responseDetails = [];

    for (const project of projects) {


      const manager = await User.findById(project.mgr_id); // Use User instead of Users
      const owner = await User.findById(project.prod_owner_id); // Use User instead of Users
      const team = await Team.findById(project.team_id);

      // console.log(manager)
      // console.log(owner)
      // console.log(team)

      responseDetails.push({
        _id:project._id,
        project_name: project.proj_name,
        description: project.proj_desc,
        manager_details: manager.firstname + "" + manager.lastname,
        owner_details: owner.firstname + "" + owner.lastname,
        teams_details: team.team_name,
        team_id: project.team_id
      });
    }

    // console.log(responseDetails)
    res.json(responseDetails);
  } catch (error) {
    res.status(500).send(error);
  }
});
  
 
// Route to add a member to a team
app.post('/addTeamMembers', async (req, res) => {
  const { team_id, member_ids } = req.body;

  if (!team_id || !Array.isArray(member_ids) || member_ids.length === 0) {
    return res.status(400).send('Both team_id and an array of member_ids are required');
  }

  try {
    // Check if the team roster entry already exists
    const teamRoster = await TeamRoster.findOne({ team_id });

    if (teamRoster) {
      // Remove duplicates from the member_ids array
      const uniqueMemberIds = [...new Set([...teamRoster.member_id, ...member_ids])];
      teamRoster.member_id = uniqueMemberIds;
      await teamRoster.save();
    } else {
      // Create a new team roster entry
      const newTeamRoster = new TeamRoster({
        team_id,
        member_id: member_ids,
      });
      await newTeamRoster.save();
    }

    res.status(201).send('Members added to the team successfully');
  } catch (error) {
    res.status(500).send(error);
  }
});




// Route for fetching team members by team ID
app.get('/getTeamMembers', async (req, res) => {
  const { team_id } = req.query;
  console.log("team id is ",team_id)

  try {
    // Use a more descriptive variable name
    const teamMembers = await TeamRoster.find({team_id:team_id});
    console.log("teammembers are ",teamMembers)
    response =[]

    for (const obj of teamMembers) {
      for (const member_id of obj.member_id) {
        const member = await User.findOne({ _id: member_id });
        if (member) {
          response.push({
            firstname: member.firstname,
            lastname: member.lastname,
            _id: member._id
          });
        }}}
      
    console.log("response is",response)
    res.send(response)

  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).send('Error fetching team members.');
  }
});





// An endpoint to get team rosters
app.get('/getTeamRosters', async (req, res) => {
  try {
    const teamRosters = await TeamRoster.find();
    // console.log('Fetched team rosters:', teamRosters);
    res.status(200).send(teamRosters);
  } catch (error) {
    res.status(500).send(error);
  }
});






// Route to add a user story to a project
app.post('/addUserStory', async (req, res) => {
  try {
    const { user_story, proj_id, priority } = req.body;
    
    if (!user_story || !proj_id) {
      return res.status(400).send('User story and project ID are required.');
    }

    const newUserStory = new UserStory({ user_story, proj_id, priority });
    await newUserStory.save();
    
    res.status(201).send(newUserStory);
  } catch (error) {
    res.status(500).send(error);
  }
});


// Add this route to your server code
app.get('/getUserStories/:project_id', async (req, res) => {
  const { project_id } = req.params;

  try {
    const userStories = await UserStory.find({ proj_id: project_id });
    res.status(200).send(userStories);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.delete('/deleteUserStory/:story_id', async (req, res) => {
  const { story_id } = req.params;

  try {
    const deletedStory = await UserStory.findByIdAndDelete(story_id);
    if (deletedStory) {
      res.status(200).send('User story deleted successfully');
    } else {
      res.status(404).send('User story not found');
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// this route is to fetch all user stories
app.get('/getAllUserStories', async (req, res) => {
  try {
    const allUserStories = await UserStory.find();
    res.status(200).send(allUserStories);
  } catch (error) {
    res.status(500).send(error);
  }
});


app.get('/getTeamsRoaster', async (req, res) => {
  try {
      const fullTeams = await TeamRoster.find();

      // A helper function to fetch user's full name and ID by user's ID
      const getUserDetails = async (userId) => {
          const user = await User.findById(userId);
          return {
              id: user._id,
              name: `${user.firstname} ${user.lastname}`
          };
      }

      // A helper function to fetch team's name by team's ID
      const getTeamName = async (teamId) => {
          const team = await Team.findById(teamId);
          return team.team_name;
      }

      // Use Promise.all to efficiently fetch names in parallel
      const teamsWithNames = await Promise.all(fullTeams.map(async team => {
          const teamName = await getTeamName(team.team_id);
          const userDetails = await Promise.all(team.member_id.map(member_id => getUserDetails(member_id)));
          
          return {
              team_id: team.team_id,
              team_name: teamName,
              users: userDetails
          };
      }));

      res.status(200).json(teamsWithNames);

  } catch (error) {
    console.log(error)
      res.status(500).json({ message: 'Server Error', error });
  }
});

app.post('/removeTeamMembers', async (req, res) => {
  try {
      const { team_id, membersToDelete } = req.body;

      // Find the FullTeam document with the given team_id
      const team = await TeamRoster.findOne({ team_id: team_id });

      // If no such team found, return an error response
      if (!team) {
          return res.status(404).json({ message: "Team not found!" });
      }

      // Filter out the members to delete
      team.member_id = team.member_id.filter(userId => !membersToDelete.includes(userId.toString()));

      // Save the updated team
      await team.save();

      res.status(200).json({ message: "Team members updated successfully!" });

  } catch (error) {
      console.log(error)
      console.error("Error updating team members", error);
      res.status(500).json({ message: "Server Error", error });
  }
});






// Route to assign a user story
app.post('/assignStory', async (req, res) => {
  try {
      const { user_story_id, user_id } = req.body;

      // Validate user_id format
      if (!mongoose.Types.ObjectId.isValid(user_id)) {
          return res.status(400).send({ message: "Invalid user_id format" });
      }

      const objectId = new mongoose.Types.ObjectId(user_id); // Convert string to Object ID

      const newAssignment = new Assigned({
          user_story_id: user_story_id,
          user_id: objectId
      });

      await newAssignment.save();

      res.status(200).send({ message: 'User Story assigned successfully' });
  } catch (error) {
      console.error("Error in assignment:", error);
      res.status(500).send({ message: "Internal Server Error", error: error.message });
  }
});



app.get('/getAssignedStories', async (req, res) => {
  try {
    const assignedStories = await Assigned.find()
      .populate('user_story_id', 'user_story isAssigned')  // field names match your schema
      .populate('user_id', 'firstname lastname username');  // Adjust according to your User schema

      console.log('Assigned Stories:', assignedStories);
    res.status(200).json(assignedStories);
  } catch (error) {
    res.status(500).send(error);
  }
});


// Route to create a new task
app.post('/createTask', async (req, res) => {
  try {
    const task = new Task(req.body);
    console.log("Received task details:", req.body); // Log the incoming request body
    await task.save();
    console.log("Saved task:", task); // Log the saved task
    res.status(201).send(task);
  } catch (error) {
    console.error('Error creating task:', error); // Log the error
    res.status(500).send(error.message); // Send back the error message
  }
});

// Route to get all tasks (or modify to fetch specific user's tasks)
app.get('/getTasks', async (req, res) => {
  try {
      const tasks = await Task.find()
          .populate('userStoryId', 'user_story') // Populate user story details
          .populate('createdBy', 'firstname lastname'); // Populate user details
          console.log("Tasks sent:", tasks); 
          res.status(200).json(tasks);
  } catch (error) {
      res.status(500).send(error);
  }
});


// Route to update a task's status
app.patch('/updateTask/:taskId', async (req, res) => {
  try {
      const { taskId } = req.params;
      const updatedTask = await Task.findByIdAndUpdate(taskId, req.body, { new: true });
      if (!updatedTask) {
          return res.status(404).send('Task not found');
      }
      res.status(200).json(updatedTask);
  } catch (error) {
      res.status(500).send(error);
  }
});



// Default route handler for non-existing routes
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
