const SCREENS=[
  {
    "id": "SC001",
    "title": "トップページ",
    "path": "/",
    "description": [
      "サイトのメインページ。新着商品、おすすめ商品、キャンペーン情報などを表示。\r\nヘッダー、左メニュー、フッターを含む基本レイアウトを提供。"
    ],
    "links": [
      {
        "ヘッダー": [
          {
            "text": "検索",
            "screenId": "SC002"
          },
          {
            "text": "カート",
            "screenId": "SC300"
          },
          {
            "text": "新規会員登録",
            "screenId": "SC111"
          },
          {
            "text": "ログイン",
            "screenId": "SC101"
          },
          {
            "text": "マイページ",
            "screenId": "SC201"
          }
        ]
      },
      {
        "左メニュー": [
          {
            "text": "カテゴリー一覧",
            "screenId": "SC010",
            "children": [
              {
                "text": "カテゴリー1",
                "screenId": "SC011"
              },
              {
                "text": "カテゴリー2",
                "screenId": "SC011"
              },
              {
                "text": "カテゴリー3",
                "screenId": "SC011"
              }
            ]
          },
          {
            "text": "アカウント",
            "screenId": "SC101"
          }
        ]
      },
      {
        "フッター": [
          {
            "text": "企業情報",
            "children": [
              {
                "text": "会社概要",
                "screenId": "SC401"
              },
              {
                "text": "ご利用ガイド",
                "screenId": "SC402"
              },
              {
                "text": "利用規約",
                "screenId": "SC403"
              },
              {
                "text": "プライバシーポリシー",
                "screenId": "SC404"
              },
              {
                "text": "お問い合わせ",
                "screenId": "SC405"
              }
            ]
          }
        ]
      }
    ],
    "parentScreenId": "SC303",
    "depth": 1,
    "pos": 28
  },
  {
    "id": "SC002",
    "title": "検索結果",
    "path": "/search",
    "description": [
      "キーワードによる商品検索結果を表示。\r\nフィルタリング機能（価格帯、カテゴリー、商品状態等）を提供。"
    ],
    "links": [
      {
        "default": [
          {
            "text": "商品詳細",
            "screenId": "SC021"
          }
        ]
      }
    ],
    "parentScreenId": "SC001",
    "depth": 1,
    "pos": 1
  },
  {
    "id": "SC010",
    "title": "カテゴリー一覧",
    "path": "/categories",
    "description": [
      "全商品カテゴリーの一覧を表示。\r\nメインカテゴリーとサブカテゴリーの階層構造を表示。"
    ],
    "links": [
      {
        "default": [
          {
            "text": "カテゴリー",
            "screenId": "SC011"
          },
          {
            "text": "商品詳細",
            "screenId": "SC021"
          }
        ]
      }
    ],
    "parentScreenId": "SC001",
    "depth": 1,
    "pos": 6
  },
  {
    "id": "SC011",
    "title": "カテゴリー",
    "path": "/categories/{category_id}",
    "description": [
      "選択されたカテゴリーに属する商品一覧を表示。\r\nソート機能とフィルタリング機能を提供。"
    ],
    "links": [
      {
        "default": [
          {
            "text": "商品詳細",
            "screenId": "SC021"
          }
        ]
      }
    ],
    "parentScreenId": "SC010",
    "depth": 1,
    "pos": 9
  },
  {
    "id": "SC021",
    "title": "商品詳細",
    "path": "/products/{product_id}",
    "description": [
      "商品の詳細情報（価格、説明、画像、在庫状況等）を表示。\r\nカートへの追加、お気に入り登録機能を提供。"
    ],
    "links": [
      {
        "default": [
          {
            "text": "カートに追加",
            "screenId": "SC300"
          },
          {
            "text": "お気に入りに追加",
            "screenId": "SC201"
          }
        ]
      }
    ],
    "parentScreenId": "SC212",
    "depth": 1,
    "pos": 23
  },
  {
    "id": "SC101",
    "title": "ログイン",
    "path": "/login",
    "description": [
      "メールアドレスとパスワードによるログインフォームを提供。\r\nソーシャルログインオプションも表示。"
    ],
    "links": [
      {
        "default": [
          {
            "text": "マイページ",
            "screenId": "SC201"
          },
          {
            "text": "新規会員登録",
            "screenId": "SC111"
          },
          {
            "text": "パスワード忘れ",
            "screenId": "SC102"
          }
        ]
      }
    ],
    "parentScreenId": "SC001",
    "depth": 1,
    "pos": 7
  },
  {
    "id": "SC102",
    "title": "パスワード再設定",
    "path": "/password/reset",
    "description": [
      "メールアドレスを入力し、パスワード再設定用リンクを送信。\r\nセキュリティ確認機能を含む。"
    ],
    "links": [],
    "parentScreenId": "SC101",
    "depth": 1,
    "pos": 16
  },
  {
    "id": "SC111",
    "title": "新規会員登録",
    "path": "/register",
    "description": [
      "新規ユーザー登録フォーム。必要な個人情報の入力と\r\n利用規約への同意プロセスを提供。"
    ],
    "links": [
      {
        "default": [
          {
            "text": "登録完了",
            "screenId": "SC112"
          }
        ]
      }
    ],
    "parentScreenId": "SC101",
    "depth": 1,
    "pos": 15
  },
  {
    "id": "SC112",
    "title": "会員登録完了",
    "path": "/register/complete",
    "description": [
      "登録完了の確認画面。登録情報の確認メール送信通知を表示。"
    ],
    "links": [],
    "parentScreenId": "SC111",
    "depth": 1,
    "pos": 17
  },
  {
    "id": "SC201",
    "title": "マイページ",
    "path": "/mypage",
    "description": [
      "ユーザーの個人ダッシュボード。注文履歴、お気に入り、\r\n個人情報管理へのリンクを提供。"
    ],
    "links": [
      {
        "default": [
          {
            "text": "注文履歴",
            "screenId": "SC211"
          },
          {
            "text": "お気に入り",
            "screenId": "SC212"
          },
          {
            "text": "会員情報編集",
            "screenId": "SC213"
          },
          {
            "text": "配送先管理",
            "screenId": "SC214"
          }
        ]
      }
    ],
    "parentScreenId": "SC303",
    "depth": 1,
    "pos": 29
  },
  {
    "id": "SC211",
    "title": "注文履歴",
    "path": "/mypage/orders",
    "description": [
      "過去の注文一覧を表示。注文状況の確認と\r\n詳細情報へのアクセスを提供。"
    ],
    "links": [
      {
        "default": [
          {
            "text": "注文詳細",
            "screenId": "SC215"
          }
        ]
      }
    ],
    "parentScreenId": "SC201",
    "depth": 1,
    "pos": 18
  },
  {
    "id": "SC212",
    "title": "お気に入り",
    "path": "/mypage/favorites",
    "description": [
      "お気に入りに登録した商品の一覧を表示。\r\n簡易的な商品情報と在庫状況を確認可能。"
    ],
    "links": [
      {
        "default": [
          {
            "text": "商品詳細",
            "screenId": "SC021"
          }
        ]
      }
    ],
    "parentScreenId": "SC201",
    "depth": 1,
    "pos": 19
  },
  {
    "id": "SC213",
    "title": "会員情報編集",
    "path": "/mypage/profile",
    "description": [
      "会員情報（個人情報、パスワード等）の確認・編集機能を提供。"
    ],
    "links": [],
    "parentScreenId": "SC201",
    "depth": 1,
    "pos": 20
  },
  {
    "id": "SC214",
    "title": "配送先管理",
    "path": "/mypage/addresses",
    "description": [
      "配送先住所の追加、編集、削除機能を提供。\r\n複数配送先の管理が可能。"
    ],
    "links": [],
    "parentScreenId": "SC201",
    "depth": 1,
    "pos": 21
  },
  {
    "id": "SC215",
    "title": "注文詳細",
    "path": "/mypage/orders/{order_id}",
    "description": [
      "個別の注文詳細情報を表示。配送状況、\r\n注文商品、支払い情報等を確認可能。"
    ],
    "links": [],
    "parentScreenId": "SC211",
    "depth": 1,
    "pos": 22
  },
  {
    "id": "SC300",
    "title": "カート",
    "path": "/cart",
    "description": [
      "カートに追加した商品の一覧、数量変更、\r\n削除機能を提供。合計金額の表示。"
    ],
    "links": [
      {
        "default": [
          {
            "text": "レジへ進む",
            "screenId": "SC301"
          },
          {
            "text": "買い物を続ける",
            "screenId": "SC001"
          }
        ]
      }
    ],
    "parentScreenId": "SC021",
    "depth": 1,
    "pos": 12
  },
  {
    "id": "SC301",
    "title": "レジ",
    "path": "/checkout",
    "description": [
      "配送先情報、支払い方法の選択、\r\n注文内容の最終確認画面を提供。"
    ],
    "links": [
      {
        "default": [
          {
            "text": "注文確認",
            "screenId": "SC302"
          }
        ]
      }
    ],
    "parentScreenId": "SC300",
    "depth": 1,
    "pos": 24
  },
  {
    "id": "SC302",
    "title": "注文確認",
    "path": "/checkout/confirm",
    "description": [
      "注文内容、配送先、支払い方法の\r\n最終確認画面。注文の確定機能を提供。"
    ],
    "links": [
      {
        "default": [
          {
            "text": "注文完了",
            "screenId": "SC303"
          }
        ]
      }
    ],
    "parentScreenId": "SC301",
    "depth": 1,
    "pos": 26
  },
  {
    "id": "SC303",
    "title": "注文完了",
    "path": "/checkout/complete",
    "description": [
      "注文完了の確認画面。注文番号、\r\nお届け予定日等の情報を表示。"
    ],
    "links": [
      {
        "default": [
          {
            "text": "トップページへ",
            "screenId": "SC001"
          },
          {
            "text": "マイページへ",
            "screenId": "SC201"
          }
        ]
      }
    ],
    "parentScreenId": "SC302",
    "depth": 1,
    "pos": 27
  },
  {
    "id": "SC401",
    "title": "会社概要",
    "path": "/company",
    "description": [
      "会社の基本情報、ビジョン、\r\nミッション等を掲載。"
    ],
    "links": [],
    "parentScreenId": null,
    "depth": 2,
    "pos": 4
  },
  {
    "id": "SC402",
    "title": "ご利用ガイド",
    "path": "/guide",
    "description": [
      "サイトの使い方、会員登録方法、\r\n注文方法等の説明を提供。"
    ],
    "links": [],
    "parentScreenId": null,
    "depth": 2,
    "pos": 5
  },
  {
    "id": "SC403",
    "title": "利用規約",
    "path": "/terms",
    "description": [
      "サービス利用に関する規約を掲載。\r\n最終更新日を明記。"
    ],
    "links": [],
    "parentScreenId": null,
    "depth": 2,
    "pos": 6
  },
  {
    "id": "SC404",
    "title": "プライバシーポリシー",
    "path": "/privacy",
    "description": [
      "個人情報の取り扱いに関する\r\n方針を掲載。"
    ],
    "links": [],
    "parentScreenId": null,
    "depth": 2,
    "pos": 7
  },
  {
    "id": "SC405",
    "title": "お問い合わせ",
    "path": "/contact",
    "description": [
      "問い合わせフォームを提供。\r\nカテゴリー選択と内容入力機能。"
    ],
    "links": [
      {
        "default": [
          {
            "text": "お問い合わせ完了",
            "screenId": "SC406"
          }
        ]
      }
    ],
    "parentScreenId": null,
    "depth": 2,
    "pos": 8
  },
  {
    "id": "SC406",
    "title": "お問い合わせ完了",
    "path": "/contact/complete",
    "description": "お問い合わせ送信完了の確認画面。\n\n受付番号と回答予定時期を表示。\n\na\r\nb\r\nc\r\nd",
    "links": [],
    "parentScreenId": "SC405",
    "depth": 1,
    "pos": 30
  }
];