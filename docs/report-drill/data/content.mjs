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
              "text": "経理の三田から、取引先に提出用に印刷したPDFの資料に、田中太郎という透かしが入ると問い合わせがありまして。"
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
              "text": "田中さんの呪いですかね～"
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
              "text": "三田さん自身が操作した資料ですね。田中さんの在籍とアカウントの記録も確認できますか？"
            },
            {
              "speaker": "client",
              "text": "三田が自分のアカウントで出力して印刷しています。\n田中さんは5年前に退職して、そのときにアカウントも無効化されています。"
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
              "text": "最新化はされていないようだが、画面側の概要は分かった。\n現行コードと照らそう。"
            }
          ]
        },
        "01.docs-external": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "出力APIから帳票サービスを呼ぶ構成らしい。\n画面がPDFを作るわけではない。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "最新化はされていないようだが、サーバー側の概要は分かった。\n現行ソースでも確認しよう。"
            }
          ]
        },
        "01.docs-detail": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "PDFの透かしにはwatermarkNameという氏名オプションがある。\n未設定時の説明は……ない。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "最新化はされていないようだが、引数の概要は分かった。\n透かしの氏名がどこから来るか追おう。"
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
              "text": "先に資料やログで絞れば、早かったかもしれない。\nPDF処理と設定を確認しよう。"
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
              "text": "45分かけて画面の操作を追った。\n三田さんの情報は正しく、出力APIにも同じIDを渡している。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "画面を直せば終わり、ではなさそうだ。\n透かしを付けるのはサーバー側か。"
            }
          ]
        },
        "01.common-miss": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "日付の書式、文字列の整形、禁則文字。\n詳しくなったが、田中太郎は出てこない。"
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
              "text": "watermarkNameが空なら田中太郎を入れる処理がある。\nコメントは「初期サンプル用」。\n透かしの氏名に、実行利用者の名前を使っていない。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "田中太郎さん、透かしの中で現役だった。\n三田さんの出力もこの処理を通るか確認しよう。"
            }
          ]
        },
        "01.settings": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "標準テンプレートのwatermarkNameは空欄。\n透かしに田中太郎を補う条件に入る。\n誰がいつ設定したかは、この記録では分からない。"
            }
          ]
        },
        "01.logs": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "印刷資料に対応するPDFの出力記録は、三田さんのID U-204の最近の操作と一致した。\nウォーターマークの田中太郎とは違う。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "三田さんが操作した記録と、透かしの氏名が食い違っている。\n氏名を入れる場所を追おう。"
            }
          ]
        },
        "01.logs-wide": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "ログだけで何万行もある。\nどのPDFのどのリクエストか分からないと追い切れない。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "45分。\n現物の確認が先だった。\n条件を絞ってからもう一度見よう。"
            }
          ]
        },
        "01.debug": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "同じ出力経路を検証環境で止めた。\n認証済みIDは三田さんのU-204なのに、透かし用の氏名は田中太郎だ。"
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
              "text": "45分。\nログや呼び出し経路で当たりをつけて、もう一度追おう。"
            }
          ]
        },
        "01.verify": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "三田さんと別の利用者で出力・印刷しても、どちらも田中太郎の透かしになった。\n検証環境で氏名の参照先を実行利用者に切り替えると、それぞれの名前になる。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "空欄時のサンプル名補完が原因だ。\nほかの帳票や、すでに提出された資料の有無までは確認できていない。"
            }
          ]
        },
        "01.response": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "サンプル名の補完をなくし、実行利用者の氏名を透かしに使う。\n氏名未取得の検知と、印刷済み・提出済み資料の確認、別利用者での出力・印刷試験を対応案にまとめた。"
            },
            {
              "speaker": "lead",
              "text": "誰が設定したかは、まだ分からないだろ。\n確認できた原因と影響、是正案で説明しよう。\n調べていない範囲まで大丈夫とは言うなよ。"
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
              "text": "古い名前が残る場合、ブラウザキャッシュや保存済みプロフィールが原因という一般例があります。\n今回の原因を示すものではありません。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "それっぽい。\nでも今のPDFで起きた証拠ではない。"
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
              "text": "印刷した利用者と透かしの氏名が違うんだよな。\nまず三田さんの現物と、それに対応する出力記録を照合しよう。"
            }
          ]
        },
        "01.makabe-specific": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "出力記録は三田さんでした。\n透かしの氏名との違いをどこから追えばいいですか？"
            },
            {
              "speaker": "lead",
              "text": "そこまで絞れたなら、バックエンドの出力経路で透かし用の引数を見よう。\n画面の名前が正しくても、透かしの名前が同じとは限らないぞ。"
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
              "text": "三田さんが印刷した資料には田中太郎の透かしがありますが、出力記録は三田さんのU-204と一致します。\n田中さんは5年前に退職し、アカウントも無効です。実行利用者と透かしの氏名が食い違っています。"
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
              "text": "今回のウォーターマークの誤表示は、透かし氏名の未設定時にサンプル名が補完されることが原因です。\n実行利用者の氏名を使う処理への是正と未取得の検知、印刷済み・提出済み資料の確認を提案します。\nほかの帳票への影響は別途確認が必要です。"
            },
            {
              "speaker": "client",
              "text": "その説明で三田に共有します。\n取引先へ提出する資料なので、正しい透かしで出せるようにする範囲と日程も相談させてください。"
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
              "kind": "thought",
              "text": "……通じた。集めた手がかりが、相手の不安をほどく説明になった。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "それにしても田中太郎さん、サンプルの中で現役すぎる。\n……これは報告には書かないでおこう。"
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
              "text": "すみません。\nまだ原因の裏付けがそろっていません。"
            }
          ]
        },
        "01.report-progress": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "途中経過をご報告します。確認できた記録と、まだ裏付けがない点を整理しています。\n原因はまだ確定できません。"
            },
            {
              "speaker": "client",
              "text": "調査中として部署に共有します。\n期限に間に合わないようなら、先に相談してくださいね。"
            }
          ]
        },
        "01.report-cannot": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "今の確認状況では、期限までに原因と影響を裏付けて報告できません。\n確認済みの記録と残った調査を共有し、期限を相談させてください。"
            },
            {
              "speaker": "client",
              "text": "今日中と伝えているので困りますが、未確認のまま断言されても……。\n現在の状況をお願いします。"
            }
          ]
        },
        "01.extension": {
          "version": 2,
          "lines": [
            {
              "speaker": "lead",
              "text": "先方には俺の方で報告しておいたから。\n調査期間を一日のばしてもらった、明日も頑張れ。"
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
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "田中さんの在籍情報や、透かしに氏名を入れる処理を調べました。\nただ、今回の印刷資料で何が起きているかを、まだ一つの説明にできていません。"
            },
            {
              "speaker": "client",
              "text": "調査いただいたのは分かったのですが、担当者にはどのように説明すればいいでしょうか？"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "調べたことと、今回の事象を説明できることは別だ。\n資料と操作、実際の出力を結び付けよう。"
            }
          ]
        },
        "01.report-2": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "今回は、三田さんの出力操作なのに、資料の透かしには退職した田中太郎さんの名前が入る、という事象です。\n透かしの氏名だけでは、田中さんが最近出力したとは判断できません。"
            },
            {
              "speaker": "player",
              "text": "提出した根拠だけでは、その原因と、確認できた影響・対応までをつないで説明しきれていません。"
            },
            {
              "speaker": "client",
              "text": "事象は分かったのですが、報告書を作成しないといけなくて……。\n原因や対応についてはどうでしょう？"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "事象は伝わった。\nなぜ起きるのか、どこまで確認して何を直すのかを、根拠と一緒にそろえよう。"
            }
          ]
        },
        "01.report-3": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "印刷したのは三田さんです。\n透かしの名前だけが「田中太郎」になっていました。"
            },
            {
              "speaker": "player",
              "text": "氏名の設定が空欄だと、サンプルの名前を入れる処理が原因でした。\n同じ条件で再現できています。"
            },
            {
              "speaker": "player",
              "text": "今のところ確認できたのは表示の誤りです。\n退職者の操作や情報漏えいは確認していません。\n他の帳票や古い記録は、まだ未確認です。"
            },
            {
              "speaker": "player",
              "text": "実際の利用者名を使うよう直し、別の利用者でも試験します。\n提出済み資料も確認し、本番修正や再提出の日程はご相談させてください。"
            },
            {
              "speaker": "client",
              "text": "……ああ、そういうことだったんですね！ 三田が操作したのに、名前だけが別のものになっていた、と。\n名前を直す対応と、提出した資料の確認が必要なんですね。"
            },
            {
              "speaker": "client",
              "text": "ありがとうございます！ これなら先方にも説明できます！ 確認できたことと、これからお願いすること、私からきちんと伝えます。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "さっきまで、何から話せばいいか分からなかったのに。\n……今は、自分の言葉で説明できている。"
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
              "speaker": "lead",
              "kind": "thought",
              "text": "差戻しボタンって、だいぶ面倒なんだけど……。\nワークフローや通知があったり、戻した後は誰が編集できるかとか、影響範囲が大きいけど見えにくいんだよなぁ……。"
            },
            {
              "speaker": "lead",
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
              "text": "現行画面は承認と却下だけだ。\nボタンの配置や、確認画面の作りは参考になる。"
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
              "text": "そうです。\nただ、承認済みの内容まで勝手に変わるのは困ります。"
            }
          ]
        },
        "02.workflow": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "却下で申請は終了する。\n元の申請を編集して再提出する経路はない。"
            }
          ]
        },
        "02.source": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "画面操作からAPI、状態更新までの経路は追えた。\n個別の改修点を調べられそうだ。"
            }
          ]
        },
        "02.ui": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "却下と区別する配置、理由の入力欄が必要そうだ。\n見た目の案は作れた。"
            }
          ]
        },
        "02.api": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "ボタンの受付だけではなく、申請の状態を変える処理も必要だ。\n権限や承認の戻り先が決まれば、その作業を見積もれる。"
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
              "text": "差戻し中に申請者が編集できる権限が必要だ。\n修正可能な項目と、承認済みの扱いは業務側に確認しよう。"
            }
          ]
        },
        "02.notification": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "差戻し理由を申請者へ伝え、修正・再申請の記録を残す必要がある。\n通知先と方法はまだ決められない。"
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
              "text": "差戻し、修正、再申請、承認の順ですね。\n承認をどこから再開するかは別途確認します。"
            }
          ]
        },
        "02.design": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "既存の却下処理を拡張する案と、差戻し用の処理を分ける案がある。\n業務ルールを固めてから選ぼう。"
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
              "text": "戻す相手と再申請の流れは分かったんだな。\n編集できる項目と、承認をどこからやり直すかも聞いておいてくれ。"
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
              "text": "差戻しボタンって、どこに置けばいいですか？"
            },
            {
              "speaker": "lead",
              "text": "その前に何のために置くんだ？\nそもそも画面設計ってのは……。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "話を聞いていたら、45分経っていた。\n先に三田さんへ聞くべきだった。"
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
              "text": "追加できるのは分かりました。\nでは、**ボタン一個分の見積もり**でお願いできますか？"
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
              "text": "やりたいことは分かりました。\nでも、それでどうして工数がかかるんでしょう？"
            }
          ]
        },
        "02.report-3": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "やりたいことは、不備の修正と再申請を楽にすることです。\n今の却下では、最初から入力し直しになります。"
            },
            {
              "speaker": "player",
              "text": "三田さんと確認し、差戻し中の編集、元の経路での再承認、通知と履歴までを今回の対象にしました。\n承認済み申請の変更や承認経路の組み替えは含めません。"
            },
            {
              "speaker": "player",
              "text": "ボタンだけでなく、この処理の改修と試験にも作業がかかります。\n確認した範囲を根拠に見積もりをお出しします。\n対象が増える場合は、別途ご相談させてください。"
            },
            {
              "speaker": "client",
              "text": "なるほど、ボタンだけじゃなくて、その後の処理も必要なんですね。\nそれなら経理にも説明できます！"
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
              "text": "お疲れ。\nその範囲なら作業を洗い出せるな。見積もり、まとめよう。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "ボタンの先に、こんなに処理があったのか。"
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
              "text": "どう使うのか、どこを直す必要があるのかを、期限までに整理できません。\n分かったことと残った調査を共有し、期限を相談させてください。"
            },
            {
              "speaker": "client",
              "text": "今日中と伝えているので困りますが、未確認のまま断言されても……。\n現在の状況をお願いします。"
            }
          ]
        },
        "02.extension": {
          "version": 2,
          "lines": [
            {
              "speaker": "lead",
              "text": "先方には俺の方で報告しておいたから。\n調査期間を一日のばしてもらった、明日も頑張れ。"
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
              "text": "作り方だけでは、なぜそれだけで済まないのか伝わらない。\n経理が何を楽にしたいかから話そう。"
            }
          ]
        },
        "02.report-workflow": {
          "version": 1,
          "lines": [
            {
              "speaker": "client",
              "text": "不便なのは分かりました。\n差戻した後は、誰が直して、どう承認に戻るんでしょう？\nその処理も見積もりに入るんですか？"
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
              "text": "直すところが色々あるのは分かりました。今回はどこまで含める見積もりですか？\n経理とは確認できていますか？"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "改修の候補だけでは見積もりの前提が決まらない。\n今回やることと、含めないことを確認しよう。"
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
              "text": "処理の経路をたどり直した。\n差戻し後の新しい運用を決める情報は、ここにはない。"
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
              "text": "はい。\n入力内容と添付を直して出し直せれば十分です。\n承認済みの申請は変えないでください。"
            },
            {
              "speaker": "player",
              "text": "差戻し理由を残し、申請者に修正を知らせ、再申請したら承認者へ通知するところまで含めます。"
            },
            {
              "speaker": "accountant",
              "text": "それでお願いします。\n承認の順番を変えたり、過去の申請まで直したりする話は今回なしで。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "今回直すところと、含めないところが決まった。\nこの範囲の改修と試験を見積もればいい。"
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
          "version": 1,
          "lines": [
            {
              "speaker": "client",
              "text": "毎朝の手入力を減らしたいそうで。\nまとめて登録できないかと相談が来ています。"
            },
            {
              "speaker": "sales",
              "text": "切りよく**10万円**で引き受けられる？"
            },
            {
              "speaker": "player",
              "text": "CSVとかで登録でしょうか？"
            },
            {
              "speaker": "client",
              "text": "**CSV？**…そう、CSVって言ってたと思うわ。"
            },
            {
              "speaker": "player",
              "text": "…確認して、回答します。"
            },
            {
              "speaker": "lead",
              "kind": "thought",
              "text": "一括登録なら、もうちょっと聞いておきたいことがあるんだけどな……。"
            }
          ]
        },
        "03.makabe-busy": {
          "version": 1,
          "lines": [
            {
              "speaker": "lead",
              "text": "今ちょっと無理。\n要件だけチャットに投げといて。あとで見る。"
            }
          ]
        },
        "03.makabe-vague": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "一括登録って、どう作るのがいいですかね。"
            },
            {
              "speaker": "lead",
              "text": "何を何件入れるんだよ。\n……ああ、手元にまだないのか。まず現物見て。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "具体的なことを何も言ってなかったな、俺。"
            }
          ]
        },
        "03.makabe-macro": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "取引先ごとにExcelの列が違って、全角の数字とか日付とかもばらばらで……。"
            },
            {
              "speaker": "lead",
              "text": "え？ そこ、ExcelマクロでチェックしてCSVにしてから渡せばいいんじゃないの？"
            },
            {
              "speaker": "player",
              "text": "……マクロ？"
            },
            {
              "speaker": "lead",
              "text": "いや、システムに何でも飲ませると面倒だろ。\n入口で弾けるものは弾いとけば？"
            },
            {
              "speaker": "player",
              "text": "今、そういうものを使っているかは聞いていませんでした。"
            },
            {
              "speaker": "lead",
              "text": "あ、俺も今の担当が何を使ってるかは知らんぞ。\n新しく作るなら、誰が面倒を見るかもあるしな。\n取引先、よく書式変えるし。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "マクロか。俺のメモには、一行もなかった。"
            }
          ]
        },
        "03.makabe-costs": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "作業量の概算は出せたんですが、使う側にどの手間が残るかは確認中です。"
            },
            {
              "speaker": "lead",
              "text": "ああ。俺が楽だと思ったやつ、向こうには面倒だったことあるぞ。\n今の担当には聞いてみた方がいいな。"
            }
          ]
        },
        "03.makabe-ready": {
          "version": 1,
          "lines": [
            {
              "speaker": "lead",
              "text": "1日と10日なら、向こうの反応も違うだろうな。"
            },
            {
              "speaker": "player",
              "text": "そうですよね。"
            },
            {
              "speaker": "lead",
              "text": "まあ、俺なら両方持ってくけど。……あ、先方の電話だ。"
            }
          ]
        },
        "03.lunch": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "kind": "thought",
              "text": "昼飯を食べた。午後は眠くならないといいけど。"
            }
          ]
        },
        "03.coffee": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "kind": "thought",
              "text": "コーヒーを飲んだ。熱い。……さて、何をしてたんだっけ。"
            }
          ]
        },
        "03.timeout": {
          "version": 1,
          "lines": [
            {
              "speaker": "client",
              "text": "一括登録の件、その後どうでしょう。\n担当からも聞かれていて。"
            },
            {
              "speaker": "player",
              "text": "すみません。まだ整理しきれていません。"
            }
          ]
        },
        "03.extension": {
          "version": 2,
          "lines": [
            {
              "speaker": "lead",
              "text": "先方には俺の方で報告しておいたから。\n調査期間を一日のばしてもらった、明日も頑張れ。"
            },
            {
              "speaker": "player",
              "text": "ありがとうございます。\n今日の調査を引き継いで、明日こそ報告します。"
            }
          ]
        },
        "03.gameover": {
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
        "03.extension-used": {
          "version": 1,
          "lines": [
            {
              "speaker": "client",
              "text": "追加の一日まで調整しましたが、今回はここまでにしましょう。\n調査した事実と未確認事項を引き継いでください。"
            }
          ]
        },
        "03.dream": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "kind": "thought",
              "text": "夢ならよかった。でも調査は現実だ。"
            }
          ]
        },
        "03.next-day": {
          "version": 1,
          "lines": [
            {
              "speaker": "lead",
              "text": "昨日の続きな。記録は残ってるだろ。……昨日どこまでやったんだっけ。"
            }
          ]
        },
        "03.report-progress": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "今の登録処理と、エラーがあった場合の動きを調べています。"
            },
            {
              "speaker": "client",
              "text": "ありがとうございます。担当から急かされていて……分かったら教えてください。"
            }
          ]
        },
        "03.report-cannot": {
          "version": 1,
          "lines": [
            {
              "speaker": "player",
              "text": "すみません、今日中には結論が出せませんでした。\n今分かっていることからお話ししてもいいですか。"
            },
            {
              "speaker": "client",
              "text": "ええ。\n何も分からないまま待つよりは助かります。"
            }
          ]
        },
        "03.clear": {
          "version": 1,
          "lines": [
            {
              "speaker": "lead",
              "text": "お、話できた？\nじゃ、先方の返事待ちだな。"
            },
            {
              "speaker": "lead",
              "text": "……十万円の話は折原にしとくか。"
            }
          ]
        },
        "03.request": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "kind": "thought",
              "text": "毎朝の手入力を減らしたい、という依頼だ。\nサンプルのExcelが添付されている。自動変換まで引き受けた話ではない。"
            }
          ]
        },
        "03.business": {
          "version": 2,
          "lines": [
            {
              "speaker": "client",
              "text": "担当に朝の手順を確認しました。\n普段は二、三十件、月初で五十件くらい。商品や数量など、六項目ほど入れるそうです。"
            },
            {
              "speaker": "client",
              "text": "数字を半角にしたり、日付を直したりしてから、一件ずつ画面に入れているそうです。\n「そのままコピーできない日がある」ってキレてました。"
            },
            {
              "speaker": "player",
              "text": "手入力だけでなく、その前に直す仕事もあるんですね。"
            }
          ]
        },
        "03.workbook": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "添付のExcelを開いた。商品コード、商品名、数量、単価、納品予定日……。\n数量が全角で、日付も表示が揃っていない。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "一緒に届いた別の取引先の見本は、列順まで違う。\nこれが毎日何件来るのか、どこを直すつもりなのかは、ファイルだけでは分からない。"
            }
          ]
        },
        "03.screen": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "検証環境で、正常なサンプルを一件登録してみた。\n入力チェックを通り、登録番号が出て、テスト用の受信箱にメールが一通届いた。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "送信する六項目と、呼び出している処理の場所は分かった。\nこの入口を使えれば、何件か続けて登録できるかも。"
            }
          ]
        },
        "03.source": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "登録ボタンの先で、入力チェック、DB更新、関連レコード作成、メール送信まで動いている。\n既存テストに、呼び出しに使える入力例もあった。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "あるのは一件ずつ登録する処理だ。\nまとめて登録する入口は、これから作ることになる。"
            }
          ]
        },
        "03.spec": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "仕様書には入力項目と単件登録の流れが載っていた。\nソースのどこを読めばいいか、当たりが付いた。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "一括登録の仕様はない。今回追加したい機能だしな。"
            }
          ]
        },
        "03.mapping": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "Excelの列を登録項目に当てはめ、数字と日付を直した見本を作った。\nこの形なら、既存の入力チェックを通せる。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "届くExcelをそのまま読ませるのか、揃えてから渡してもらうのか。\nここで、作るものが変わるな。"
            }
          ]
        },
        "03.csv-preparation": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "この見本の列順と表記に揃えたCSVを、用意できますか？"
            },
            {
              "speaker": "client",
              "text": "担当が試してくれました。\n今も数字や日付は直しているので、揃えてCSVにするところまでは担当でできるそうです。\n共通で使えるマクロはないそうです。"
            },
            {
              "speaker": "player",
              "text": "では、今回はそのCSVをチェックして登録する範囲で見積もります。\n取引先ごとの自動変換や、マクロを新しく作る費用は別にします。"
            },
            {
              "speaker": "client",
              "text": "分かりました。\nExcelを渡すだけで全部済む、とは伝えないようにします。"
            }
          ]
        },
        "03.csv-preparation-first": {
          "version": 2,
          "lines": [
            {
              "speaker": "client",
              "text": "担当に作業から確認しました。\n毎朝二、三十件、月初で五十件ほど。六項目を、数字や日付を直して転記しているそうです。"
            },
            {
              "speaker": "player",
              "text": "この見本の列順と表記に揃えたCSVを、用意できますか？"
            },
            {
              "speaker": "client",
              "text": "担当が試してくれました。\n今も数字や日付は直しているので、揃えてCSVにするところまでは担当でできるそうです。\n共通で使えるマクロはないそうです。"
            },
            {
              "speaker": "player",
              "text": "では、今回はそのCSVをチェックして登録する範囲で見積もります。\n取引先ごとの自動変換や、マクロを新しく作る費用は別にします。"
            },
            {
              "speaker": "client",
              "text": "分かりました。\nExcelを渡すだけで全部済む、とは伝えないようにします。"
            }
          ]
        },
        "03.operations": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "これから作る機能で、一件でも間違いがあれば全部戻す形だと、\n直したファイルを丸ごと入れ直すことになります。担当の作業はどうなりそうですか？"
            },
            {
              "speaker": "client",
              "text": "直した後、全部の結果をもう一度見ることになりますね。\n通った分を残せるなら、失敗した分を見分けて直したいそうです。"
            },
            {
              "speaker": "player",
              "text": "そちらは結果の一覧や、失敗行だけ送り直す仕組みも要りますね。"
            },
            {
              "speaker": "client",
              "text": "楽になるならありがたいけど、費用次第ですって。\nどちらで頼むかは、まだ決められないわね。"
            }
          ]
        },
        "03.prototype": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "検証用の短いコードを書いて、一件登録を三回呼んだ。\n一件目は成功。二件目は日付が不正で止まり、三件目には進まなかった。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "一件目の登録は残っているし、テスト用メールも届いている。\n止まったから全部なかったことに、とはならないのか。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "これは呼び出し方を試しただけだ。\nこのまま一括登録として渡すわけにはいかない。"
            }
          ]
        },
        "03.related": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "単件登録では、本体と関連レコードを一緒に確定している。\n呼び出しを繰り返しても、ファイル全体で取り消す境界にはならない。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "一括用にまとめて確定するか、一件ずつ確定して結果を残すか。\nどちらも、新しい入口の設計が要る。"
            }
          ]
        },
        "03.related-prototype": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "試作で残った登録番号から追うと、本体と関連レコードが一緒に確定していた。\n二回目の失敗は、前の呼び出しの確定には触れない。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "この呼び方ではそうなる、ということだ。\n一括登録の確定単位は、まだ決めていない。"
            }
          ]
        },
        "03.notification": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "既存の単件処理は、登録を確定してからメールを送っている。\nDBを戻したとしても、一度送ったメールは戻らない。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "まとめて取り消す作りにするなら、通知を送る場所も変えないとな。"
            }
          ]
        },
        "03.notification-prototype": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "試作の登録番号と受信箱を照合した。\n成功した一件目のメールは送信済みで、二件目の失敗では取り消されない。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "単件の確定後に送る仕組みと一致している。\n一括で戻すなら、送信は全体が決まってからにしないと。"
            }
          ]
        },
        "03.notification-followup": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "前に見た単件の通知記録に、今回の試作結果を重ねた。\n二回目で止まっても、一件目のメールは送信済みのままだ。"
            }
          ]
        },
        "03.retry": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "検証環境で、同じ単件入力をもう一度送った。\n登録番号がもう一つ増え、メールももう一通届いた。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "行を残す一括登録なら、前に通った分を見分けないと二重になる。\n結果の記録と、送り直す行の識別も新しく要るな。"
            }
          ]
        },
        "03.retry-prototype": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "試作の入力を直して最初から呼び直すと、前に成功した一件もまた登録された。\n関連レコードも、テスト用メールも増えた。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "正常な行を残す方法では、何が通ったか記録しておかないと。\n失敗行だけ直して渡す手順も要るな。"
            }
          ]
        },
        "03.plan-a": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "入力を全部チェックし、登録はファイル単位でまとめて確定する構成を考えた。\n途中で失敗すれば全件取り消し、通知は全体の確定後に送る。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "結果は単純になる。直した後は、全部もう一度入れる。\nまだ処理案だ。例外や画面まで詰める時間はなさそうだな。"
            }
          ]
        },
        "03.plan-b": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "一件ずつ確定して、通った行と失敗した行の結果を返す構成を考えた。\n通った分を残せるけど、結果を保存して、送り直す行を見分ける仕組みが要る。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "関連更新と通知も、同じ行を二回処理しないようにする。\n便利にはなるけど、作るものが増えるな。"
            }
          ]
        },
        "03.plan-both": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "全件を戻す構成と、通った分を残す構成を並べた。\n前者は結果が単純で、ファイルを全部入れ直す。\n後者はやり直しを減らせるが、結果と再送を管理する必要がある。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "どちらも新しく作る処理だ。\n残る作業を大きく分けて、まず概算を出そう。"
            }
          ]
        },
        "03.estimate-a": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "全件取消の案は、CSVの読取・入力チェック、確定単位と通知の変更、試験。\n所定のCSVを受け取る前提なら、実装と試験で**1日程度**と積んだ。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "詳細設計も通し試験も、まだこれからだ。\n自動変換まで含める数字ではない、とメモしておこう。"
            }
          ]
        },
        "03.estimate-b": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "正常な行を残す案は、結果一覧、行の識別、関連更新、通知と再送の重複対策。\n所定CSVを前提に、実装と試験で**10日程度**と積んだ。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "画面や例外を全部詰めた数字じゃない。\nここから先は詳細設計で変わり得る、という留保も付ける。"
            }
          ]
        },
        "03.estimate-both": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "全件取消の案は、CSVの読取・入力チェック、確定単位と通知の変更、試験。\n所定のCSVを受け取る前提なら、実装と試験で**1日程度**と積んだ。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "詳細設計も通し試験も、まだこれからだ。\n自動変換まで含める数字ではない、とメモしておこう。"
            },
            {
              "speaker": "player",
              "text": "正常な行を残す案は、結果一覧、行の識別、関連更新、通知と再送の重複対策。\n所定CSVを前提に、実装と試験で**10日程度**と積んだ。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "画面や例外を全部詰めた数字じゃない。\nここから先は詳細設計で変わり得る、という留保も付ける。"
            }
          ]
        },
        "03.estimate-missing": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "作業を並べてみたが、単件登録の確定と通知のところが曖昧だ。\n正常な行を残すなら、同じ入力を再送した時の扱いも確認しておきたい。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "どこを変えるか分からないまま、値段だけ書くのは無理があるな。"
            }
          ]
        },
        "03.estimate-missing-structure": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "kind": "thought",
              "text": "登録の確定と関連更新を、どこまでまとめているのか読み切れていない。\nこの境界が分かれば、流用する部分と変える部分を積めそうだ。"
            }
          ]
        },
        "03.estimate-missing-notification": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "kind": "thought",
              "text": "登録の確定単位は分かった。\nただ、通知をいつ送っているかがまだ曖昧だ。取り消す処理と一緒には扱えないよな。"
            }
          ]
        },
        "03.estimate-missing-retry": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "kind": "thought",
              "text": "確定と通知のところは確認できている。\n通った行を残すなら、同じ入力をもう一度送った時も見ておこう。\n必要な重複対策を積む根拠になる。"
            }
          ]
        },
        "03.summary": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "kind": "thought",
              "text": "分かったことと、まだ確認していないことを分けて書き直した。\n調べていないものまで、分かったことにはしない。"
            }
          ]
        },
        "03.libraries": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "CSVの読取ライブラリを比較した。\n文字コードや引用符を扱えて、試験を書きやすい候補が見つかった。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "必要な形式を読むだけなら、候補による作業量の差は小さい。\nここで見積もりが大きく変わることはなさそうだ。\n読んだ後の登録や通知をどう作るかは、別に考えよう。"
            }
          ]
        },
        "03.distributed": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "キューで分けて処理する構成を調べた。\n大量データには使えるが、再送や処理状況を管理する部品も増える。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "必要な規模と比べてからにしよう。\n構成図が立派なだけで採用するのは怖い。"
            }
          ]
        },
        "03.tables": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "参照されていた集計用テーブルまで追った。\nこの登録経路から更新はしていない。今回の修正対象から外せる。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "ここは切り上げよう。\n他の処理まで全部安全、という話ではないけど。"
            }
          ]
        },
        "03.macro-check": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "前処理をマクロにする場合の作業を調べた。\n列の対応や入力チェックは楽になるが、書式変更と誤変換の確認、保守担当が要る。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "今ある共通ツールを使う話ではなかった。\n新しく作るなら別見積もりだし、登録と通知の設計も残るな。"
            }
          ]
        },
        "03.detail": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "結果一覧と例外時の画面を書き始めた。\n関連更新の失敗、送信に失敗したメール、再送の順序……試験の組合せが増えていく。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "今日は調査と概算の回答までだった。\nこの先の詳細設計を全部終えてから、とはいかないな。"
            }
          ]
        },
        "03.recheck": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "同じ箇所を見直したが、新しい記録も入力もなかった。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "これ以上は調べても何も分からなそうだ。"
            }
          ]
        },
        "03.no-progress": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "kind": "thought",
              "text": "この作業、意味あるかな……？"
            }
          ]
        },
        "03.makabe-incident": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "単件登録の確定と、一括で呼ぶ時の境界を見ているんですが。"
            },
            {
              "speaker": "lead",
              "text": "ああ、昔それでメール百通飛ばした。俺が。\n登録だけ戻せば終わり、って思ってたんだよな。"
            },
            {
              "speaker": "player",
              "text": "メールは戻らないですもんね。"
            },
            {
              "speaker": "lead",
              "text": "今の処理は自分で見てくれよ。\n昔のやつと同じとは限らんから。"
            }
          ]
        },
        "03.makabe-again": {
          "version": 2,
          "lines": [
            {
              "speaker": "lead",
              "text": "その話ならさっきの通り。\n俺の経験で、今の担当の仕事まで決めないでくれよ。"
            }
          ]
        },
        "03.progress-early": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "一括登録の件、今ある資料から確認を進めています。\nまだ作り方や見積もりを答えられる段階ではありません。"
            },
            {
              "speaker": "lead",
              "text": "了解。抱えたまま黙られるより助かる。"
            }
          ]
        },
        "03.progress-trial": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "単件を何度か呼ぶ検証用コードで、途中で止めてみました。\n先に登録した分とメールは残っていました。"
            },
            {
              "speaker": "lead",
              "text": "あー、あるな。\nそれをどういう機能にして渡すかは、まだ別の話だな。"
            }
          ]
        },
        "03.progress-scope": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "処理案の作業量は整理していますが、担当に残る作業と準備の範囲はまだ確認中です。"
            },
            {
              "speaker": "lead",
              "text": "うん。先方が思ってる「まとめて」とずれてないか、気になるな。"
            }
          ]
        },
        "03.progress-ready": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "二つの作り方で概算を出しました。\nCSVの準備と、エラーの後に残る作業も担当に確認しました。"
            },
            {
              "speaker": "lead",
              "text": "なら先方の話も聞いてこよう。\n俺の好みで決める話でもないし。"
            }
          ]
        },
        "03.progress-busy": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "調べたことと残っている確認を、記録にまとめました。"
            },
            {
              "speaker": "lead",
              "text": "ごめん今手が離せない。\n置いといて。先方への連絡はこっちからも入れる。"
            }
          ]
        },
        "03.report-0": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "今の登録を調べています。"
            },
            {
              "speaker": "client",
              "text": "ありがとうございます。\nで、私から担当に何と返せばいいかしら。作れそうかと、費用の話を聞きたいんです。"
            }
          ]
        },
        "03.report-csv": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "今の登録処理は使えそうです。\nまだ、一括登録として何を足すかと、作業量を整理しています。"
            },
            {
              "speaker": "client",
              "text": "読めるだけでは、まだ見積もりは出ないのね。\n届いたExcelをどう渡すかも、担当に聞いてみてください。"
            }
          ]
        },
        "03.report-only-a": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "一件でもエラーなら全件取り消す案で、実装と試験は**1日程度**です。\n修正したファイルは、全部入れ直してもらいます。"
            },
            {
              "speaker": "lead",
              "text": "ちょっと待って。作りやすいのは分かったけど、\n毎朝やり直す人の手間は確認した？\n通った分を残す方は、どれくらい変わるんだ。"
            },
            {
              "speaker": "player",
              "text": "担当のやり直し方と、別の作り方も並べて確認します。"
            }
          ]
        },
        "03.report-only-b": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "正常な行を残して、失敗行を直して送り直せる案は、\n実装と試験で**10日程度**の概算です。"
            },
            {
              "speaker": "client",
              "text": "十日？ 折原さん、十万円って言ってませんでした？\n便利なのは分かるけど、もう少し簡単に作る方法はないのかしら。"
            },
            {
              "speaker": "player",
              "text": "全体を戻す作り方も、作業量と使う側の手間を比べてみます。"
            }
          ]
        },
        "03.report-operation": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "全部取り消す案が1日程度、正常な行を残す案が10日程度です。"
            },
            {
              "speaker": "client",
              "text": "そんなに違うのね。\n担当はどこまでファイルを用意して、間違いがあったら何をするのかしら。\nそこが分からないと、この値段で何が楽になるのか判断できないわ。"
            },
            {
              "speaker": "player",
              "text": "準備の範囲と、止まった後の作業を担当に確かめてきます。"
            }
          ]
        },
        "03.report-3": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "担当で列や数字・日付を揃えたCSVを用意して、画面への転記をなくす範囲です。\nExcelの自動変換や、マクロを新しく作る費用は別にしています。"
            },
            {
              "speaker": "player",
              "text": "A案は、エラーが一件でもあれば全件取消。**1日程度**の概算です。\n直した後はファイル全体をもう一度入れて、結果を確認します。"
            },
            {
              "speaker": "player",
              "text": "B案は、正常な行を残して、失敗行を直して再投入。**10日程度**です。\n結果の記録や、関連更新・通知の重複対策を作る分、費用が増えます。"
            },
            {
              "speaker": "player",
              "text": "一括登録の詳細設計と通し試験はこれからで、数字は変わり得ます。\nやり直す手間と費用を比べて、担当の方とも相談していただけますか。"
            },
            {
              "speaker": "client",
              "text": "全部入れ直す手間と、十日分の費用か……。\n二つとも持ち帰って、担当と相談します。前提も一緒に伝えるわね。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "折原さん、もう見積書を開いてる。"
            }
          ]
        }
      },
      "chat": [
        {
          "id": "03.chat.1",
          "at": "09:00",
          "speaker": "lead",
          "text": "佐伯さんの件、よろしく。折原は10万って言ってたけど、まだ何も決まってないからな。"
        },
        {
          "id": "03.chat.2",
          "at": "09:20",
          "speaker": "lead",
          "text": "コーヒーを淹れ直したら、朝のやる気が少し戻った。少しだけ。"
        },
        {
          "id": "03.chat.3",
          "at": "09:50",
          "speaker": "lead",
          "text": "前の案件、担当に聞いたら想像してた手順と全然違った。会議の説明だけで分かった気になるの怖いな。"
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
          "text": "別件の障害対応。しばらく反応遅れます。"
        },
        {
          "id": "03.chat.6",
          "at": "11:20",
          "speaker": "lead",
          "text": "復旧。再起動で直った。直った理由はまだ分からない。こういうのが一番嫌。"
        },
        {
          "id": "03.chat.7",
          "at": "11:40",
          "speaker": "lead",
          "text": "便利な方がいい、って言うのは簡単なんだよな。毎日使う人はまた違うこと言うし。"
        },
        {
          "id": "03.chat.8",
          "at": "12:10",
          "speaker": "lead",
          "text": "昼飯を早く決めるために店の比較表を作った。結果、昼が終わりそう。"
        },
        {
          "id": "03.chat.9",
          "at": "13:00",
          "speaker": "lead",
          "text": "会議で一番長く喋ったやつが議事録書くルールにしたい。"
        },
        {
          "id": "03.chat.10",
          "at": "14:00",
          "speaker": "lead",
          "text": "何でも顧客に決めてもらえばいいわけじゃないぞ。使う人に聞く話と、こっちで決める話はある。"
        },
        {
          "id": "03.chat.11",
          "at": "15:10",
          "speaker": "lead",
          "text": "調査資料が30ページあると、読んだ人も頑張った気になる。俺もなる。"
        },
        {
          "id": "03.chat.12",
          "at": "16:00",
          "speaker": "lead",
          "text": "議事録、俺が書くことになった。納得いかん。"
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
        "dream": "03.dream"
      }
    },
    "problem": {
      "schemaVersion": 1,
      "caseId": "bulk-import",
      "version": 2,
      "status": "prototype",
      "title": "一括登録機能",
      "titleQuote": "「まとめて登録できないかしら？」",
      "closingNote": "両案の概算と前提、担当に残る作業を説明し、佐伯が利用部署へ持ち帰りました。採用判断と詳細設計はこれからです。",
      "requestMemoTitle": "朝の手入力をまとめたい",
      "requestMemo": "毎朝の手入力を減らしたいと、佐伯さんから相談が来た。\n\nサンプルのExcelが添付されている。まとめて登録したいという話だが、担当の手順や、どこまで自動化するかはまだ分からない。",
      "requestPurpose": "現場の作業と登録処理を調べ、実現方法と見積もりを佐伯さんに報告する。",
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
      "intuition": {
        "max": 3
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
        "maxMemories": 0,
        "intuitionGainPerNewMemoryLoop": 0
      },
      "questions": [
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
    }
  }
};
export const {scenario,problem}=cases.watermark;
