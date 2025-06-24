<?php

namespace App\Services;

use Kreait\Firebase\Factory;
use Kreait\Firebase\Auth;
use Illuminate\Support\Facades\Log;
use Kreait\Firebase\Exception\Auth\UserNotFound;

class FirebaseService
{
    protected Auth $auth;

    public function __construct(string $credentialsPath, string $projectId)
    {
        $this->auth = (new Factory)
            ->withServiceAccount($credentialsPath)
            ->withProjectId($projectId)
            ->createAuth();
        // サービス初期化時に Firebase の認証情報（サービスアカウント）を指定し、Auth インスタンスを生成。
    }

    public function verifyToken(string $idToken)
    {
        return $this->auth->verifyIdToken($idToken);
        // クライアント（Nuxt など）から送られてきた **IDトークン（JWT）を検証**するメソッド
    }

    public function getUserByUid(string $uid)
    {
        // Firebase の UID を使って、ユーザー情報を取得する
        try {
            $user = $this->auth->getUser($uid);
            return [
                'firebase_uid' => $user->uid,
                'name' => $user->displayName ?? '匿名',
            ];
            // 成功時：Firebase のユーザー情報から uid と displayName を返す（displayName がない場合は「匿名」）。
        } catch (UserNotFound $e) {
            return null;
        } catch (\Exception $e) {
            return null;
        }
    }

    public function getAuth(): Auth
    {
        return $this->auth;
    }
}