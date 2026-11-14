// Generated from docs Markdown. Do not edit.
export const scenario = {
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
          "speaker": "sales",
          "text": "経理の三田から、取引先に提出用に印刷したPDFの資料に、田中太郎という透かしが入ると問い合わせがありまして。"
        },
        {
          "speaker": "sales",
          "text": "調べたところ、田中太郎という社員は5年前に退職していて今はいなくて。"
        },
        {
          "speaker": "sales",
          "text": "そもそも、三田が印刷していますから、三田の名前が透かしで入るものだと思うのですが。"
        },
        {
          "speaker": "player",
          "text": "三田さんが印刷した資料に、退職した方の名前が透かしで入るんですね。"
        },
        {
          "speaker": "sales",
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
          "speaker": "sales",
          "text": "三田から届いた印刷資料がこちらです。ウォーターマークは田中太郎になっています。取引先に提出する前に気づいたそうです。"
        },
        {
          "speaker": "player",
          "text": "三田さん自身が操作した資料ですね。田中さんの在籍とアカウントの記録も確認できますか？"
        },
        {
          "speaker": "sales",
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
          "speaker": "sales",
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
          "speaker": "sales",
          "text": "その説明で三田に共有します。取引先へ提出する資料なので、正しい透かしで出せるようにする範囲と日程も相談させてください。"
        }
      ]
    },
    "01.q1-guess": {
      "version": 1,
      "lines": [
        {
          "speaker": "sales",
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
          "speaker": "sales",
          "text": "キャッシュかもしれない、という一般論だけでは今回の説明になりません。現物と記録、実際の処理で確認できたことはありますか？"
        }
      ]
    },
    "01.q1-missing": {
      "version": 2,
      "lines": [
        {
          "speaker": "sales",
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
          "speaker": "sales",
          "text": "原因の話は分かりました。どこまで確認できていて、何を対応すると部署に伝えればいいんですか？ 全部大丈夫という話ではないんですよね？"
        }
      ]
    },
    "01.clear": {
      "version": 3,
      "lines": [
        {
          "speaker": "sales",
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
          "speaker": "sales",
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
          "speaker": "sales",
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
          "speaker": "sales",
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
          "speaker": "sales",
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
          "speaker": "sales",
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
          "speaker": "sales",
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
          "speaker": "sales",
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
          "speaker": "sales",
          "text": "……ああ、そういうことだったんですね！ 三田が操作したのに、名前だけが別のものになっていた、と。名前を直す対応と、提出した資料の確認が必要なんですね。"
        },
        {
          "speaker": "sales",
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
      "speaker": "sales",
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
      "speaker": "sales",
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
};
export const problem = {
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
      "to": "sales",
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
};
