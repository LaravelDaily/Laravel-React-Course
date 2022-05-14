require('./bootstrap');

import { render } from "react-dom";
import PostsIndex from "./Pages/Posts";

render(<PostsIndex />, document.getElementById('app'))
