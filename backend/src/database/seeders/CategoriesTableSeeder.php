<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoriesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $categories = [
            [
                'name' => '食費',
                'type' => 'expense'
            ],
            [
                'name' => '食費',
                'type' => 'expense'
            ],
            [
                'name' => '外食',
                'type' => 'expense'
            ],
            [
                'name' => '日用品',
                'type' => 'expense'
            ],
            [
                'name' => '交際',
                'type' => 'expense'
            ],
            [
                'name' => '服・美容',
                'type' => 'expense'
            ],
            [
                'name' => '交通',
                'type' => 'expense'
            ],
            [
                'name' => '医療',
                'type' => 'expense'
            ],
            [
                'name' => '家賃',
                'type' => 'expense'
            ],
            [
                'name' => '公共料金',
                'type' => 'expense'
            ],
            [
                'name' => '通信',
                'type' => 'expense'
            ],
            [
                'name' => '税金',
                'type' => 'expense'
            ],
            [
                'name' => '保険',
                'type' => 'expense'
            ],
            [
                'name' => 'その他',
                'type' => 'expense'
            ],
            [
                'name' => '給料',
                'type' => 'income'
            ],
            [
                'name' => 'ボーナス',
                'type' => 'income'
            ],
            [
                'name' => '副業',
                'type' => 'income'
            ],
        ];

        foreach ($categories as $category) {
            DB::table('categories')->insert($category);
        }
    }
}
