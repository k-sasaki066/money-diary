//indexedDBの名前などの設定
const dbName = "kakeiboDB";
const storeName = "kakeiboStore";
const dbVersion = 1;

//データベース接続する。データベースが未作成なら新規作成する。
let database = indexedDB.open(dbName, dbVersion);

//データベースとオブジェクトストアの作成
database.onupgradeneeded = function (event) {
    let db = event.target.result;
    db.createObjectStore(storeName, { keyPath: "id" });
    console.log("データベースを新規作成しました");
}

//データベースに接続に成功した時に発生するイベント
database.onsuccess = function (event) {
    let db = event.target.result;
    // 接続を解除する
    db.close();
    console.log("データベースに接続できました");
}
database.onerror = function (event) {
    console.log("データベースに接続できませんでした");
}

// 共通化
function openDB(callback) {
    const request = indexedDB.open(dbName, dbVersion);

    request.onerror = () => {
        console.error("データベースに接続できませんでした");
    };

    request.onsuccess = (event) => {
        const db = event.target.result;
        callback(db);
    };
}

//フォームの内容をDBに登録する
function regist() {
    //フォームの入力チェック。falseが返却されたら登録処理を中断
    if (inputCheck() == false) {
        return;
    }

    //ラジオボタンの取得
    let radio = document.getElementsByName("balance");
    let balance;
    for (let i = 0; i < radio.length; i++) {
        if (radio[i].checked == true) {
            balance = radio[i].value;
            break;
        }
    }

    //フォームに入力された値を取得
    let date = document.getElementById("date").value;
    let amount = document.getElementById("amount").value;
    let memo = document.getElementById("memo").value;
    let category = document.getElementById("category").value;
    //ラジオボタンが収入を選択時はカテゴリを「収入」とする
    if (balance == "収入") {
        category = "収入";
    }
 
    //データベースにデータを登録する
    insertData(balance, date, category, amount, memo);

    //入手金一覧を作成
    createList();
}

function insertData(balance, date, category, amount, memo) {
    //一意のIDを現在の日時から作成
    let uniqueID = new Date().getTime().toString();
    console.log(uniqueID);
    //DBに登録するための連想配列のデータを作成
    let data = {
        id: uniqueID,
        balance: balance,
        date: String(date),
        category: category,
        amount: amount,
        memo: memo,
    }

    //データベースを開く
    let database = indexedDB.open(dbName, dbVersion);
 
    //データベースの開けなかった時の処理
    database.onerror = function (event) {
        console.log("データベースに接続できませんでした");
    }

    openDB((db) => {
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);

        const addRequest = store.add(data);

        addRequest.onsuccess = () => {
            console.log("データが登録できました");
            alert("登録しました");
        };

        addRequest.onerror = () => {
            console.error("データが登録できませんでした");
        };

        transaction.oncomplete = () => {
            console.log("トランザクション完了");
            db.close();
        };

        transaction.onerror = () => {
            console.error("トランザクションエラー");
            db.close();
        };
    });
}

function createList() {
    //データベースからデータを全件取得
    openDB((db) => {
    // 読み取り専用トランザクション開始
    const transaction = db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);
    const getAllReq = store.getAll();
    getAllReq.onsuccess = function (event) {
        let rows = event.target.result;

        // data は配列なので、日付でソートする
        rows.sort((a, b) => {
            // 日付が文字列の場合、Dateオブジェクトに変換して比較
            return new Date(a.date) - new Date(b.date);
        });

        console.log(rows);
        const section = document.getElementById("list");

        // テーブルヘッダ
        let html = `
            <table>
            <tr>
                <th>日付</th>
                <th>収支</th>
                <th>カテゴリ</th>
                <th>金額</th>
                <th>メモ</th>
                <th>削除</th>
            </tr>
        `;

        // レコードを行として追加
        rows.forEach((r) => {
            html += `
            <tr>
                <td>${r.date}</td>
                <td>${r.balance}</td>
                <td>${r.category}</td>
                <td>${r.amount}</td>
                <td>${r.memo}</td>
                <td><button onclick="deleteData('${r.id}')">×</button></td>
            </tr>
            `;
        });

        html += `</table>`;
        section.innerHTML = html;// 一覧を描画
        //円グラフの作成
        createPieChart(rows);
    };

    // 終了時に DB をクローズ
    transaction.oncomplete = () => {
        console.log("トランザクション完了");
        db.close();
    };
    transaction.onerror = () => {
        console.error("トランザクションエラー");
        db.close();
    };
    });
}

function deleteData(id) {
    const isConfirmed = confirm("本当に削除しますか？");
    if (!isConfirmed) return; // キャンセルされたら中断
    //データベースを開く
    openDB((db) => {
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);

        // レコード削除
        const req = store.delete(id);

        req.onsuccess = () => {
        console.log("削除成功");
        createList();          // 一覧を再描画
        };

        req.onerror = () => {
        console.error("削除失敗");
        };

        // トランザクション完了後に DB を閉じる
        transaction.oncomplete = () => {
            console.log("トランザクション完了");
            db.close();
        };
        transaction.onerror    = () => {
            console.error("トランザクションエラー");
            db.close();
        };
    });
}