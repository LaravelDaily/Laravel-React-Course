<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePostRequest;
use App\Http\Resources\PostResource;
use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $this->authorize('post_view');

        $orderColumn = $request->input('order_column', 'id');
        $orderDirection = $request->input('order_direction', 'desc');
        if (!in_array($orderColumn, ['id', 'title'])) {
            $orderColumn = 'id';
        }
        if (!in_array($orderDirection, ['asc', 'desc'])) {
            $orderDirection = 'desc';
        }

        $filterable = ['id', 'title', 'content'];
        $filterableValues = array_filter($request->only($filterable));

        $posts = Post::with('category')
            ->when(count($filterableValues), function($query) use ($filterableValues) {
                foreach ($filterableValues as $column => $value) {
                    $query->where($column, 'like', '%' . $value . '%');
                }
            })
            ->when($request->filled('global'), function($query) use ($filterable, $request) {
                foreach ($filterable as $column) {
                    if ($column == $filterable[0]) {
                        $query->where($column, 'like', '%' . $request->global . '%');
                    } else {
                        $query->orWhere($column, 'like', '%' . $request->global . '%');
                    }
                }
            })
            ->when($request->filled('category_id'), function($query) use ($request) {
                $query->where('category_id', $request->category_id);
            })
            ->orderBy($orderColumn, $orderDirection)
            ->paginate(10);

        return PostResource::collection($posts);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StorePostRequest $request)
    {
        $this->authorize('post_create');

        $post = Post::create($request->validated());

        if ($request->hasFile('thumbnail')) {
            $filename = $request->file('thumbnail')->getClientOriginalName();
            info($filename);
        }

        return new PostResource($post);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Post $post)
    {
        $this->authorize('post_view');

        return new PostResource($post);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(StorePostRequest $request, Post $post)
    {
        $this->authorize('post_update');

        $post->update($request->validated());

        return new PostResource($post);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Post $post)
    {
        $this->authorize('post_delete');

        $post->delete();

        return response()->noContent();
    }
}
