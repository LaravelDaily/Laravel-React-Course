import {Component} from "react";
import CategoriesService from "../../Services/CategoriesService";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'

export const withNavigation = (Component) => {
    return props => <Component {...props} navigate={useNavigate()} />;
}

class PostsCreate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            content: '',
            category_id: '',
            thumbnail: '',
            categories: [],
            errors: {},
            isLoading: false
        }

        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleContentChange = this.handleContentChange.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleThumbnailChange = this.handleThumbnailChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleTitleChange(event) {
        this.setState({ title: event.target.value });
    }

    handleContentChange(event) {
        this.setState({ content: event.target.value });
    }

    handleCategoryChange(event) {
        this.setState({ category_id: event.target.value });
    }

    handleThumbnailChange(event) {
        this.setState({ thumbnail: event.target.files[0] });
    }

    handleSubmit(event) {
        event.preventDefault();

        if (this.state.isLoading) return;

        this.setState({
            errors: {},
            isLoading: true
        });

        let postData = new FormData()
        postData.append('title', this.state.title);
        postData.append('content', this.state.content);
        postData.append('category_id', this.state.category_id);
        postData.append('thumbnail', this.state.thumbnail);

        axios.post('/api/posts', postData).then(response => {
            Swal.fire({
                icon: 'success',
                title: 'Post added successfully'
            });
            this.props.navigate('/')
        })
            .catch(error => {
                this.setState({ errors: error.response.data.errors })
                Swal.fire({
                    icon: 'error',
                    title: error.response.data.message
                })
            })
            .finally(() => this.setState({ isLoading: false }));
    }

    componentDidMount() {
        CategoriesService.getAll()
            .then(response => this.setState({categories: response.data.data}))
    }

    errorMessage(field) {
        return (
            <div className="text-red-600 mt-1">
                {
                    this.state.errors?.[field]?.map((message, index) => {
                        return (
                            <div key={index}>{ message }</div>
                        )
                    })
                }
            </div>
        )
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div>
                    <label htmlFor="title" className="block font-medium text-sm text-gray-700">
                        Title
                    </label>
                    <input value={this.state.title} onChange={this.handleTitleChange} id="title" type="text" className="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    { this.errorMessage('title') }
                </div>
                <div className="mt-4">
                    <label htmlFor="content" className="block font-medium text-sm text-gray-700">
                        Content
                    </label>
                    <textarea value={this.state.content} onChange={this.handleContentChange} id="content" type="text" className="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
                    { this.errorMessage('content') }
                </div>
                <div className="mt-4">
                    <label htmlFor="category" className="block font-medium text-sm text-gray-700">
                        Category
                    </label>
                    <select value={this.state.category_id} onChange={this.handleCategoryChange} id="category" className="block mt-1 w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                        <option value="">-- Select category --</option>
                        { this.state.categories.map((category, index) => (
                            <option key={index} value={category.id}>{ category.name }</option>
                        )) }
                    </select>
                    { this.errorMessage('category_id') }
                </div>
                <div className="mt-4">
                    <label htmlFor="thumbnail" className="block font-medium text-sm text-gray-700">
                        Thumbnail
                    </label>
                    <input type="file" id="thumbnail" onChange={this.handleThumbnailChange} />
                    { this.errorMessage('thumbnail') }
                </div>
                <div className="mt-4">
                    <button type="submit" className="flex items-center px-3 py-2 bg-blue-600 text-white rounded" disabled={this.state.isLoading}>
                        <svg role="status" className={`w-4 h-4 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600 inline ${!this.state.isLoading ? 'hidden' : ''}`} viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                        <span>Save</span>
                    </button>
                </div>
            </form>
        )
    }
}

export default withNavigation(PostsCreate);
