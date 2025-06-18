<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Services\FirebaseService;
use App\Models\Category;
use App\Models\ListItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Exception;

class CategoryController extends Controller
{
    public function index()
    {
        try {
            $user = auth()->user();
            if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
            }

            $categories = Category::all();
            return response()->json([
                'user' => $user,
                'categories' => $categories,
            ], 200);
        } catch (Exception $e) {
            Log::error('Failed to fetch category: ' . $e->getMessage());

            return response()->json([
                'error' => '問題が発生しました。時間を置いて再度お試しください。'
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $user = auth()->user();
            if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
            }

            $validated = $request->validate([
                'date' => ['required', 'date'],
                'amount' => ['required', 'numeric'],
                'user_id' => ['required', 'exists:users,id'],
                'category_id' => ['required', 'exists:categories,id'],
                'memo' => ['nullable', 'string'],
            ]);

            $listItem = ListItem::create($validated);

            return response()->json([
                'message' => 'データを保存しました',
                'data' => $listItem
            ], 201);
        } catch (Exception $e) {
            Log::error('ListItem Store Error: ' . $e->getMessage());

            return response()->json([
                'error' => '問題が発生しました。時間を置いて再度お試しください。'
            ], 500);
        }
    }
}
