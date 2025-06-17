import { ref } from 'vue';
// Vue のリアクティブな状態を管理する ref をインポート

export const useSingleClick = () => {
    // useSingleClick は Vue/Nuxt で使うためのカスタム Composable 関数
    const isRunning = ref(false);
    // 実行中かどうかを表すフラグ

    const run = async (callback: () => Promise<void>) => {
        if (isRunning.value) return
        isRunning.value = true;
        // run() は任意の非同期関数を1度だけ実行するための関数
        // すでに isRunning が true の場合は何もしない
        // 初回クリック時に isRunning を true にセット

        try {
            await callback();
        } finally {
            isRunning.value = false;
        };
        // 非同期関数 callback を実行
        // 成功しても失敗しても最後に isRunning を false に戻す（finally 句）
    }

    return {
        isRunning,
        run,
    };
    // 外部から isRunning と run を使えるように返す
};