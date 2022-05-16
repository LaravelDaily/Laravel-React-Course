require('./bootstrap');

import { createRoot } from 'react-dom/client';
import PostsIndex from "./Pages/Posts";
const root = createRoot(document.getElementById('app'));
root.render(<PostsIndex />)
