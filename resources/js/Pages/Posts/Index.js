import { Component } from "react";

class PostsIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            posts: []
        }
    }

    fetchPosts() {
        axios.get('/api/posts')
            .then(response => this.setState({ posts: response.data.data }))
    }

    componentDidMount() {
        this.fetchPosts()
    }

    renderPosts() {
        return this.state.posts.map(post => <tr>
            <td>{ post.id }</td>
            <td>{ post.title }</td>
            <td>{ post.content }</td>
            <td>{ post.created_at }</td>
        </tr>);
    }

    render() {
        return (
            <div className="overflow-hidden overflow-x-auto p-6 bg-white border-gray-200">
                <div className="min-w-full align-middle">
                    <table className="table">
                        <thead className="table-header">
                        <tr>
                            <th>
                                <span>ID</span>
                            </th>
                            <th>
                                <span>Title</span>
                            </th>
                            <th>
                                <span>Content</span>
                            </th>
                            <th>
                                <span>Created at</span>
                            </th>
                        </tr>
                        </thead>
                        <tbody className="table-body">
                            { this.renderPosts() }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default PostsIndex

