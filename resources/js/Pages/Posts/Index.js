import {Component} from "react";
import CategoriesService from "../../Services/CategoriesService";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2'
import { Can } from '../../Abilities/Can'

class PostsIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            posts: [],
            categories: [],
            query: {
                page: 1,
                id: '',
                category_id: '',
                title: '',
                content: '',
                global: '',
                order_column: 'id',
                order_direction: 'desc'
            }
        }

        this.handleIdFilter = this.handleIdFilter.bind(this)
        this.handleTitleFilter = this.handleTitleFilter.bind(this)
        this.handleCategoryFilter = this.handleCategoryFilter.bind(this)
        this.handleContentFilter = this.handleContentFilter.bind(this)
        this.handleGlobalFilter = this.handleGlobalFilter.bind(this)
        this.pageChanged = this.pageChanged.bind(this)
        this.orderChanged = this.orderChanged.bind(this)
        this.deletePost = this.deletePost.bind(this)
    }

    fetchPosts() {
        axios.get('/api/posts', {params: this.state.query})
            .then(response => this.setState({posts: response.data}))
    }

    pageChanged(url) {
        const fullUrl = new URL(url);
        this.setState(({
            query: {
                page: fullUrl.searchParams.get('page')
            }
        }), () => this.fetchPosts())
    }

    debounceFetchPosts = _.debounce(this.fetchPosts, 500);

    handleIdFilter(event) {
        this.setState(({
            query: {
                id: event.target.value,
                page: 1
            }
        }));

        this.debounceFetchPosts();
    }

    handleTitleFilter(event) {
        this.setState(({
            query: {
                title: event.target.value,
                page: 1
            }
        }));

        this.debounceFetchPosts();
    }

    handleCategoryFilter(event) {
        this.setState(({
            query: {
                category_id: event.target.value,
                page: 1
            }
        }));

        this.debounceFetchPosts();
    }

    handleContentFilter(event) {
        this.setState(({
            query: {
                content: event.target.value,
                page: 1
            }
        }));

        this.debounceFetchPosts();
    }

    handleGlobalFilter(event) {
        this.setState(({
            query: {
                global: event.target.value,
                page: 1
            }
        }));

        this.debounceFetchPosts();
    }

    componentDidMount() {
        CategoriesService.getAll()
            .then(response => this.setState({categories: response.data.data}))
        this.fetchPosts()
    }

    deletePost(event) {
        Swal.fire({
            title: 'Delete this post?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            confirmButtonColor: '#EF4444',
            cancelButtonText: 'No',
            cancelButtonColor: '#A3A3A3',
            reverseButtons: true,
            focusCancel: true
        }).then(result => {
            if (result.isConfirmed) {
                axios.delete('/api/posts/' + event.target.value)
                    .then(response => this.fetchPosts())
                    .catch(error => Swal.fire({ icon: 'error', title: 'Something went wrong' }));
            }
        })

    }

    renderPosts() {
        return this.state.posts.data.map(post => <tr key={post.id}>
            <td>{post.id}</td>
            <td>{post.title}</td>
            <td>{post.category.name}</td>
            <td>{post.content}</td>
            <td>{post.created_at}</td>
            <td>
                <Link to={`posts/edit/${post.id}`}>Edit</Link>
                <Can do="post_delete">
                    <button value={post.id} onClick={this.deletePost} type="button" className="bg-red-500 rounded-full text-white px-3 py-1 font-bold">Delete</button>
                </Can>
            </td>
        </tr>);
    }

    renderPaginatorLinks() {
        return this.state.posts.meta.links.map((link, index) =>
            <button key={index} onClick={() => this.pageChanged(link.url)}
                    dangerouslySetInnerHTML={{__html: link.label}}
                    className="relative inline-flex items-center px-4 py-2 -ml-px text-sm font-medium text-gray-700 bg-white border border-gray-300 leading-5 hover:text-gray-500 focus:z-10 focus:outline-none focus:ring ring-gray-300 focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150 first:rounded-l-md last:rounded-r-md"/>
        );
    }

    renderPaginator() {
        return (
            <nav role="navigation" aria-label="Pagination Navigation" className="flex items-center justify-between">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700 leading-5">
                            Showing
                            <span>
                                <span className="font-medium"> {this.state.posts.meta.from} </span>
                                to
                                <span className="font-medium"> {this.state.posts.meta.to} </span>
                            </span>
                            of
                            <span className="font-medium"> {this.state.posts.meta.total} </span>
                            results
                        </p>
                    </div>

                    <div>
                        <span className="relative z-0 inline-flex shadow-sm rounded-md">
                            {this.renderPaginatorLinks()}
                        </span>
                    </div>
                </div>
            </nav>
        );
    }

    orderColumnIcon(column) {
        let icon = 'fa-sort';
        if (this.state.query.order_column === column) {
            if (this.state.query.order_direction === 'asc') {
                icon = 'fa-sort-up';
            } else {
                icon = 'fa-sort-down';
            }
        }

        return (
            <i className={`fa-solid ${icon}`}></i>
        )

    }

    orderChanged(column) {
        let direction = 'asc';
        if (column === this.state.query.order_column) {
            direction = this.state.query.order_direction === 'asc' ? 'desc' : 'asc'
        }

        this.setState(({
            query: {
                page: 1,
                order_column: column,
                order_direction: direction
            }
        }), () => this.fetchPosts())
    }

    renderTextFilter(column, callback) {
        return (
            <div className="m-2">
                <input type="text" placeholder="Search..." value={this.state.query[column]} onChange={callback} className="block w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
            </div>
        )
    }

    renderCategoryFilter() {
        const categories = this.state.categories.map(category =>
            <option key={category.id} value={category.id}>{category.name}</option>
        );

        return (
            <div className="m-2">
                <select onChange={this.handleCategoryFilter}
                        className="mt-1 block w-full sm:mt-0 rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                    <option>-- all categories --</option>
                    {categories}
                </select>
            </div>
        )
    }

    renderFiltersRow() {
        return (
            <tr className="bg-gray-50">
                <th>
                    { this.renderTextFilter('id', this.handleIdFilter) }
                </th>
                <th>
                    { this.renderTextFilter('title', this.handleTitleFilter) }
                </th>
                <th>
                    { this.renderCategoryFilter() }
                </th>
                <th>
                    { this.renderTextFilter('content', this.handleContentFilter) }
                </th>
                <th></th>
                <th></th>
            </tr>
        )
    }

    render() {
        if (!('data' in this.state.posts)) return;

        return (
            <div className="overflow-hidden overflow-x-auto p-6 bg-white border-gray-200">
                <div className="min-w-full align-middle">
                    <div className="mb-4">
                        { this.renderTextFilter('global', this.handleGlobalFilter) }
                    </div>
                    <table className="table">
                        <thead className="table-header">
                        <tr>
                            <th>
                                <div>
                                    <span>ID</span>
                                    <button onClick={() => this.orderChanged('id')} type="button" className="column-sort">
                                        { this.orderColumnIcon('id') }
                                    </button>
                                </div>
                            </th>
                            <th>
                                <div>
                                    <span>Title</span>
                                    <button onClick={() => this.orderChanged('title')} type="button" className="column-sort">
                                        { this.orderColumnIcon('title') }
                                    </button>
                                </div>
                            </th>
                            <th>
                                <div>
                                    <span>Category</span>
                                </div>
                            </th>
                            <th>
                                <div>
                                    <span>Content</span>
                                </div>
                            </th>
                            <th>
                                <div>
                                    <span>Created at</span>
                                </div>
                            </th>
                            <th>
                            </th>
                        </tr>
                        {this.renderFiltersRow()}
                        </thead>
                        <tbody className="table-body">
                        {this.renderPosts()}
                        </tbody>
                    </table>
                    <div className="mt-4">
                        {this.renderPaginator()}
                    </div>
                </div>
            </div>
        )
    }
}

export default PostsIndex

