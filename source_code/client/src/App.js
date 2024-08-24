import React from 'react';
import './App.css';
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Login from './components/login.jsx';
import Signup from './components/Signup.jsx';
import Home from './components/home.jsx';
import CreateProject from './components/CreateProject.jsx';
import CreateTeam from './components/CreateTeam.jsx';
import CreateTeamRoster from './components/CreateTeamRoster.jsx';
import CreateUserStory from './components/CreateUserStory.jsx';
import CreateTask from './components/CreateTask.jsx';
import ViewTeam from './components/ViewTeam.jsx';
import ViewProjects from './components/ViewProjects.jsx';
import ViewUserStories from './components/ViewUserStories.jsx';
import RemoveTeamMember from './components/RemoveTeamMembers';
import TeamRosterList from './components/TeamRosterlist';
import AssignUserStories from './components/AssignUserStories.jsx';
import ViewTask from './components/ViewTask.jsx';
function App() {
  return (
    <div>
        <BrowserRouter>

              <Routes>
                  <Route path="/" element={<Login />}/>
                  <Route path="/Signup" element={<Signup />}/>
                  <Route path="/home" element={<Home />}/>

                  <Route path="/CreateProject" element={<CreateProject />} />
                  <Route path="/CreateTeam" element={<CreateTeam />} />
                  <Route path="/CreateTeamRoster" element={<CreateTeamRoster />} />
                  <Route path="/CreateUserStory" element={<CreateUserStory />} />
                  <Route path="/ViewTeam" element={<ViewTeam />} />
                  <Route path="/CreateTask" element={<CreateTask />} />
                  <Route path="/ViewProjects" element={<ViewProjects />} />
                  <Route path="/ViewUserStories" element={<ViewUserStories />} />
                  <Route path="/RemoveTeamMembers" element={<RemoveTeamMember />} />
                  <Route path="/TeamRosterList" element={<TeamRosterList />} />
                  <Route path="/AssignUserStories" element={<AssignUserStories />} />
                  <Route path="/ViewTask" element={<ViewTask />} />
              </Routes>
          </BrowserRouter>
    </div>
      
  );
}

export default App;
