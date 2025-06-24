<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Kreait\Firebase\Factory;
use Kreait\Firebase\Auth;
use App\Services\FirebaseService;
use RuntimeException;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    // サービスをバインド（登録）
    public function register()
    {
        // LaravelのDIコンテナ（サービスコンテナ）に対してFirebaseService を一度だけ（singleton）インスタンス化して、他のクラスから自動的に注入できるように登録する
        $this->app->singleton(FirebaseService::class, function () {
            $credentialsPath = config('services.firebase.credentials');
            $projectId       = config('services.firebase.project_id');

            // 認証ファイルが存在するかをチェック、存在しない場合は例外を投げて処理を中断
            if (! $credentialsPath || ! file_exists($credentialsPath)) {
                throw new RuntimeException('Firebase credentials file not found at: ' . $credentialsPath);
            }

            // FirebaseService を生成し、そのインスタンスをサービスコンテナに登録。このインスタンスは他のクラスで自動的に注入されて使えるようになる
            return new FirebaseService($credentialsPath, $projectId);
        });
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //アプリケーション起動時に実行される初期化処理を定義
    }
}
