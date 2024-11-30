const SCREENS=[
  {
    "id": "SC001",
    "name": "トップ",
    "url": "/",
    "depth": 0,
    "pos": 1,
    "descriptions": [
      "サイトのメインページ。新着商品、おすすめ商品、キャンペーン情報などを表示。\r\nヘッダー、左メニュー、フッターを含む基本レイアウトを提供。"
    ],
    "links": [
      {
        "sectionName": "ヘッダー",
        "text": "検索",
        "linkToId": "SC002"
      },
      {
        "sectionName": "ヘッダー",
        "text": "カート",
        "linkToId": "SC300"
      },
      {
        "sectionName": "ヘッダー",
        "text": "新規会員登録",
        "linkToId": "SC111"
      },
      {
        "sectionName": "ヘッダー",
        "text": "ログイン",
        "linkToId": "SC101"
      },
      {
        "sectionName": "ヘッダー",
        "text": "マイページ",
        "linkToId": "SC201"
      },
      {
        "sectionName": "左メニュー",
        "text": "カテゴリー一覧",
        "linkToId": "SC010",
        "children": [
          {
            "text": "カテゴリー1",
            "linkToId": "SC011"
          },
          {
            "text": "カテゴリー2",
            "linkToId": "SC011"
          },
          {
            "text": "カテゴリー3",
            "linkToId": "SC011"
          }
        ]
      },
      {
        "sectionName": "左メニュー",
        "text": "アカウント",
        "linkToId": "SC101"
      },
      {
        "sectionName": "フッター",
        "text": "企業情報",
        "children": [
          {
            "text": "会社概要",
            "linkToId": "SC401"
          },
          {
            "text": "ご利用ガイド",
            "linkToId": "SC402"
          },
          {
            "text": "利用規約",
            "linkToId": "SC403"
          },
          {
            "text": "プライバシーポリシー",
            "linkToId": "SC404"
          },
          {
            "text": "お問い合わせ",
            "linkToId": "SC405"
          }
        ]
      }
    ],
    "description": "サイトのメインページ。新着商品、おすすめ商品、キャンペーン情報などを表示。\r\nヘッダー、左メニュー、フッターを含む基本レイアウトを提供。"
  },
  {
    "id": "SC002",
    "name": "検索結果",
    "url": "/search",
    "depth": 1,
    "pos": 1,
    "descriptions": [
      "キーワードによる商品検索結果を表示。\r\nフィルタリング機能（価格帯、カテゴリー、商品状態等）を提供。"
    ],
    "links": [
      {
        "sectionName": "",
        "text": "商品詳細",
        "linkToId": "SC021"
      }
    ],
    "description": "キーワードによる商品検索結果を表示。\r\nフィルタリング機能（価格帯、カテゴリー、商品状態等）を提供。",
    "parentId": "SC001"
  },
  {
    "id": "SC010",
    "name": "カテゴリー一覧",
    "url": "/categories",
    "depth": 1,
    "pos": 2,
    "descriptions": [
      "全商品カテゴリーの一覧を表示。\r\nメインカテゴリーとサブカテゴリーの階層構造を表示。"
    ],
    "links": [
      {
        "sectionName": "",
        "text": "カテゴリー",
        "linkToId": "SC011"
      },
      {
        "sectionName": "",
        "text": "商品詳細",
        "linkToId": "SC021"
      }
    ],
    "description": "全商品カテゴリーの一覧を表示。\r\nメインカテゴリーとサブカテゴリーの階層構造を表示。",
    "parentId": "SC001"
  },
  {
    "id": "SC011",
    "name": "カテゴリー",
    "url": "/categories/{category_id}",
    "depth": 2,
    "pos": 2,
    "descriptions": [
      "選択されたカテゴリーに属する商品一覧を表示。\r\nソート機能とフィルタリング機能を提供。"
    ],
    "links": [
      {
        "sectionName": "",
        "text": "商品詳細",
        "linkToId": "SC021"
      }
    ],
    "description": "選択されたカテゴリーに属する商品一覧を表示。\r\nソート機能とフィルタリング機能を提供。",
    "parentId": "SC010"
  },
  {
    "id": "SC021",
    "name": "商品詳細",
    "url": "/products/{product_id}",
    "depth": 2,
    "pos": 3,
    "descriptions": [
      "商品の詳細情報（価格、説明、画像、在庫状況等）を表示。\r\nカートへの追加、お気に入り登録機能を提供。"
    ],
    "links": [
      {
        "sectionName": "",
        "text": "カートに追加",
        "linkToId": "SC300"
      },
      {
        "sectionName": "",
        "text": "お気に入りに追加",
        "linkToId": "SC201"
      }
    ],
    "description": "商品の詳細情報（価格、説明、画像、在庫状況等）を表示。\r\nカートへの追加、お気に入り登録機能を提供。",
    "parentId": "SC002"
  },
  {
    "id": "SC101",
    "name": "ログイン",
    "url": "/login",
    "depth": 1,
    "pos": 4,
    "descriptions": [
      "メールアドレスとパスワードによるログインフォームを提供。\r\nソーシャルログインオプションも表示。"
    ],
    "links": [
      {
        "sectionName": "",
        "text": "マイページ",
        "linkToId": "SC201"
      },
      {
        "sectionName": "",
        "text": "新規会員登録",
        "linkToId": "SC111"
      },
      {
        "sectionName": "",
        "text": "パスワード忘れ",
        "linkToId": "SC102"
      }
    ],
    "description": "メールアドレスとパスワードによるログインフォームを提供。\r\nソーシャルログインオプションも表示。"
  },
  {
    "id": "SC102",
    "name": "パスワード再設定",
    "url": "/password/reset",
    "depth": 2,
    "pos": 4,
    "descriptions": [
      "メールアドレスを入力し、パスワード再設定用リンクを送信。\r\nセキュリティ確認機能を含む。"
    ],
    "links": [],
    "description": "メールアドレスを入力し、パスワード再設定用リンクを送信。\r\nセキュリティ確認機能を含む。",
    "parentId": "SC101"
  },
  {
    "id": "SC111",
    "name": "新規会員登録",
    "url": "/register",
    "depth": 1,
    "pos": 5,
    "descriptions": [
      "新規ユーザー登録フォーム。必要な個人情報の入力と\r\n利用規約への同意プロセスを提供。"
    ],
    "links": [
      {
        "sectionName": "",
        "text": "登録完了",
        "linkToId": "SC112"
      }
    ],
    "description": "新規ユーザー登録フォーム。必要な個人情報の入力と\r\n利用規約への同意プロセスを提供。",
    "parentId": "SC001"
  },
  {
    "id": "SC112",
    "name": "会員登録完了",
    "url": "/register/complete",
    "depth": 2,
    "pos": 5,
    "descriptions": [
      "登録完了の確認画面。登録情報の確認メール送信通知を表示。"
    ],
    "links": [],
    "description": "登録完了の確認画面。登録情報の確認メール送信通知を表示。",
    "parentId": "SC111"
  },
  {
    "id": "SC201",
    "name": "マイページ",
    "url": "/mypage",
    "depth": 1,
    "pos": 6,
    "descriptions": [
      "ユーザーの個人ダッシュボード。注文履歴、お気に入り、\r\n個人情報管理へのリンクを提供。"
    ],
    "links": [
      {
        "sectionName": "",
        "text": "注文履歴",
        "linkToId": "SC211"
      },
      {
        "sectionName": "",
        "text": "お気に入り",
        "linkToId": "SC212"
      },
      {
        "sectionName": "",
        "text": "会員情報編集",
        "linkToId": "SC213"
      },
      {
        "sectionName": "",
        "text": "配送先管理",
        "linkToId": "SC214"
      }
    ],
    "description": "ユーザーの個人ダッシュボード。注文履歴、お気に入り、\r\n個人情報管理へのリンクを提供。",
    "parentId": "SC001"
  },
  {
    "id": "SC211",
    "name": "注文履歴",
    "url": "/mypage/orders",
    "depth": 2,
    "pos": 6,
    "descriptions": [
      "過去の注文一覧を表示。注文状況の確認と\r\n詳細情報へのアクセスを提供。"
    ],
    "links": [
      {
        "sectionName": "",
        "text": "注文詳細",
        "linkToId": "SC215"
      }
    ],
    "description": "過去の注文一覧を表示。注文状況の確認と\r\n詳細情報へのアクセスを提供。",
    "parentId": "SC201"
  },
  {
    "id": "SC212",
    "name": "お気に入り",
    "url": "/mypage/favorites",
    "depth": 2,
    "pos": 7,
    "descriptions": [
      "お気に入りに登録した商品の一覧を表示。\r\n簡易的な商品情報と在庫状況を確認可能。"
    ],
    "links": [
      {
        "sectionName": "",
        "text": "商品詳細",
        "linkToId": "SC021"
      }
    ],
    "description": "お気に入りに登録した商品の一覧を表示。\r\n簡易的な商品情報と在庫状況を確認可能。",
    "parentId": "SC201"
  },
  {
    "id": "SC213",
    "name": "会員情報編集",
    "url": "/mypage/profile",
    "depth": 2,
    "pos": 8,
    "descriptions": [
      "会員情報（個人情報、パスワード等）の確認・編集機能を提供。"
    ],
    "links": [],
    "description": "会員情報（個人情報、パスワード等）の確認・編集機能を提供。",
    "parentId": "SC201"
  },
  {
    "id": "SC214",
    "name": "配送先管理",
    "url": "/mypage/addresses",
    "depth": 2,
    "pos": 9,
    "descriptions": [
      "配送先住所の追加、編集、削除機能を提供。\r\n複数配送先の管理が可能。"
    ],
    "links": [],
    "description": "配送先住所の追加、編集、削除機能を提供。\r\n複数配送先の管理が可能。",
    "parentId": "SC201"
  },
  {
    "id": "SC215",
    "name": "注文詳細",
    "url": "/mypage/orders/{order_id}",
    "depth": 3,
    "pos": 6,
    "descriptions": [
      "個別の注文詳細情報を表示。配送状況、\r\n注文商品、支払い情報等を確認可能。"
    ],
    "links": [],
    "description": "個別の注文詳細情報を表示。配送状況、\r\n注文商品、支払い情報等を確認可能。",
    "parentId": "SC211"
  },
  {
    "id": "SC300",
    "name": "カート",
    "url": "/cart",
    "depth": 1,
    "pos": 7,
    "descriptions": [
      "カートに追加した商品の一覧、数量変更、\r\n削除機能を提供。合計金額の表示。"
    ],
    "links": [
      {
        "sectionName": "",
        "text": "レジへ進む",
        "linkToId": "SC301"
      },
      {
        "sectionName": "",
        "text": "買い物を続ける",
        "linkToId": "SC001"
      }
    ],
    "description": "カートに追加した商品の一覧、数量変更、\r\n削除機能を提供。合計金額の表示。",
    "parentId": "SC001"
  },
  {
    "id": "SC301",
    "name": "レジ",
    "url": "/checkout",
    "depth": 2,
    "pos": 10,
    "descriptions": [
      "配送先情報、支払い方法の選択、\r\n注文内容の最終確認画面を提供。"
    ],
    "links": [
      {
        "sectionName": "",
        "text": "注文確認",
        "linkToId": "SC302"
      }
    ],
    "description": "配送先情報、支払い方法の選択、\r\n注文内容の最終確認画面を提供。",
    "parentId": "SC300"
  },
  {
    "id": "SC302",
    "name": "注文確認",
    "url": "/checkout/confirm",
    "depth": 3,
    "pos": 10,
    "descriptions": [
      "注文内容、配送先、支払い方法の\r\n最終確認画面。注文の確定機能を提供。"
    ],
    "links": [
      {
        "sectionName": "",
        "text": "注文完了",
        "linkToId": "SC303"
      }
    ],
    "description": "注文内容、配送先、支払い方法の\r\n最終確認画面。注文の確定機能を提供。",
    "parentId": "SC301"
  },
  {
    "id": "SC303",
    "name": "注文完了",
    "url": "/checkout/complete",
    "depth": 4,
    "pos": 10,
    "descriptions": [
      "注文完了の確認画面。注文番号、\r\nお届け予定日等の情報を表示。"
    ],
    "links": [
      {
        "sectionName": "",
        "text": "トップページへ",
        "linkToId": "SC001"
      },
      {
        "sectionName": "",
        "text": "マイページへ",
        "linkToId": "SC201"
      }
    ],
    "description": "注文完了の確認画面。注文番号、\r\nお届け予定日等の情報を表示。",
    "parentId": "SC302"
  },
  {
    "id": "SC401",
    "name": "会社概要",
    "url": "/company",
    "depth": 1,
    "pos": 12,
    "descriptions": [
      "会社の基本情報、ビジョン、\r\nミッション等を掲載。"
    ],
    "links": [],
    "description": "会社の基本情報、ビジョン、\r\nミッション等を掲載。"
  },
  {
    "id": "SC402",
    "name": "ご利用ガイド",
    "url": "/guide",
    "depth": 1,
    "pos": 13,
    "descriptions": [
      "サイトの使い方、会員登録方法、\r\n注文方法等の説明を提供。"
    ],
    "links": [],
    "description": "サイトの使い方、会員登録方法、\r\n注文方法等の説明を提供。"
  },
  {
    "id": "SC403",
    "name": "利用規約",
    "url": "/terms",
    "depth": 1,
    "pos": 14,
    "descriptions": [
      "サービス利用に関する規約を掲載。\r\n最終更新日を明記。"
    ],
    "links": [],
    "description": "サービス利用に関する規約を掲載。\r\n最終更新日を明記。"
  },
  {
    "id": "SC404",
    "name": "プライバシーポリシー",
    "url": "/privacy",
    "depth": 1,
    "pos": 15,
    "descriptions": [
      "個人情報の取り扱いに関する\r\n方針を掲載。"
    ],
    "links": [],
    "description": "個人情報の取り扱いに関する\r\n方針を掲載。"
  },
  {
    "id": "SC405",
    "name": "お問い合わせ",
    "url": "/contact",
    "depth": 1,
    "pos": 16,
    "descriptions": [
      "問い合わせフォームを提供。\r\nカテゴリー選択と内容入力機能。"
    ],
    "links": [
      {
        "sectionName": "",
        "text": "お問い合わせ完了",
        "linkToId": "SC406"
      }
    ],
    "description": "問い合わせフォームを提供。\r\nカテゴリー選択と内容入力機能。"
  },
  {
    "id": "SC406",
    "name": "お問い合わせ完了",
    "url": "/contact/complete",
    "depth": 2,
    "pos": 16,
    "descriptions": [
      "お問い合わせ送信完了の確認画面。",
      "受付番号と回答予定時期を表示。",
      "a\r\nb\r\nc\r\nd"
    ],
    "links": [],
    "description": "お問い合わせ送信完了の確認画面。\r\n受付番号と回答予定時期を表示。\r\na\r\nb\r\nc\r\nd",
    "parentId": "SC405"
  }
];