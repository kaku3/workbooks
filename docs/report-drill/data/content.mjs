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
              "text": "何を何件入れるんだよ。……ああ、まだ見てないのか。現物見てから来て。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "何も見てないの、バレた。"
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
              "text": "**……Excelマクロ？**"
            },
            {
              "speaker": "lead",
              "text": "いや、システムに何でも食わせると面倒だろ。\nExcelでできることはExcelにやらせれば？"
            },
            {
              "speaker": "player",
              "text": "そういうものなのですね？全然発想がなかったです。"
            },
            {
              "speaker": "lead",
              "text": "システム側で作ると、Excelの書式が変わるたびに修正が入るから面倒なんだよね。毎回**『10万円で』**って言うのも感じ悪いし。システムに入れて初めてエラーが分かるってのも、使いづらいだろうし。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "Excelマクロか。\nそういえば、死んだばーちゃんが「Excelがなくならない限り、VBAもなくならない」って言ってたのは、このことか。"
            }
          ]
        },
        "03.makabe-costs": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "一応、作業量は出したんですけど。使う人の手間って、そんなに気にした方がいいですかね。"
            },
            {
              "speaker": "lead",
              "text": "そりゃいいに決まってる。\n納品日直前に**『依頼内容と違う、いま中に直してください』**って言われるんだぞ。"
            },
            {
              "speaker": "player",
              "text": "え、細かいところは依頼されてないですよね？"
            },
            {
              "speaker": "lead",
              "text": "確認しなかったところは、空中戦で負けて泣き寝入りするって覚えておいた方がいい。"
            }
          ]
        },
        "03.makabe-ready": {
          "version": 1,
          "lines": [
            {
              "speaker": "lead",
              "text": "１日と１０日か。まぁそうだよな。"
            },
            {
              "speaker": "player",
              "text": "ですよね。どっちが通りますかね？"
            },
            {
              "speaker": "lead",
              "text": "使うの俺らでも**佐伯さんでもないから**、最低限お客さんが困らなければ、変に障害の要因となるような処理を作り込まない方が好まれるような気はするかな。\n……あ、先方の電話だ。"
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
              "text": "一括登録の件、その後どうでしょう。担当からも聞かれていて。"
            },
            {
              "speaker": "player",
              "text": "あ、すみません。もう少し……。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "まったくメドが立っていない…残業しても今日中に終わるかも分からない…"
            }
          ]
        },
        "03.extension": {
          "version": 2,
          "lines": [
            {
              "speaker": "lead",
              "text": "佐伯さんには俺から話しておく。一日だけ延ばしてもらおう。"
            },
            {
              "speaker": "player",
              "text": "ありがとうございます。助かります。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "助かったけど、明日もこれやるのか……。"
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
              "text": "**分からないなら分からないって言ってくれよ！**\n何も言われなきゃ、こっちは順調だと思うだろうが！"
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
              "text": "昨日の続きよろしく。\nもう延ばせないから、なんとかやってみてくれ。"
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
              "text": "ちゃんと案を持ち帰ってもらえたな。つぎは、先方の返事が来たら動けばいいから。\nいったんは、おつかれさん。"
            }
          ]
        },
        "03.request": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "kind": "thought",
              "text": "毎朝の手入力を減らしたい、か。Excelも付いてる。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "これを画面からポチポチ入力して登録はダルそう…CSVでまとめて登録はしたそう。"
            }
          ]
        },
        "03.business": {
          "version": 2,
          "lines": [
            {
              "speaker": "client",
              "text": "担当に朝の手順を確認しました。普段は２～３０件、月初で５０件くらい。商品や数量など、６項目ほど入れるそうです。"
            },
            {
              "speaker": "client",
              "text": "一件ずつ画面にコピペして入力しているけど、数字が全角半角バラバラだったり日付がおかしかったりしてエラーになるってキレてました。"
            },
            {
              "speaker": "player",
              "text": "アプリ側の入力は融通効かないですからね…。"
            }
          ]
        },
        "03.workbook": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "添付のExcelを開いた。商品コード、商品名、数量、単価、納品予定日……。数量が全角で、日付も表示が揃っていない。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "もう一個のファイル、列の順番まで違う。\n……プログラムって**『思った通り』には動かない**んだけどなあ…。"
            }
          ]
        },
        "03.screen": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "検証環境で、適当なデータを１件登録してみた。登録番号が出て、テスト用の受信箱にメールも１通届いた。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "これを繰り返せばいけるんじゃないか？\nひょっとして**チョロい？**"
            }
          ]
        },
        "03.source": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "登録ボタンの先で、入力チェック、DB更新、関連レコード作成、メール送信まで動いている。既存テストに、呼び出しに使える入力例もあった。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "思ったよりいろいろやってるな……。でもAPIを呼ぶだけなら楽そう。"
            }
          ]
        },
        "03.spec": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "仕様書には入力項目と単件登録の流れが載っていた。ソースの**どこを読めばいいか**はだいたい分かった。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "**既存のコードをできるだけいじらずに**一括登録を追加する方法を考えないとなのか…。"
            }
          ]
        },
        "03.mapping": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "player: サンプルでもらったExcelのデータを登録画面にコピペしてみた。数字と日付でエラーが出たけど、直したら既存のチェックは通った。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "……この変換プログラム書くの結構めんどくさそう。"
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
              "text": "お願いします。\n**頼まれていないもの**を作っても予算おりないですからね。"
            }
          ]
        },
        "03.csv-preparation-first": {
          "version": 2,
          "lines": [
            {
              "speaker": "client",
              "text": "担当に作業から確認しました。毎朝２～３０件、月初で５０件ほど。６項目を、数字や日付を直して転記しているそうです。"
            },
            {
              "speaker": "player",
              "text": "この見本の列順と表記に揃えたCSVを、用意できますか？"
            },
            {
              "speaker": "client",
              "text": "担当が試してくれました。今も数字や日付は直しているので、揃えてCSVにするところまではできるそうです。共通で使えるマクロはないそうです。"
            },
            {
              "speaker": "player",
              "text": "じゃあ、今回はそのCSVを登録するところまでで見積もります。Excelを自動で直す仕組みは別、ということで。"
            },
            {
              "speaker": "client",
              "text": "お願いします。\n**頼まれていないもの**を作っても予算おりないですからね。"
            }
          ]
        },
        "03.operations": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "もし１件でもエラーがあったら、ファイルを全部直して入れ直す、という作り方もあるんですが。運用的にはどうですかね。"
            },
            {
              "speaker": "client",
              "text": "全部、ですか。担当は嫌がりそうね。通った分だけ残せないんですか？"
            },
            {
              "speaker": "player",
              "text": "できますけど、そっちはちょっと作るものが増えるんですよね。"
            },
            {
              "speaker": "client",
              "text": "じゃあ費用を見ないと決められないわね。"
            }
          ]
        },
        "03.prototype": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "検証用の短いコードを書いて、一件登録を３回呼んだ。\n１件目は成功。２件目は日付が不正で止まり、３件目には進まなかった。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "そうか…２件目で失敗したら止めるとか続けるとかを考えてなかった。１件目のデータは残ってるし。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "ゴミデータが残るのも困るだろうけど、１件ずつ登録していた処理のロールバックってどうやるんだ…。"
            }
          ]
        },
        "03.related": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "単件登録では、本体と関連レコードを一緒に確定している。\n一括登録でエラーが出ても確定したものはそのままにさせてほしいな…。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "でも、このまま簡単なエラー処理のつもりで作って、あとで**思ってたのと違う**って言われても面倒だよなぁ…。\n**異常系考えるの面倒くさいな。**"
            }
          ]
        },
        "03.related-prototype": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "試作で残った登録番号を追うと、本体と関連レコードが一緒に確定していた。２回目で失敗しても、１回目は残っている。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "そりゃ１件ずつ登録してるんだからそうか。……全部戻すって、思ったより面倒では？"
            }
          ]
        },
        "03.notification": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "単件登録では、確定してからメールを送っている。DBのデータを戻しても、送ったメールは戻らない。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "あー、メールもあった。取り消したのに通知だけ届くの、まずいよな……。"
            }
          ]
        },
        "03.notification-prototype": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "試作の登録番号と受信箱を見比べた。１件目のメールはもう届いている。２件目で止まっても消えない。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "……メールって取り消せないよな。送るタイミング、変えないとダメか。"
            }
          ]
        },
        "03.notification-followup": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "さっきの試作をもう一度見た。２件目で止まっても、１件目のメールは届いたままだ。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "うん、さっき見た通りだ。"
            }
          ]
        },
        "03.retry": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "検証環境で、同じ入力をもう一度送った。登録番号がもう一つ増え、メールももう１通届いた。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "あ、二重登録できちゃうのか。……失敗した分だけ送り直すって、どうやって見分けるんだ？"
            }
          ]
        },
        "03.retry-prototype": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "試作の入力を直して最初からやり直したら、前に成功した一件までまた登録された。メールも増えた。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "げ。直したファイルをそのまま投げ直すのはダメか。どこまで通ったか、覚えておかないと。"
            }
          ]
        },
        "03.plan-a": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "最初に全件チェックして、問題なければまとめて登録する形を考えた。途中で失敗したら全部取り消す。メールも最後に送る。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "こっちならまだ何とかなりそう。全部やり直しになるけど……まあ、使うの俺じゃないし。いや、そこが問題か。"
            }
          ]
        },
        "03.plan-b": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "一件ずつ登録して、成功と失敗を分けて返す形も考えた。失敗分だけやり直せるが、結果の記録と二重登録の対策が要る。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "こっちの方が親切そうだけど、急にやること増えたな……。"
            }
          ]
        },
        "03.plan-both": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "全部取り消す案と、通った分を残す案を並べた。前者は作るのが比較的簡単で、後者はやり直しが少なくて済む。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "どっちがいいんだ、これ。……とりあえず工数を出すか。"
            }
          ]
        },
        "03.estimate-a": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "全件取消の案。CSVの読取とチェック、確定と通知の変更、試験をざっと積んで、所定のCSVを受け取るなら**1日程度**。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "一日か。これなら折原さんの十万円でも何とか……いや、勝手に決めるな俺。"
            }
          ]
        },
        "03.estimate-b": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "正常な行を残す案。結果一覧、行の識別、関連更新、通知、二重登録の対策まで入れて、**１０日程度**。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "１０日……。１日との差、でかすぎないか。どこか見落としてる？"
            }
          ]
        },
        "03.estimate-both": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "全件取消の案は、CSVの読取とチェック、確定と通知の変更、試験で**１日程度**。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "１日なら、まあ……。"
            },
            {
              "speaker": "player",
              "text": "正常な行を残す案は、結果一覧、行の識別、関連更新、通知、二重登録の対策で**１０日程度**。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "１０日！？ ……いや、自分で積んだんだけど。"
            }
          ]
        },
        "03.estimate-missing": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "工数を並べてみたけど、登録がどこで確定するか、メールがいつ飛ぶかがよく分からない。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "このまま１日って書いて、後で増えたら怒られるよな……。"
            }
          ]
        },
        "03.estimate-missing-structure": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "kind": "thought",
              "text": "本体と関連レコード、どこまで一緒に確定してるんだ？ そこが分からないと、何を直すのかも分からん。"
            }
          ]
        },
        "03.estimate-missing-notification": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "kind": "thought",
              "text": "登録の確定は分かった。でもメール、いつ飛んでるんだこれ。……後で見ようと思って忘れてた。"
            }
          ]
        },
        "03.estimate-missing-retry": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "kind": "thought",
              "text": "登録とメールは見た。けど、同じファイルをもう一回入れたらどうなるんだ？ ……考えたくないけど試すか。"
            }
          ]
        },
        "03.summary": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "kind": "thought",
              "text": "分かったことと、まだ分からないことを書き出した。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "……思ったより、分からないこと多いな。"
            }
          ]
        },
        "03.libraries": {
          "version": 3,
          "lines": [
            {
              "speaker": "player",
              "text": "CSVを読むライブラリをいくつか見た。文字コードや引用符も扱えそうだ。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "ここは既製品でよさそう。……よし、一個片付いた。登録処理はまだだけど。"
            }
          ]
        },
        "03.distributed": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "キューで分けて処理する方法も調べた。再送や進捗を管理する仕組みまで必要らしい。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "なんか格好いいけど、５０件だよな……。やめとくか。"
            }
          ]
        },
        "03.tables": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "参照されていた集計用テーブルまで追った。この登録処理からは更新していない。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "関係なさそうだな。……これ以上掘ると帰れなくなる。"
            }
          ]
        },
        "03.macro-check": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "Excelマクロで前処理する場合も調べた。列の対応やチェックはできそうだが、書式が変わったら直す人が要る。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "マクロ作るのも結局仕事か。……今回の見積もりに混ぜたら面倒そうだな。"
            }
          ]
        },
        "03.detail": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "結果一覧の画面まで考え始めた。関連更新の失敗、メール送信失敗、再送の順序……試験の組合せが増えていく。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "あれ、これ今日中に全部決めるんだっけ。……いや、概算を返す日だ。"
            }
          ]
        },
        "03.recheck": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "さっき見たところをもう一度開いた。特に新しいことは分からなかった。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "……何か見落としてる気がしたんだけどな。"
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
              "text": "１件ずつ登録する処理を繰り返すと、途中で止まっても前の分が残るんですよね。"
            },
            {
              "speaker": "lead",
              "text": "ああ、昔それでメール１００通飛ばした。俺が。"
            },
            {
              "speaker": "player",
              "text": "１００通！？"
            },
            {
              "speaker": "lead",
              "text": "登録だけ戻せばいいと思ってたんだよな。今の処理は自分で見てくれよ。"
            }
          ]
        },
        "03.makabe-again": {
          "version": 2,
          "lines": [
            {
              "speaker": "lead",
              "text": "さっきも言ったろ。俺がやらかした話はしたけど、今の処理まで知ってるわけじゃないぞ。"
            }
          ]
        },
        "03.progress-early": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "一括登録の件、まだ調べてます。すみません、見積もりはもう少しかかりそうです。"
            },
            {
              "speaker": "lead",
              "text": "了解。分かった。先方にはそう言っとく。"
            }
          ]
        },
        "03.progress-trial": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "一件登録を繰り返してみたら、途中で止まっても前の分が残っちゃいました。メールも。"
            },
            {
              "speaker": "lead",
              "text": "あー、そうなるか。で、どうするつもり？"
            },
            {
              "speaker": "player",
              "text": "……それを今考えてます。"
            }
          ]
        },
        "03.progress-scope": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "作業量はだいたい見えてきたんですけど、Excelをどこまでこっちで直すのか、まだ確認できてなくて。"
            },
            {
              "speaker": "lead",
              "text": "あー、そこ後から増えると面倒だぞ。"
            }
          ]
        },
        "03.progress-ready": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "二つの作り方で見積もりました。CSVを誰が用意するかも確認できました。"
            },
            {
              "speaker": "lead",
              "text": "じゃあ話せそうだな。……１０万円の件は折原に任せよう。"
            }
          ]
        },
        "03.progress-busy": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "今分かってること、まとめて置きました。"
            },
            {
              "speaker": "lead",
              "text": "ごめん、今見られない。置いといて。先方にはこっちからも連絡しとく。"
            }
          ]
        },
        "03.report-0": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "今の登録処理を調べてます。"
            },
            {
              "speaker": "client",
              "text": "ありがとうございます。……で、担当には何て言えばいいかしら。できそうか、費用はいくらかって聞かれてるんです。"
            }
          ]
        },
        "03.report-csv": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "今の登録処理は使えそうです。たぶん。ただ、一括にするにはもう少し調べないと……。"
            },
            {
              "speaker": "client",
              "text": "なるほど。Excelを渡せば済むのかも、担当に確認してもらえますか。"
            }
          ]
        },
        "03.report-only-a": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "１件でもエラーがあれば全部取り消す方法なら、**１日程度**で作れそうです。直したらファイルごと入れ直してもらう形です。"
            },
            {
              "speaker": "lead",
              "text": "１日なら早いな。……で、毎朝それをやる人は大丈夫なのか？"
            },
            {
              "speaker": "player",
              "text": "あ……そこ、まだ聞いてないです。"
            }
          ]
        },
        "03.report-only-b": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "正しい行だけ残して、失敗した分をやり直せる方法なら、**１０日程度**です。"
            },
            {
              "speaker": "client",
              "text": "１０日？ 折原さん、１０万円って言ってませんでした？ もっと簡単な方法はないのかしら。"
            },
            {
              "speaker": "player",
              "text": "……一応、別のやり方も考えてみます。"
            }
          ]
        },
        "03.report-operation": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "全部取り消すなら１日、通った分を残すなら１０日くらいです。"
            },
            {
              "speaker": "client",
              "text": "そんなに違うんですか。担当が何を準備して、失敗したら何をやり直すのかも教えてください。値段だけじゃ決められませんから。"
            },
            {
              "speaker": "player",
              "text": "あ、そこも確認してきます。"
            }
          ]
        },
        "03.report-3": {
          "version": 2,
          "lines": [
            {
              "speaker": "player",
              "text": "今回は、担当の方に列や数字、日付を揃えたCSVを用意してもらって、画面への手入力をなくすところまでです。Excelの自動変換は入れてません。"
            },
            {
              "speaker": "player",
              "text": "１件でもエラーがあれば全部取り消す方法なら、**１日程度**。直したらファイルを丸ごと入れ直します。"
            },
            {
              "speaker": "player",
              "text": "正しい行は残して、失敗した分だけやり直せる方法なら、**１０日程度**。結果の記録や二重登録の対策が必要なので、結構増えます。"
            },
            {
              "speaker": "player",
              "text": "どちらも概算です。……担当の方と相談して、どっちがいいか決めてもらえますか。"
            },
            {
              "speaker": "client",
              "text": "１日と１０日か……。持ち帰って聞いてみます。何をやってもらうかも、一緒に伝えますね。"
            },
            {
              "speaker": "player",
              "kind": "thought",
              "text": "折原さん、もう見積書開いてる。早いな。"
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
