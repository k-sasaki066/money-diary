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
                'icon' => '/icons/食費.png',
                'type' => 'expense'
            ],
            [
                'name' => '外食',
                'icon' => '/icons/外食.png',
                'type' => 'expense'
            ],
            [
                'name' => '日用品',
                'icon' => '/icons/日用品.png',
                'type' => 'expense'
            ],
            [
                'name' => '交際',
                'icon' => '/icons/交際.png',
                'type' => 'expense'
            ],
            [
                'name' => '服・美容',
                'icon' => '/icons/服.png',
                'type' => 'expense'
            ],
            [
                'name' => '交通',
                'icon' => '/icons/交通.png',
                'type' => 'expense'
            ],
            [
                'name' => '医療',
                'icon' => '/icons/医療.png',
                'type' => 'expense'
            ],
            [
                'name' => '家賃',
                'icon' => '/icons/家賃.png',
                'type' => 'expense'
            ],
            [
                'name' => '公共料金',
                'icon' => '/icons/公共.png',
                'type' => 'expense'
            ],
            [
                'name' => '通信',
                'icon' => '/icons/通信.png',
                'type' => 'expense'
            ],
            [
                'name' => '税金',
                'icon' => '/icons/税金.png',
                'type' => 'expense'
            ],
            [
                'name' => '保険',
                'icon' => '/icons/保険.png',
                'type' => 'expense'
            ],
            [
                'name' => 'その他',
                'icon' => '/icons/その他.png',
                'type' => 'expense'
            ],
            [
                'name' => '給料',
                'icon' => '/icons/給料.png',
                'type' => 'income'
            ],
            [
                'name' => 'ボーナス',
                'icon' => '/icons/ボーナス.png',
                'type' => 'income'
            ],
            [
                'name' => '副業',
                'icon' => '/icons/副業.png',
                'type' => 'income'
            ],
        ];

        foreach ($categories as $category) {
            DB::table('categories')->insert($category);
        }
    }
}
