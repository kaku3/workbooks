# 第2面：承認画面へのボタン追加（問題）

編集の正本。仕様は [第2面仕様 v2](../chapter2-v2/10_第2面仕様.md) を参照。

導入に合わせ、今回は修正候補の列挙で終了せず、三田と対象を確認してから見積もりの根拠を報告する。業務・再申請・状態を調べ、権限または通知を確認すると「三田と今回の修正範囲を確認する」が開く。確認後の手がかりは、今回含める改修と含めない対応を示す。金額・納期の数値は正解条件にしない。

## schemaVersion

```json
1
```

## caseId

```json
"approval-button"
```

## version

```json
1
```

## status

```json
"prototype"
```

## title

```json
"承認画面へのボタン追加"
```

## requestMemo

```json
"経理から、承認画面に差戻しボタンを追加してほしいとの依頼。\n\n「ボタン一個だから簡単」と思われているが、本当にそうなのかは分からない。"
```

## requestMemoTitle

```json
"承認画面への差戻しボタン追加"
```

## requestPurpose

```json
"実現したいことと必要な修正範囲を調査し、適正な見積もりの根拠を佐伯さんに説明する。"
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
    "max": 8
  },
  "system": {
    "initial": 0,
    "max": 10
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
    "id": "ab.requested",
    "title": "差戻しボタンの依頼",
    "text": "承認画面への追加依頼。何を解決したいかは未確認。",
    "kind": "confirmed",
    "source": "差戻しボタンの依頼"
  },
  {
    "id": "ab.screen",
    "title": "承認画面の構成",
    "text": "操作欄に追加できる。差戻し後の扱いは記載なし。",
    "kind": "reference",
    "source": "承認画面の構成"
  },
  {
    "id": "ab.pain",
    "title": "再入力と別連絡が負担",
    "text": "軽微な不備でも再入力。修正依頼は別メールで連絡。",
    "kind": "confirmed",
    "source": "再入力と別連絡が負担"
  },
  {
    "id": "ab.current",
    "title": "却下後は再編集できない",
    "text": "却下は申請を終了させる。修正・再提出の経路はない。",
    "kind": "confirmed",
    "source": "却下後は再編集できない"
  },
  {
    "id": "ab.source",
    "title": "承認処理の経路",
    "text": "受付と状態更新の処理を確認。差戻しは画面以外も改修が必要。",
    "kind": "confirmed",
    "source": "承認処理の経路"
  },
  {
    "id": "ab.ui",
    "title": "ボタンは配置できる",
    "text": "配置と理由入力の案。押した後の処理は別に確認が必要。",
    "kind": "proposal",
    "source": "ボタンは配置できる"
  },
  {
    "id": "ab.api",
    "title": "APIの変更候補",
    "text": "操作受付と状態更新も改修候補。業務ルールを確認して見積もる。",
    "kind": "proposal",
    "source": "APIの変更候補"
  },
  {
    "id": "ab.state",
    "title": "状態の追加が必要",
    "text": "差戻し中・再申請を区別する。承認の再開条件は要確認。",
    "kind": "confirmed",
    "source": "状態の追加が必要"
  },
  {
    "id": "ab.access",
    "title": "編集できる人の確認",
    "text": "差戻し状態と編集権限も改修。直せる項目を確認して見積もる。",
    "kind": "confirmed",
    "source": "編集できる人の確認"
  },
  {
    "id": "ab.notice",
    "title": "通知と履歴も関係する",
    "text": "状態・通知・履歴も改修。通知先を確認して見積もる。",
    "kind": "confirmed",
    "source": "通知と履歴も関係する"
  },
  {
    "id": "ab.flow",
    "title": "修正して再申請したい",
    "text": "差戻し→申請者が修正→再申請→改めて承認判断。",
    "kind": "confirmed",
    "source": "修正して再申請したい"
  },
  {
    "id": "ab.return-flow",
    "title": "差戻し後の業務フロー",
    "text": "理由を付けて戻し、申請者が修正・再申請して再承認。",
    "kind": "confirmed",
    "source": "差戻し後の業務フロー"
  },
  {
    "id": "ab.design",
    "title": "実装方式の比較",
    "text": "複数案に利点と制約がある。要件確定後に方式を選ぶ。",
    "kind": "proposal",
    "source": "実装方式の比較"
  },
  {
    "id": "ab.ai",
    "title": "AIの実装案",
    "text": "ボタン・API・通知の一般案。現場の確認はまだ。",
    "kind": "proposal",
    "source": "AIの実装案"
  },
  {
    "id": "ab.purpose-summary",
    "title": "再入力と別連絡を減らしたい",
    "text": "却下で終了する現状を変え、不備の修正と再提出を楽にする。",
    "kind": "confirmed",
    "source": "再入力と別連絡を減らしたい"
  },
  {
    "id": "ab.impact-summary",
    "title": "見積もりに含める修正",
    "text": "修正・再承認・通知・履歴が対象。承認済み申請の変更は含めない。",
    "kind": "confirmed",
    "source": "ボタン以外にも変更が及ぶ"
  },
  {
    "id": "ab.agreed-scope",
    "title": "三田と確認した今回の対象",
    "text": "差戻し中だけ編集可。元の経路で再承認し、本人と承認者へ通知。",
    "kind": "confirmed",
    "source": "三田への修正範囲の確認"
  }
]
```

## investigations

```json
[
  {
    "id": "ab.request",
    "title": "依頼と現状を確認する",
    "description": "佐伯から届いた依頼を読み直す。",
    "unlock": {},
    "outcomes": [
      {
        "id": "default",
        "when": {},
        "minutes": 20,
        "scene": "02.request",
        "flags": [
          "ab.request"
        ],
        "evidence": [
          "ab.requested"
        ],
        "gain": {
          "business": 1
        }
      }
    ]
  },
  {
    "id": "ab.screen",
    "title": "画面仕様書を読む",
    "description": "承認画面の構成と操作を調べる。",
    "unlock": {},
    "outcomes": [
      {
        "id": "recheck",
        "when": {
          "flagsAll": [
            "ab.screen"
          ]
        },
        "minutes": 20,
        "scene": "02.screen-recheck",
        "complete": false
      },
      {
        "id": "default",
        "when": {},
        "minutes": 20,
        "scene": "02.screen",
        "flags": [
          "ab.screen"
        ],
        "evidence": [
          "ab.screen"
        ],
        "gain": {
          "system": 1
        }
      }
    ],
    "repeatable": true,
    "repeatHint": "追加で調べ直す"
  },
  {
    "id": "ab.business",
    "title": "経理の三田に確認する",
    "description": "不備のある申請をどう扱いたいか聞く。",
    "unlock": {},
    "outcomes": [
      {
        "id": "default",
        "when": {},
        "minutes": 30,
        "scene": "02.business",
        "flags": [
          "ab.business"
        ],
        "evidence": [
          "ab.pain"
        ],
        "gain": {
          "business": 1
        }
      }
    ]
  },
  {
    "id": "ab.workflow",
    "title": "現行フローを確認する",
    "description": "却下後の申請がどうなるか調べる。",
    "unlock": {},
    "outcomes": [
      {
        "id": "default",
        "when": {},
        "minutes": 30,
        "scene": "02.workflow",
        "flags": [
          "ab.workflow"
        ],
        "evidence": [
          "ab.current"
        ],
        "gain": {
          "business": 1
        }
      }
    ]
  },
  {
    "id": "ab.source",
    "title": "ソースを解析する",
    "description": "画面・API・状態処理のつながりを見る。",
    "unlock": {},
    "outcomes": [
      {
        "id": "recheck",
        "when": {
          "flagsAll": [
            "ab.source"
          ]
        },
        "minutes": 60,
        "scene": "02.source-recheck",
        "complete": false
      },
      {
        "id": "default",
        "when": {},
        "minutes": 60,
        "scene": "02.source",
        "flags": [
          "ab.source"
        ],
        "evidence": [
          "ab.source"
        ],
        "gain": {
          "system": 2
        }
      }
    ],
    "repeatable": true,
    "repeatHint": "追加で調べ直す"
  },
  {
    "id": "ab.ui",
    "title": "ボタン配置を検討する",
    "description": "誤操作を避ける配置と確認画面を考える。",
    "unlock": {
      "flagsAll": [
        "ab.screen"
      ]
    },
    "outcomes": [
      {
        "id": "recheck",
        "when": {
          "flagsAll": [
            "ab.ui"
          ]
        },
        "minutes": 45,
        "scene": "02.ui-recheck",
        "complete": false
      },
      {
        "id": "default",
        "when": {},
        "minutes": 45,
        "scene": "02.ui",
        "flags": [
          "ab.ui"
        ],
        "evidence": [
          "ab.ui"
        ],
        "gain": {
          "system": 1
        }
      }
    ],
    "repeatable": true,
    "repeatHint": "追加で調べ直す"
  },
  {
    "id": "ab.api",
    "title": "APIの改修点を調べる",
    "description": "差戻し操作を受け付ける処理を確認する。",
    "unlock": {
      "flagsAll": [
        "ab.source"
      ]
    },
    "outcomes": [
      {
        "id": "recheck",
        "when": {
          "flagsAll": [
            "ab.api"
          ]
        },
        "minutes": 60,
        "scene": "02.api-recheck",
        "complete": false
      },
      {
        "id": "default",
        "when": {},
        "minutes": 60,
        "scene": "02.api",
        "flags": [
          "ab.api"
        ],
        "evidence": [
          "ab.api"
        ],
        "gain": {
          "system": 2
        }
      }
    ],
    "repeatable": true,
    "repeatHint": "追加で調べ直す"
  },
  {
    "id": "ab.state",
    "title": "状態遷移を調べる",
    "description": "差戻しと却下を区別して追う。",
    "unlock": {
      "any": [
        {
          "flagsAll": [
            "ab.workflow"
          ]
        },
        {
          "flagsAll": [
            "ab.source"
          ]
        }
      ]
    },
    "outcomes": [
      {
        "id": "default",
        "when": {},
        "minutes": 40,
        "scene": "02.state",
        "flags": [
          "ab.state"
        ],
        "evidence": [
          "ab.state"
        ],
        "gain": {
          "system": 1,
          "business": 1
        }
      }
    ]
  },
  {
    "id": "ab.permission",
    "title": "編集権限を調べる",
    "description": "誰が、いつ、どこまで編集できるか調べる。",
    "unlock": {
      "flagsAll": [
        "ab.state"
      ]
    },
    "outcomes": [
      {
        "id": "default",
        "when": {},
        "minutes": 35,
        "scene": "02.permission",
        "flags": [
          "ab.permission"
        ],
        "evidence": [
          "ab.access"
        ],
        "gain": {
          "system": 1
        }
      }
    ]
  },
  {
    "id": "ab.notification",
    "title": "通知と履歴を調べる",
    "description": "理由を伝え、操作の記録を残す経路を調べる。",
    "unlock": {
      "flagsAll": [
        "ab.state"
      ]
    },
    "outcomes": [
      {
        "id": "default",
        "when": {},
        "minutes": 40,
        "scene": "02.notification",
        "flags": [
          "ab.notification"
        ],
        "evidence": [
          "ab.notice"
        ],
        "gain": {
          "system": 1
        }
      }
    ]
  },
  {
    "id": "ab.reapply",
    "title": "再申請の経路を確認する",
    "description": "修正後、誰が次の判断をするか確認する。",
    "unlock": {
      "any": [
        {
          "flagsAll": [
            "ab.business"
          ]
        },
        {
          "flagsAll": [
            "ab.state"
          ]
        }
      ]
    },
    "outcomes": [
      {
        "id": "default",
        "when": {},
        "minutes": 35,
        "scene": "02.reapply",
        "flags": [
          "ab.reapply"
        ],
        "evidence": [
          "ab.flow",
          "ab.return-flow"
        ],
        "gain": {
          "business": 1
        }
      }
    ]
  },
  {
    "id": "ab.design",
    "title": "実装方式を比較する",
    "description": "複数の実装案の利点と制約を比較する。",
    "unlock": {
      "any": [
        {
          "flagsAll": [
            "ab.api"
          ]
        },
        {
          "flagsAll": [
            "ab.ui"
          ]
        }
      ]
    },
    "outcomes": [
      {
        "id": "recheck",
        "when": {
          "flagsAll": [
            "ab.design"
          ]
        },
        "minutes": 90,
        "scene": "02.design-recheck",
        "complete": false
      },
      {
        "id": "default",
        "when": {},
        "minutes": 90,
        "scene": "02.design",
        "flags": [
          "ab.design"
        ],
        "evidence": [
          "ab.design"
        ],
        "gain": {
          "system": 2
        }
      }
    ],
    "repeatable": true,
    "repeatHint": "追加で調べ直す"
  },
  {
    "id": "ab.ai",
    "title": "AIに聞く",
    "description": "差戻し機能の一般的な実装例を聞く。",
    "unlock": {},
    "outcomes": [
      {
        "id": "recheck",
        "when": {
          "flagsAll": [
            "ab.ai"
          ]
        },
        "minutes": 5,
        "scene": "02.ai-recheck",
        "complete": false
      },
      {
        "id": "default",
        "when": {},
        "minutes": 5,
        "scene": "02.ai",
        "flags": [
          "ab.ai"
        ],
        "evidence": [
          "ab.ai"
        ],
        "gain": {
          "system": 1
        }
      }
    ],
    "repeatable": true,
    "repeatHint": "追加で調べ直す"
  },
  {
    "id": "ab.ask-makabe",
    "title": "真壁に聞く",
    "description": "先輩に差戻しの相談をする。",
    "unlock": {},
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
        "scene": "02.makabe-busy",
        "complete": false
      },
      {
        "id": "prepared",
        "when": {
          "flagsAll": [
            "ab.business",
            "ab.reapply"
          ]
        },
        "minutes": 10,
        "scene": "02.ask-makabe",
        "gain": {
          "business": 1
        }
      },
      {
        "id": "default",
        "when": {},
        "minutes": 45,
        "scene": "02.makabe-vague",
        "complete": false,
        "flags": [
          "ab.ask-makabe"
        ],
        "evidence": [],
        "gain": {}
      }
    ]
  },
  {
    "id": "ab.lunch",
    "title": "昼休憩",
    "description": "人間的生活に必要。しっかり食べて、ひと息つこう。",
    "unlock": {},
    "outcomes": [
      {
        "id": "default",
        "when": {},
        "minutes": 60,
        "scene": "02.lunch",
        "flags": [
          "ab.lunch"
        ],
        "evidence": [],
        "gain": {}
      }
    ]
  },
  {
    "id": "ab.progress",
    "title": "真壁に途中報告",
    "description": "確認できたことと、残っている確認を共有する。",
    "unlock": {},
    "outcomes": [
      {
        "id": "default",
        "when": {},
        "minutes": 30,
        "scene": "02.progress",
        "flags": [
          "ab.progress"
        ],
        "evidence": [],
        "gain": {},
        "progressReported": true
      }
    ]
  },
  {
    "id": "ab.confirm-scope",
    "title": "三田と今回の修正範囲を確認する",
    "description": "調べた改修点をもとに、今回どこまで対応するかを確認する。",
    "unlock": {
      "all": [
        {
          "flagsAll": [
            "ab.business",
            "ab.reapply",
            "ab.state"
          ]
        },
        {
          "any": [
            {
              "flagsAll": [
                "ab.permission"
              ]
            },
            {
              "flagsAll": [
                "ab.notification"
              ]
            }
          ]
        }
      ]
    },
    "outcomes": [
      {
        "id": "default",
        "when": {},
        "minutes": 30,
        "scene": "02.confirm-scope",
        "flags": [
          "ab.scope-agreed"
        ],
        "evidence": [
          "ab.agreed-scope"
        ],
        "gain": {
          "business": 1
        }
      }
    ]
  }
]
```

## derivedEvidence

```json
[
  {
    "id": "ab.purpose-summary",
    "when": {
      "flagsAll": [
        "ab.business",
        "ab.workflow"
      ]
    }
  },
  {
    "id": "ab.impact-summary",
    "when": {
      "flagsAll": [
        "ab.scope-agreed"
      ]
    }
  }
]
```

## dailyActions

```json
[
  "ab.lunch",
  "ab.progress"
]
```

## lunchAction

```json
"ab.lunch"
```

## coffeeAction

```json
"ab.coffee"
```

## help

```json
{
  "cards": [
    {
      "id": "ab.coffee",
      "title": "コーヒーを飲む",
      "unlock": {},
      "usesPerLoop": 1,
      "outcomes": [
        {
          "id": "default",
          "when": {},
          "minutes": 5,
          "scene": "02.coffee"
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
    "id": "ab.report",
    "prompt": "差戻しボタンの見積もり、お願いします。\n経理が実現したいことと、今回どこまで直す見積もりなのか、説明していただけますか？",
    "slots": 3,
    "minutes": 10,
    "elements": [
      {
        "id": "purpose",
        "when": {
          "selectedAny": [
            "ab.pain",
            "ab.purpose-summary"
          ]
        }
      },
      {
        "id": "workflow",
        "when": {
          "selectedAny": [
            "ab.flow",
            "ab.return-flow"
          ]
        }
      },
      {
        "id": "scope",
        "when": {
          "all": [
            {
              "flagsAll": [
                "ab.scope-agreed"
              ]
            },
            {
              "selectedAny": [
                "ab.impact-summary",
                "ab.agreed-scope"
              ]
            }
          ]
        }
      }
    ],
    "primaryElement": "purpose",
    "primaryWhen": {
      "all": [
        {
          "selectedAny": [
            "ab.pain",
            "ab.purpose-summary"
          ]
        },
        {
          "selectedAny": [
            "ab.flow",
            "ab.return-flow"
          ]
        }
      ]
    },
    "relevant": {
      "selectedAny": [
        "ab.requested",
        "ab.screen",
        "ab.pain",
        "ab.current",
        "ab.source",
        "ab.state",
        "ab.access",
        "ab.notice",
        "ab.flow",
        "ab.return-flow",
        "ab.purpose-summary",
        "ab.impact-summary",
        "ab.agreed-scope"
      ]
    },
    "reactions": [
      "02.report-0",
      "02.report-1",
      "02.report-2",
      "02.report-3"
    ],
    "reject": [],
    "accept": [],
    "fallback": "02.report-0",
    "missingReactions": {
      "purpose": "02.report-purpose",
      "workflow": "02.report-workflow",
      "scope": "02.report-scope"
    }
  }
]
```
