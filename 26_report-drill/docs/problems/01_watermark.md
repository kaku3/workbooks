# 第1面：ウォーターマークの誤表示

このMarkdownが編集の正本です。JSONと実行データはビルドで生成します。分岐と報告の対応は [案件設計](01_pdf-incident-design.md) を参照。

## schemaVersion

```json
1
```

## caseId

```json
"watermark"
```

## version

```json
2
```

## status

```json
"prototype"
```

## title

```json
"ウォーターマークの誤表示"
```

## requestMemo

```json
"経理の三田が取引先提出用にPDF資料を印刷したところ、5年前に退職した田中太郎の氏名がウォーターマーク（透かし）として入る。三田の名前が入る想定との食い違いについて、今日17:00までに原因と根拠、確認できた影響と対応案を報告する。本番修正と提出先の全件確認は今回の調査範囲外。"
```

## clock

```json
{
  "start": "09:00",
  "deadline": "17:00"
}
```

## knowledge

```json
{
  "business": {
    "initial": 0,
    "max": 5
  },
  "system": {
    "initial": 0,
    "max": 8
  }
}
```

## intuition

```json
{
  "max": 3
}
```

## evidence

```json
[
  {
    "id": "wm.case",
    "title": "三田の資料に田中太郎の透かし",
    "text": "三田が印刷したPDFに「田中太郎」。本来は三田の氏名が入るはず。",
    "source": "佐伯経由で受領した三田の問い合わせと印刷資料",
    "kind": "confirmed"
  },
  {
    "id": "wm.retired",
    "title": "田中太郎は5年前に退職",
    "text": "アカウントも無効化済み。名前が表示される理由は、まだ不明。",
    "source": "佐伯が確認した在籍とアカウントの記録",
    "kind": "confirmed"
  },
  {
    "id": "wm.screen",
    "title": "画面名と透かしは別項目",
    "text": "古い仕様では、透かしは出力者の氏名。今の動作は要確認。",
    "source": "画面仕様書・更新漏れあり",
    "kind": "reference"
  },
  {
    "id": "wm.architecture",
    "title": "PDFはサーバー側で生成",
    "text": "出力APIから帳票サービスを呼ぶ。現行の処理経路との照合が必要。",
    "source": "外部設計書またはバックエンドの呼び出し経路",
    "kind": "reference"
  },
  {
    "id": "wm.detail",
    "title": "透かしには氏名オプション",
    "text": "watermarkNameを使用。古い設計書に、未設定時の動作はない。",
    "source": "詳細設計書・更新漏れあり",
    "kind": "reference"
  },
  {
    "id": "wm.logs",
    "title": "出力したのは三田",
    "text": "対象PDFのリクエストと三田の操作記録が一致。保存期間外は未確認。",
    "source": "対象PDFと三田の操作記録をリクエストIDで照合",
    "kind": "confirmed"
  },
  {
    "id": "wm.debug",
    "title": "利用者と透かしの氏名が別",
    "text": "認証IDは三田、透かしの氏名は田中太郎。実行時の値で確認。",
    "source": "デバッガでウォーターマーク生成の引数を確認",
    "kind": "confirmed"
  },
  {
    "id": "wm.defaults",
    "title": "空欄なら「田中太郎」を補完",
    "text": "透かし氏名が未設定だと、出力者名ではなくサンプル名を使う処理が残る。",
    "source": "ウォーターマーク生成処理の現行ソース",
    "kind": "confirmed"
  },
  {
    "id": "wm.setting",
    "title": "対象の氏名設定は空欄",
    "text": "標準テンプレートが、サンプル名を補う条件に入る。変更の経緯は不明。",
    "source": "対象テンプレートと検証環境の透かし設定を照合",
    "kind": "confirmed"
  },
  {
    "id": "wm.repro",
    "title": "別利用者でも同じ透かし",
    "text": "三田以外でも「田中太郎」。参照先を利用者に変えると正しい氏名になる。",
    "source": "利用者と透かし氏名の参照先を変えた再現試験",
    "kind": "confirmed"
  },
  {
    "id": "wm.impact",
    "title": "同じ条件で誤表示を確認",
    "text": "氏名未設定の標準テンプレートで再現。他の帳票や提出済み資料は未確認。",
    "source": "ウォーターマークの再現試験と調査範囲の整理",
    "kind": "confirmed"
  },
  {
    "id": "wm.response",
    "title": "利用者名を使う修正案",
    "text": "サンプル名補完を廃止し、利用者名を渡す。別利用者の試験と提出済み資料の確認も。本番は未修正。",
    "source": "再現結果に基づくウォーターマークの対応案",
    "kind": "proposal"
  },
  {
    "id": "wm.frontend",
    "title": "画面・APIは三田の情報",
    "text": "画面の氏名も、出力APIの利用者IDも三田。透かしを作る処理は見つからない。",
    "source": "フロントエンドの現行ソース",
    "kind": "confirmed"
  },
  {
    "id": "wm.cache",
    "title": "キャッシュ原因説",
    "text": "AIが挙げた一般論。今回の原因だと示す記録や再現結果はない。",
    "source": "社内AIの一般論",
    "kind": "proposal"
  }
]
```

## investigations

```json
[
  {
    "id": "wm.purpose-check",
    "title": "依頼と現物を確認する",
    "description": "佐伯経由で三田の問い合わせと印刷資料を確認する。",
    "unlock": {},
    "outcomes": [
      {
        "id": "default",
        "when": {},
        "minutes": 20,
        "scene": "01.case",
        "gain": {
          "business": 1
        },
        "evidence": [
          "wm.case",
          "wm.retired"
        ]
      }
    ]
  },
  {
    "id": "wm.design",
    "title": "仕様書を読む",
    "description": "保管された資料の種類と対象を整理する。",
    "unlock": {},
    "outcomes": [
      {
        "id": "overview",
        "when": {},
        "minutes": 20,
        "scene": "01.docs-overview",
        "gain": {
          "system": 1
        },
        "flags": [
          "wm.docs-map"
        ]
      }
    ]
  },
  {
    "id": "wm.docs-screen",
    "title": "画面仕様書を読む",
    "description": "画面項目と出力操作の概要を読む。",
    "unlock": {
      "flagsAll": [
        "wm.docs-map"
      ]
    },
    "outcomes": [
      {
        "id": "default",
        "when": {},
        "minutes": 15,
        "scene": "01.docs-screen",
        "gain": {
          "system": 1
        },
        "evidence": [
          "wm.screen"
        ],
        "flags": [
          "wm.screen-read"
        ]
      }
    ]
  },
  {
    "id": "wm.docs-external",
    "title": "外部設計書を読む",
    "description": "APIとサービスの関係を読む。",
    "unlock": {
      "flagsAll": [
        "wm.docs-map"
      ]
    },
    "outcomes": [
      {
        "id": "default",
        "when": {},
        "minutes": 20,
        "scene": "01.docs-external",
        "gain": {
          "system": 1
        },
        "evidence": [
          "wm.architecture"
        ],
        "flags": [
          "wm.external-read"
        ]
      }
    ]
  },
  {
    "id": "wm.docs-detail",
    "title": "詳細設計書を読む",
    "description": "透かしの氏名オプションと出力処理の概要を読む。",
    "unlock": {
      "flagsAll": [
        "wm.docs-map"
      ]
    },
    "outcomes": [
      {
        "id": "default",
        "when": {},
        "minutes": 20,
        "scene": "01.docs-detail",
        "gain": {
          "system": 1
        },
        "evidence": [
          "wm.detail"
        ],
        "flags": [
          "wm.detail-read"
        ]
      }
    ]
  },
  {
    "id": "wm.source",
    "title": "ソースを解析する",
    "description": "全体構成を読み、調べる領域を切り分ける。",
    "unlock": {},
    "outcomes": [
      {
        "id": "overview",
        "when": {},
        "minutes": 60,
        "scene": "01.source-overview",
        "gain": {
          "system": 1
        },
        "flags": [
          "wm.source-map"
        ]
      }
    ]
  },
  {
    "id": "wm.source-backend",
    "title": "バックエンド側ソースを読む",
    "description": "サーバー側のリクエスト処理を追う。",
    "unlock": {
      "flagsAll": [
        "wm.source-map"
      ]
    },
    "outcomes": [
      {
        "id": "prepared",
        "when": {
          "flagsAll": [
            "wm.external-read"
          ]
        },
        "minutes": 30,
        "scene": "01.backend",
        "gain": {
          "system": 1
        },
        "evidence": [
          "wm.architecture"
        ],
        "flags": [
          "wm.backend-read"
        ]
      },
      {
        "id": "traced",
        "when": {
          "evidenceAll": [
            "wm.logs"
          ]
        },
        "minutes": 40,
        "scene": "01.backend",
        "gain": {
          "system": 1
        },
        "evidence": [
          "wm.architecture"
        ],
        "flags": [
          "wm.backend-read"
        ]
      },
      {
        "id": "default",
        "when": {},
        "minutes": 60,
        "scene": "01.backend-wide",
        "gain": {
          "system": 1
        },
        "evidence": [
          "wm.architecture"
        ],
        "flags": [
          "wm.backend-read"
        ]
      }
    ]
  },
  {
    "id": "wm.source-frontend",
    "title": "フロントエンド側ソースを読む",
    "description": "画面表示と出力操作のコードを追う。",
    "unlock": {
      "flagsAll": [
        "wm.source-map"
      ]
    },
    "outcomes": [
      {
        "id": "prepared",
        "when": {
          "flagsAll": [
            "wm.screen-read"
          ]
        },
        "minutes": 20,
        "scene": "01.frontend",
        "gain": {
          "system": 1
        },
        "evidence": [
          "wm.frontend"
        ]
      },
      {
        "id": "default",
        "when": {},
        "minutes": 45,
        "scene": "01.frontend-wide",
        "gain": {
          "system": 1
        },
        "evidence": [
          "wm.frontend"
        ]
      }
    ]
  },
  {
    "id": "wm.source-common",
    "title": "共通ユーティリティを読む",
    "description": "日付と文字列の共通処理を追う。",
    "unlock": {
      "flagsAll": [
        "wm.source-map"
      ]
    },
    "outcomes": [
      {
        "id": "default",
        "when": {},
        "minutes": 45,
        "scene": "01.common-miss",
        "complete": false
      }
    ]
  },
  {
    "id": "wm.source-pdf",
    "title": "PDF生成処理を読む",
    "description": "バックエンドからたどった帳票処理を確認する。",
    "unlock": {
      "flagsAll": [
        "wm.backend-read"
      ]
    },
    "outcomes": [
      {
        "id": "prepared",
        "when": {
          "flagsAll": [
            "wm.detail-read"
          ]
        },
        "minutes": 20,
        "scene": "01.pdf-source",
        "gain": {
          "system": 1
        },
        "evidence": [
          "wm.defaults"
        ]
      },
      {
        "id": "default",
        "when": {},
        "minutes": 45,
        "scene": "01.pdf-source",
        "gain": {
          "system": 1
        },
        "evidence": [
          "wm.defaults"
        ]
      }
    ]
  },
  {
    "id": "wm.settings",
    "title": "テンプレート設定を確認する",
    "description": "現在の帳票表示オプションを照合する。",
    "unlock": {
      "flagsAll": [
        "wm.backend-read"
      ]
    },
    "outcomes": [
      {
        "id": "default",
        "when": {},
        "minutes": 20,
        "scene": "01.settings",
        "gain": {
          "system": 1
        },
        "evidence": [
          "wm.setting"
        ]
      }
    ]
  },
  {
    "id": "wm.logs",
    "title": "ログを調べる",
    "description": "出力リクエストの時刻と利用者を追う。",
    "unlock": {},
    "outcomes": [
      {
        "id": "focused",
        "when": {
          "evidenceAll": [
            "wm.case"
          ]
        },
        "minutes": 30,
        "scene": "01.logs",
        "gain": {
          "system": 1
        },
        "evidence": [
          "wm.logs"
        ],
        "flags": [
          "wm.trace-found"
        ]
      },
      {
        "id": "default",
        "when": {},
        "minutes": 45,
        "scene": "01.logs-wide",
        "complete": false
      }
    ],
    "repeatable": true
  },
  {
    "id": "wm.debugger",
    "title": "デバッガで追う",
    "description": "検証環境で実行時の値を確認する。",
    "unlock": {},
    "outcomes": [
      {
        "id": "focused",
        "when": {
          "any": [
            {
              "evidenceAll": [
                "wm.logs"
              ]
            },
            {
              "flagsAll": [
                "wm.backend-read"
              ]
            }
          ]
        },
        "minutes": 30,
        "scene": "01.debug",
        "gain": {
          "system": 1
        },
        "evidence": [
          "wm.debug"
        ]
      },
      {
        "id": "default",
        "when": {},
        "minutes": 45,
        "scene": "01.debug-wide",
        "complete": false
      }
    ],
    "repeatable": true
  },
  {
    "id": "wm.verify",
    "title": "原因の仮説を再現して確かめる",
    "description": "利用者と透かし氏名の参照先を変え、出力・印刷結果を確かめる。",
    "unlock": {
      "evidenceAll": [
        "wm.defaults",
        "wm.debug",
        "wm.setting"
      ]
    },
    "outcomes": [
      {
        "id": "default",
        "when": {},
        "minutes": 35,
        "scene": "01.verify",
        "gain": {
          "system": 1
        },
        "evidence": [
          "wm.repro",
          "wm.impact"
        ],
        "flags": [
          "wm.reproduced"
        ]
      }
    ]
  },
  {
    "id": "wm.response",
    "title": "報告と対応案をまとめる",
    "description": "原因、影響、未確認事項、是正案を整理する。",
    "unlock": {
      "flagsAll": [
        "wm.reproduced"
      ]
    },
    "outcomes": [
      {
        "id": "default",
        "when": {},
        "minutes": 20,
        "scene": "01.response",
        "gain": {
          "business": 1
        },
        "evidence": [
          "wm.response"
        ]
      }
    ]
  },
  {
    "id": "wm.ai",
    "title": "似た症状をAIに聞く",
    "description": "一般的な原因候補を集める。今回の原因かは未確認。",
    "unlock": {},
    "outcomes": [
      {
        "id": "default",
        "when": {},
        "minutes": 10,
        "scene": "01.ai",
        "evidence": [
          "wm.cache"
        ]
      }
    ]
  },
  {
    "id": "wm.legacy",
    "title": "旧リリース資料を読む",
    "description": "5年前のリリースと担当一覧を確認する。",
    "unlock": {},
    "outcomes": [
      {
        "id": "default",
        "when": {},
        "minutes": 60,
        "scene": "01.legacy",
        "complete": false
      }
    ]
  },
  {
    "id": "wm.ask-makabe",
    "title": "真壁に聞く",
    "description": "調べたことを整理して先輩に質問する。",
    "unlock": {},
    "outcomes": [
      {
        "id": "meeting",
        "when": {
          "availabilityIn": [
            "meeting"
          ]
        },
        "minutes": 10,
        "scene": "01.makabe-away",
        "complete": false
      },
      {
        "id": "busy",
        "when": {
          "all": [
            {
              "availabilityIn": [
                "incident"
              ]
            },
            {
              "flagAbsent": "wm.lecture-seen"
            }
          ]
        },
        "minutes": 45,
        "scene": "01.makabe-busy",
        "flags": [
          "wm.lecture-seen"
        ],
        "complete": false
      },
      {
        "id": "specific",
        "when": {
          "all": [
            {
              "evidenceAll": [
                "wm.logs"
              ]
            },
            {
              "questionIs": "pdf-location"
            }
          ]
        },
        "minutes": 10,
        "scene": "01.makabe-specific",
        "flags": [
          "wm.source-hint"
        ]
      },
      {
        "id": "default",
        "when": {},
        "minutes": 10,
        "scene": "01.makabe-vague",
        "complete": false
      }
    ],
    "questionOptions": [
      {
        "id": "general",
        "label": "三田さんが印刷した資料に田中太郎の透かしが入る件、何から調べればいいですか？",
        "unlock": {}
      },
      {
        "id": "pdf-location",
        "label": "出力記録は三田さんでした。透かしの氏名との違いをどこから追えばいいですか？",
        "unlock": {
          "evidenceAll": [
            "wm.logs"
          ]
        }
      }
    ]
  }
]
```

## questions

```json
[
  {
    "id": "wm.report",
    "to": "sales",
    "prompt": "三田が印刷した資料に、なぜ退職した田中太郎さんの透かしが入るのでしょう。何が起きていて、どこまで影響し、何を対応するか、担当者に説明できる形でお願いします。",
    "slots": 3,
    "minutes": 10,
    "elements": [
      {
        "id": "phenomenon",
        "label": "事象",
        "when": {
          "selectedAny": [
            "wm.logs",
            "wm.repro",
            "wm.impact"
          ]
        }
      },
      {
        "id": "cause",
        "label": "原因",
        "when": {
          "all": [
            {
              "selectedAll": [
                "wm.defaults"
              ]
            },
            {
              "selectedAny": [
                "wm.debug",
                "wm.repro",
                "wm.impact"
              ]
            }
          ]
        }
      },
      {
        "id": "response",
        "label": "対応・影響",
        "when": {
          "selectedAll": [
            "wm.impact",
            "wm.response"
          ]
        }
      }
    ],
    "relevant": {
      "selectedAny": [
        "wm.case",
        "wm.retired",
        "wm.logs",
        "wm.debug",
        "wm.defaults",
        "wm.setting",
        "wm.repro",
        "wm.impact",
        "wm.response"
      ]
    },
    "conflict": {
      "selectedAny": [
        "wm.cache"
      ]
    },
    "reactions": [
      "01.report-0",
      "01.report-1",
      "01.report-2",
      "01.report-3"
    ],
    "reject": [],
    "accept": [],
    "fallback": "01.report-0"
  }
]
```

## help

```json
{
  "slots": 1,
  "cards": [
    {
      "id": "wm.coffee",
      "title": "コーヒーを飲む",
      "usesPerLoop": 1,
      "outcomes": [
        {
          "id": "default",
          "when": {},
          "minutes": 5,
          "scene": "01.coffee-none"
        }
      ]
    }
  ]
}
```

## loop

```json
{
  "memoryCandidates": [
    "wm.case",
    "wm.logs",
    "wm.defaults"
  ],
  "maxMemories": 3,
  "intuitionGainPerNewMemoryLoop": 1
}
```

## authorNotes

```json
[
  "人物・障害・コード・ログはすべて架空。透かしの氏名だけで実行利用者を断定しない。",
  "仕様書から画面・外部・詳細の3枚、ソースからバックエンド・フロントエンド・共通の3枚を解放する。PDF生成処理はバックエンドを読んだ後だけ表示する。",
  "画面仕様書はフロントエンド45mから20m、外部設計書はバックエンド60mから30m、詳細設計書はPDF45mから20m。ログで絞ったバックエンドは40m。仕様書だけでは原因を確定しない。",
  "ログ・デバッガは反復可能。準備なしは45mで有用な根拠なし、準備後は30m。再実行でも同じ結果の報酬は重複させない。効果のない調査と反復道具はイベント後に未着手へ戻す。",
  "報告は確認できた原因・影響・是正案を事実に沿って説明する。個人への推測を避け、未確認事項を隠して会社を守る展開にはしない。"
]
```
