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
        "01.intro": {
          "version": 2,
          "lines": [
            {
              "speaker": "client",
              "text": "経理の三田から、取引先に提出用に印刷したPDFの資料に、田中太郎という透かしが入ると問い合わせがありまして。"
            },
            {
              "speaker": "client",
              "text": "調べたところ、田中太郎という社員は5年前に退職していて今はいなくて。"
            },
            {
              "speaker": "client",
              "text": "そもそも、三田が印刷していますから、三田の名前が透かしで入るものだと思うのですが。"
            },
            {
              "speaker": "player",
              "text": "三田さんが印刷した資料に、退職した方の名前が透かしで入るんですね。"
            },
            {
              "speaker": "client",
              "text": "はい。何が起きているのか調べてください。今日18時までに、原因と根拠、どこまで影響して何を対応するか、報告をお願いします。"
            },
            {
              "speaker": "player",
              "text": "分かりました。まず三田さんの印刷資料と、出力したときの記録を確認します。"
            }
          ]
        },
        "01.case": {
          "version": 2,
          "lines": [
            {
              "speaker": "client",
              "text": "三田から届いた印刷資料がこちらです。ウォーターマークは田中太郎になっています。取引先に提出する前に気づいたそうです。"
            },
            {
              "speaker": "player",
              "text": "三田さん自身が操作した資料ですね。田中さんの在籍とアカウントの記録も確認できますか？"
            },
            {
              "speaker": "client",
              "text": "三田が自分のアカウントで出力して印刷しています。田中さんは5年前に退職して、そのときにアカウントも無効化されています。"
            }
          ]
        },
        "01.docs-overview": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "画面仕様書、外部設計書、詳細設計書がある。どれも更新日が少し古い。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "全部読むのも時間がかかる。追いたい場所の資料から見よう。"
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
              "text": "最新化はされていないようだが、画面側の概要は分かった。現行コードと照らそう。"
            }
          ]
        },
        "01.docs-external": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "出力APIから帳票サービスを呼ぶ構成らしい。画面がPDFを作るわけではない。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "最新化はされていないようだが、サーバー側の概要は分かった。現行ソースでも確認しよう。"
            }
          ]
        },
        "01.docs-detail": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "PDFの透かしにはwatermarkNameという氏名オプションがある。未設定時の説明は……ない。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "最新化はされていないようだが、引数の概要は分かった。透かしの氏名がどこから来るか追おう。"
            }
          ]
        },
        "01.source-overview": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "1時間でバックエンド、フロントエンド、共通処理の置き場所は分かった。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "どの領域が怪しいか、記録と照らそう。"
            }
          ]
        },
        "01.backend": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "帳票サービスを呼び出している箇所が見つかった。ここからPDF生成処理とテンプレート設定を確認できそうだ。"
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
              "text": "先に資料やログで絞れば、早かったかもしれない。PDF処理と設定を確認しよう。"
            }
          ]
        },
        "01.frontend": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "画面仕様を頼りに追った。画面の名前もAPIへ送るIDも三田さんで、PDFの透かしは画面側では作っていない。"
            }
          ]
        },
        "01.frontend-wide": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "45分かけて画面の操作を追った。三田さんの情報は正しく、出力APIにも同じIDを渡している。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "画面を直せば終わり、ではなさそうだ。透かしを付けるのはサーバー側か。"
            }
          ]
        },
        "01.common-miss": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "日付の書式、文字列の整形、禁則文字。詳しくなったが、田中太郎は出てこない。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "……45分。今回の調査に使える情報は得られなかった。"
            }
          ]
        },
        "01.pdf-source": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "watermarkNameが空なら田中太郎を入れる処理がある。コメントは「初期サンプル用」。透かしの氏名に、実行利用者の名前を使っていない。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "田中太郎さん、透かしの中で現役だった。三田さんの出力もこの処理を通るか確認しよう。"
            }
          ]
        },
        "01.settings": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "標準テンプレートのwatermarkNameは空欄。透かしに田中太郎を補う条件に入る。誰がいつ設定したかは、この記録では分からない。"
            }
          ]
        },
        "01.logs": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "印刷資料に対応するPDFの出力記録は、三田さんのID U-204の最近の操作と一致した。ウォーターマークの田中太郎とは違う。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "三田さんが操作した記録と、透かしの氏名が食い違っている。氏名を入れる場所を追おう。"
            }
          ]
        },
        "01.logs-wide": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "ログだけで何万行もある。どのPDFのどのリクエストか分からないと追い切れない。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "45分。現物の確認が先だった。条件を絞ってからもう一度見よう。"
            }
          ]
        },
        "01.debug": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "同じ出力経路を検証環境で止めた。認証済みIDは三田さんのU-204なのに、透かし用の氏名は田中太郎だ。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "ログイン情報ではなく、ウォーターマークへ名前を入れる処理が怪しい。"
            }
          ]
        },
        "01.debug-wide": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "画面操作から止めてみたが、どの値をどこで見ればよいのか決まっていなかった。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "45分。ログや呼び出し経路で当たりをつけて、もう一度追おう。"
            }
          ]
        },
        "01.verify": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "三田さんと別の利用者で出力・印刷しても、どちらも田中太郎の透かしになった。検証環境で氏名の参照先を実行利用者に切り替えると、それぞれの名前になる。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "空欄時のサンプル名補完が原因だ。ほかの帳票や、すでに提出された資料の有無までは確認できていない。"
            }
          ]
        },
        "01.response": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "サンプル名の補完をなくし、実行利用者の氏名を透かしに使う。氏名未取得の検知と、印刷済み・提出済み資料の確認、別利用者での出力・印刷試験を対応案にまとめた。"
            },
            {
              "speaker": "lead",
              "text": "誰が設定したかは、まだ分からないだろ。確認できた原因と影響、是正案で説明しよう。調べていない範囲まで大丈夫とは言うなよ。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "言い方は大事だ。事実まで丸めないようにしよう。"
            }
          ]
        },
        "01.ai": {
          "version": 1,
          "lines": [
            {
              "speaker": "ai",
              "text": "古い名前が残る場合、ブラウザキャッシュや保存済みプロフィールが原因という一般例があります。今回の原因を示すものではありません。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "それっぽい。でも今のPDFで起きた証拠ではない。"
            }
          ]
        },
        "01.legacy": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "田中太郎は導入資料にも載っていた。画面キャプチャの説明がとても丁寧だ。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "1時間。今のPDFがどう作られたかは、まだ分からない。"
            }
          ]
        },
        "01.makabe-busy": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "三田さんが印刷した資料に田中太郎の透かしが入る件、何から調べればいいですか？"
            },
            {
              "speaker": "lead",
              "text": "ごめん、今は別の障害対応中。……そもそも、何を確認した？ 昔、俺が新人の頃もな……"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "45分。質問する前の確認は、確かに足りていなかった。"
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
              "text": "印刷した利用者と透かしの氏名が違うんだよな。まず三田さんの現物と、それに対応する出力記録を照合しよう。"
            }
          ]
        },
        "01.makabe-specific": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "出力記録は三田さんでした。透かしの氏名との違いをどこから追えばいいですか？"
            },
            {
              "speaker": "lead",
              "text": "そこまで絞れたなら、バックエンドの出力経路で透かし用の引数を見よう。画面の名前が正しくても、透かしの名前が同じとは限らないぞ。"
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
        "01.q1-pass": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "三田さんが印刷した資料には田中太郎の透かしがありますが、出力記録は三田さんのU-204と一致します。田中さんは5年前に退職し、アカウントも無効です。実行利用者と透かしの氏名が食い違っています。"
            },
            {
              "speaker": "client",
              "text": "やはり三田の操作なのに、別の氏名が透かしに入るんですね。では、その原因をお願いします。"
            }
          ]
        },
        "01.q2-pass": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "透かしの氏名が未設定のとき、田中太郎というサンプル名を補うコードが残っていました。実行時も三田さんのIDとは別にその値が入り、別利用者でも同じ透かしを再現しました。"
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
              "text": "今回のウォーターマークの誤表示は、透かし氏名の未設定時にサンプル名が補完されることが原因です。実行利用者の氏名を使う処理への是正と未取得の検知、印刷済み・提出済み資料の確認を提案します。ほかの帳票への影響は別途確認が必要です。"
            },
            {
              "speaker": "client",
              "text": "その説明で三田に共有します。取引先へ提出する資料なので、正しい透かしで出せるようにする範囲と日程も相談させてください。"
            }
          ]
        },
        "01.q1-guess": {
          "version": 1,
          "lines": [
            {
              "speaker": "client",
              "text": "キャッシュかもしれない、という一般論だけでは今回の説明になりません。現物と記録、実際の処理で確認できたことはありますか？"
            }
          ]
        },
        "01.q2-guess": {
          "version": 1,
          "lines": [
            {
              "speaker": "lead",
              "text": "キャッシュかもしれない、という一般論だけでは今回の説明になりません。現物と記録、実際の処理で確認できたことはありますか？"
            }
          ]
        },
        "01.q3-guess": {
          "version": 1,
          "lines": [
            {
              "speaker": "client",
              "text": "キャッシュかもしれない、という一般論だけでは今回の説明になりません。現物と記録、実際の処理で確認できたことはありますか？"
            }
          ]
        },
        "01.q1-missing": {
          "version": 2,
          "lines": [
            {
              "speaker": "client",
              "text": "三田が印刷した資料の透かし、田中さんの退職記録、三田の出力操作。この三つを照合した結果を教えてください。"
            }
          ]
        },
        "01.q2-missing": {
          "version": 1,
          "lines": [
            {
              "speaker": "lead",
              "text": "疑わしい場所は分かった。原因だと、コードだけでなく実行時の値と再現結果で言えるか？"
            }
          ]
        },
        "01.q3-missing": {
          "version": 1,
          "lines": [
            {
              "speaker": "client",
              "text": "原因の話は分かりました。どこまで確認できていて、何を対応すると部署に伝えればいいんですか？ 全部大丈夫という話ではないんですよね？"
            }
          ]
        },
        "01.clear": {
          "version": 3,
          "lines": [
            {
              "speaker": "client",
              "text": "これで三田に返事ができます。最初は、退職した方が今も資料を出せるのかと心配していたんです。調べていただいて、助かりました！"
            },
            {
              "speaker": "lead",
              "text": "よし、お疲れ。あとの段取りは俺の方でやっとく。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "……通じた。集めた手がかりが、相手の不安をほどく説明になった。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "それにしても田中太郎さん、サンプルの中で現役すぎる。……これは報告には書かないでおこう。"
            }
          ]
        },
        "01.timeout": {
          "version": 1,
          "lines": [
            {
              "speaker": "client",
              "text": "部署から、調査結果はまだかと連絡が来ています。PDFの件、回答できますか？"
            },
            {
              "speaker": "player",
              "text": "すみません。まだ原因の裏付けがそろっていません。"
            }
          ]
        },
        "01.report-progress": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "途中経過をご報告します。確認できた記録と、まだ裏付けがない点を整理しています。原因はまだ確定できません。"
            },
            {
              "speaker": "client",
              "text": "調査中として部署に共有します。期限に間に合わないようなら、先に相談してくださいね。"
            }
          ]
        },
        "01.report-cannot": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "今の確認状況では、期限までに原因と影響を裏付けて報告できません。確認済みの記録と残った調査を共有し、期限を相談させてください。"
            },
            {
              "speaker": "client",
              "text": "今日中と伝えているので困りますが、未確認のまま断言されても……。現在の状況をお願いします。"
            }
          ]
        },
        "01.extension": {
          "version": 2,
          "lines": [
            {
              "speaker": "lead",
              "text": "先方には俺の方で報告しておいたから。調査期間を一日のばしてもらった、明日も頑張れ。"
            },
            {
              "speaker": "player",
              "text": "ありがとうございます。今日の調査を引き継いで、明日こそ報告します。"
            }
          ]
        },
        "01.gameover": {
          "version": 2,
          "lines": [
            {
              "speaker": "lead",
              "text": "おい、期限まで何をしていたんだ！ 途中報告もせず、黙って抱え込んでどうする！"
            },
            {
              "speaker": "lead",
              "text": "間に合わないなら、その時点で言え！ こっちは先方への説明も、応援の手配もできないだろ！"
            },
            {
              "speaker": "lead",
              "text": "分からないことを責めているんじゃない。状況を伝えないまま期限を過ぎたことを言っているんだ！"
            },
            {
              "speaker": "lead",
              "text": "今回の担当はここまでだ。調査した内容をまとめて引き継げ。"
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
              "text": "昨日の続きから。記録は残っている。今日は原因と根拠、対応を報告できるところまで詰めよう。"
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
              "text": "すみません、何をおっしゃっているのか、ちょっと分からないのですが……。三田の資料には何が起きているのでしょう？"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "調べた仕組みを並べただけになってしまった。問い合わせと結び付く根拠から組み立てよう。"
            }
          ]
        },
        "01.report-1": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "田中さんの在籍情報や、透かしに氏名を入れる処理を調べました。ただ、今回の印刷資料で何が起きているかを、まだ一つの説明にできていません。"
            },
            {
              "speaker": "client",
              "text": "調査いただいたのは分かったのですが、担当者にはどのように説明すればいいでしょうか？"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "調べたことと、今回の事象を説明できることは別だ。資料と操作、実際の出力を結び付けよう。"
            }
          ]
        },
        "01.report-2": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "今回は、三田さんの出力操作なのに、資料の透かしには退職した田中太郎さんの名前が入る、という事象です。透かしの氏名だけでは、田中さんが最近出力したとは判断できません。"
            },
            {
              "speaker": "player",
              "text": "提出した根拠だけでは、その原因と、確認できた影響・対応までをつないで説明しきれていません。"
            },
            {
              "speaker": "client",
              "text": "事象は分かったのですが、報告書を作成しないといけなくて……。原因や対応についてはどうでしょう？"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "事象は伝わった。なぜ起きるのか、どこまで確認して何を直すのかを、根拠と一緒にそろえよう。"
            }
          ]
        },
        "01.report-3": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "印刷したのは三田さんです。透かしの名前だけが「田中太郎」になっていました。"
            },
            {
              "speaker": "player",
              "text": "氏名の設定が空欄だと、サンプルの名前を入れる処理が原因でした。同じ条件で再現できています。"
            },
            {
              "speaker": "player",
              "text": "今のところ確認できたのは表示の誤りです。退職者の操作や情報漏えいは確認していません。他の帳票や古い記録は、まだ未確認です。"
            },
            {
              "speaker": "player",
              "text": "実際の利用者名を使うよう直し、別の利用者でも試験します。提出済み資料も確認し、本番修正や再提出の日程はご相談させてください。"
            },
            {
              "speaker": "client",
              "text": "……ああ、そういうことだったんですね！ 三田が操作したのに、名前だけが別のものになっていた、と。名前を直す対応と、提出した資料の確認が必要なんですね。"
            },
            {
              "speaker": "client",
              "text": "ありがとうございます！ これなら先方にも説明できます！ 確認できたことと、これからお願いすること、私からきちんと伝えます。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "さっきまで、何から話せばいいか分からなかったのに。……今は、自分の言葉で説明できている。"
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
              "text": "真壁さん、途中報告です。確認できたことと、まだ裏付けがない点、残った調査を共有します。"
            },
            {
              "speaker": "lead",
              "text": "分かった。途中で状況を伝えてくれれば、こっちも先方への説明や期限の相談ができる。引き続き調べてくれ。"
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
        "clear": "01.clear",
        "timeout": "01.timeout",
        "progress": "01.report-progress",
        "cannot": "01.report-cannot",
        "extension": "01.extension",
        "gameover": "01.gameover",
        "extensionUsed": "01.extension-used",
        "nextDay": "01.next-day",
        "dream": "01.dream"
      }
    },
    "problem": {
      "schemaVersion": 1,
      "caseId": "watermark",
      "version": 2,
      "status": "prototype",
      "title": "ウォーターマークの誤表示",
      "requestMemo": "経理の三田が取引先提出用にPDF資料を印刷したところ、5年前に退職した田中太郎の氏名がウォーターマーク（透かし）として入る。三田の名前が入る想定との食い違いについて、今日18:00までに原因と根拠、確認できた影響と対応案を報告する。本番修正と提出先の全件確認は今回の調査範囲外。",
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
      "intuition": {
        "max": 3
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
          "title": "利用者名を使う修正案",
          "text": "サンプル名を利用者名へ。別利用者の試験・提出資料確認も。本番未修正。",
          "source": "再現結果に基づくウォーターマークの対応案",
          "kind": "proposal"
        },
        {
          "id": "wm.frontend",
          "title": "画面・APIは三田の情報",
          "text": "画面の氏名・APIの利用者IDは三田。透かし生成は見つからない。",
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
        "maxMemories": 3,
        "intuitionGainPerNewMemoryLoop": 1
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
        "02.intro": {
          "version": 2,
          "lines": [
            {
              "speaker": "client",
              "text": "経理から、承認画面にボタンを一個追加してほしいって言われてまして。見積もりを頂けますか？"
            },
            {
              "speaker": "player",
              "text": "何をするボタンですか？"
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
              "speaker": "player",
              "kind": "thought",
              "text": "差戻しボタンって、だいぶ面倒なんだけど……。\nワークフローや通知があったり、戻した後は誰が編集できるかとか、影響範囲が大きいけど見えにくいんだよなぁ……。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "**ご想像よりお高い見積もり**になるのは間違いないとして…\nまずは、経理に何をしたいのか確認して…修正範囲を確定して見積もり根拠を準備して回答しないとだな。"
            }
          ]
        },
        "02.request": {
          "version": 1,
          "lines": [
            {
              "speaker": "client",
              "text": "今は承認と却下しかないので、差戻しを追加したいそうです。\n**ボタン一個分の見積もり**でお願いできれば、と。"
            }
          ]
        },
        "02.screen": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "現行画面は承認と却下だけだ。ボタンの配置や、確認画面の作りは参考になる。"
            }
          ]
        },
        "02.business": {
          "version": 1,
          "lines": [
            {
              "speaker": "accountant",
              "text": "領収書が一枚足りないだけでも、却下すると最初から入力し直しなんです。\n修正のお願いも別メールで送っていて。"
            },
            {
              "speaker": "player",
              "text": "内容を直して、もう一度出せるようにしたいんですね。"
            },
            {
              "speaker": "accountant",
              "text": "そうです。ただ、承認済みの内容まで勝手に変わるのは困ります。"
            }
          ]
        },
        "02.workflow": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "却下で申請は終了する。元の申請を編集して再提出する経路はない。"
            }
          ]
        },
        "02.source": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "画面操作からAPI、状態更新までの経路は追えた。個別の改修点を調べられそうだ。"
            }
          ]
        },
        "02.ui": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "却下と区別する配置、理由の入力欄が必要そうだ。見た目の案は作れた。"
            }
          ]
        },
        "02.api": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "ボタンの受付だけではなく、申請の状態を変える処理も必要だ。権限や承認の戻り先が決まれば、その作業を見積もれる。"
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
              "text": "差戻し中に申請者が編集できる権限が必要だ。修正可能な項目と、承認済みの扱いは業務側に確認しよう。"
            }
          ]
        },
        "02.notification": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "差戻し理由を申請者へ伝え、修正・再申請の記録を残す必要がある。通知先と方法はまだ決められない。"
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
              "text": "差戻し、修正、再申請、承認の順ですね。承認をどこから再開するかは別途確認します。"
            }
          ]
        },
        "02.design": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "既存の却下処理を拡張する案と、差戻し用の処理を分ける案がある。業務ルールを固めてから選ぼう。"
            }
          ]
        },
        "02.ai": {
          "version": 1,
          "lines": [
            {
              "speaker": "ai",
              "text": "ボタン、受付API、差戻し状態、通知などが実装候補です。現場の業務ルールは別途確認してください。"
            }
          ]
        },
        "02.ask-makabe": {
          "version": 1,
          "lines": [
            {
              "speaker": "lead",
              "text": "戻す相手と再申請の流れは分かったんだな。編集できる項目と、承認をどこからやり直すかも聞いておいてくれ。"
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
              "text": "今ちょっと別件に入ってる。分かったところを先にまとめておいてくれ。"
            }
          ]
        },
        "02.makabe-vague": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "差戻しボタンって、どこに置けばいいですか？"
            },
            {
              "speaker": "lead",
              "text": "その前に何のために置くんだ？ そもそも画面設計ってのは……。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "話を聞いていたら、45分経っていた。先に三田さんへ聞くべきだった。"
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
              "text": "調べた資料をまとめました。"
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
              "text": "追加できるのは分かりました。では、ボタン一個分の見積もりでお願いできますか？"
            }
          ]
        },
        "02.report-2": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "不備のある申請を差戻し、直して再提出できるようにしたい、という話です。"
            },
            {
              "speaker": "client",
              "text": "やりたいことは分かりました。でも、それでどうして工数がかかるんでしょう？"
            }
          ]
        },
        "02.report-3": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "やりたいことは、不備の修正と再申請を楽にすることです。今の却下では、最初から入力し直しになります。"
            },
            {
              "speaker": "player",
              "text": "三田さんと確認し、差戻し中の編集、元の経路での再承認、通知と履歴までを今回の対象にしました。承認済み申請の変更や承認経路の組み替えは含めません。"
            },
            {
              "speaker": "player",
              "text": "ボタンだけでなく、この処理の改修と試験にも作業がかかります。確認した範囲を根拠に見積もりをお出しします。対象が増える場合は、別途ご相談させてください。"
            },
            {
              "speaker": "client",
              "text": "なるほど、ボタンだけじゃなくて、その後の処理も必要なんですね。それなら経理にも説明できます！"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "最初からそう言ってる……いや、言ってないか。"
            }
          ]
        },
        "02.clear": {
          "version": 1,
          "lines": [
            {
              "speaker": "lead",
              "text": "お疲れ。その範囲なら作業を洗い出せるな。見積もり、まとめよう。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "ボタンの先に、こんなに仕事があったのか。"
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
              "text": "すみません。差戻した後の使い方と、ボタン以外に直すところを整理できていません。"
            }
          ]
        },
        "02.report-progress": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "途中経過です。差戻し後の業務と、追加の確認が必要な範囲を整理しています。"
            },
            {
              "speaker": "client",
              "text": "調査中として部署に共有します。期限に間に合わないようなら、先に相談してくださいね。"
            }
          ]
        },
        "02.report-cannot": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "どう使うのか、どこを直す必要があるのかを、期限までに整理できません。分かったことと残った調査を共有し、期限を相談させてください。"
            },
            {
              "speaker": "client",
              "text": "今日中と伝えているので困りますが、未確認のまま断言されても……。現在の状況をお願いします。"
            }
          ]
        },
        "02.extension": {
          "version": 2,
          "lines": [
            {
              "speaker": "lead",
              "text": "先方には俺の方で報告しておいたから。調査期間を一日のばしてもらった、明日も頑張れ。"
            },
            {
              "speaker": "player",
              "text": "ありがとうございます。今日の調査を引き継いで、明日こそ報告します。"
            }
          ]
        },
        "02.gameover": {
          "version": 2,
          "lines": [
            {
              "speaker": "lead",
              "text": "おい、期限まで何をしていたんだ！ 途中報告もせず、黙って抱え込んでどうする！"
            },
            {
              "speaker": "lead",
              "text": "間に合わないなら、その時点で言え！ こっちは先方への説明も、応援の手配もできないだろ！"
            },
            {
              "speaker": "lead",
              "text": "分からないことを責めているんじゃない。状況を伝えないまま期限を過ぎたことを言っているんだ！"
            },
            {
              "speaker": "lead",
              "text": "今回の担当はここまでだ。調査した内容をまとめて引き継げ。"
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
              "text": "追加の一日まで調整しましたが、今回はここまでにしましょう。調査した事実と未確認事項を引き継いでください。"
            }
          ]
        },
        "02.next-day": {
          "version": 1,
          "lines": [
            {
              "speaker": "lead",
              "text": "昨日の続きから。記録は残っている。今日は戻した後の仕事と、ボタン以外に直すところを詰めよう。"
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
              "text": "方式を比べ直したが、新しい根拠は増えなかった。業務側に確認する条件が残っている。"
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
              "text": "追加できるのは分かりました。では、ボタン一個分の見積もりでお願いできますか？"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "作り方だけでは、なぜそれだけで済まないのか伝わらない。経理が何を楽にしたいかから話そう。"
            }
          ]
        },
        "02.report-workflow": {
          "version": 1,
          "lines": [
            {
              "speaker": "client",
              "text": "不便なのは分かりました。差戻した後は、誰が直して、どう承認に戻るんでしょう？ その処理も見積もりに入るんですか？"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "困っている理由だけでなく、その後の仕事の流れも伝えよう。"
            }
          ]
        },
        "02.report-scope": {
          "version": 1,
          "lines": [
            {
              "speaker": "client",
              "text": "直すところが色々あるのは分かりました。今回はどこまで含める見積もりですか？ 経理とは確認できていますか？"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "改修の候補だけでは見積もりの前提が決まらない。今回やることと、含めないことを確認しよう。"
            }
          ]
        },
        "02.screen-recheck": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "現行画面の配置と操作を見直した。差戻しはこれから追加する機能だから、仕様書に答えがあるわけじゃない。"
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
              "text": "処理の経路をたどり直した。差戻し後の新しい運用を決める情報は、ここにはない。"
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
              "text": "今回は差戻し中の申請だけ直せるようにして、元の承認経路へ戻す形でよいですか？"
            },
            {
              "speaker": "accountant",
              "text": "はい。入力内容と添付を直して出し直せれば十分です。承認済みの申請は変えないでください。"
            },
            {
              "speaker": "player",
              "text": "差戻し理由を残し、申請者に修正を知らせ、再申請したら承認者へ通知するところまで含めます。"
            },
            {
              "speaker": "accountant",
              "text": "それでお願いします。承認の順番を変えたり、過去の申請まで直したりする話は今回なしで。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "今回直すところと、含めないところが決まった。この範囲の改修と試験を見積もればいい。"
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
        "clear": "02.clear",
        "timeout": "02.timeout",
        "progress": "02.report-progress",
        "cannot": "02.report-cannot",
        "extension": "02.extension",
        "gameover": "02.gameover",
        "extensionUsed": "02.extension-used",
        "nextDay": "02.next-day",
        "dream": "02.dream"
      }
    },
    "problem": {
      "schemaVersion": 1,
      "caseId": "approval-button",
      "version": 1,
      "status": "prototype",
      "title": "承認画面へのボタン追加",
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
      "intuition": {
        "max": 3
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
        "maxMemories": 0,
        "intuitionGainPerNewMemoryLoop": 0
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
  }
};
export const {scenario,problem}=cases.watermark;
