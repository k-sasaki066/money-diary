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
    public function register()
    {
        $this->app->singleton(FirebaseService::class, function () {
            $credentialsPath = config('services.firebase.credentials');
            $projectId       = config('services.firebase.project_id');

            if (! $credentialsPath || ! file_exists($credentialsPath)) {
                throw new RuntimeException('Firebase credentials file not found at: ' . $credentialsPath);
            }

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
        //
    }
}
