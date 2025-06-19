<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\User;
use App\Models\Category;

class ListItemsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $users = User::all(); // 全ユーザー取得
        $categories = Category::all(); // すでにcategoriesテーブルにデータがあると仮定

        $incomeCategory = Category::find(14);

        foreach ($users as $user) {
            DB::table('list_items')->insert([
                'user_id' => $user->id,
                'date' => Carbon::now()->subDays(rand(0, 30))->format('Y-m-d'),
                'category_id' => $incomeCategory->id,
                'amount' => 200000,
                'memo' => '固定収入200000円',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        foreach ($users as $user) {
            foreach (range(1, 10) as $i) {
                DB::table('list_items')->insert([
                    'user_id' => $user->id,
                    'date' => Carbon::now()->subDays(rand(0, 30))->format('Y-m-d'),
                    'category_id' => $categories->random()->id,
                    'amount' => rand(500, 50000),
                    'memo' => rand(0, 1) ? 'ダミーメモ ' . $i : null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
