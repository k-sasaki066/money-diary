<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Models\ListItem;
use App\Models\Category;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use App\Services\FirebaseService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Exception;

class ListController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        try {
            $user = auth()->user();
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $month = $request->query('month', Carbon::now()->format('Y-m'));

            try {
                $startOfMonth = Carbon::createFromFormat('Y-m', $month)->startOfMonth();
                $endOfMonth = Carbon::createFromFormat('Y-m', $month)->endOfMonth();
            } catch (\Exception $e) {
                return response()->json(['error' => 'Invalid month format'], 400);
            }

            $listItems = ListItem::with('category')
            ->where('user_id', $user->id)
            ->whereBetween('date', [$startOfMonth, $endOfMonth])
            ->orderBy('date', 'asc')
            ->get();

            $incomeTotal = $listItems->where('category.type', 'income')->sum('amount');
            $expenseTotal = $listItems->where('category.type', 'expense')->sum('amount');

            $categories = Category::select('name', 'icon', 'type')->get();

            return response()->json([
                'user' => $user,
                'listItems' => $listItems,
                'incomeTotal' => $incomeTotal,
                'expenseTotal' => $expenseTotal,
                'categories' => $categories,
            ], 200);
        } catch (Exception $e) {
            Log::error('Failed to fetch messages: ' . $e->getMessage());

            return response()->json([
                'error' => '問題が発生しました。時間を置いて再度お試しください。'
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
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

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $user = auth()->user();
            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $item = ListItem::where('id', $id)
                ->where('user_id', $user->id)
                ->firstOrFail();
            if ($item->user_id !== $user->id) {
                return response()->json(['error' => 'Forbidden'], 403); // 自分以外のメッセージは削除できない
            }

            $item->delete();

            return response()->json(['message' => 'deleted'], 200);
        } catch (Exception $e) {
            Log::error('Message delete error: ' . $e->getMessage());

            return response()->json(['error' => '問題が発生しました。時間を置いて再度お試しください。'], 500);
        }
    }
}
