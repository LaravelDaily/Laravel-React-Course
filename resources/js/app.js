import {Route, Routes, BrowserRouter, Navigate} from "react-router-dom";

require('./bootstrap');

import {createRoot} from 'react-dom/client';
import App from "./Layouts/App";
import PostsIndex from "./Pages/Posts";
import PostsCreate from "./Pages/Posts/Create";
import PostsEdit from "./Pages/Posts/Edit";
import Guest from "./Layouts/Guest";
import Login from "./Pages/Auth/Login";
import Register from "./Pages/Auth/Register";

import {AbilityContext} from './Abilities/Can';
import Ability from './Abilities/Ability';

const root = createRoot(document.getElementById('app'));
root.render(
    <AbilityContext.Provider value={Ability}>
        <BrowserRouter>
            <Routes>
                <Route path="posts" element={<App/>}>
                    <Route index element={<PostsIndex/>}></Route>
                    <Route path="/posts/create" element={<PostsCreate/>}></Route>
                    <Route path="/posts/edit/:id" element={<PostsEdit/>}></Route>
                </Route>
                <Route path="login" element={<Guest/>}>
                    <Route index element={<Login/>}></Route>
                </Route>
                <Route path="register" element={<Guest/>}>
                    <Route index element={<Register/>}></Route>
                </Route>
                <Route path="*" element={<Navigate to="/posts" replace/>}/>
            </Routes>
        </BrowserRouter>
    </AbilityContext.Provider>
)
