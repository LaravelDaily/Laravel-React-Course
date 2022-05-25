import {Component} from "react";
import CategoriesService from "../../Services/CategoriesService";
import { useNavigate } from "react-router-dom";

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
            categories: [],
            errors: {}
        }

        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleContentChange = this.handleContentChange.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
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

    handleSubmit(event) {
        event.preventDefault();

        axios.post('/api/posts', {
            title: this.state.title,
            content: this.state.content,
            category_id: this.state.category_id,
        }).then(response => this.props.navigate('/'))
            .catch(error => this.setState({ errors: error.response.data.errors }));
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
                    <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded">
                        Save
                    </button>
                </div>
            </form>
        )
    }
}

export default withNavigation(PostsCreate);
