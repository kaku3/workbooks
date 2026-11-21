// Generated from docs Markdown. Do not edit.
export const cases = {
  "watermark": {
    "scenario": {
      "schemaVersion": 1,
      "caseId": "watermark",
      "version": 2,
      "status": "prototype",
      "characters": [
        {
          "id": "player",
          "name": "主人公"
        },
        {
          "id": "sales",
          "name": "折原"
        },
        {
          "id": "client",
          "name": "佐伯"
        },
        {
          "id": "lead",
          "name": "真壁"
        },
        {
          "id": "ai",
          "name": "社内AI"
        }
      ],
      "scenes": {
        "01.no-progress": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "kind": "thought",
              "text": "この作業意味あるかな・・・？"
            }
          ]
        },
        "01.intro": {
          "version": 2,
          "lines": [
            {
              "speaker": "client",
              "text": "経理の三田から、取引先に提出用に印刷したPDFの資料に、**田中太郎**という透かしが入ると問い合わせがありまして。"
            },
            {
              "speaker": "client",
              "text": "調べたところ、田中太郎という社員は5年前に退職していて今はいなくて。"
            },
            {
              "speaker": "lead",
              "kind": "thought",
              "text": "…これ、5年間、誰も気づかなかったのか…？"
            },
            {
              "speaker": "sales",
              "text": "**田中さんの亡霊**のしわざですかね～"
            },
            {
              "speaker": "client",
              "text": "…何が起きているのか調べてください。\n**今日18時までに、**原因と根拠、どこまで影響して何を対応するか、報告をお願いします。"
            },
            {
              "speaker": "lead",
              "text": "分かりました。まず三田さんの印刷資料と、出力したときの記録を確認します。\n**こいつが**"
            },
            {
              "speaker": "player",
              "text": "**え！？**"
            },
            {
              "speaker": "lead",
              "text": "Backlogにチケット切っておいたから。\n着手する時は**作業中**に、完了したと思ったら**完了**にチケットを移動して。"
            }
          ]
        },
        "01.case": {
          "version": 2,
          "lines": [
            {
              "speaker": "client",
              "text": "三田から届いた印刷資料がこちらです。\nウォーターマークは田中太郎になっています。取引先に提出する前に気づいたそうです。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "取引先に提出前って、印刷してその場で気づかないのかな…\n**しかも5年も…**"
            },
            {
              "speaker": "client",
              "text": "何かいいましたか？"
            },
            {
              "speaker": "player",
              "text": "いえ、べつに！\n田中さんはやっぱり退職なさっているんですよね？"
            },
            {
              "speaker": "client",
              "text": "ええ、田中は5年前に退職して、そのときにアカウントも無効化されているようです。"
            }
          ]
        },
        "01.docs-overview": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "画面仕様書、外部連携書、詳細設計書があるな…。\nうわっ、**あちこちに【TBD】が残ったまま**だ。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "全部読むのは大変だな…今回の件に関係ありそうなのは…。"
            }
          ]
        },
        "01.docs-screen": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "画面右上はログイン利用者名、PDFの透かしは出力した利用者の氏名と書かれている。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "さすがに透かしに田中太郎を出す仕様ではなかったな。まあ、そりゃそうか。\n**コードがどうなってるかは分からないけど。**"
            }
          ]
        },
        "01.docs-external": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "出力APIから帳票サービスを呼ぶ構成らしい。\n**『こういう構成はローカルから呼べなくて困る』**と死んだばーちゃんが言ってたな。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "とりあえずサーバー側のアタリはついた。\n出力APIのあたりから見るか。"
            }
          ]
        },
        "01.docs-detail": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "PDFの透かしにはwatermarkNameという氏名オプションがある。\n未設定時の説明は**【TBD】**。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "【TBD】…めっちゃ腹が立つけど、俺の資料も遠くの空の下で誰かの腹を立てているかもしれないな。\nソースでwatermarkNameを検索してみよう。"
            }
          ]
        },
        "01.source-overview": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "バックエンド、フロントエンド、共通処理の置き場所は分かった。\n大したことないアプリに見えるのにすごい量のソースだ。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "時計の針の音が大きく聞こえる気がする。俺のスマホの時計からはそんな音は鳴らないけど。"
            }
          ]
        },
        "01.backend": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "帳票サービスを呼び出している箇所が見つかった。\nここからPDF生成処理とテンプレート設定を確認できそうだ。"
            }
          ]
        },
        "01.backend-wide": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "認証、受注処理、出力API……広く追って1時間。ようやく帳票サービスに着いた。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "……帳票から見てたら楽だったんだけどな。\n普通気づかないよなぁ。"
            }
          ]
        },
        "01.frontend": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "画面仕様を頼りにソースを追った。PDF出力はバックエンドのAPIを呼んでいるだけらしい。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "画面側には透かしを付ける処理はなさそうだな。"
            }
          ]
        },
        "01.frontend-wide": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "画面の操作から順番にソースを追った。PDF出力はバックエンドのAPIを呼んでいるだけらしい。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "……何度も操作を繰り返すと『視えて』くるんだよな。\n時間はかかるけど。"
            }
          ]
        },
        "01.common-miss": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "日付の書式、文字列の整形、禁則文字。\nいくら読んでも、今回の透かしとは関係なさそうな処理ばかりだった。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "……45分。小学校の授業の１コマが消えた。"
            }
          ]
        },
        "01.pdf-source": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "**// FIXME : watermarkNameが空なら田中太郎**"
            },
            {
              "speaker": "player",
              "text": "…見つけた…これだ…。\nあとは何でwatermarkNameが空のままここまで来るかが分かれば…"
            }
          ]
        },
        "01.settings": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "帳票サービスの設定ファイルを開いた。\n標準テンプレートのwatermarkNameが空欄になっている。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "え…設定漏れ…いつから…？\n何にしてもこのテンプレで印刷したら…**田中太郎が…出るッ。**"
            }
          ]
        },
        "01.logs": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "印刷資料に対応するPDFの出力記録は、三田さんのID U-204の最近の操作と一致していた。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "これで三田さんが操作したことが確定した。\nやはり**田中の亡霊**ではなかったか。"
            }
          ]
        },
        "01.logs-wide": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "何万行もある巨大なログだ。\n『PDF』で検索してもヒットしすぎて分からない。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "４５分。\n……先に印刷処理のソース見とけばよかったかな。"
            }
          ]
        },
        "01.debug": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "印刷ロジック手前でブレークポイントを張って止めた。\nウォッチウィンドウのID表示は三田さんのIDのU-204。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "デバッガのウォッチウィンドウを使いこなしているのは同期では俺だけだと思う。この会社に同期はいないけど。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "ログイン情報はバックエンドまで届いている。\n印刷ロジックより先が怪しそうだ。"
            }
          ]
        },
        "01.debug-wide": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "印刷ボタンからAPI呼び出しまでステップ実行をした。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "４５分。クリックしすぎて指が痛い。"
            }
          ]
        },
        "01.verify": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "調査用に用意してもらったアカウントで印刷してみた。\n**田中太郎の透かしが入っている。**"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "俺が印刷しても田中太郎じゃん……。\nなんで三田さんしか気づかないんだ…？"
            }
          ]
        },
        "01.response": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "状況を整理するか…\n直接の原因はテンプレートが**なぜか**空欄なこと。\n誰かがうっかりやらかしたけど**三田さん以外は気づいていない。**"
            },
            {
              "speaker": "lead",
              "text": "悪意ある整理だな。\nいつから田中太郎の亡霊が暴れ始めたかも調べて、佐伯さん向けの報告を用意しておけ。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "悪意あるかな…？"
            }
          ]
        },
        "01.ai": {
          "version": 1,
          "lines": [
            {
              "speaker": "ai",
              "text": "古い名前が残る場合、ブラウザキャッシュや保存済みプロフィールが原因という一般例があります。\nAIは間違えることがあります。重要な情報は確認してください。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "それっぽい。\nでも三田さんが田中太郎をキャッシュするのは考えにくい。"
            }
          ]
        },
        "01.legacy": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "田中太郎は導入資料にも載っていた。\n画面キャプチャの説明がとても丁寧だ。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "１時間。今のPDFがどう作られたかは、まだ分からない。"
            }
          ]
        },
        "01.makabe-busy": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "何から調べればいいですか？"
            },
            {
              "speaker": "lead",
              "text": "ごめん、何の話？……ていうか、質問の仕方ってあるよな？\n忙しい人を相手にする時は要点を（ｒｙ"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "４５分。……結局、何を調べればいいか聞けなかった。"
            }
          ]
        },
        "01.makabe-away": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "kind": "thought",
              "text": "真壁さんは会議中か。手元の調査を進めよう。"
            }
          ]
        },
        "01.makabe-vague": {
          "version": 2,
          "lines": [
            {
              "speaker": "lead",
              "text": "印刷した利用者と透かしの氏名が違うんだよな。\nで、実際に何が出てるかは確認したのか？"
            }
          ]
        },
        "01.makabe-specific": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "ログから三田さんのIDで印刷しているのは確認できました。"
            },
            {
              "speaker": "lead",
              "text": "じゃあ、少なくとも出力記録には正しいIDが残ってるわけだ。\nその先を追ってみればいいんじゃないか。印刷処理まわり。"
            }
          ]
        },
        "01.coffee-none": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "kind": "thought",
              "text": "コーヒーを飲んだ。……うまい。PDFの中身は変わらなかった。"
            }
          ]
        },
        "01.clear": {
          "version": 3,
          "lines": [
            {
              "speaker": "client",
              "text": "これで三田に返事ができます。\n最初は、退職した方が今も資料を出せるのかと心配していたんです。\n調べていただいて、助かりました！"
            },
            {
              "speaker": "lead",
              "text": "よし、お疲れ。あとの段取りは俺の方でやっとく。"
            },
            {
              "speaker": "player",
              "text": "ありがとうございます。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "……確認して、お客さんへの回答、難しいなあ。"
            }
          ]
        },
        "01.timeout": {
          "version": 1,
          "lines": [
            {
              "speaker": "client",
              "text": "部署から、調査結果はまだかと連絡が来ています。\nPDFの件、回答できますか？"
            },
            {
              "speaker": "player",
              "text": "すみません。\nまだ報告をまとめられていないです。"
            }
          ]
        },
        "01.report-progress": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "途中経過をご報告します。\nいくつか確認できたことはあるんですが、原因はまだ分かっていません。"
            },
            {
              "speaker": "client",
              "text": "分かりました。調査中として部署に共有します。\n期限に間に合わなそうなら、早めに相談してくださいね。"
            }
          ]
        },
        "01.report-cannot": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "すみません。今日中には原因が分かりそうにありません。\n今分かっていることを報告しますので、もう少し時間をいただけませんか？"
            },
            {
              "speaker": "client",
              "text": "今日中と伝えているので困りますが、分からないものは仕方ないですね。\nまず、今の状況を教えてください。"
            }
          ]
        },
        "01.extension": {
          "version": 2,
          "lines": [
            {
              "speaker": "lead",
              "text": "佐伯さんには俺の方で報告しておいたから。\n調査期間を一日のばしてもらった、明日も頑張れ。"
            },
            {
              "speaker": "player",
              "text": "ありがとうございます。\n今日の調査を引き継いで、明日こそ報告します。"
            }
          ]
        },
        "01.gameover": {
          "version": 2,
          "lines": [
            {
              "speaker": "lead",
              "text": "おい、期限まで何をしていたんだ！\n途中報告もせず、黙って抱え込んでどうする！"
            },
            {
              "speaker": "lead",
              "text": "間に合わないなら、その時点で言え！\nこっちは先方への説明も、応援の手配もできないだろ！"
            },
            {
              "speaker": "lead",
              "text": "分からないことを責めているんじゃない。\n状況を伝えないまま期限を過ぎたことを言っているんだ！"
            },
            {
              "speaker": "lead",
              "text": "今回の担当はここまでだ。\n調査した内容をまとめて引き継げ。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "途中で真壁さんに相談しておくべきだった……。"
            }
          ]
        },
        "01.extension-used": {
          "version": 1,
          "lines": [
            {
              "speaker": "client",
              "text": "追加の一日まで調整しましたが、今回はここまでにしましょう。調査した事実と未確認事項を引き継いでください。"
            }
          ]
        },
        "01.next-day": {
          "version": 1,
          "lines": [
            {
              "speaker": "lead",
              "text": "昨日の続きから。記録は残っている。\n今日は原因と根拠、対応を報告できるところまで詰めよう。"
            },
            {
              "speaker": "player",
              "text": "はい。まだ裏付けのないところから確認します。"
            }
          ]
        },
        "01.dream": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "kind": "thought",
              "text": "夢ならよかった。でも調査は現実だ。"
            }
          ]
        },
        "01.report-0": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "えーと……PDFのレンダリング処理がサーバー側で、出力オプションというものがありまして……。"
            },
            {
              "speaker": "client",
              "text": "すみません、何をおっしゃっているのか、ちょっと分からないのですが……。\n三田の資料には何が起きているのでしょう？"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "調べた仕組みを並べただけになってしまった。\n問い合わせと結び付く根拠から組み立てよう。"
            }
          ]
        },
        "01.report-1": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "田中さんがいつ退職したかとか、透かしの処理とかは調べたんですが……。\nまだ原因は分かっていません。"
            },
            {
              "speaker": "client",
              "text": "そうですか……。\n三田には、まだ調査中と伝えておけばいいでしょうか？"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "いろいろ調べたんだけどなあ……。"
            }
          ]
        },
        "01.report-2": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "印刷したのは三田さんで、透かしだけ田中太郎になっていました。\n田中さん本人が印刷したわけではなさそうです。"
            },
            {
              "speaker": "client",
              "text": "それは分かったんですが……。\nどうして田中さんの名前が出るんでしょう？"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "……そこがまだ説明できないんだよなあ。"
            }
          ]
        },
        "01.report-3": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "印刷したのは三田さんですが、透かしだけ田中太郎になっていました。"
            },
            {
              "speaker": "player",
              "text": "透かしの名前が未設定だと、サンプル名の田中太郎が使われるのが原因でした。\nこちらでも再現しています。"
            },
            {
              "speaker": "player",
              "text": "今回確認できたのは名前の誤表示です。\nほかの帳票への影響はまだ調べていません。"
            },
            {
              "speaker": "player",
              "text": "印刷した人の名前が入るよう修正し、提出済みの資料も確認します。\n修正の日程は別途ご相談させてください。"
            },
            {
              "speaker": "client",
              "text": "ああ、そういうことだったんですね！\n三田にも説明できそうです。ありがとうございます！"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "……なんとか伝わったみたいだ。"
            }
          ]
        },
        "01.lunch": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "kind": "thought",
              "text": "そろそろ昼休憩。人間的生活に必要な一時間だ。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "ごはんを食べて、少し休んだ。調査に戻ろう。"
            }
          ]
        },
        "01.makabe-progress": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "真壁さん、途中報告です。\n確認できたことと、まだ裏付けがない点、残った調査を共有します。"
            },
            {
              "speaker": "lead",
              "text": "分かった。\n途中で状況を伝えてくれれば、こっちも先方への説明や期限の相談ができる。\n引き続き調べてくれ。"
            }
          ]
        },
        "meeting.muted": {
          "version": 1,
          "lines": [
            {
              "speaker": "client",
              "text": "マイクミュートでしゃべってますか？"
            },
            {
              "speaker": "player",
              "text": "あ、すいません、ミュートでした。"
            }
          ]
        }
      },
      "chat": [
        {
          "id": "01.chat.01",
          "at": "09:00",
          "speaker": "lead",
          "text": "佐伯さんより依頼された件、調査、報告よろしく"
        },
        {
          "id": "01.chat.02",
          "at": "09:15",
          "speaker": "lead",
          "text": "再現しない"
        },
        {
          "id": "01.chat.03",
          "at": "09:30",
          "speaker": "lead",
          "text": "再現した"
        },
        {
          "id": "01.chat.04",
          "at": "09:45",
          "speaker": "lead",
          "text": "再現しなくなった"
        },
        {
          "id": "01.chat.05",
          "at": "10:00",
          "speaker": "lead",
          "text": "原因わかった。俺だった"
        },
        {
          "id": "01.chat.06",
          "at": "10:30",
          "speaker": "lead",
          "text": "障害対応ひと段落。記録だけ残す。"
        },
        {
          "id": "01.chat.07",
          "at": "10:45",
          "speaker": "lead",
          "text": "コーヒーがない"
        },
        {
          "id": "01.chat.08",
          "at": "11:15",
          "speaker": "lead",
          "text": "別件の共通処理、誰が書いたんだこれ"
        },
        {
          "id": "01.chat.09",
          "at": "11:20",
          "speaker": "lead",
          "text": "俺だった"
        },
        {
          "id": "01.chat.10",
          "at": "12:00",
          "speaker": "client",
          "text": "三田の印刷資料に別の氏名の透かしが入る件、原因と対応の調査状況を共有してください。"
        },
        {
          "id": "01.chat.11",
          "at": "13:00",
          "speaker": "lead",
          "text": "会議終了。次回も会議することが決まった。これから別会議。"
        },
        {
          "id": "01.chat.12",
          "at": "14:00",
          "speaker": "lead",
          "text": "会議から戻った。作業再開。"
        },
        {
          "id": "01.chat.13",
          "at": "16:30",
          "speaker": "client",
          "text": "三田の印刷資料に別の氏名の透かしが入る件、原因と対応の調査状況を共有してください。"
        }
      ],
      "schedules": {
        "lead": [
          {
            "from": "09:00",
            "to": "10:30",
            "state": "incident"
          },
          {
            "from": "10:30",
            "to": "10:45",
            "state": "working"
          },
          {
            "from": "10:45",
            "to": "11:15",
            "state": "available"
          },
          {
            "from": "11:15",
            "to": "12:00",
            "state": "related"
          },
          {
            "from": "12:00",
            "to": "13:00",
            "state": "working"
          },
          {
            "from": "13:00",
            "to": "14:00",
            "state": "meeting"
          },
          {
            "from": "14:00",
            "to": "18:00",
            "state": "working"
          }
        ]
      },
      "events": {
        "intro": "01.intro",
        "noProgress": "01.no-progress",
        "clear": "01.clear",
        "timeout": "01.timeout",
        "progress": "01.report-progress",
        "cannot": "01.report-cannot",
        "extension": "01.extension",
        "gameover": "01.gameover",
        "extensionUsed": "01.extension-used",
        "nextDay": "01.next-day",
        "dream": "01.dream",
        "microphoneMuted": "meeting.muted"
      },
      "legacyScenes": {
        "01.q1-pass": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "三田さんが印刷した資料には田中太郎の透かしがありますが、出力記録は三田さんのU-204と一致します。\n田中さんは５年前に退職し、アカウントも無効です。実行利用者と透かしの氏名が食い違っています。"
            },
            {
              "speaker": "client",
              "text": "やはり三田の操作なのに、別の氏名が透かしに入るんですね。\nでは、その原因をお願いします。"
            }
          ]
        },
        "01.q2-pass": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "透かしの氏名が未設定のとき、田中太郎というサンプル名を補うコードが残っていました。\n実行時も三田さんのIDとは別にその値が入り、別利用者でも同じ透かしを再現しました。"
            },
            {
              "speaker": "lead",
              "text": "文字列を見つけただけでなく、実際にその処理で透かしが誤ることまで確認できているな。"
            }
          ]
        },
        "01.q3-pass": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "透かしの氏名が未設定だと、サンプル名の田中太郎が使われるのが原因でした。\n印刷時に利用者名を設定する修正と、提出済み資料の確認を提案します。\nほかの帳票への影響はまだ分かっていません。"
            },
            {
              "speaker": "client",
              "text": "分かりました。三田にも共有します。\n取引先に出す資料なので、修正の日程も相談させてください。"
            }
          ]
        },
        "01.q1-guess": {
          "version": 1,
          "lines": [
            {
              "speaker": "client",
              "text": "キャッシュかもしれない、という一般論だけでは今回の説明になりません。\n現物と記録、実際の処理で確認できたことはありますか？"
            }
          ]
        },
        "01.q2-guess": {
          "version": 1,
          "lines": [
            {
              "speaker": "lead",
              "text": "キャッシュかもしれない、という一般論だけでは今回の説明になりません。\n現物と記録、実際の処理で確認できたことはありますか？"
            }
          ]
        },
        "01.q3-guess": {
          "version": 1,
          "lines": [
            {
              "speaker": "client",
              "text": "キャッシュかもしれない、という一般論だけでは今回の説明になりません。\n現物と記録、実際の処理で確認できたことはありますか？"
            }
          ]
        },
        "01.q1-missing": {
          "version": 2,
          "lines": [
            {
              "speaker": "client",
              "text": "三田が印刷した資料の透かし、田中さんの退職記録、三田の出力操作。\nこの三つを照合した結果を教えてください。"
            }
          ]
        },
        "01.q2-missing": {
          "version": 1,
          "lines": [
            {
              "speaker": "lead",
              "text": "疑わしい場所は分かった。\n原因だと、コードだけでなく実行時の値と再現結果で言えるか？"
            }
          ]
        },
        "01.q3-missing": {
          "version": 1,
          "lines": [
            {
              "speaker": "client",
              "text": "原因の話は分かりました。\nどこまで確認できていて、何を対応すると部署に伝えればいいんですか？ 全部大丈夫という話ではないんですよね？"
            }
          ]
        }
      }
    },
    "problem": {
      "schemaVersion": 1,
      "caseId": "watermark",
      "version": 2,
      "status": "prototype",
      "title": "田中太郎の亡霊",
      "requestMemo": "経理の三田が取引先提出用にPDF資料を印刷したところ、５年前に退職した田中太郎の氏名がウォーターマーク（透かし）として入る。三田の名前が入る想定との食い違いについて、今日18:00までに原因と根拠、確認できた影響と対応案を報告する。本番修正と提出先の全件確認は今回の調査範囲外。",
      "clock": {
        "start": "09:00",
        "deadline": "18:00"
      },
      "knowledge": {
        "business": {
          "initial": 0,
          "max": 5
        },
        "system": {
          "initial": 0,
          "max": 8
        }
      },
      "evidence": [
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
          "title": "透かしへの利用者名設定案",
          "text": "印刷時に利用者名を設定。別利用者で試験し、提出済み資料も確認。本番未修正。",
          "source": "再現結果に基づくウォーターマークの対応案",
          "kind": "proposal"
        },
        {
          "id": "wm.frontend",
          "title": "画面には透かし生成はない",
          "text": "画面からはバックエンド側の印字リクエスト呼び出しのみ。",
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
      ],
      "investigations": [
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
              "id": "documented-overview",
              "when": {
                "flagsAll": [
                  "wm.docs-map"
                ]
              },
              "minutes": 30,
              "scene": "01.source-overview",
              "gain": {
                "system": 1
              },
              "flags": [
                "wm.source-map"
              ]
            },
            {
              "id": "overview",
              "when": {},
              "minutes": 120,
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
              "id": "documented-trace",
              "when": {
                "flagsAll": [
                  "wm.external-read"
                ],
                "evidenceAll": [
                  "wm.logs"
                ]
              },
              "minutes": 20,
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
              "id": "prepared",
              "when": {
                "flagsAll": [
                  "wm.external-read"
                ]
              },
              "minutes": 60,
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
              "minutes": 90,
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
              "minutes": 180,
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
              "minutes": 120,
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
              "minutes": 120,
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
        },
        {
          "id": "wm.lunch",
          "title": "昼休憩",
          "description": "人間的生活に必要。しっかり食べて、ひと息つこう。",
          "unlock": {},
          "outcomes": [
            {
              "id": "default",
              "when": {},
              "minutes": 60,
              "scene": "01.lunch"
            }
          ]
        },
        {
          "id": "wm.progress",
          "title": "真壁に途中報告",
          "description": "確認できたことと残った調査を共有し、期限について相談する。",
          "unlock": {},
          "outcomes": [
            {
              "id": "default",
              "when": {},
              "minutes": 30,
              "scene": "01.makabe-progress",
              "progressReported": true
            }
          ]
        }
      ],
      "questions": [
        {
          "id": "wm.report",
          "to": "client",
          "prompt": "PDF印刷のウォーターマークの件\n現象、影響範囲、対策の報告をお願いします。",
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
      ],
      "help": {
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
      },
      "loop": {
        "memoryCandidates": [
          "wm.case",
          "wm.logs",
          "wm.defaults"
        ],
        "maxMemories": 3
      },
      "authorNotes": [
        "人物・障害・コード・ログはすべて架空。透かしの氏名だけで実行利用者を断定しない。",
        "仕様書から画面・外部・詳細の3枚、ソースからバックエンド・フロントエンド・共通の3枚を解放する。PDF生成処理はバックエンドを読んだ後だけ表示する。",
        "画面仕様書はフロントエンド45mから20m、外部設計書はバックエンド60mから30m、詳細設計書はPDF45mから20m。ログで絞ったバックエンドは40m。仕様書だけでは原因を確定しない。",
        "ログ・デバッガは反復可能。準備なしは45mで有用な根拠なし、準備後は30m。再実行でも同じ結果の報酬は重複させない。効果のない調査と反復道具はイベント後に未着手へ戻す。",
        "報告は確認できた原因・影響・是正案を事実に沿って説明する。個人への推測を避け、未確認事項を隠して会社を守る展開にはしない。"
      ]
    }
  },
  "approval-button": {
    "scenario": {
      "schemaVersion": 1,
      "caseId": "approval-button",
      "version": 1,
      "status": "prototype",
      "characters": [
        {
          "id": "player",
          "name": "主人公"
        },
        {
          "id": "sales",
          "name": "折原"
        },
        {
          "id": "client",
          "name": "佐伯"
        },
        {
          "id": "lead",
          "name": "真壁"
        },
        {
          "id": "ai",
          "name": "社内AI"
        },
        {
          "id": "accountant",
          "name": "三田"
        }
      ],
      "scenes": {
        "02.no-progress": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "kind": "thought",
              "text": "この作業意味あるかな・・・？"
            }
          ]
        },
        "02.intro": {
          "version": 2,
          "lines": [
            {
              "speaker": "client",
              "text": "経理から、承認画面にボタンを一個追加してほしいって言われてまして。\n見積もりを頂けますか？"
            },
            {
              "speaker": "player",
              "text": "何のボタンですか？"
            },
            {
              "speaker": "client",
              "text": "差戻しです。\n**ボタン一個なので、そんなにかからないですよね？**"
            },
            {
              "speaker": "player",
              "text": "……確認して、回答します。"
            },
            {
              "speaker": "lead",
              "kind": "thought",
              "text": "差戻しボタンって、だいぶ面倒だけど……。\nワークフローや通知があったり、戻した後はどこで編集できるかとか、やること多いけど見えにくいんだよなぁ……。"
            },
            {
              "speaker": "lead",
              "kind": "thought",
              "text": "**ご想像よりお高い見積もり**になるのは間違いないとして…\nまずは、経理のご要望を確認して…修正範囲を確定して見積もり根拠を準備して回答しないとだな。"
            }
          ]
        },
        "02.request": {
          "version": 1,
          "lines": [
            {
              "speaker": "client",
              "text": "この承認と却下ボタンの横に、差戻しボタンを追加したいそうです。\n**ボタン一個分の見積もり**でお願いできれば、と。"
            }
          ]
        },
        "02.screen": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "現行画面は承認と却下だけだ。\n**却下ボタンをコピペしてラベルを変えれば**いいのか？"
            }
          ]
        },
        "02.business": {
          "version": 1,
          "lines": [
            {
              "speaker": "accountant",
              "text": "ちょっとした間違いでも、却下をすると別途申請するしかなくて。\nメールで再度の申請をお願いすると、「ただでさえ入力項目が多くて面倒なのに１からやり直しか」とクレームがくるんですよね。"
            },
            {
              "speaker": "player",
              "text": "間違いだけを修正して、もう一度出せるようにしたいんですね。"
            },
            {
              "speaker": "accountant",
              "text": "そうです。できれば再申請の依頼も自動で送ってほしいです。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "申請画面で差し戻された時の内容を表示できるようにすれば…あれ…申請画面にどっから遷移させるんだ？"
            }
          ]
        },
        "02.workflow": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "却下で申請は終了する。\n却下された申請を見る方法はない。当然再編集もできない。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "**自分で使うと思うと**あり得ない仕様だと思うけど、\n**仕事で仕様書の通り作っている時は**何も感じないのなんでだろう。"
            }
          ]
        },
        "02.source": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "画面操作からAPI、バックエンドでステータス更新。よくあるWebアプリだ。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "昔ならこれだけ読めたら**フルスタックエンジニア**と言われて高い給料もらえたんだろうな…"
            }
          ]
        },
        "02.ui": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "却下時は却下理由を入力するモーダルが表示されるのか。\n差戻しもこの処理を**コピペ**で作れそうだな。"
            }
          ]
        },
        "02.api": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "ステータス変更のAPIはそのまま使えそうだ。差戻しのステータスは新たに追加しないとだな。\n差し戻された申請の扱いの仕様を作れば見積れるか。"
            }
          ]
        },
        "02.state": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "差戻し中の状態を分け、修正して再申請した後に承認判断へ戻す必要がある。"
            }
          ]
        },
        "02.permission": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "差戻し中に申請者だけが編集できる画面が必要だ。\n申請履歴画面から遷移して再申請できればいいのかを業務側に確認しよう。"
            }
          ]
        },
        "02.notification": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "差戻し理由を申請者へ伝え、修正・再申請の記録を残す必要がある。\nメール通知も作るのは簡単だけど、このサービスで使えるメールサーバーあるのかな？"
            }
          ]
        },
        "02.reapply": {
          "version": 1,
          "lines": [
            {
              "speaker": "accountant",
              "text": "申請者に直してもらって、もう一度承認をお願いします。"
            },
            {
              "speaker": "player",
              "text": "差戻し、修正、再申請、承認の順ですね。\n再申請をどこから行うかは別途確認します。"
            }
          ]
        },
        "02.design": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "kind": "thought",
              "text": "あれ…却下された申請を再申請できるようにするだけでいいんじゃないか？\n業務ルールはどうなっているんだっけ？"
            }
          ]
        },
        "02.ai": {
          "version": 1,
          "lines": [
            {
              "speaker": "ai",
              "text": "ボタン、受付API、差戻し状態、通知などが実装候補です。\n現場の業務ルールは別途確認してください。"
            }
          ]
        },
        "02.ask-makabe": {
          "version": 1,
          "lines": [
            {
              "speaker": "lead",
              "text": "申請者に戻して再申請か。\n編集できる画面と、申請をどこからやり直すかも聞いておいてくれ。"
            },
            {
              "speaker": "player",
              "text": "はい。そこはまだなので、確認してきます。"
            }
          ]
        },
        "02.makabe-busy": {
          "version": 1,
          "lines": [
            {
              "speaker": "lead",
              "text": "今ちょっと別件に入ってる。\n分かったところを先にまとめておいてくれ。"
            }
          ]
        },
        "02.makabe-vague": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "差戻しボタンって、却下ボタンの右と左どっちに置いたらいいですか？"
            },
            {
              "speaker": "lead",
              "text": "[却下][差戻][承認]の順がいいかな。\n却下は取り返しがつかないから承認から遠くに置きたい。UIデザインは奥が深いんだよな…面白いよな…なあ…。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "話を聞いていたら、４５分経っていた。\n三田さんに聞けばすぐに決めてくれたかな…。"
            }
          ]
        },
        "02.lunch": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "kind": "thought",
              "text": "ごはんを食べて、少し休んだ。調査に戻ろう。"
            }
          ]
        },
        "02.progress": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "分かったことと、まだ確認が必要な点を共有します。"
            },
            {
              "speaker": "lead",
              "text": "了解。先方への話はこっちでも進めるから、調査よろしく。"
            }
          ]
        },
        "02.report-0": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "調査内容を資料にまとめました。"
            },
            {
              "speaker": "client",
              "text": "すみません、何をおっしゃっているのか、ちょっと分からないのですが……。"
            }
          ]
        },
        "02.report-1": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "画面にボタンを追加して、APIを呼ぶ方法は確認しました。"
            },
            {
              "speaker": "client",
              "text": "追加できるのは分かりました。\nでは、**ボタン一個分の見積もり**でお願いできますか？"
            }
          ]
        },
        "02.report-2": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "不備のある申請を差戻し、直して再提出できるようにしたい、というのがご依頼事項のようでした。"
            },
            {
              "speaker": "client",
              "text": "そうなんですね。\n…それで、予算枠には収まる感じでしょうか？"
            },
            {
              "speaker": "sales",
              "text": "１０万円でできるよね？"
            },
            {
              "speaker": "player",
              "text": "折原さんすいません、黙っててもらっていいですか？"
            }
          ]
        },
        "02.report-3": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "今の却下は、メールで却下したことを連絡して、申請者に最初から入力をし直してもらうのですよね？"
            },
            {
              "speaker": "client",
              "text": "ええ、そうですね。\nそれがなにか？"
            },
            {
              "speaker": "player",
              "text": "**ボタン一つで**やりたいことは、それをもっと楽にすることらしいです。"
            },
            {
              "speaker": "client",
              "text": "え？\n**今でも別に困っていないし**、楽になんてならないでしょ？"
            },
            {
              "speaker": "player",
              "text": "一から申請しなおしではなく、間違ったところだけ直して出せるとしたら・・・？"
            },
            {
              "speaker": "client",
              "text": "**！！**\nそんなことできるんですか？"
            },
            {
              "speaker": "player",
              "text": "はい。三田さんにも確認しました。\n修正して再申請できるようにして、通知や履歴も対応します。"
            },
            {
              "speaker": "client",
              "text": "なるほど、三田さんが言うなら楽になるんでしょうね。\n…でも、**結構かかるんですよね？**"
            },
            {
              "speaker": "player",
              "text": "そうですね、ボタンだけじゃなかったですからね…確認して回答しますね。\nあ、メールサーバーは御社側でご用意お願いします。"
            }
          ]
        },
        "02.clear": {
          "version": 1,
          "lines": [
            {
              "speaker": "lead",
              "text": "お疲れ。\nその範囲なら作業を洗い出せるな。見積もり、まとめよう。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "差戻しボタン、めんどうくさいんだな…。"
            }
          ]
        },
        "02.timeout": {
          "version": 1,
          "lines": [
            {
              "speaker": "client",
              "text": "経理から連絡が来ています。差戻しボタンの件、どう説明すればいいでしょう？"
            },
            {
              "speaker": "player",
              "text": "すみません。\n差戻した後の使い方と、ボタン以外に直すところを整理できていません。"
            },
            {
              "effect": "blackout"
            }
          ]
        },
        "02.report-progress": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "途中経過です。\n差戻し後の業務と、追加の確認が必要な範囲を整理しています。"
            },
            {
              "speaker": "client",
              "text": "調査中として部署に共有します。\n期限に間に合わないようなら、先に相談してくださいね。"
            }
          ]
        },
        "02.report-cannot": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "期限までに整理できなそうです。\n申し訳ないのですが期限を相談させていただくことは可能でしょうか。"
            },
            {
              "speaker": "client",
              "text": "今日中と伝えているので困りますが、一旦現在までの調査結果の共有をお願いします。"
            }
          ]
        },
        "02.extension": {
          "version": 2,
          "lines": [
            {
              "speaker": "lead",
              "text": "佐伯さんには俺の方で報告しておいたから。\n調査期間を一日のばしてもらった、明日も頑張れ。"
            },
            {
              "speaker": "player",
              "text": "ありがとうございます。\n今日の調査を引き継いで、明日こそ報告します。"
            }
          ]
        },
        "02.gameover": {
          "version": 2,
          "lines": [
            {
              "speaker": "lead",
              "text": "おい、期限まで何をしていたんだ！\n**途中報告もせず、黙って抱え込んでどうする！**"
            },
            {
              "speaker": "lead",
              "text": "間に合わないなら、その時点で言え！\nこっちは先方への説明も、応援の手配もできないだろ！"
            },
            {
              "speaker": "lead",
              "text": "分からないことを責めているんじゃない。\n**状況を伝えないまま期限を過ぎたことを言っているんだ！**"
            },
            {
              "speaker": "lead",
              "text": "今回の担当はここまでだ。\n調査した内容をまとめて引き継げ。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "途中で真壁さんに相談しておくべきだった……。"
            }
          ]
        },
        "02.extension-used": {
          "version": 1,
          "lines": [
            {
              "speaker": "client",
              "text": "追加の一日まで調整しましたが、今回はここまでにしましょう。\n調査した事実と未確認事項を引き継いでください。"
            }
          ]
        },
        "02.next-day": {
          "version": 1,
          "lines": [
            {
              "speaker": "lead",
              "text": "昨日の続きから。記録は残っている。\n今日は戻した後の仕事と、ボタン以外に直すところを詰めよう。"
            },
            {
              "speaker": "player",
              "text": "はい。まだ裏付けのないところから確認します。"
            }
          ]
        },
        "02.dream": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "kind": "thought",
              "text": "夢ならよかった。でも調査は現実だ。"
            }
          ]
        },
        "02.coffee": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "kind": "thought",
              "text": "ひと息ついて、調査に戻ろう。"
            }
          ]
        },
        "02.api-recheck": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "APIの受付と状態更新を追い直したが、新しい条件は見つからなかった。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "これ以上は調べても何も分からなそうだ。"
            }
          ]
        },
        "02.ui-recheck": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "配置と確認画面を見直したが、押した後の仕事について新しく分かったことはない。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "これ以上は調べても何も分からなそうだ。"
            }
          ]
        },
        "02.design-recheck": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "方式を比べ直したが、新しい根拠は増えなかった。\n業務側に確認する条件が残っている。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "これ以上は調べても何も分からなそうだ。"
            }
          ]
        },
        "02.ai-recheck": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "聞き直したけど、さっきと同じ一般的な案だった。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "これ以上は調べても何も分からなそうだ。"
            }
          ]
        },
        "02.report-purpose": {
          "version": 1,
          "lines": [
            {
              "speaker": "client",
              "text": "追加できるのは分かりました。\nでは、ボタン一個分の見積もりでお願いできますか？"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "佐伯さん、開発のこと理解してくれないんだよなぁ。\n業務目線でエモく伝えればいいのか？"
            }
          ]
        },
        "02.report-workflow": {
          "version": 1,
          "lines": [
            {
              "speaker": "client",
              "text": "不便なのは分かりました。\nそれを直すのにそんなに費用かかるんですか？"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "**指一本動かしても金を取れ**って研修で習ったけど……。\nどう説明したら納得してもらえるんだろう。\n**細かい話は聞いてくれなそうだしなぁ……。**"
            }
          ]
        },
        "02.report-scope": {
          "version": 1,
          "lines": [
            {
              "speaker": "client",
              "text": "直すところが色々あるのは分かりました。\n経理とは合意が取れている内容ですか？"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "佐伯さんの立場ってよく分からないよな…\nその辺の調整をする仕事じゃないのかな…？"
            }
          ]
        },
        "02.screen-recheck": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "現行の申請画面をもう一度見てみた。……やっぱり差戻しボタンはない。\n**寝て起きたら**勝手にボタンついてないかな…"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "これ以上は調べても何も分からなそうだ。"
            }
          ]
        },
        "02.source-recheck": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "ソースを読み直した。二度見しても差戻しの処理は見当たらない。\nやっぱり俺が書くのか…"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "これ以上は調べても何も分からなそうだ。"
            }
          ]
        },
        "02.confirm-scope": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "今回は差戻し中の申請だけ直せるようにして、承認処理はそのままでいいですか？"
            },
            {
              "speaker": "accountant",
              "text": "はい。\n入力内容と添付を直して出し直せれば十分です。"
            },
            {
              "speaker": "player",
              "text": "差戻し理由を残し、申請者に修正を知らせ、再申請したら承認者へ通知するところまで含めます。"
            },
            {
              "speaker": "accountant",
              "text": "それでお願いします。\n他にも要望は来ているのですが…今回はなしで。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "**足るを知る**ことを覚えた方が人生が平和になると教えてあげたい…とりあえず見積もりをするか。"
            }
          ]
        },
        "meeting.muted": {
          "version": 1,
          "lines": [
            {
              "speaker": "client",
              "text": "マイクミュートでしゃべってますか？"
            },
            {
              "speaker": "player",
              "text": "あ、すいません、ミュートでした。"
            }
          ]
        }
      },
      "chat": [
        {
          "id": "02.chat.1",
          "at": "09:00",
          "speaker": "lead",
          "text": "佐伯さんより依頼された件、調査、報告よろしく"
        },
        {
          "id": "02.chat.2",
          "at": "09:15",
          "speaker": "lead",
          "text": "差戻しって、どこに戻すんだよ"
        },
        {
          "id": "02.chat.3",
          "at": "09:40",
          "speaker": "lead",
          "text": "仕様書に書いてない"
        },
        {
          "id": "02.chat.4",
          "at": "09:45",
          "speaker": "lead",
          "text": "俺が書いた仕様書だった"
        },
        {
          "id": "02.chat.5",
          "at": "10:30",
          "speaker": "lead",
          "text": "別件の障害対応入ります"
        },
        {
          "id": "02.chat.6",
          "at": "11:20",
          "speaker": "lead",
          "text": "復旧。原因は設定値"
        },
        {
          "id": "02.chat.7",
          "at": "11:25",
          "speaker": "lead",
          "text": "設定したの俺だった"
        },
        {
          "id": "02.chat.8",
          "at": "13:00",
          "speaker": "lead",
          "text": "会議終わった。次の会議の日程が決まった"
        },
        {
          "id": "02.chat.9",
          "at": "15:00",
          "speaker": "lead",
          "text": "差戻しと却下を同じにすると、後で泣くぞ"
        },
        {
          "id": "02.chat.10",
          "at": "16:30",
          "speaker": "client",
          "text": "差戻しボタンの件、確認できたところから状況をお願いします。"
        }
      ],
      "schedules": {
        "lead": [
          {
            "from": "09:00",
            "to": "10:30",
            "state": "incident"
          },
          {
            "from": "10:30",
            "to": "10:45",
            "state": "working"
          },
          {
            "from": "10:45",
            "to": "11:15",
            "state": "available"
          },
          {
            "from": "11:15",
            "to": "12:00",
            "state": "related"
          },
          {
            "from": "12:00",
            "to": "13:00",
            "state": "working"
          },
          {
            "from": "13:00",
            "to": "14:00",
            "state": "meeting"
          },
          {
            "from": "14:00",
            "to": "18:00",
            "state": "working"
          }
        ]
      },
      "events": {
        "intro": "02.intro",
        "noProgress": "02.no-progress",
        "clear": "02.clear",
        "timeout": "02.timeout",
        "progress": "02.report-progress",
        "cannot": "02.report-cannot",
        "extension": "02.extension",
        "gameover": "02.gameover",
        "extensionUsed": "02.extension-used",
        "nextDay": "02.next-day",
        "dream": "02.dream",
        "microphoneMuted": "meeting.muted"
      }
    },
    "problem": {
      "schemaVersion": 1,
      "caseId": "approval-button",
      "version": 1,
      "status": "prototype",
      "title": "ボタンの値段",
      "requestMemo": "経理から、承認画面に差戻しボタンを追加してほしいとの依頼。\n\n「ボタン一個だから簡単」と思われているが、本当にそうなのかは分からない。",
      "requestMemoTitle": "承認画面への差戻しボタン追加",
      "requestPurpose": "実現したいことと必要な修正範囲を調査し、適正な見積もりの根拠を佐伯さんに説明する。",
      "clock": {
        "start": "09:00",
        "deadline": "18:00"
      },
      "knowledge": {
        "business": {
          "initial": 0,
          "max": 8
        },
        "system": {
          "initial": 0,
          "max": 10
        }
      },
      "evidence": [
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
          "text": "現行は承認・却下。配置の参考にはなるが、新機能の要件は別確認。",
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
      ],
      "investigations": [
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
          "description": "誰が、いつ、どの画面で編集できるか調べる。",
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
      ],
      "derivedEvidence": [
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
      ],
      "dailyActions": [
        "ab.lunch",
        "ab.progress"
      ],
      "lunchAction": "ab.lunch",
      "coffeeAction": "ab.coffee",
      "help": {
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
      },
      "loop": {
        "memoryCandidates": [],
        "maxMemories": 0
      },
      "questions": [
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
    }
  },
  "bulk-import": {
    "scenario": {
      "schemaVersion": 1,
      "caseId": "bulk-import",
      "version": 2,
      "status": "prototype",
      "characters": [
        {
          "id": "player",
          "name": "主人公"
        },
        {
          "id": "sales",
          "name": "折原"
        },
        {
          "id": "client",
          "name": "佐伯"
        },
        {
          "id": "lead",
          "name": "真壁"
        },
        {
          "id": "ai",
          "name": "社内AI"
        },
        {
          "id": "accountant",
          "name": "三田"
        }
      ],
      "scenes": {
        "03.intro": {
          "version": 2,
          "lines": [
            {
              "speaker": "client",
              "text": "登録の担当から、毎朝の手入力を減らせないかって相談が来てまして。\nまとめて登録する機能のお見積もりを頂けますか？"
            },
            {
              "speaker": "sales",
              "text": "**10万円**くらいでどうでしょう！\n一件ずつ入れるのを、まとめるだけですし。"
            },
            {
              "speaker": "player",
              "text": "CSVとかで登録する感じでしょうか？"
            },
            {
              "speaker": "client",
              "text": "**CSV？**……ああ、そういうのだと思います。\nExcelも預かっているので、送りますね。"
            },
            {
              "speaker": "player",
              "text": "……確認して、回答します。"
            },
            {
              "speaker": "client",
              "text": "では、**今日18時までに**、どう作るかと見積もりをお願いします。\n担当にも返事をしたいので。"
            },
            {
              "speaker": "lead",
              "text": "チケットは切ってあるから、調査よろしく。"
            },
            {
              "speaker": "lead",
              "kind": "thought",
              "text": "CSVって言い出したの、こいつなんだけどな……。\nもう依頼内容みたいになってる。"
            }
          ]
        },
        "03.makabe-busy": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "真壁さん、一括登録の件で……。"
            },
            {
              "speaker": "lead",
              "text": "ごめん、今こっちが片づいてない。\n分かったところをチャットに置いといて。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "この人の「片づいた」を、今日はまだ聞いていない。"
            }
          ]
        },
        "03.makabe-vague": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "一括登録って、どう作るのがいいですかね。"
            },
            {
              "speaker": "lead",
              "text": "一括って何件？ 何を入れるの？\n……俺も今、それしか聞いてないんだけど。"
            },
            {
              "speaker": "player",
              "text": "すみません。質問が一括すぎました。"
            },
            {
              "speaker": "lead",
              "text": "前に一括で入れた案件はな……。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "昔の案件の話を聞いていたら、35分経っていた。\n今回の話をすればよかった。"
            }
          ]
        },
        "03.makabe-macro": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "Excelの列や、数字と日付を揃えるところって、どう作るんでしょう。"
            },
            {
              "speaker": "lead",
              "text": "そこ、ExcelマクロでチェックしてCSVにしてから渡す手もあるだろ。"
            },
            {
              "speaker": "player",
              "text": "**……Excelマクロ？**\nシステムで変換するものだと思ってました。"
            },
            {
              "speaker": "lead",
              "text": "俺はExcelの書式が変わるたびに、サーバーを直したくないんだよ。\nそのたび折原に10万円の話をされるし。"
            },
            {
              "speaker": "player",
              "text": "マクロなら、その修正で済むんですね。"
            },
            {
              "speaker": "lead",
              "text": "そういう案もあるって話。\n今回、誰が作って面倒を見るかまでは知らんぞ。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "死んだばーちゃんも「Excelがなくならない限り、VBAもなくならない」って言ってたな。\n……作る人も、いなくならないといいけど。"
            }
          ]
        },
        "03.makabe-costs": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "見積もりって、使う人に残る作業まで書くんですか？\n作る方の作業量だけじゃなくて。"
            },
            {
              "speaker": "lead",
              "text": "そこを省くと、納品前に**「思ってたのと違う」**って話になる。\n俺はもう、その会議に出たくない。"
            },
            {
              "speaker": "player",
              "text": "依頼された通りでも、ですか？"
            },
            {
              "speaker": "lead",
              "text": "「通り」の中身が違うんだよ。\n向こうは楽になるつもりで頼んでるからな。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "会議に出たくない、は分かる。"
            }
          ]
        },
        "03.makabe-ready": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "所定のCSVをもらう前提で、全件を戻すなら1日、成功分を残すなら10日くらいです。"
            },
            {
              "speaker": "lead",
              "text": "ああ、残す方は結果を管理する仕事が増えるもんな。"
            },
            {
              "speaker": "player",
              "text": "どっちが通ると思います？"
            },
            {
              "speaker": "lead",
              "text": "使うのは俺らでも**佐伯さんでもない**からな。\n担当の人が毎朝どうやるかと、その差に金を出すかだろ。"
            },
            {
              "speaker": "player",
              "text": "真壁さんなら、どっちに……。"
            },
            {
              "speaker": "lead",
              "text": "……電話だ。佐伯さんに話す時は呼んで。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "判断だけ置いて帰ろうとしたの、バレたかな。"
            }
          ]
        },
        "03.lunch": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "kind": "thought",
              "text": "昼飯を食べた。\n午後の俺が、午前の俺より賢いといいんだけど。"
            }
          ]
        },
        "03.coffee": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "kind": "thought",
              "text": "コーヒーを飲んだ。熱い。\n落ち着いて考えようと思ったのに、舌のことしか考えられない。"
            }
          ]
        },
        "03.timeout": {
          "version": 2,
          "lines": [
            {
              "speaker": "client",
              "text": "18時になりましたが、一括登録の件はいかがでしょう。\n担当にどう返事をしたらいいですか？"
            },
            {
              "speaker": "player",
              "text": "すみません。\nまだ、作り方と担当の方の作業をまとめて説明できていません。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "調べたことなら話せるのに、返事にならない。"
            }
          ]
        },
        "03.extension": {
          "version": 3,
          "lines": [
            {
              "speaker": "lead",
              "text": "佐伯さんには俺から今の状況を話して、調査を一日延ばしてもらった。\n明日、続きよろしく。"
            },
            {
              "speaker": "player",
              "text": "ありがとうございます。\n今日の記録から続けます。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "助かった。\n明日の俺に、今日の俺の続きを頼む。"
            }
          ]
        },
        "03.gameover": {
          "version": 3,
          "lines": [
            {
              "speaker": "lead",
              "text": "おい、期限まで何をしていたんだ！\n**途中報告もせず、黙って抱え込んでどうする！**"
            },
            {
              "speaker": "lead",
              "text": "間に合わないなら、その時点で言え！\nこっちは先方への説明も、応援の手配もできないだろ！"
            },
            {
              "speaker": "lead",
              "text": "分からないことを責めているんじゃない。\n**状況を伝えないまま期限を過ぎたことを言っているんだ！**"
            },
            {
              "speaker": "lead",
              "text": "今回の担当はここまでだ。\n調査した内容をまとめて引き継げ。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "調べることばかり考えて、誰にも返事をしていなかった……。"
            }
          ]
        },
        "03.extension-used": {
          "version": 2,
          "lines": [
            {
              "speaker": "client",
              "text": "担当にも、追加の一日まで待ってもらっています。\n今回はここまでにして、分かったことと残っている確認を引き継いでください。"
            },
            {
              "speaker": "player",
              "text": "はい……。\n説明できるところまで整理して、お渡しします。"
            }
          ]
        },
        "03.dream": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "kind": "thought",
              "text": "夢なら、知らない間に登録画面まで出来ていてほしかった。"
            }
          ]
        },
        "03.next-day": {
          "version": 2,
          "lines": [
            {
              "speaker": "lead",
              "text": "昨日の続きから。記録は残ってるから、同じところを一から調べ直すなよ。"
            },
            {
              "speaker": "player",
              "text": "はい。\n今日は、佐伯さんに返事を持って帰ってもらえるところまで。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "昨日の俺のメモ、もう少し丁寧に書いてほしかった。"
            }
          ]
        },
        "03.report-progress": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "途中経過です。\n登録の作り方と、担当の方に残る作業を整理しています。まだ見積もりとしてお返しできる段階ではありません。"
            },
            {
              "speaker": "client",
              "text": "分かりました。担当には調査中と伝えます。\n今日中に難しそうなら、先に教えてくださいね。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "返事を保留にするにも、返事は要るんだな……。"
            }
          ]
        },
        "03.report-cannot": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "すみません。今日中に見積もりをまとめきれそうにありません。\n今分かっていることをお伝えした上で、期限をご相談できますか？"
            },
            {
              "speaker": "client",
              "text": "今日中に返すと伝えているので困りますが……。\nまず、どこまで分かっているか聞かせてください。"
            }
          ]
        },
        "03.clear": {
          "version": 2,
          "lines": [
            {
              "speaker": "lead",
              "text": "よし、返事が来たら次を詰めよう。\n今日はここまでで、お疲れ。"
            },
            {
              "speaker": "player",
              "text": "お疲れさまでした。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "まとめて登録するだけ、か。\n**「だけ」の後ろ、長かったな。**"
            }
          ]
        },
        "03.request": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "依頼は毎朝の手入力を減らすこと。添付はExcel。\n一括登録の細かい仕様は、まだ書かれていない。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "CSVって言ったの俺だったな……。\n「それがいいです」って返されると、正解を引いた気になる。"
            }
          ]
        },
        "03.business": {
          "version": 3,
          "lines": [
            {
              "speaker": "client",
              "text": "担当に聞きました。普段は20〜30件、月初は50件ほど。\n商品や数量など、6項目くらいを一件ずつ入力しているそうです。"
            },
            {
              "speaker": "player",
              "text": "毎朝、それを画面に転記しているんですね。"
            },
            {
              "speaker": "client",
              "text": "ええ。数字が全角だったり、日付の書き方が違ったりして、直してから入れるそうです。\n「また同じところで引っかかった」って怒ってました。"
            },
            {
              "speaker": "player",
              "text": "表記を直す作業も、今は担当の方がやっているんですね。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "入力ボタンを押すまでに、もう仕事をしている……。"
            }
          ]
        },
        "03.workbook": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "添付のExcelを開いた。商品コード、商品名、数量、単価、納品予定日……。\n数量は全角、日付の表示も揃っていない。"
            },
            {
              "speaker": "player",
              "text": "別の取引先の見本は、列の順番まで違う。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "人間なら「同じ表」で済むのか。\nプログラムは、そこまで察してくれないんだけどなあ。"
            }
          ]
        },
        "03.screen": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "検証環境で、サンプルを一件登録してみた。\n登録番号が出て、テスト用の受信箱にメールが一通届いた。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "これを件数分、繰り返すだけでは？\nひょっとして**チョロい？**"
            }
          ]
        },
        "03.source": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "登録ボタンから処理を追った。\n入力チェック、DB更新、関連レコードの作成、それからメール送信。既存テストには呼び出し用の入力例もある。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "登録ボタン一個で、裏ではよく働いてるな。\n俺も、この処理を呼ぶだけの仕事にしたい。"
            }
          ]
        },
        "03.spec": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "仕様書には、入力項目と一件登録する時の流れが載っていた。\n一括登録の仕様はないが、対応するソースの場所は絞れそうだ。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "「この仕様の通り作って」で済む資料を期待してたんだけど。\nこれから書くの、俺か。"
            }
          ]
        },
        "03.mapping": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "Excelの列を登録項目に合わせて、入力を試した。\n数字と日付はそのままだとエラー。表記を直した見本なら、既存のチェックを通った。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "**「Excelを読む」と「登録できる形にする」は別の仕事**か。\n最初の見積もりに、後半の俺が入っていなかった。"
            }
          ]
        },
        "03.csv-preparation": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "この見本と同じ列順で、数字や日付も揃えたCSVを用意できますか？"
            },
            {
              "speaker": "client",
              "text": "Excelを渡すだけでは、だめなんですか？"
            },
            {
              "speaker": "player",
              "text": "そのまま自動で変換するなら、取引先ごとの列や書き方にも対応する必要がありまして。\nまず、揃えたCSVを登録する部分と分けて見積もりたいんです。"
            },
            {
              "speaker": "client",
              "text": "担当に見本で試してもらいました。\n今も数字や日付は直しているので、揃えてCSVにするところまではできるそうです。"
            },
            {
              "speaker": "player",
              "text": "既に共通のマクロがあったりは……。"
            },
            {
              "speaker": "client",
              "text": "ないそうです。\n作るなら、その費用もかかるんですよね？"
            },
            {
              "speaker": "player",
              "text": "はい。今回はそのCSVをチェックして登録する範囲の概算にして、Excelの自動変換とマクロの新規作成は別にします。"
            },
            {
              "speaker": "client",
              "text": "では、その前提でお願いします。\n担当に何をやってもらうかも、見積もりに書いてくださいね。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "入力の手間は減らせそうだけど、ファイルを作る仕事は残る。\n「全部楽になります」って言わなくてよかった。"
            }
          ]
        },
        "03.csv-preparation-first": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "入力用ファイルの件で、担当の方の朝の手順から確認させてください。"
            },
            {
              "speaker": "client",
              "text": "聞いてきました。普段は20〜30件、月初は50件くらい。\n6項目ほどを、数字や日付を直しながら一件ずつ転記しているそうです。"
            },
            {
              "speaker": "player",
              "text": "では、直したものを、この見本の列順と表記のCSVにできますか？"
            },
            {
              "speaker": "client",
              "text": "まとめて登録するなら、今のExcelをそのまま渡すのかと思ってました。"
            },
            {
              "speaker": "player",
              "text": "取引先ごとのExcelを自動変換する部分も作るなら、その分の作業が増えるんです。\nCSVを用意していただく場合と、分けて見積もりたいです。"
            },
            {
              "speaker": "client",
              "text": "担当に見本で試してもらいました。\n今の補正作業の続きで、揃えてCSVにするところまではできるそうです。共通のマクロはないとのことでした。"
            },
            {
              "speaker": "player",
              "text": "ありがとうございます。では今回は、そのCSVをチェックして登録する範囲で概算します。\n自動変換やマクロを新しく作る費用は、別にします。"
            },
            {
              "speaker": "client",
              "text": "お願いします。\n担当の準備が残ることも、分かるように書いてください。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "一括登録でも、入力ファイルは誰かが作る。\nその誰かの仕事を、今まで数えていなかった。"
            }
          ]
        },
        "03.operations": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "エラーが出た後の作業も、担当の方に確認していただけますか？\n一件でも失敗したら全部取り消し、誤りを直したファイルを全件入れ直す方法があります。"
            },
            {
              "speaker": "client",
              "text": "直すのは間違ったところでも、登録は全部やり直すんですね。"
            },
            {
              "speaker": "player",
              "text": "はい。もう一つは、成功した行を残して、失敗した行だけ直して入れ直す方法です。"
            },
            {
              "speaker": "client",
              "text": "担当は、全部入れ直すより、失敗した分だけ直したいそうです。\nただ、その行がどれかと、入れ直した結果が分かるようにしてほしい、と。"
            },
            {
              "speaker": "player",
              "text": "そこも作る必要があるので、作業量は変わります。"
            },
            {
              "speaker": "client",
              "text": "では、費用も一緒に見せてください。\n楽な方がいいのはそうですけど、金額を見ずには決められないので。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "「便利な方で」と言われたら困るし、値段を聞かれても困る。\n……見積もるしかないか。"
            }
          ]
        },
        "03.prototype": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "検証用の短いコードを書いて、一件登録を3回呼んだ。\n1件目は成功。2件目は不正な日付で停止。3件目には進まなかった。"
            },
            {
              "speaker": "player",
              "text": "止まったのに、1件目の登録は残っている。\nテスト用の受信箱には、その通知も届いていた。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "そりゃ、もう登録したんだから残るか……。\n**繰り返すだけ、の「だけ」が終わった。**"
            }
          ]
        },
        "03.related": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "単件登録の確定箇所を追った。\n本体と関連レコードを、一件分ずつ同じDBで確定している。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "一括にして途中で止まったら、この確定済みの分も戻すのか？\n一件分の処理に「全件の面倒」まで見てくれとは、言いづらい。"
            }
          ]
        },
        "03.related-prototype": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "試作で残った登録番号からデータを追った。\n本体だけでなく、関連レコードも一緒に確定していた。2件目の失敗では、1件目は戻っていない。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "残ったデータを消せばいい、と思っていたけど。\n**どれをどこまで戻すか**から、俺が考えるんだな……。"
            }
          ]
        },
        "03.notification": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "メール送信は、単件の登録を確定した後に呼ばれている。\nDBを取り消しても、送信済みのメールは取り消せない。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "データを戻したから、なかったことに……とはいかないか。\n受け取った人の記憶も、ロールバックできないし。"
            }
          ]
        },
        "03.notification-prototype": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "試作の登録番号とテスト用の受信箱を照合した。\n2件目で止まっているのに、1件目の登録通知は届いている。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "本人には「登録できました」、こっちは「途中で失敗しました」。\n言い分が二つあるの、もう面倒な予感しかしない。"
            }
          ]
        },
        "03.notification-followup": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "前に調べた単件の送信順と、後から作った試作の記録を突き合わせた。\n今回も1件目の通知は送信済み。2件目で止めても戻っていない。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "単件の時と同じ順番で、繰り返すたびに送っている。\n一括用に、いつ送るかを考え直す必要があるな。"
            }
          ]
        },
        "03.retry": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "検証環境の単件登録へ、同じ入力をもう一度送った。\n別の登録番号が増え、メールももう一通届いた。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "二回押せば二回登録する。素直だな……。\n一括にしたら、その素直さで困りそうだ。"
            }
          ]
        },
        "03.retry-prototype": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "試作で失敗した入力を直して、最初からやり直した。\n前に成功した行も、別の登録として増えている。通知も増えた。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "**「エラーを直してもう一回」で、成功分まで増えた。**\nどれが済んでいるか、こっちで分かるようにしないと。"
            }
          ]
        },
        "03.plan-a": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "全件を先にチェックして、登録もまとめて確定する案にした。\n途中で失敗したら全件を戻し、通知は確定した後に送る。確定の範囲と呼び出す順番を変える想定だ。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "成功か失敗か、一つに揃えられれば作りやすそうだ。\n全部入れ直す人には、嫌われそうだけど……。"
            }
          ]
        },
        "03.plan-b": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "一件ずつ確定して、成功と失敗を行ごとに返す案も考えた。\n失敗分だけ送り直せるよう、結果の記録と行の識別、登録や通知が重複しない対策を作る。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "使う人には親切そうだ。\nその親切を実装する人には、まだ見せていない。**俺だけど。**"
            }
          ]
        },
        "03.plan-both": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "全件を戻す案と、成功した行を残す案を並べた。\n前者は結果を一つに揃える。後者は行ごとの結果を管理し、失敗分だけやり直せるようにする。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "作りやすいのと、やり直しやすいの。\n同じものが一位になってくれれば、楽だったんだけど。"
            }
          ]
        },
        "03.estimate-a": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "列と表記の揃ったCSVを受け取る前提で、全件取消の案を積んだ。\n読取とチェック、確定と通知の変更、試験までで、概算は**1日程度**。"
            },
            {
              "speaker": "player",
              "text": "細かい例外や試験の中身は、これから詰める。そこで変わり得る数字だ。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "これなら10万円でも……って、単価も決めずに考えてた。\n折原さんに近づいている気がする。"
            }
          ]
        },
        "03.estimate-b": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "列と表記の揃ったCSVを受け取る前提で、成功した行を残す案を積んだ。\n結果一覧、行の識別、関連更新、通知と再投入の対策、試験までで、概算は**10日程度**。"
            },
            {
              "speaker": "player",
              "text": "詳細設計はこれから。例外処理や試験を詰めて、数字も精査する。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "10日……。「失敗した分だけ」で、こんなに作るものが増えるのか。\n見積書を開く折原さんの顔が浮かぶ。"
            }
          ]
        },
        "03.estimate-both": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "所定のCSVを受け取る前提で、両方の作業を積んだ。\n全件取消は、読取・チェック、確定と通知の変更、試験で**1日程度**。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "1日なら、まあ……。"
            },
            {
              "speaker": "player",
              "text": "成功した行を残す方は、結果の記録、行の識別、関連更新、通知と再投入の対策、試験で**10日程度**。\nどちらも詳細を詰める前の概算だ。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "**10日！？**\n……いや、自分で積んだんだけど。"
            }
          ]
        },
        "03.estimate-missing": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "作業の欄は埋めたが、登録をどこまで取り消せるか、通知をいつ送るかの裏付けが足りない。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "数字の入った表になっただけで、見積もった気になるな。\nこの表で仕事を始めるの、未来の俺なんだけど。"
            }
          ]
        },
        "03.estimate-missing-structure": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "kind": "thought",
              "text": "一件を登録する時、本体と関連データはどこまで一緒に確定しているんだ？\n戻す範囲が分からないまま、戻す作業を見積もろうとしてた。"
            }
          ]
        },
        "03.estimate-missing-notification": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "kind": "thought",
              "text": "登録と関連データが一緒に確定するところは分かった。\n通知は、その前と後のどっちだ？ ここが違うと、直すところも変わる。"
            }
          ]
        },
        "03.estimate-missing-retry": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "kind": "thought",
              "text": "登録の確定と通知の順番は分かった。\n成功分を残してやり直すなら、同じ入力をもう一度送った時も見ておかないとか。\n一回目だけうまく動く仕組み、作った覚えがあるな……。"
            }
          ]
        },
        "03.summary": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "調べたことを、佐伯さんに話す順に並べ直した。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "「ソースを読みました」の次が続かない。\n読んだ感想を聞かれているわけじゃないんだよな……。"
            }
          ]
        },
        "03.libraries": {
          "version": 4,
          "lines": [
            {
              "speaker": "player",
              "text": "CSVを読むライブラリを比較した。\n文字コードや引用符を扱えて、テストもしやすそうな候補を絞れた。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "読むところは、既製品に頼れそうだ。\n登録まで全部やってくれる名前のライブラリも、つい探したくなる。"
            }
          ]
        },
        "03.distributed": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "キューに分けて大量処理する構成を調べた。\n処理状況や再送を管理する仕組みも要るらしい。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "構成図が急に格好よくなった。\nこの規模が要るかは、件数と見比べないとな。図を完成させるのが仕事になりかけた。"
            }
          ]
        },
        "03.tables": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "参照先の集計用テーブルまで追った。\n今回の単件登録から更新しているものではなかった。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "ここは修正範囲から外せる。\n45分かけて「やらなくていい」を見つけた。見積もりにはどう書こう。"
            }
          ]
        },
        "03.macro-check": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "Excelマクロで、列の対応付けや表記のチェックを補助する方法を調べた。\n新しく作る作業と、書式が変わった時に直す担当は必要だ。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "マクロにすれば仕事が消えると思ったけど、置き場所が変わるのか。\nこれも作るなら、登録部分とは別に数えないと。"
            }
          ]
        },
        "03.detail": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "結果一覧や例外処理の詳細を書き始めた。\n関連更新の失敗、通知の失敗、再投入の順番……それぞれ試験も要る。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "このまま設計書を完成させれば安心だけど、いつ終わるんだ。\n今日返すのは概算だったな。残る設計と試験は、未確定のものとして書いておこう。"
            }
          ]
        },
        "03.recheck": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "同じところを読み直したが、新しい事実は見つからなかった。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "**これ以上は調べても何も分からなそうだ。**\n気が済むまで読めば、分かることが増えるわけでもないか。"
            }
          ]
        },
        "03.no-progress": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "kind": "thought",
              "text": "この作業、意味あるかな……？"
            }
          ]
        },
        "03.makabe-incident": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "単件の登録処理を繰り返す案なんですが、途中でエラーが出た後の扱いが気になって。"
            },
            {
              "speaker": "lead",
              "text": "ああ、昔それでメール100通飛ばした。俺が。"
            },
            {
              "speaker": "player",
              "text": "**100通！？**"
            },
            {
              "speaker": "lead",
              "text": "DBを戻して、直して、もう一回実行してな。\n受信箱を見て、初めて気づいた。"
            },
            {
              "speaker": "player",
              "text": "……通知は戻らなかったんですね。"
            },
            {
              "speaker": "lead",
              "text": "俺の話は昔のやつだからな。\n今回の送信順は、自分で確認してくれ。"
            }
          ]
        },
        "03.makabe-again": {
          "version": 3,
          "lines": [
            {
              "speaker": "lead",
              "text": "さっきの話は、俺が前の案件でやった話だからな。\n今回も同じでいいかは、手元の資料で確認してくれ。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "経験談はもらえたけど、今回の保証は付いていない。"
            }
          ]
        },
        "03.progress-early": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "一括登録の件、まだ概算を返せるところまで整理できていません。\n今の調査状況をチャットにまとめました。"
            },
            {
              "speaker": "lead",
              "text": "了解。先方には調査中って伝える。\n時間が厳しくなったら、その時も言ってくれ。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "「まだです」を言うの、調べるより勇気が要るな……。"
            }
          ]
        },
        "03.progress-trial": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "一件登録を繰り返す検証コードを動かしました。\n途中で止まっても、先に成功した分の登録と通知が残ります。"
            },
            {
              "speaker": "lead",
              "text": "あー。回したら終わり、って感じにはならなかったか。"
            },
            {
              "speaker": "player",
              "text": "はい。止まった後と、やり直す時の扱いを考えています。"
            },
            {
              "speaker": "lead",
              "text": "分かった。今は作り方を詰めてるって、先方にも伝えとく。"
            }
          ]
        },
        "03.progress-scope": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "概算は出せたんですが、担当の方に残る準備とやり直しも、見積もりの前提に書き添えます。"
            },
            {
              "speaker": "lead",
              "text": "うん。「ここはそっちでやって」って、納品の日に初めて言うのはやめような。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "その日の会議、想像するだけで胃が痛い。"
            }
          ]
        },
        "03.progress-ready": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "両方の概算と、担当の方が用意するCSV、エラー後の作業まで揃いました。\n佐伯さんには、その違いを説明します。"
            },
            {
              "speaker": "lead",
              "text": "分かった。同席する。\n……10万円の話は、折原に引き取ってもらおう。"
            }
          ]
        },
        "03.progress-busy": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "一括登録の途中報告です。分かったことと、まだ残っている確認をチャットに置きました。"
            },
            {
              "speaker": "lead",
              "text": "ごめん、今は読めない。あとで見る。\n状況の連絡をもらったことは、先方にも伝えとく。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "今読めなくても、置いておけばよかったのか。"
            }
          ]
        },
        "03.report-0": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "調べた内容をご報告します。登録画面と、その裏の処理について……。"
            },
            {
              "speaker": "client",
              "text": "すみません。担当から聞かれているのは、まとめて登録できるかと、どのくらいかかるかなんです。\nこの内容だと、何と返事をすればいいでしょう？"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "調べたことを順番に話せば、報告になると思ってた。"
            }
          ]
        },
        "03.report-csv": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "既存の登録処理を使って、CSVから呼び出す形を考えています。"
            },
            {
              "speaker": "client",
              "text": "それは、担当が今持っているExcelを渡せば済む話ですか？\nこちらの準備と、見積もりも合わせて教えてください。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "CSVを読めるか、だけ答えていた。\n佐伯さんの返事に使える話にしないと。"
            }
          ]
        },
        "03.report-only-a": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "一件でも失敗したら全件を取り消す方法なら、所定のCSVを前提に**1日程度**です。\n誤りを直して、ファイルを丸ごと入れ直していただきます。"
            },
            {
              "speaker": "lead",
              "text": "作るのは早いとして、毎朝やる人にはどうなんだ？\n入れ直す手間と、別の方法も並べて話そう。"
            },
            {
              "speaker": "client",
              "text": "そうですね。担当にも、これが一番いいとはまだ言えないので。"
            },
            {
              "speaker": "player",
              "text": "はい。担当の方の作業と、ほかの方法も合わせて説明し直します。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "俺の作業が少ない順に、話を終わらせようとしていたかな……。"
            }
          ]
        },
        "03.report-only-b": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "正常な行を残して、失敗した分だけ直して入れ直せる方法なら、所定のCSVを前提に**10日程度**です。"
            },
            {
              "speaker": "client",
              "text": "10日？\n折原さん、10万円くらいって言ってませんでした？"
            },
            {
              "speaker": "sales",
              "text": "まずは、ご予算に合う形で……。"
            },
            {
              "speaker": "client",
              "text": "では、もっと簡単に作る方法はないんでしょうか。\n便利でも、これだけを持ち帰るのはちょっと。"
            },
            {
              "speaker": "player",
              "text": "作る手間を抑える方法も並べて、ご説明します。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "便利な方だけ出せば、喜んでもらえると思ってた。\n金額を聞く人は、まだ喜んでいない。"
            }
          ]
        },
        "03.report-operation": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "全件を取り消すなら概算1日、成功分を残すなら10日です。"
            },
            {
              "speaker": "client",
              "text": "そんなに違うんですか。\nそれぞれ、担当は何を用意して、間違いがあったら何をやり直すんでしょう？"
            },
            {
              "speaker": "player",
              "text": "準備とやり直しの手順も、一緒に説明します。"
            },
            {
              "speaker": "client",
              "text": "お願いします。\n**1日と10日だけだと、安い方でって返されそうなので。**"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "数字を比べるだけなら、俺も1日の方を選ぶな……。"
            }
          ]
        },
        "03.report-3": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "毎朝、画面に一件ずつ転記する作業を減らす、一括登録の概算です。\n担当の方に、列や数字、日付を揃えたCSVを用意してもらう前提で比べました。"
            },
            {
              "speaker": "client",
              "text": "今のExcelを、そのまま渡すわけではないんですね？"
            },
            {
              "speaker": "player",
              "text": "はい。見本で試していただいて、CSVの準備は担当の方でできると確認しました。\n取引先ごとのExcelを自動変換する機能や、マクロを新しく作る費用は含めていません。"
            },
            {
              "speaker": "client",
              "text": "なるほど。\n表記を直す仕事は残って、画面に何回も入力するところが減るんですね。"
            },
            {
              "speaker": "player",
              "text": "そうです。まず、一件でも失敗したら全件を取り消す方法なら、**1日程度**です。\nエラーを直した後、ファイルは全件を入れ直して、結果を確認していただきます。"
            },
            {
              "speaker": "client",
              "text": "通った分も、全部ですか？\nその分だけ残すことはできませんか？"
            },
            {
              "speaker": "player",
              "text": "成功した行を残し、失敗分だけ直して入れ直せる方法も考えました。\nこちらは**10日程度**です。"
            },
            {
              "speaker": "client",
              "text": "**1日が、10日に？**\n残すだけで、そんなに変わるんですか？"
            },
            {
              "speaker": "player",
              "text": "どの行が成功したかを記録して、失敗した行と理由を返す必要があります。\n入れ直した時に、同じ登録や通知を二回しない仕組みと、その試験も増えるんです。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "作る前は、俺も「繰り返すだけ」だと思ってたんだけど。"
            },
            {
              "speaker": "client",
              "text": "担当は失敗分だけ直せる方を希望していましたが……。\nその差に費用をかけるかは、相談しないとですね。"
            },
            {
              "speaker": "player",
              "text": "はい。どちらも、既存処理の調査をもとに大きな作業を積んだ**概算**です。\n完成版の実装や検証はまだで、細かい設計と試験を詰めると変わる可能性があります。"
            },
            {
              "speaker": "player",
              "text": "同じCSVの準備を前提に、全件を入れ直す方法と、失敗分だけ直す方法です。\n作業の違いと一緒に、担当の方に両案を見ていただけますか？"
            },
            {
              "speaker": "client",
              "text": "分かりました。両方、部署へ持ち帰って相談します。\n担当に残る仕事も、これなら説明できます。"
            },
            {
              "speaker": "sales",
              "text": "では、お見積書の方を……。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "折原さん、もう開いてる。\n早いな。**まだ、どっちにするかは決まってないけど。**"
            }
          ]
        },
        "meeting.muted": {
          "version": 1,
          "lines": [
            {
              "speaker": "client",
              "text": "マイクミュートでしゃべってますか？"
            },
            {
              "speaker": "player",
              "text": "あ、すいません、ミュートでした。"
            }
          ]
        }
      },
      "chat": [
        {
          "id": "03.chat.1",
          "at": "09:00",
          "speaker": "lead",
          "text": "佐伯さんの件、調査よろしく。10万円は折原が言ってるだけだからな。"
        },
        {
          "id": "03.chat.2",
          "at": "09:20",
          "speaker": "lead",
          "text": "コーヒーを淹れ直した。冷めるまでに一つ片づけたい。"
        },
        {
          "id": "03.chat.3",
          "at": "09:50",
          "speaker": "lead",
          "text": "前の案件、担当の手順を聞いたら資料と全然違った。資料の方が新しかった。"
        },
        {
          "id": "03.chat.4",
          "at": "10:00",
          "speaker": "lead",
          "text": "テストのメールを本物と間違えた。宛先を分けておいてよかった。"
        },
        {
          "id": "03.chat.5",
          "at": "10:30",
          "speaker": "lead",
          "text": "別件の障害対応に入ります。しばらく返事遅れます。"
        },
        {
          "id": "03.chat.6",
          "at": "11:20",
          "speaker": "lead",
          "text": "復旧。再起動したら直った。原因の欄が埋まらない。"
        },
        {
          "id": "03.chat.7",
          "at": "11:40",
          "speaker": "lead",
          "text": "原因調査のチケットを切った。担当は俺になった。"
        },
        {
          "id": "03.chat.8",
          "at": "12:10",
          "speaker": "lead",
          "text": "昼飯の店を決めるために比較表を作った。昼が終わりそう。"
        },
        {
          "id": "03.chat.9",
          "at": "13:00",
          "speaker": "lead",
          "text": "会議で一番長く喋った人が議事録を書くルールにしたい。"
        },
        {
          "id": "03.chat.10",
          "at": "14:00",
          "speaker": "lead",
          "text": "便利な方で、という話になった後、予算の人が会議に来た。話が最初に戻った。"
        },
        {
          "id": "03.chat.13",
          "at": "14:30",
          "speaker": "lead",
          "text": "「1バイトでも直したらお前のソースだ」と師匠に言われた。今日はまだ眺めている。"
        },
        {
          "id": "03.chat.11",
          "at": "15:10",
          "speaker": "lead",
          "text": "調査資料が30ページになった。内容を減らす打ち合わせが増えた。"
        },
        {
          "id": "03.chat.12",
          "at": "16:00",
          "speaker": "lead",
          "text": "議事録、俺が書くことになった。午前の自分に黙っていてほしかった。"
        }
      ],
      "schedules": {
        "lead": [
          {
            "from": "09:00",
            "to": "10:30",
            "state": "working"
          },
          {
            "from": "10:30",
            "to": "11:20",
            "state": "incident"
          },
          {
            "from": "11:20",
            "to": "13:00",
            "state": "available"
          },
          {
            "from": "13:00",
            "to": "14:00",
            "state": "meeting"
          },
          {
            "from": "14:00",
            "to": "18:00",
            "state": "working"
          }
        ]
      },
      "events": {
        "intro": "03.intro",
        "noProgress": "03.no-progress",
        "clear": "03.clear",
        "timeout": "03.timeout",
        "progress": "03.report-progress",
        "cannot": "03.report-cannot",
        "extension": "03.extension",
        "gameover": "03.gameover",
        "extensionUsed": "03.extension-used",
        "nextDay": "03.next-day",
        "dream": "03.dream",
        "microphoneMuted": "meeting.muted"
      }
    },
    "problem": {
      "schemaVersion": 1,
      "caseId": "bulk-import",
      "version": 2,
      "status": "prototype",
      "title": "予算と異常系",
      "titleQuote": "「まとめて登録できないかしら？」",
      "closingNote": "CSVの準備と、エラー後にやり直す仕事を添えて、両案の概算を説明しました。佐伯が部署へ持ち帰り、採用と詳細の相談はこれからです。",
      "requestMemoTitle": "朝の手入力をまとめたい",
      "requestMemo": "毎朝の手入力を減らしたいと、佐伯さんから相談が来た。\n\nサンプルのExcelが添付されている。担当が何をしているか、どこまで自動化したいかは、まだ分からない。\n\n折原さんは10万円くらいと言っているが、作る範囲も見積もりも未確定。今日18時までに、実現方法と概算を回答する。",
      "requestPurpose": "朝の手入力を減らす方法と概算を調べ、担当の作業がどう変わるかも佐伯さんに説明する。",
      "clock": {
        "start": "09:00",
        "deadline": "18:00"
      },
      "knowledge": {
        "business": {
          "initial": 0,
          "max": 12
        },
        "system": {
          "initial": 0,
          "max": 18
        }
      },
      "evidence": [
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
          "text": "全件取消なら、誤りを直して全件再投入。行を残すなら、失敗行だけ修正・再投入し結果を確認。",
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
          "text": "試作の登録番号と受信記録を照合。二件目で停止しても、一件目の通知は送信済み。",
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
          "text": "所定CSV前提の概算1日。全件再投入と確認が必要。詳細設計・試験内容で変動し得る。",
          "kind": "proposal",
          "source": "A案：全件取消・概算1日"
        },
        {
          "id": "bi.b",
          "title": "B案：正常行を残す・概算10日",
          "text": "所定CSV前提の概算10日。結果管理・関連更新・通知・再投入対策が必要。詳細は未確定。",
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
      ],
      "investigations": [
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
          "description": "全件を入れ直す場合と、失敗行だけ直す場合の手順を担当に確かめる。",
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
          "description": "先に調べた単件の送信順と、新たな試作の登録番号・受信記録を照らす。",
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
          "description": "調べた順から、佐伯に伝わる順へ並べ直す。前提と未確認点も残す。",
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
          "description": "今分かっていることと残りの確認を伝え、先方への連絡を相談する。",
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
      ],
      "derivedEvidence": [
        {
          "id": "bi.business",
          "when": {
            "evidenceAll": [
              "bi.csv-ready",
              "bi.operations"
            ]
          }
        }
      ],
      "dailyActions": [
        "bi.lunch",
        "bi.progress"
      ],
      "lunchAction": "bi.lunch",
      "coffeeAction": "bi.coffee",
      "help": {
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
      },
      "loop": {
        "memoryCandidates": [],
        "maxMemories": 0
      },
      "questions": [
        {
          "id": "bi.report",
          "prompt": "一括登録の件、どう作るかと見積もりを伺えますか？\n担当が何を準備して、エラーが出たら何をやり直すのかも、一緒に教えてください。",
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
    }
  }
};
export const {scenario,problem}=cases.watermark;
