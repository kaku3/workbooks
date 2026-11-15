# 第3章：一括登録機能（問題）

編集の正本。設計は [第3章資料](../chapter3/00_README.md) を参照。

## schemaVersion

```json
1
```

## caseId

```json
"bulk-import"
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
"一括登録機能"
```

## titleQuote

```json
"「まとめて登録できないかしら？」"
```

## closingNote

```json
"両案の概算と前提、担当に残る作業を説明し、佐伯が利用部署へ持ち帰りました。採用判断と詳細設計はこれからです。"
```

## requestMemoTitle

```json
"朝の手入力をまとめたい"
```

## requestMemo

```json
"毎朝の手入力を減らしたいと、佐伯さんから相談が来た。\n\nサンプルのExcelが添付されている。まとめて登録したいという話だが、担当の手順や、どこまで自動化するかはまだ分からない。"
```

## requestPurpose

```json
"現場の作業と登録処理を調べ、実現方法と見積もりを佐伯さんに報告する。"
```

## clock

```json
{
  "start": "09:00",
  "deadline": "18:00"
}
```

## knowledge

```json
{
  "business": {
    "initial": 0,
    "max": 12
  },
  "system": {
    "initial": 0,
    "max": 18
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
    "id": "bi.request",
    "title": "朝の手入力を減らしたい",
    "text": "一括登録の依頼。Excel自動変換まで約束していない。添付はサンプル。",
    "kind": "confirmed",
    "source": "朝の手入力を減らしたい"
  },
  {
    "id": "bi.work",
    "title": "毎朝の補正と転記",
    "text": "普段20〜30件、月初50件。約6項目を補正して、一件ずつ画面へ転記している。",
    "kind": "confirmed",
    "source": "毎朝の補正と転記"
  },
  {
    "id": "bi.workbook",
    "title": "Excelの列と表記が違う",
    "text": "取引先ごとに列順が違い、全角数字や日付の揺れがある。日々の手順は未確認。",
    "kind": "confirmed",
    "source": "Excelの列と表記が違う"
  },
  {
    "id": "bi.screen",
    "title": "単件の入力例と呼び出し先",
    "text": "検証環境で一件登録。入力の形式と送信先、登録番号とテスト通知を確認。",
    "kind": "confirmed",
    "source": "単件の入力例と呼び出し先"
  },
  {
    "id": "bi.source",
    "title": "現行は単件登録のみ",
    "text": "入力検証・登録・関連更新・通知の処理箇所とテスト入力を確認。一括の入口は新設。",
    "kind": "confirmed",
    "source": "現行は単件登録のみ"
  },
  {
    "id": "bi.spec",
    "title": "単件登録の仕様書",
    "text": "入力項目と処理の概要。ソースの読解に使えるが、一括登録の仕様はない。",
    "kind": "reference",
    "source": "単件登録の仕様書"
  },
  {
    "id": "bi.mapping",
    "title": "Excelと入力形式の差",
    "text": "列・数値・日付を揃えた見本は入力チェックを通る。CSVを準備する仕事は残る。",
    "kind": "confirmed",
    "source": "Excelと入力形式の差"
  },
  {
    "id": "bi.csv-ready",
    "title": "所定CSVの準備は担当で",
    "text": "担当が補正してCSV化する前提で見積もる。自動変換・マクロ新規開発は別範囲。",
    "kind": "confirmed",
    "source": "所定CSVの準備は担当で"
  },
  {
    "id": "bi.operations",
    "title": "入れ直し方で残る仕事が違う",
    "text": "全体取消なら全件再投入・結果確認。行を残すなら失敗行の識別・修正・再投入。",
    "kind": "confirmed",
    "source": "入れ直し方で残る仕事が違う"
  },
  {
    "id": "bi.business",
    "title": "見積もりの前提と担当に残る作業",
    "text": "所定CSVの登録が対象。整形は担当、自動変換は別。全件／失敗行の再投入で手間が違う。",
    "kind": "confirmed",
    "source": "見積もりの前提と担当に残る作業"
  },
  {
    "id": "bi.prototype",
    "title": "試作は二件目で停止",
    "text": "新しい検証用コードで単件を反復。一件目の登録と通知が残った。完成版ではない。",
    "kind": "confirmed",
    "source": "試作は二件目で停止"
  },
  {
    "id": "bi.related",
    "title": "単件ごとに関連更新を確定",
    "text": "本体・関連レコードを単件で確定する。一括時の取消単位は新しく設計する。",
    "kind": "confirmed",
    "source": "単件ごとに関連更新を確定"
  },
  {
    "id": "bi.notification",
    "title": "通知は単件の確定後",
    "text": "送信済みメールはDB取消で戻らない。一括処理の確定と通知順はこれから設計。",
    "kind": "confirmed",
    "source": "通知は単件の確定後"
  },
  {
    "id": "bi.notification-trial",
    "title": "試作の停止後も通知は送信済み",
    "text": "登録番号と受信記録を照合。試作の一件目の送信は二件目の失敗で戻らなかった。",
    "kind": "confirmed",
    "source": "試作の停止後も通知は送信済み"
  },
  {
    "id": "bi.retry",
    "title": "単件への再送で二重登録",
    "text": "同じ入力で登録と通知が増えた。行を残す一括処理には結果記録・識別が必要。",
    "kind": "confirmed",
    "source": "単件への再送で二重登録"
  },
  {
    "id": "bi.plan-a",
    "title": "全体を戻す処理案",
    "text": "全件をまとめて確定し、失敗なら取り消す。通知は確定後。詳細設計は未完了。",
    "kind": "proposal",
    "source": "全体を戻す処理案"
  },
  {
    "id": "bi.plan-b",
    "title": "通った登録を残す処理案",
    "text": "一件ずつ確定して結果を記録。失敗行を区別して再送する設計。詳細はこれから。",
    "kind": "proposal",
    "source": "通った登録を残す処理案"
  },
  {
    "id": "bi.a",
    "title": "A案：全件取消・概算1日",
    "text": "所定CSV前提、実装・試験1日程度。全件再投入・確認が必要。詳細設計で変動し得る。",
    "kind": "proposal",
    "source": "A案：全件取消・概算1日"
  },
  {
    "id": "bi.b",
    "title": "B案：正常行を残す・概算10日",
    "text": "所定CSV前提、実装・試験10日程度。結果・再送・関連更新・通知対策。詳細は未確定。",
    "kind": "proposal",
    "source": "B案：正常行を残す・概算10日"
  },
  {
    "id": "bi.libraries",
    "title": "CSV読取の実装候補",
    "text": "形式対応と試験のしやすさで候補を絞った。読取方法で概算は大きく変わらず、登録・通知の設計は別。",
    "kind": "reference",
    "source": "CSV読取の実装候補"
  },
  {
    "id": "bi.distributed",
    "title": "大量処理の構成と管理コスト",
    "text": "分散すると処理状況・再送の管理も増える。毎日の件数に見合うか比較する。",
    "kind": "reference",
    "source": "大量処理の構成と管理コスト"
  },
  {
    "id": "bi.tables",
    "title": "集計用テーブルは更新対象外",
    "text": "今回の単件登録から更新されないことを確認。修正範囲から除外できる。",
    "kind": "reference",
    "source": "集計用テーブルは更新対象外"
  },
  {
    "id": "bi.macro",
    "title": "マクロで前処理する手もある",
    "text": "真壁の経験案。今の道具や担当は未確認。新規作成・書式変更対応は別の仕事。",
    "kind": "proposal",
    "source": "マクロで前処理する手もある"
  },
  {
    "id": "bi.macro-check",
    "title": "前処理マクロにも保守が必要",
    "text": "列対応とチェックを補助できる。新規作成・誤変換確認・保守担当の費用は別。",
    "kind": "reference",
    "source": "前処理マクロにも保守が必要"
  },
  {
    "id": "bi.detail",
    "title": "詳細設計に残る項目",
    "text": "結果画面、例外、送信失敗、再送の順序と試験が残る。概算を出す段階と区別する。",
    "kind": "reference",
    "source": "詳細設計に残る項目"
  }
]
```

## investigations

```json
[
  {
    "id": "bi.request",
    "title": "依頼を読み直す",
    "description": "添付と依頼の内容を確かめる。",
    "unlock": {},
    "repeatable": true,
    "outcomes": [
      {
        "id": "default",
        "when": {
          "flagAbsent": "bi.request"
        },
        "minutes": 5,
        "scene": "03.request",
        "flags": [
          "bi.request"
        ],
        "evidence": [
          "bi.request"
        ],
        "gain": {
          "business": 1
        }
      },
      {
        "id": "recheck",
        "when": {},
        "minutes": 5,
        "scene": "03.recheck",
        "complete": false
      }
    ]
  },
  {
    "id": "bi.business",
    "title": "担当者の朝の作業を確認する",
    "description": "佐伯に取り次いでもらい、普段の件数と手順を確認する。",
    "unlock": {},
    "repeatable": true,
    "outcomes": [
      {
        "id": "default",
        "when": {
          "flagAbsent": "bi.business"
        },
        "minutes": 25,
        "scene": "03.business",
        "flags": [
          "bi.business"
        ],
        "evidence": [
          "bi.work"
        ],
        "gain": {
          "business": 2
        }
      },
      {
        "id": "recheck",
        "when": {},
        "minutes": 25,
        "scene": "03.recheck",
        "complete": false
      }
    ]
  },
  {
    "id": "bi.workbook",
    "title": "届いたExcelを開く",
    "description": "添付のサンプルや別書式の見本を読む。",
    "unlock": {},
    "repeatable": true,
    "outcomes": [
      {
        "id": "default",
        "when": {
          "flagAbsent": "bi.workbook"
        },
        "minutes": 20,
        "scene": "03.workbook",
        "flags": [
          "bi.workbook"
        ],
        "evidence": [
          "bi.workbook"
        ],
        "gain": {
          "business": 1
        }
      },
      {
        "id": "recheck",
        "when": {},
        "minutes": 20,
        "scene": "03.recheck",
        "complete": false
      }
    ]
  },
  {
    "id": "bi.screen",
    "title": "今の登録画面を使ってみる",
    "description": "検証環境のサンプル一件で、入力と送信内容を見る。",
    "unlock": {},
    "repeatable": true,
    "outcomes": [
      {
        "id": "default",
        "when": {
          "flagAbsent": "bi.screen"
        },
        "minutes": 20,
        "scene": "03.screen",
        "flags": [
          "bi.screen"
        ],
        "evidence": [
          "bi.screen"
        ],
        "gain": {
          "system": 1
        }
      },
      {
        "id": "recheck",
        "when": {},
        "minutes": 20,
        "scene": "03.recheck",
        "complete": false
      }
    ]
  },
  {
    "id": "bi.source",
    "title": "今の登録処理をソースから追う",
    "description": "既存の単件登録とテストの呼び出し先を探す。",
    "unlock": {},
    "repeatable": true,
    "outcomes": [
      {
        "id": "prepared",
        "when": {
          "all": [
            {
              "evidenceAll": [
                "bi.spec"
              ]
            },
            {
              "flagAbsent": "bi.source"
            }
          ]
        },
        "minutes": 30,
        "scene": "03.source",
        "flags": [
          "bi.source"
        ],
        "evidence": [
          "bi.source"
        ],
        "gain": {
          "system": 2
        }
      },
      {
        "id": "default",
        "when": {
          "flagAbsent": "bi.source"
        },
        "minutes": 45,
        "scene": "03.source",
        "flags": [
          "bi.source"
        ],
        "evidence": [
          "bi.source"
        ],
        "gain": {
          "system": 2
        }
      },
      {
        "id": "recheck",
        "when": {},
        "minutes": 45,
        "scene": "03.recheck",
        "complete": false
      }
    ]
  },
  {
    "id": "bi.spec",
    "title": "登録まわりの仕様書を見る",
    "description": "入力項目と処理の概要から、読む場所の当たりを付ける。",
    "unlock": {},
    "repeatable": true,
    "outcomes": [
      {
        "id": "default",
        "when": {
          "flagAbsent": "bi.spec"
        },
        "minutes": 20,
        "scene": "03.spec",
        "flags": [
          "bi.spec"
        ],
        "evidence": [
          "bi.spec"
        ],
        "gain": {
          "system": 1
        }
      },
      {
        "id": "recheck",
        "when": {},
        "minutes": 20,
        "scene": "03.recheck",
        "complete": false
      }
    ]
  },
  {
    "id": "bi.mapping",
    "title": "Excelと登録項目を対応付ける",
    "description": "届くデータを今の入力と照らし、使える見本を作る。",
    "unlock": {
      "all": [
        {
          "any": [
            {
              "evidenceAll": [
                "bi.work"
              ]
            },
            {
              "evidenceAll": [
                "bi.workbook"
              ]
            }
          ]
        },
        {
          "any": [
            {
              "evidenceAll": [
                "bi.screen"
              ]
            },
            {
              "evidenceAll": [
                "bi.source"
              ]
            }
          ]
        }
      ]
    },
    "repeatable": true,
    "outcomes": [
      {
        "id": "default",
        "when": {
          "flagAbsent": "bi.mapping"
        },
        "minutes": 20,
        "scene": "03.mapping",
        "flags": [
          "bi.mapping"
        ],
        "evidence": [
          "bi.mapping"
        ],
        "gain": {
          "business": 1
        }
      },
      {
        "id": "recheck",
        "when": {},
        "minutes": 20,
        "scene": "03.recheck",
        "complete": false
      }
    ]
  },
  {
    "id": "bi.csv-preparation",
    "title": "入力用ファイルの作り方を担当と試す",
    "description": "見本をもとに、準備する仕事と今回の見積もり範囲を確認する。",
    "unlock": {
      "evidenceAll": [
        "bi.mapping"
      ]
    },
    "repeatable": true,
    "outcomes": [
      {
        "id": "first-contact",
        "when": {
          "all": [
            {
              "flagAbsent": "bi.csv-preparation"
            },
            {
              "all": [
                {
                  "flagAbsent": "bi.business"
                }
              ]
            }
          ]
        },
        "minutes": 35,
        "scene": "03.csv-preparation-first",
        "flags": [
          "bi.csv-preparation"
        ],
        "evidence": [
          "bi.csv-ready",
          "bi.work"
        ],
        "gain": {
          "business": 2
        }
      },
      {
        "id": "default",
        "when": {
          "flagAbsent": "bi.csv-preparation"
        },
        "minutes": 25,
        "scene": "03.csv-preparation",
        "flags": [
          "bi.csv-preparation"
        ],
        "evidence": [
          "bi.csv-ready"
        ],
        "gain": {
          "business": 1
        }
      },
      {
        "id": "recheck",
        "when": {},
        "minutes": 25,
        "scene": "03.recheck",
        "complete": false
      }
    ]
  },
  {
    "id": "bi.operations",
    "title": "止まったときの作業を担当に確かめる",
    "description": "試した結果や処理案を見せ、やり直す仕事を確認する。",
    "unlock": {
      "any": [
        {
          "evidenceAll": [
            "bi.prototype"
          ]
        },
        {
          "flagsAll": [
            "bi.plan-a"
          ]
        },
        {
          "flagsAll": [
            "bi.plan-b"
          ]
        }
      ]
    },
    "repeatable": true,
    "outcomes": [
      {
        "id": "default",
        "when": {
          "flagAbsent": "bi.operations"
        },
        "minutes": 20,
        "scene": "03.operations",
        "flags": [
          "bi.operations"
        ],
        "evidence": [
          "bi.operations"
        ],
        "gain": {
          "business": 1
        }
      },
      {
        "id": "recheck",
        "when": {},
        "minutes": 20,
        "scene": "03.recheck",
        "complete": false
      }
    ]
  },
  {
    "id": "bi.prototype",
    "title": "単件を数回呼ぶ検証用コードを作る",
    "description": "検証環境で小さく試す。正常入力と不正な入力を混ぜて呼び出す。",
    "unlock": {
      "any": [
        {
          "evidenceAll": [
            "bi.screen"
          ]
        },
        {
          "evidenceAll": [
            "bi.source"
          ]
        }
      ]
    },
    "repeatable": true,
    "outcomes": [
      {
        "id": "default",
        "when": {
          "flagAbsent": "bi.prototype"
        },
        "minutes": 35,
        "scene": "03.prototype",
        "flags": [
          "bi.prototype"
        ],
        "evidence": [
          "bi.prototype"
        ],
        "gain": {
          "system": 1
        }
      },
      {
        "id": "recheck",
        "when": {},
        "minutes": 35,
        "scene": "03.recheck",
        "complete": false
      }
    ]
  },
  {
    "id": "bi.related",
    "title": "単件登録と関連更新の境界を追う",
    "description": "登録番号や処理箇所から、一緒に確定するデータを追う。",
    "unlock": {
      "any": [
        {
          "evidenceAll": [
            "bi.screen"
          ]
        },
        {
          "evidenceAll": [
            "bi.source"
          ]
        }
      ]
    },
    "repeatable": true,
    "outcomes": [
      {
        "id": "prototype-prepared",
        "when": {
          "all": [
            {
              "flagAbsent": "bi.related"
            },
            {
              "evidenceAll": [
                "bi.prototype",
                "bi.source"
              ]
            }
          ]
        },
        "minutes": 20,
        "scene": "03.related-prototype",
        "flags": [
          "bi.related"
        ],
        "evidence": [
          "bi.related"
        ],
        "gain": {
          "system": 2
        }
      },
      {
        "id": "prototype",
        "when": {
          "all": [
            {
              "flagAbsent": "bi.related"
            },
            {
              "evidenceAll": [
                "bi.prototype"
              ]
            }
          ]
        },
        "minutes": 30,
        "scene": "03.related-prototype",
        "flags": [
          "bi.related"
        ],
        "evidence": [
          "bi.related"
        ],
        "gain": {
          "system": 2
        }
      },
      {
        "id": "prepared",
        "when": {
          "all": [
            {
              "flagAbsent": "bi.related"
            },
            {
              "evidenceAll": [
                "bi.source"
              ]
            }
          ]
        },
        "minutes": 20,
        "scene": "03.related",
        "flags": [
          "bi.related"
        ],
        "evidence": [
          "bi.related"
        ],
        "gain": {
          "system": 2
        }
      },
      {
        "id": "default",
        "when": {
          "flagAbsent": "bi.related"
        },
        "minutes": 30,
        "scene": "03.related",
        "flags": [
          "bi.related"
        ],
        "evidence": [
          "bi.related"
        ],
        "gain": {
          "system": 2
        }
      },
      {
        "id": "recheck",
        "when": {},
        "minutes": 30,
        "scene": "03.recheck",
        "complete": false
      }
    ]
  },
  {
    "id": "bi.notification",
    "title": "通知と登録結果を照合する",
    "description": "確定と送信の順番を、コードやテスト用の受信記録と照らす。",
    "unlock": {
      "any": [
        {
          "evidenceAll": [
            "bi.screen"
          ]
        },
        {
          "evidenceAll": [
            "bi.source"
          ]
        }
      ]
    },
    "repeatable": true,
    "outcomes": [
      {
        "id": "trial",
        "when": {
          "all": [
            {
              "flagAbsent": "bi.notification"
            },
            {
              "evidenceAll": [
                "bi.prototype"
              ]
            }
          ]
        },
        "minutes": 20,
        "scene": "03.notification-prototype",
        "flags": [
          "bi.notification",
          "bi.notification-trial"
        ],
        "evidence": [
          "bi.notification",
          "bi.notification-trial"
        ],
        "gain": {
          "system": 1
        }
      },
      {
        "id": "default",
        "when": {
          "flagAbsent": "bi.notification"
        },
        "minutes": 20,
        "scene": "03.notification",
        "flags": [
          "bi.notification",
          "bi.notification-before-trial"
        ],
        "evidence": [
          "bi.notification"
        ],
        "gain": {
          "system": 1
        }
      },
      {
        "id": "recheck",
        "when": {},
        "minutes": 20,
        "scene": "03.recheck",
        "complete": false
      }
    ]
  },
  {
    "id": "bi.notification-followup",
    "title": "停止した試作の通知を追加で照合する",
    "description": "既に見た単件の記録と、新たな試作の送信結果を突き合わせる。",
    "unlock": {
      "all": [
        {
          "evidenceAll": [
            "bi.prototype",
            "bi.notification"
          ]
        },
        {
          "flagsAll": [
            "bi.notification-before-trial"
          ]
        }
      ]
    },
    "repeatable": true,
    "outcomes": [
      {
        "id": "trial",
        "when": {
          "flagAbsent": "bi.notification-trial"
        },
        "minutes": 10,
        "scene": "03.notification-followup",
        "flags": [
          "bi.notification-trial",
          "bi.notification-followup"
        ],
        "evidence": [
          "bi.notification-trial"
        ],
        "gain": {}
      },
      {
        "id": "default",
        "when": {
          "flagAbsent": "bi.notification-followup"
        },
        "minutes": 10,
        "scene": "03.notification-followup",
        "flags": [
          "bi.notification-followup"
        ],
        "evidence": [
          "bi.notification-trial"
        ],
        "gain": {}
      },
      {
        "id": "recheck",
        "when": {},
        "minutes": 10,
        "scene": "03.recheck",
        "complete": false
      }
    ]
  },
  {
    "id": "bi.retry",
    "title": "同じデータをもう一度送る",
    "description": "検証環境の単件入力、または試作へ同じ入力を送ってみる。",
    "unlock": {
      "any": [
        {
          "evidenceAll": [
            "bi.prototype"
          ]
        },
        {
          "evidenceAll": [
            "bi.related"
          ]
        }
      ]
    },
    "repeatable": true,
    "outcomes": [
      {
        "id": "prototype",
        "when": {
          "all": [
            {
              "flagAbsent": "bi.retry"
            },
            {
              "evidenceAll": [
                "bi.prototype"
              ]
            }
          ]
        },
        "minutes": 25,
        "scene": "03.retry-prototype",
        "flags": [
          "bi.retry"
        ],
        "evidence": [
          "bi.retry"
        ],
        "gain": {
          "system": 1
        }
      },
      {
        "id": "default",
        "when": {
          "flagAbsent": "bi.retry"
        },
        "minutes": 25,
        "scene": "03.retry",
        "flags": [
          "bi.retry"
        ],
        "evidence": [
          "bi.retry"
        ],
        "gain": {
          "system": 1
        }
      },
      {
        "id": "recheck",
        "when": {},
        "minutes": 25,
        "scene": "03.recheck",
        "complete": false
      }
    ]
  },
  {
    "id": "bi.plan",
    "title": "一括登録の処理案を検討する",
    "description": "今の単件処理をどう使い、一括登録に何を新設するか考える。",
    "unlock": {
      "any": [
        {
          "evidenceAll": [
            "bi.prototype"
          ]
        },
        {
          "evidenceAll": [
            "bi.related"
          ]
        }
      ]
    },
    "chooseQuestion": true,
    "questionOptions": [
      {
        "id": "a",
        "label": "エラー時に全体を戻す構成を考える",
        "unlock": {
          "any": [
            {
              "flagAbsent": "bi.plan-a"
            },
            {
              "flagsAll": [
                "bi.plan-a",
                "bi.plan-b"
              ]
            }
          ]
        }
      },
      {
        "id": "b",
        "label": "通った登録を残す構成を考える",
        "unlock": {
          "any": [
            {
              "flagAbsent": "bi.plan-b"
            },
            {
              "flagsAll": [
                "bi.plan-a",
                "bi.plan-b"
              ]
            }
          ]
        }
      }
    ],
    "repeatable": true,
    "outcomes": [
      {
        "id": "recheck-a",
        "when": {
          "all": [
            {
              "questionIs": "a"
            },
            {
              "flagsAll": [
                "bi.plan-a"
              ]
            }
          ]
        },
        "minutes": 25,
        "scene": "03.recheck",
        "flags": [],
        "evidence": [],
        "gain": {}
      },
      {
        "id": "recheck-b",
        "when": {
          "all": [
            {
              "questionIs": "b"
            },
            {
              "flagsAll": [
                "bi.plan-b"
              ]
            }
          ]
        },
        "minutes": 25,
        "scene": "03.recheck",
        "flags": [],
        "evidence": [],
        "gain": {}
      },
      {
        "id": "a-update",
        "when": {
          "all": [
            {
              "questionIs": "a"
            },
            {
              "flagsAll": [
                "bi.plan-started"
              ]
            }
          ]
        },
        "minutes": 15,
        "scene": "03.plan-a",
        "flags": [
          "bi.plan-started",
          "bi.plan-a"
        ],
        "evidence": [
          "bi.plan-a"
        ],
        "gain": {
          "system": 1
        }
      },
      {
        "id": "a",
        "when": {
          "questionIs": "a"
        },
        "minutes": 25,
        "scene": "03.plan-a",
        "flags": [
          "bi.plan-started",
          "bi.plan-a"
        ],
        "evidence": [
          "bi.plan-a"
        ],
        "gain": {
          "system": 1
        }
      },
      {
        "id": "b-update",
        "when": {
          "all": [
            {
              "questionIs": "b"
            },
            {
              "flagsAll": [
                "bi.plan-started"
              ]
            }
          ]
        },
        "minutes": 15,
        "scene": "03.plan-b",
        "flags": [
          "bi.plan-started",
          "bi.plan-b"
        ],
        "evidence": [
          "bi.plan-b"
        ],
        "gain": {
          "system": 1
        }
      },
      {
        "id": "b",
        "when": {
          "questionIs": "b"
        },
        "minutes": 25,
        "scene": "03.plan-b",
        "flags": [
          "bi.plan-started",
          "bi.plan-b"
        ],
        "evidence": [
          "bi.plan-b"
        ],
        "gain": {
          "system": 1
        }
      },
      {
        "id": "legacy-both",
        "when": {
          "questionIs": "legacy-both"
        },
        "minutes": 25,
        "scene": "03.plan-both"
      }
    ]
  },
  {
    "id": "bi.plan-more",
    "title": "処理案を追加・再検討する",
    "description": "今の単件処理をどう使い、一括登録に何を新設するか考える。",
    "unlock": {
      "flagsAll": [
        "bi.plan-started"
      ]
    },
    "chooseQuestion": true,
    "questionOptions": [
      {
        "id": "a",
        "label": "エラー時に全体を戻す構成を考える",
        "unlock": {
          "any": [
            {
              "flagAbsent": "bi.plan-a"
            },
            {
              "flagsAll": [
                "bi.plan-a",
                "bi.plan-b"
              ]
            }
          ]
        }
      },
      {
        "id": "b",
        "label": "通った登録を残す構成を考える",
        "unlock": {
          "any": [
            {
              "flagAbsent": "bi.plan-b"
            },
            {
              "flagsAll": [
                "bi.plan-a",
                "bi.plan-b"
              ]
            }
          ]
        }
      }
    ],
    "repeatable": true,
    "outcomes": [
      {
        "id": "recheck-a",
        "when": {
          "all": [
            {
              "questionIs": "a"
            },
            {
              "flagsAll": [
                "bi.plan-a"
              ]
            }
          ]
        },
        "minutes": 25,
        "scene": "03.recheck",
        "flags": [],
        "evidence": [],
        "gain": {}
      },
      {
        "id": "recheck-b",
        "when": {
          "all": [
            {
              "questionIs": "b"
            },
            {
              "flagsAll": [
                "bi.plan-b"
              ]
            }
          ]
        },
        "minutes": 25,
        "scene": "03.recheck",
        "flags": [],
        "evidence": [],
        "gain": {}
      },
      {
        "id": "a-update",
        "when": {
          "all": [
            {
              "questionIs": "a"
            },
            {
              "flagsAll": [
                "bi.plan-started"
              ]
            }
          ]
        },
        "minutes": 15,
        "scene": "03.plan-a",
        "flags": [
          "bi.plan-started",
          "bi.plan-a"
        ],
        "evidence": [
          "bi.plan-a"
        ],
        "gain": {
          "system": 1
        }
      },
      {
        "id": "a",
        "when": {
          "questionIs": "a"
        },
        "minutes": 15,
        "scene": "03.plan-a",
        "flags": [
          "bi.plan-started",
          "bi.plan-a"
        ],
        "evidence": [
          "bi.plan-a"
        ],
        "gain": {
          "system": 1
        }
      },
      {
        "id": "b-update",
        "when": {
          "all": [
            {
              "questionIs": "b"
            },
            {
              "flagsAll": [
                "bi.plan-started"
              ]
            }
          ]
        },
        "minutes": 15,
        "scene": "03.plan-b",
        "flags": [
          "bi.plan-started",
          "bi.plan-b"
        ],
        "evidence": [
          "bi.plan-b"
        ],
        "gain": {
          "system": 1
        }
      },
      {
        "id": "b",
        "when": {
          "questionIs": "b"
        },
        "minutes": 15,
        "scene": "03.plan-b",
        "flags": [
          "bi.plan-started",
          "bi.plan-b"
        ],
        "evidence": [
          "bi.plan-b"
        ],
        "gain": {
          "system": 1
        }
      },
      {
        "id": "legacy-both",
        "when": {
          "questionIs": "legacy-both"
        },
        "minutes": 25,
        "scene": "03.plan-both"
      }
    ]
  },
  {
    "id": "bi.estimate",
    "title": "分かった範囲で概算を出す",
    "description": "検討した案の大きな作業を積む。前提と未確認点も付ける。",
    "unlock": {
      "flagsAll": [
        "bi.plan-started"
      ]
    },
    "outcomes": [
      {
        "id": "recheck-update",
        "when": {
          "all": [
            {
              "flagsAll": [
                "bi.estimate-started"
              ]
            },
            {
              "any": [
                {
                  "all": [
                    {
                      "all": [
                        {
                          "flagsAll": [
                            "bi.plan-a"
                          ]
                        },
                        {
                          "evidenceAll": [
                            "bi.related",
                            "bi.notification"
                          ]
                        }
                      ]
                    },
                    {
                      "flagAbsent": "bi.estimated-a"
                    }
                  ]
                },
                {
                  "all": [
                    {
                      "all": [
                        {
                          "flagsAll": [
                            "bi.plan-b"
                          ]
                        },
                        {
                          "evidenceAll": [
                            "bi.related",
                            "bi.notification",
                            "bi.retry"
                          ]
                        }
                      ]
                    },
                    {
                      "flagAbsent": "bi.estimated-b"
                    }
                  ]
                }
              ]
            },
            {
              "all": [
                {
                  "flagsAll": [
                    "bi.estimated-a",
                    "bi.estimated-b"
                  ]
                }
              ]
            }
          ]
        },
        "minutes": 25,
        "scene": "03.recheck",
        "flags": [],
        "evidence": [],
        "gain": {}
      },
      {
        "id": "a-update",
        "when": {
          "all": [
            {
              "questionIs": "a"
            },
            {
              "all": [
                {
                  "flagsAll": [
                    "bi.estimate-started"
                  ]
                },
                {
                  "any": [
                    {
                      "all": [
                        {
                          "all": [
                            {
                              "flagsAll": [
                                "bi.plan-a"
                              ]
                            },
                            {
                              "evidenceAll": [
                                "bi.related",
                                "bi.notification"
                              ]
                            }
                          ]
                        },
                        {
                          "flagAbsent": "bi.estimated-a"
                        }
                      ]
                    },
                    {
                      "all": [
                        {
                          "all": [
                            {
                              "flagsAll": [
                                "bi.plan-b"
                              ]
                            },
                            {
                              "evidenceAll": [
                                "bi.related",
                                "bi.notification",
                                "bi.retry"
                              ]
                            }
                          ]
                        },
                        {
                          "flagAbsent": "bi.estimated-b"
                        }
                      ]
                    }
                  ]
                },
                {
                  "all": [
                    {
                      "all": [
                        {
                          "flagsAll": [
                            "bi.plan-a"
                          ]
                        },
                        {
                          "evidenceAll": [
                            "bi.related",
                            "bi.notification"
                          ]
                        }
                      ]
                    },
                    {
                      "flagAbsent": "bi.estimated-a"
                    }
                  ]
                }
              ]
            }
          ]
        },
        "minutes": 15,
        "scene": "03.estimate-a",
        "flags": [
          "bi.estimate-started",
          "bi.estimated-a"
        ],
        "evidence": [
          "bi.a"
        ],
        "gain": {
          "system": 1
        }
      },
      {
        "id": "b-update",
        "when": {
          "all": [
            {
              "questionIs": "b"
            },
            {
              "all": [
                {
                  "flagsAll": [
                    "bi.estimate-started"
                  ]
                },
                {
                  "any": [
                    {
                      "all": [
                        {
                          "all": [
                            {
                              "flagsAll": [
                                "bi.plan-a"
                              ]
                            },
                            {
                              "evidenceAll": [
                                "bi.related",
                                "bi.notification"
                              ]
                            }
                          ]
                        },
                        {
                          "flagAbsent": "bi.estimated-a"
                        }
                      ]
                    },
                    {
                      "all": [
                        {
                          "all": [
                            {
                              "flagsAll": [
                                "bi.plan-b"
                              ]
                            },
                            {
                              "evidenceAll": [
                                "bi.related",
                                "bi.notification",
                                "bi.retry"
                              ]
                            }
                          ]
                        },
                        {
                          "flagAbsent": "bi.estimated-b"
                        }
                      ]
                    }
                  ]
                },
                {
                  "all": [
                    {
                      "all": [
                        {
                          "flagsAll": [
                            "bi.plan-b"
                          ]
                        },
                        {
                          "evidenceAll": [
                            "bi.related",
                            "bi.notification",
                            "bi.retry"
                          ]
                        }
                      ]
                    },
                    {
                      "flagAbsent": "bi.estimated-b"
                    }
                  ]
                }
              ]
            }
          ]
        },
        "minutes": 15,
        "scene": "03.estimate-b",
        "flags": [
          "bi.estimate-started",
          "bi.estimated-b"
        ],
        "evidence": [
          "bi.b"
        ],
        "gain": {
          "system": 1
        }
      },
      {
        "id": "missing-structure-update",
        "when": {
          "all": [
            {
              "flagsAll": [
                "bi.estimate-started"
              ]
            },
            {
              "any": [
                {
                  "all": [
                    {
                      "all": [
                        {
                          "flagsAll": [
                            "bi.plan-a"
                          ]
                        },
                        {
                          "evidenceAll": [
                            "bi.related",
                            "bi.notification"
                          ]
                        }
                      ]
                    },
                    {
                      "flagAbsent": "bi.estimated-a"
                    }
                  ]
                },
                {
                  "all": [
                    {
                      "all": [
                        {
                          "flagsAll": [
                            "bi.plan-b"
                          ]
                        },
                        {
                          "evidenceAll": [
                            "bi.related",
                            "bi.notification",
                            "bi.retry"
                          ]
                        }
                      ]
                    },
                    {
                      "flagAbsent": "bi.estimated-b"
                    }
                  ]
                }
              ]
            },
            {
              "flagAbsent": "bi.related"
            }
          ]
        },
        "minutes": 15,
        "scene": "03.estimate-missing-structure",
        "flags": [
          "bi.estimate-started"
        ],
        "evidence": [],
        "gain": {}
      },
      {
        "id": "missing-notification-update",
        "when": {
          "all": [
            {
              "flagsAll": [
                "bi.estimate-started"
              ]
            },
            {
              "any": [
                {
                  "all": [
                    {
                      "all": [
                        {
                          "flagsAll": [
                            "bi.plan-a"
                          ]
                        },
                        {
                          "evidenceAll": [
                            "bi.related",
                            "bi.notification"
                          ]
                        }
                      ]
                    },
                    {
                      "flagAbsent": "bi.estimated-a"
                    }
                  ]
                },
                {
                  "all": [
                    {
                      "all": [
                        {
                          "flagsAll": [
                            "bi.plan-b"
                          ]
                        },
                        {
                          "evidenceAll": [
                            "bi.related",
                            "bi.notification",
                            "bi.retry"
                          ]
                        }
                      ]
                    },
                    {
                      "flagAbsent": "bi.estimated-b"
                    }
                  ]
                }
              ]
            },
            {
              "flagAbsent": "bi.notification"
            }
          ]
        },
        "minutes": 15,
        "scene": "03.estimate-missing-notification",
        "flags": [
          "bi.estimate-started"
        ],
        "evidence": [],
        "gain": {}
      },
      {
        "id": "missing-retry-update",
        "when": {
          "all": [
            {
              "flagsAll": [
                "bi.estimate-started"
              ]
            },
            {
              "any": [
                {
                  "all": [
                    {
                      "all": [
                        {
                          "flagsAll": [
                            "bi.plan-a"
                          ]
                        },
                        {
                          "evidenceAll": [
                            "bi.related",
                            "bi.notification"
                          ]
                        }
                      ]
                    },
                    {
                      "flagAbsent": "bi.estimated-a"
                    }
                  ]
                },
                {
                  "all": [
                    {
                      "all": [
                        {
                          "flagsAll": [
                            "bi.plan-b"
                          ]
                        },
                        {
                          "evidenceAll": [
                            "bi.related",
                            "bi.notification",
                            "bi.retry"
                          ]
                        }
                      ]
                    },
                    {
                      "flagAbsent": "bi.estimated-b"
                    }
                  ]
                }
              ]
            },
            {
              "all": [
                {
                  "flagsAll": [
                    "bi.plan-b"
                  ]
                },
                {
                  "flagAbsent": "bi.retry"
                }
              ]
            }
          ]
        },
        "minutes": 15,
        "scene": "03.estimate-missing-retry",
        "flags": [
          "bi.estimate-started"
        ],
        "evidence": [],
        "gain": {}
      },
      {
        "id": "recheck-one-update",
        "when": {
          "all": [
            {
              "flagsAll": [
                "bi.estimate-started"
              ]
            },
            {
              "any": [
                {
                  "all": [
                    {
                      "all": [
                        {
                          "flagsAll": [
                            "bi.plan-a"
                          ]
                        },
                        {
                          "evidenceAll": [
                            "bi.related",
                            "bi.notification"
                          ]
                        }
                      ]
                    },
                    {
                      "flagAbsent": "bi.estimated-a"
                    }
                  ]
                },
                {
                  "all": [
                    {
                      "all": [
                        {
                          "flagsAll": [
                            "bi.plan-b"
                          ]
                        },
                        {
                          "evidenceAll": [
                            "bi.related",
                            "bi.notification",
                            "bi.retry"
                          ]
                        }
                      ]
                    },
                    {
                      "flagAbsent": "bi.estimated-b"
                    }
                  ]
                }
              ]
            },
            {}
          ]
        },
        "minutes": 25,
        "scene": "03.recheck",
        "flags": [],
        "evidence": [],
        "gain": {}
      },
      {
        "id": "recheck",
        "when": {
          "all": [
            {
              "flagsAll": [
                "bi.estimated-a",
                "bi.estimated-b"
              ]
            }
          ]
        },
        "minutes": 25,
        "scene": "03.recheck",
        "flags": [],
        "evidence": [],
        "gain": {}
      },
      {
        "id": "a",
        "when": {
          "all": [
            {
              "questionIs": "a"
            },
            {
              "all": [
                {
                  "all": [
                    {
                      "flagsAll": [
                        "bi.plan-a"
                      ]
                    },
                    {
                      "evidenceAll": [
                        "bi.related",
                        "bi.notification"
                      ]
                    }
                  ]
                },
                {
                  "flagAbsent": "bi.estimated-a"
                }
              ]
            }
          ]
        },
        "minutes": 25,
        "scene": "03.estimate-a",
        "flags": [
          "bi.estimate-started",
          "bi.estimated-a"
        ],
        "evidence": [
          "bi.a"
        ],
        "gain": {
          "system": 1
        }
      },
      {
        "id": "b",
        "when": {
          "all": [
            {
              "questionIs": "b"
            },
            {
              "all": [
                {
                  "all": [
                    {
                      "flagsAll": [
                        "bi.plan-b"
                      ]
                    },
                    {
                      "evidenceAll": [
                        "bi.related",
                        "bi.notification",
                        "bi.retry"
                      ]
                    }
                  ]
                },
                {
                  "flagAbsent": "bi.estimated-b"
                }
              ]
            }
          ]
        },
        "minutes": 25,
        "scene": "03.estimate-b",
        "flags": [
          "bi.estimate-started",
          "bi.estimated-b"
        ],
        "evidence": [
          "bi.b"
        ],
        "gain": {
          "system": 1
        }
      },
      {
        "id": "missing-structure",
        "when": {
          "flagAbsent": "bi.related"
        },
        "minutes": 25,
        "scene": "03.estimate-missing-structure",
        "flags": [
          "bi.estimate-started"
        ],
        "evidence": [],
        "gain": {}
      },
      {
        "id": "missing-notification",
        "when": {
          "flagAbsent": "bi.notification"
        },
        "minutes": 25,
        "scene": "03.estimate-missing-notification",
        "flags": [
          "bi.estimate-started"
        ],
        "evidence": [],
        "gain": {}
      },
      {
        "id": "missing-retry",
        "when": {
          "all": [
            {
              "flagsAll": [
                "bi.plan-b"
              ]
            },
            {
              "flagAbsent": "bi.retry"
            }
          ]
        },
        "minutes": 25,
        "scene": "03.estimate-missing-retry",
        "flags": [
          "bi.estimate-started"
        ],
        "evidence": [],
        "gain": {}
      },
      {
        "id": "recheck-one",
        "when": {},
        "minutes": 25,
        "scene": "03.recheck",
        "flags": [],
        "evidence": [],
        "gain": {}
      },
      {
        "id": "legacy-both",
        "when": {
          "questionIs": "legacy-both"
        },
        "minutes": 25,
        "scene": "03.estimate-both"
      }
    ],
    "chooseQuestion": true,
    "choicePrompt": "どの処理案を見積もりますか？",
    "questionOptions": [
      {
        "id": "a",
        "label": "全件取り消す案を見積もる",
        "unlock": {
          "all": [
            {
              "flagsAll": [
                "bi.plan-a"
              ]
            },
            {
              "any": [
                {
                  "flagAbsent": "bi.estimated-a"
                },
                {
                  "flagsAll": [
                    "bi.estimated-b"
                  ]
                },
                {
                  "flagAbsent": "bi.plan-b"
                }
              ]
            }
          ]
        }
      },
      {
        "id": "b",
        "label": "正常な行を残す案を見積もる",
        "unlock": {
          "all": [
            {
              "flagsAll": [
                "bi.plan-b"
              ]
            },
            {
              "any": [
                {
                  "flagAbsent": "bi.estimated-b"
                },
                {
                  "flagsAll": [
                    "bi.estimated-a"
                  ]
                },
                {
                  "flagAbsent": "bi.plan-a"
                }
              ]
            }
          ]
        }
      }
    ]
  },
  {
    "id": "bi.estimate-update",
    "title": "追加で分かったことを概算へ反映する",
    "description": "新しい根拠や別案を反映する。詳細設計の完了までは待たない。",
    "unlock": {
      "flagsAll": [
        "bi.estimate-started"
      ]
    },
    "outcomes": [
      {
        "id": "recheck",
        "when": {
          "all": [
            {
              "flagsAll": [
                "bi.estimated-a",
                "bi.estimated-b"
              ]
            }
          ]
        },
        "minutes": 25,
        "scene": "03.recheck",
        "flags": [],
        "evidence": [],
        "gain": {}
      },
      {
        "id": "a",
        "when": {
          "all": [
            {
              "questionIs": "a"
            },
            {
              "all": [
                {
                  "all": [
                    {
                      "flagsAll": [
                        "bi.plan-a"
                      ]
                    },
                    {
                      "evidenceAll": [
                        "bi.related",
                        "bi.notification"
                      ]
                    }
                  ]
                },
                {
                  "flagAbsent": "bi.estimated-a"
                }
              ]
            }
          ]
        },
        "minutes": 15,
        "scene": "03.estimate-a",
        "flags": [
          "bi.estimate-started",
          "bi.estimated-a"
        ],
        "evidence": [
          "bi.a"
        ],
        "gain": {
          "system": 1
        }
      },
      {
        "id": "b",
        "when": {
          "all": [
            {
              "questionIs": "b"
            },
            {
              "all": [
                {
                  "all": [
                    {
                      "flagsAll": [
                        "bi.plan-b"
                      ]
                    },
                    {
                      "evidenceAll": [
                        "bi.related",
                        "bi.notification",
                        "bi.retry"
                      ]
                    }
                  ]
                },
                {
                  "flagAbsent": "bi.estimated-b"
                }
              ]
            }
          ]
        },
        "minutes": 15,
        "scene": "03.estimate-b",
        "flags": [
          "bi.estimate-started",
          "bi.estimated-b"
        ],
        "evidence": [
          "bi.b"
        ],
        "gain": {
          "system": 1
        }
      },
      {
        "id": "missing-structure",
        "when": {
          "flagAbsent": "bi.related"
        },
        "minutes": 15,
        "scene": "03.estimate-missing-structure",
        "flags": [
          "bi.estimate-started"
        ],
        "evidence": [],
        "gain": {}
      },
      {
        "id": "missing-notification",
        "when": {
          "flagAbsent": "bi.notification"
        },
        "minutes": 15,
        "scene": "03.estimate-missing-notification",
        "flags": [
          "bi.estimate-started"
        ],
        "evidence": [],
        "gain": {}
      },
      {
        "id": "missing-retry",
        "when": {
          "all": [
            {
              "flagsAll": [
                "bi.plan-b"
              ]
            },
            {
              "flagAbsent": "bi.retry"
            }
          ]
        },
        "minutes": 15,
        "scene": "03.estimate-missing-retry",
        "flags": [
          "bi.estimate-started"
        ],
        "evidence": [],
        "gain": {}
      },
      {
        "id": "recheck-one",
        "when": {},
        "minutes": 25,
        "scene": "03.recheck",
        "flags": [],
        "evidence": [],
        "gain": {}
      },
      {
        "id": "legacy-both",
        "when": {
          "questionIs": "legacy-both"
        },
        "minutes": 25,
        "scene": "03.estimate-both"
      }
    ],
    "chooseQuestion": true,
    "choicePrompt": "どの処理案を見積もりますか？",
    "questionOptions": [
      {
        "id": "a",
        "label": "全件取り消す案を見積もる",
        "unlock": {
          "all": [
            {
              "flagsAll": [
                "bi.plan-a"
              ]
            },
            {
              "any": [
                {
                  "flagAbsent": "bi.estimated-a"
                },
                {
                  "flagsAll": [
                    "bi.estimated-b"
                  ]
                },
                {
                  "flagAbsent": "bi.plan-b"
                }
              ]
            }
          ]
        }
      },
      {
        "id": "b",
        "label": "正常な行を残す案を見積もる",
        "unlock": {
          "all": [
            {
              "flagsAll": [
                "bi.plan-b"
              ]
            },
            {
              "any": [
                {
                  "flagAbsent": "bi.estimated-b"
                },
                {
                  "flagsAll": [
                    "bi.estimated-a"
                  ]
                },
                {
                  "flagAbsent": "bi.plan-a"
                }
              ]
            }
          ]
        }
      }
    ]
  },
  {
    "id": "bi.summary",
    "title": "担当への説明を組み立てる",
    "description": "手元の結果と未確認点を整理する。",
    "unlock": {
      "any": [
        {
          "evidenceAll": [
            "bi.work"
          ]
        },
        {
          "evidenceAll": [
            "bi.workbook"
          ]
        },
        {
          "evidenceAll": [
            "bi.screen"
          ]
        },
        {
          "evidenceAll": [
            "bi.source"
          ]
        },
        {
          "evidenceAll": [
            "bi.spec"
          ]
        }
      ]
    },
    "repeatable": true,
    "outcomes": [
      {
        "id": "default",
        "when": {
          "flagAbsent": "bi.summary"
        },
        "minutes": 15,
        "scene": "03.summary",
        "flags": [
          "bi.summary"
        ],
        "evidence": [],
        "gain": {}
      },
      {
        "id": "recheck",
        "when": {},
        "minutes": 15,
        "scene": "03.recheck",
        "complete": false
      }
    ]
  },
  {
    "id": "bi.libraries",
    "title": "CSVライブラリを比較する",
    "description": "読取形式と保守性、試験のしやすさを比べる。",
    "unlock": {
      "any": [
        {
          "evidenceAll": [
            "bi.screen"
          ]
        },
        {
          "evidenceAll": [
            "bi.source"
          ]
        }
      ]
    },
    "repeatable": true,
    "outcomes": [
      {
        "id": "default",
        "when": {
          "flagAbsent": "bi.libraries"
        },
        "minutes": 40,
        "scene": "03.libraries",
        "flags": [
          "bi.libraries"
        ],
        "evidence": [
          "bi.libraries"
        ],
        "gain": {
          "system": 1
        }
      },
      {
        "id": "recheck",
        "when": {},
        "minutes": 40,
        "scene": "03.recheck",
        "complete": false
      }
    ]
  },
  {
    "id": "bi.distributed",
    "title": "大量処理の構成を検討する",
    "description": "キューで分けて処理する場合の規模と管理を調べる。",
    "unlock": {
      "any": [
        {
          "evidenceAll": [
            "bi.source"
          ]
        },
        {
          "evidenceAll": [
            "bi.prototype"
          ]
        }
      ]
    },
    "repeatable": true,
    "outcomes": [
      {
        "id": "default",
        "when": {
          "flagAbsent": "bi.distributed"
        },
        "minutes": 60,
        "scene": "03.distributed",
        "flags": [
          "bi.distributed"
        ],
        "evidence": [
          "bi.distributed"
        ],
        "gain": {
          "system": 1
        }
      },
      {
        "id": "recheck",
        "when": {},
        "minutes": 60,
        "scene": "03.recheck",
        "complete": false
      }
    ]
  },
  {
    "id": "bi.tables",
    "title": "他部署の集計を追う",
    "description": "処理中に見つけた参照先が、修正対象に含まれるか調べる。",
    "unlock": {
      "any": [
        {
          "evidenceAll": [
            "bi.source"
          ]
        },
        {
          "evidenceAll": [
            "bi.related"
          ]
        }
      ]
    },
    "repeatable": true,
    "outcomes": [
      {
        "id": "default",
        "when": {
          "flagAbsent": "bi.tables"
        },
        "minutes": 45,
        "scene": "03.tables",
        "flags": [
          "bi.tables"
        ],
        "evidence": [
          "bi.tables"
        ],
        "gain": {
          "system": 1
        }
      },
      {
        "id": "recheck",
        "when": {},
        "minutes": 45,
        "scene": "03.recheck",
        "complete": false
      }
    ]
  },
  {
    "id": "bi.macro-check",
    "title": "前処理マクロの適用範囲を確かめる",
    "description": "整形の補助と、作成・保守に必要な仕事を調べる。",
    "unlock": {
      "any": [
        {
          "evidenceAll": [
            "bi.mapping"
          ]
        },
        {
          "evidenceAll": [
            "bi.macro"
          ]
        }
      ]
    },
    "repeatable": true,
    "outcomes": [
      {
        "id": "default",
        "when": {
          "flagAbsent": "bi.macro-check"
        },
        "minutes": 25,
        "scene": "03.macro-check",
        "flags": [
          "bi.macro-check"
        ],
        "evidence": [
          "bi.macro-check"
        ],
        "gain": {
          "business": 1
        }
      },
      {
        "id": "recheck",
        "when": {},
        "minutes": 25,
        "scene": "03.recheck",
        "complete": false
      }
    ]
  },
  {
    "id": "bi.detail",
    "title": "結果画面と例外の詳細設計を進める",
    "description": "概算の先に残る設計と試験項目を洗い出す。",
    "unlock": {
      "flagsAll": [
        "bi.estimate-started"
      ]
    },
    "repeatable": true,
    "outcomes": [
      {
        "id": "default",
        "when": {
          "flagAbsent": "bi.detail"
        },
        "minutes": 60,
        "scene": "03.detail",
        "flags": [
          "bi.detail"
        ],
        "evidence": [
          "bi.detail"
        ],
        "gain": {
          "system": 1
        }
      },
      {
        "id": "recheck",
        "when": {},
        "minutes": 60,
        "scene": "03.recheck",
        "complete": false
      }
    ]
  },
  {
    "id": "bi.ask-makabe",
    "title": "真壁に相談する",
    "description": "分かったことを持って相談する。相手の予定や話題によって反応が変わる。",
    "unlock": {},
    "repeatable": true,
    "chooseQuestion": true,
    "choicePrompt": "何を相談しますか？",
    "questionOptions": [
      {
        "id": "general",
        "label": "一括登録の作り方を聞く",
        "unlock": {}
      },
      {
        "id": "technical",
        "label": "登録の確定や試作の結果について話す",
        "unlock": {
          "any": [
            {
              "evidenceAll": [
                "bi.prototype"
              ]
            },
            {
              "evidenceAll": [
                "bi.related"
              ]
            }
          ]
        }
      },
      {
        "id": "estimate",
        "label": "概算と、担当に残る作業について話す",
        "unlock": {
          "any": [
            {
              "evidenceAll": [
                "bi.a"
              ]
            },
            {
              "evidenceAll": [
                "bi.b"
              ]
            }
          ]
        }
      },
      {
        "id": "excel",
        "label": "Excelの列や表記の違いについて話す",
        "unlock": {
          "any": [
            {
              "evidenceAll": [
                "bi.work"
              ]
            },
            {
              "evidenceAll": [
                "bi.workbook"
              ]
            },
            {
              "evidenceAll": [
                "bi.mapping"
              ]
            }
          ]
        }
      }
    ],
    "outcomes": [
      {
        "id": "busy",
        "when": {
          "availabilityIn": [
            "incident",
            "meeting"
          ]
        },
        "minutes": 10,
        "scene": "03.makabe-busy",
        "flags": [],
        "evidence": [],
        "gain": {}
      },
      {
        "id": "macro",
        "when": {
          "all": [
            {
              "questionIs": "excel"
            },
            {
              "flagAbsent": "bi.macro-heard"
            }
          ]
        },
        "minutes": 15,
        "scene": "03.makabe-macro",
        "flags": [
          "bi.macro-heard"
        ],
        "evidence": [
          "bi.macro"
        ],
        "gain": {
          "business": 1
        }
      },
      {
        "id": "excel-again",
        "when": {
          "questionIs": "excel"
        },
        "minutes": 15,
        "scene": "03.makabe-again",
        "flags": [],
        "evidence": [],
        "gain": {}
      },
      {
        "id": "ready",
        "when": {
          "all": [
            {
              "questionIs": "estimate"
            },
            {
              "evidenceAll": [
                "bi.a",
                "bi.b",
                "bi.business"
              ]
            }
          ]
        },
        "minutes": 10,
        "scene": "03.makabe-ready",
        "flags": [],
        "evidence": [],
        "gain": {}
      },
      {
        "id": "costs",
        "when": {
          "questionIs": "estimate"
        },
        "minutes": 10,
        "scene": "03.makabe-costs",
        "flags": [],
        "evidence": [],
        "gain": {}
      },
      {
        "id": "incident",
        "when": {
          "all": [
            {
              "questionIs": "technical"
            },
            {
              "flagAbsent": "bi.incident-heard"
            }
          ]
        },
        "minutes": 15,
        "scene": "03.makabe-incident",
        "flags": [
          "bi.incident-heard"
        ],
        "evidence": [],
        "gain": {
          "system": 1
        }
      },
      {
        "id": "incident-again",
        "when": {
          "questionIs": "technical"
        },
        "minutes": 15,
        "scene": "03.makabe-again",
        "flags": [],
        "evidence": [],
        "gain": {}
      },
      {
        "id": "vague",
        "when": {},
        "minutes": 35,
        "scene": "03.makabe-vague",
        "flags": [],
        "evidence": [],
        "gain": {}
      }
    ]
  },
  {
    "id": "bi.progress",
    "title": "真壁に途中報告",
    "description": "確認できた事実と残っている確認を共有する。",
    "unlock": {},
    "repeatable": true,
    "outcomes": [
      {
        "id": "busy",
        "when": {
          "availabilityIn": [
            "incident",
            "meeting"
          ]
        },
        "minutes": 30,
        "scene": "03.progress-busy",
        "flags": [],
        "evidence": [],
        "gain": {},
        "progressReported": true
      },
      {
        "id": "ready",
        "when": {
          "evidenceAll": [
            "bi.a",
            "bi.b",
            "bi.business"
          ]
        },
        "minutes": 30,
        "scene": "03.progress-ready",
        "flags": [],
        "evidence": [],
        "gain": {},
        "progressReported": true
      },
      {
        "id": "scope",
        "when": {
          "any": [
            {
              "evidenceAll": [
                "bi.a"
              ]
            },
            {
              "evidenceAll": [
                "bi.b"
              ]
            }
          ]
        },
        "minutes": 30,
        "scene": "03.progress-scope",
        "flags": [],
        "evidence": [],
        "gain": {},
        "progressReported": true
      },
      {
        "id": "trial",
        "when": {
          "evidenceAll": [
            "bi.prototype"
          ]
        },
        "minutes": 30,
        "scene": "03.progress-trial",
        "flags": [],
        "evidence": [],
        "gain": {},
        "progressReported": true
      },
      {
        "id": "early",
        "when": {},
        "minutes": 30,
        "scene": "03.progress-early",
        "flags": [],
        "evidence": [],
        "gain": {},
        "progressReported": true
      }
    ]
  },
  {
    "id": "bi.lunch",
    "title": "昼休憩",
    "description": "人間的生活に必要。しっかり食べて、ひと息つこう。",
    "unlock": {},
    "repeatable": true,
    "outcomes": [
      {
        "id": "default",
        "when": {
          "flagAbsent": "bi.lunch"
        },
        "minutes": 60,
        "scene": "03.lunch",
        "flags": [
          "bi.lunch"
        ],
        "evidence": [],
        "gain": {}
      },
      {
        "id": "recheck",
        "when": {},
        "minutes": 60,
        "scene": "03.recheck",
        "complete": false
      }
    ]
  }
]
```

## derivedEvidence

```json
[
  {
    "id": "bi.business",
    "when": {
      "evidenceAll": [
        "bi.csv-ready",
        "bi.operations"
      ]
    }
  }
]
```

## dailyActions

```json
[
  "bi.lunch",
  "bi.progress"
]
```

## lunchAction

```json
"bi.lunch"
```

## coffeeAction

```json
"bi.coffee"
```

## help

```json
{
  "cards": [
    {
      "id": "bi.coffee",
      "title": "コーヒーを飲む",
      "unlock": {},
      "usesPerLoop": 1,
      "outcomes": [
        {
          "id": "default",
          "when": {},
          "minutes": 5,
          "scene": "03.coffee"
        }
      ]
    }
  ]
}
```

## loop

```json
{
  "memoryCandidates": [],
  "maxMemories": 0,
  "intuitionGainPerNewMemoryLoop": 0
}
```

## questions

```json
[
  {
    "id": "bi.report",
    "prompt": "一括登録の件、作り方と見積もりを伺えますか？\nこちらで何を準備して、間違いがあったら何をやり直すのかも教えてください。",
    "slots": 3,
    "minutes": 10,
    "elements": [
      {
        "id": "a",
        "when": {
          "selectedAll": [
            "bi.a"
          ]
        }
      },
      {
        "id": "b",
        "when": {
          "selectedAll": [
            "bi.b"
          ]
        }
      },
      {
        "id": "business",
        "when": {
          "selectedAny": [
            "bi.business"
          ]
        }
      }
    ],
    "primaryWhen": {
      "selectedAll": [
        "bi.a",
        "bi.b"
      ]
    },
    "relevant": {
      "selectedAny": [
        "bi.request",
        "bi.work",
        "bi.workbook",
        "bi.screen",
        "bi.source",
        "bi.spec",
        "bi.mapping",
        "bi.csv-ready",
        "bi.operations",
        "bi.business",
        "bi.prototype",
        "bi.related",
        "bi.notification",
        "bi.notification-trial",
        "bi.retry",
        "bi.plan-a",
        "bi.plan-b",
        "bi.a",
        "bi.b",
        "bi.libraries",
        "bi.distributed",
        "bi.tables",
        "bi.macro",
        "bi.macro-check",
        "bi.detail"
      ]
    },
    "reactions": [
      "03.report-0",
      "03.report-csv",
      "03.report-operation",
      "03.report-3"
    ],
    "feedbackReactions": [
      {
        "when": {
          "selectedAll": [
            "bi.a",
            "bi.b"
          ]
        },
        "scene": "03.report-operation"
      },
      {
        "when": {
          "selectedAll": [
            "bi.a"
          ]
        },
        "scene": "03.report-only-a"
      },
      {
        "when": {
          "selectedAll": [
            "bi.b"
          ]
        },
        "scene": "03.report-only-b"
      },
      {
        "when": {},
        "scene": "03.report-csv"
      }
    ],
    "reject": [],
    "accept": [],
    "fallback": "03.report-0"
  }
]
```
