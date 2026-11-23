"""Render the approved 34-second trailer using the original capture assets.

Requires Python, Pillow, Node.js and an FFmpeg build with libx264.
PROMO_FFMPEG / PROMO_FONT / PROMO_WORK can override local tool paths.
"""
import argparse
import json
import os
from pathlib import Path
import re
import struct
import subprocess

from PIL import Image, ImageDraw, ImageEnhance, ImageFont

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parents[2]
CAPTURE = ROOT / 'promo-capture'
WORK = Path(os.environ.get('PROMO_WORK', str(REPO / 'artifacts/design-block-promo-edit')))
FFMPEG = os.environ.get('PROMO_FFMPEG', str(REPO / '26_report-drill/docs/promo/promo-capture/.runtime/edit/imageio_ffmpeg/binaries/ffmpeg-win64-v4.2.2.exe'))
FONT = os.environ.get('PROMO_FONT', 'C:/Windows/Fonts/YuGothB.ttc')
SIZE = (1920, 1080)
FPS = 30
NAVY = '#0d1523'
WHITE = '#f5f7ff'
CYAN = '#a8e6ed'
GOLD = '#ffd18a'
ENCODE = ['-an', '-c:v', 'libx264', '-preset', 'fast', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', '30', '-threads', '4', '-video_track_timescale', '15360']
TEXT_BOXES = []


def run(args, cwd=None):
    result = subprocess.run([FFMPEG, '-hide_banner', '-loglevel', 'error', '-y'] + list(map(str, args)), cwd=cwd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, creationflags=subprocess.CREATE_NO_WINDOW)
    if result.returncode:
        raise RuntimeError(result.stderr.decode('utf-8', 'replace')[-6000:])
    return result


def face(size):
    return ImageFont.truetype(FONT, size)


def measure(text, font):
    return font.getsize(text)[0]


def draw_text(draw, pos, text, font, fill=WHITE, record=True):
    x, y = pos
    if hasattr(draw, 'textbbox'):
        bounds = draw.textbbox(pos, text, font=font)
    else:
        width, height = font.getsize(text)
        dx, dy = font.getoffset(text)
        bounds = (x + dx, y + dy, x + width, y + height)
    if record:
        assert bounds[0] >= 90 and bounds[2] <= 1830, (text, bounds)
        assert bounds[1] >= 50 and bounds[3] <= 1026, (text, bounds)
        TEXT_BOXES.append({'text': text, 'bounds': bounds})
    draw.text(pos, text, font=font, fill=fill)


def centered(draw, y, text, font, fill=WHITE):
    draw_text(draw, ((1920 - measure(text, font)) / 2, y), text, font, fill)


def wrap(text, font, width):
    lines, line = [], ''
    for char in text:
        if char == '\n':
            lines.append(line)
            line = ''
        elif line and measure(line + char, font) > width and char not in '、。？！…）':
            lines.append(line)
            line = char
        else:
            line += char
    if line:
        lines.append(line)
    return lines


def load_dialogue():
    source = (ROOT.parents[1] / 'src/story-data.mjs').as_uri()
    code = 'import {scenes} from ' + json.dumps(source) + '; console.log(JSON.stringify(scenes));'
    raw = json.loads(subprocess.check_output(['node', '--input-type=module', '-e', code], encoding='utf-8'))
    for lines in raw.values():
        for line in lines:
            line['text'] = line['text'].replace('**', '').replace('<br>', '\n').rstrip()
    return raw


DIALOGUE = load_dialogue()
INTRO = DIALOGUE['01-01.intro'][0]['text']
INTRO_LINES = INTRO.split('。', 1)
INTRO_LINES[0] += '。'
assert ''.join(INTRO_LINES) == INTRO
SPEAKERS = {'client': '担当・佐伯', 'lead': '先輩・真壁', 'player': 'あなた'}


def intro_frame(frame):
    im = Image.new('RGB', SIZE, '#090d15')
    draw = ImageDraw.Draw(im)
    fonts = [face(84), face(106)]
    ys = [382, 525]
    # 8 static thumbnail frames, 58 typing frames, then 54 reading frames.
    if frame < 8:
        count = len(INTRO)
    else:
        count = min(len(INTRO), int((frame - 8) / 58 * len(INTRO)))
    remaining = count
    cursor = None
    for i, line in enumerate(INTRO_LINES):
        shown = line[:max(0, remaining)]
        x = (1920 - measure(line, fonts[i])) / 2
        if shown:
            draw_text(draw, (x, ys[i]), shown, fonts[i], WHITE if i == 0 else GOLD, record=False)
        if 8 <= frame < 66 and remaining <= len(line) and cursor is None:
            cursor = (x + measure(shown, fonts[i]) + 8, ys[i] + 22, ys[i] + fonts[i].size + 8)
        remaining -= len(line)
    if cursor:
        x, top, bottom = cursor
        draw.rectangle((x, top, x + 4, bottom), fill=CYAN)
    return im


def dialogue_layers(index):
    line = DIALOGUE['01-02.intro'][index + 1]
    source = CAPTURE / 'screenshots' / ('08-order-help-%02d.png' % (index + 2))
    bg = Image.open(str(source)).convert('RGB')
    # The source already blurs the UI behind the characters. Preserve the cast.
    bg = ImageEnhance.Brightness(bg).enhance(.94)
    overlay = Image.new('RGBA', SIZE)
    draw = ImageDraw.Draw(overlay)
    draw.rectangle((0, 800, 1920, 1080), fill=NAVY)
    draw.rectangle((96, 837, 102, 1005), fill=CYAN)
    draw_text(draw, (130, 817), SPEAKERS[line['speaker']], face(32), CYAN)
    lines = wrap(line['text'], face(54), 1656)
    if index == 0:
        before, after = line['text'].split('できないって', 1)
        lines = [before, 'できないって' + after]
    assert len(lines) <= 2, lines
    for row, text in enumerate(lines):
        draw_text(draw, (130, 874 + row * 72), text, face(54))
    if index == 0:
        draw.rectangle((96, 88, 970, 270), fill=(11, 21, 35, 237))
        draw.rectangle((96, 88, 102, 270), fill=GOLD)
        draw_text(draw, (130, 111), '未経験なのに経験5年として', face(50), GOLD)
        draw_text(draw, (130, 184), '現場に投入された主人公', face(50))
    return bg, overlay


def gameplay_overlay(text):
    overlay = Image.new('RGBA', SIZE)
    draw = ImageDraw.Draw(overlay)
    draw.rectangle((0, 0, 1920, 122), fill=(9, 17, 30, 248))
    draw.rectangle((96, 54, 102, 110), fill=CYAN)
    draw_text(draw, (128, 50), text, face(57))
    return overlay


def title_overlay():
    im = Image.new('RGBA', SIZE)
    draw = ImageDraw.Draw(im)
    draw.rectangle((0, 824, 1919, 1079), fill=NAVY)
    draw.line((0, 824, 1919, 824), fill='#426677', width=2)
    centered(draw, 853, '株式会社コウカンゲンで 案件をこなして未経験からエンジニアに', face(47))

    # Center the badge against the visible glyphs, including the font's vertical offset.
    badge_text = Image.new('L', (540, 100))
    ImageDraw.Draw(badge_text).text((12, 12), '無料・ブラウザで遊べる', font=face(37), fill=255)
    badge_text = badge_text.crop(badge_text.getbbox())
    badge_width = badge_text.width + 44
    badge_height = badge_text.height + 28
    url = 'https://kaku3.github.io/workbooks/design-block-drill/'
    url_font = face(39)
    left = (1920 - badge_width - 34 - measure(url, url_font)) // 2
    top = 935
    draw.rectangle((left, top, left + badge_width - 1, top + badge_height - 1), fill=CYAN)
    im.paste(NAVY, (left + 22, top + 14, left + 22 + badge_text.width, top + 14 + badge_text.height), badge_text)
    draw_text(draw, (left + badge_width + 34, 942), url, url_font)
    return im


def prepare():
    WORK.mkdir(parents=True, exist_ok=True)
    intro_frame(0).save(str(ROOT / 'promo-thumbnail.png'))
    for frame in [0, 8, 30, 66, 119]:
        intro_frame(frame).save(str(WORK / ('intro-%03d.png' % frame)))
    for i in range(4):
        bg, overlay = dialogue_layers(i)
        bg.save(str(WORK / ('dialogue-%d-bg.png' % i)))
        overlay.save(str(WORK / ('dialogue-%d-overlay.png' % i)))
        preview = Image.alpha_composite(bg.convert('RGBA'), overlay).convert('RGB')
        preview.save(str(WORK / ('dialogue-%d-preview.png' % i)))
    for name, text in [('fail', '頼れるのはテストコードのみ'), ('repair', 'ブロック設計システムでバグを直せ'), ('pass', 'ブロック設計システムでバグを直せ')]:
        gameplay_overlay(text).save(str(WORK / (name + '-overlay.png')))
    overlay = title_overlay()
    overlay.save(str(WORK / 'title-overlay.png'))
    preview = Image.new('RGBA', SIZE, NAVY)
    with Image.open(str(CAPTURE / 'screenshots/01-title.png')) as screenshot:
        preview.paste(screenshot, (0, -80))
    Image.alpha_composite(preview, overlay).convert('RGB').save(str(WORK / 'title.png'))
    (WORK / 'text-layout.json').write_text(json.dumps(TEXT_BOXES, ensure_ascii=False, indent=2), encoding='utf-8')
    print('Prepared typography, dialogue layers, title, thumbnail.', flush=True)


def encode_intro():
    target = WORK / '00-intro.mp4'
    command = [FFMPEG, '-hide_banner', '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pixel_format', 'rgb24', '-video_size', '1920x1080', '-framerate', '30', '-i', 'pipe:0', '-frames:v', '120'] + ENCODE + [str(target)]
    with (WORK / 'intro-encode.log').open('wb') as log:
        process = subprocess.Popen(command, stdin=subprocess.PIPE, stderr=log, creationflags=subprocess.CREATE_NO_WINDOW)
        try:
            for frame in range(120):
                process.stdin.write(intro_frame(frame).tobytes())
            process.stdin.close()
            assert process.wait() == 0, 'Intro encoding failed; see intro-encode.log'
        except Exception:
            process.kill()
            process.wait()
            raise
    return target


def encode_dialogue(index, frames):
    target = WORK / ('01-dialogue-%d.mp4' % index)
    z = '1+0.018*on/' + str(frames - 1)
    filters = "[0:v]zoompan=z='%s':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=1:s=1920x1080:fps=30[bg];[bg][1:v]overlay=0:0,setsar=1" % z
    run(['-loop', '1', '-framerate', '30', '-i', WORK / ('dialogue-%d-bg.png' % index), '-loop', '1', '-framerate', '30', '-i', WORK / ('dialogue-%d-overlay.png' % index), '-filter_complex', filters, '-frames:v', frames] + ENCODE + [target])
    return target


def encode_play(name, asset, start, source_duration, speed, frames):
    target = WORK / ('02-' + name + '.mp4')
    args = ['-ss', start, '-t', source_duration, '-i', CAPTURE / 'clips' / asset]
    base = '[0:v]setpts=(PTS-STARTPTS)/%s,fps=30,tpad=stop_mode=clone:stop_duration=1' % speed
    if name in ['fail', 'pass']:
        base += ",zoompan=z='1+0.25*min(on/30,1)':x='iw-iw/zoom':y=0:d=1:s=1920x1080:fps=30"
    elif name == 'repair':
        base += ',crop=1372:772:0:108,scale=1920:1080'
    if name != 'excellent':
        args += ['-loop', '1', '-framerate', '30', '-i', WORK / (name + '-overlay.png')]
        filters = base + '[bg];[bg][1:v]overlay=0:0,setsar=1'
    else:
        filters = base + ',setsar=1'
    run(args + ['-filter_complex', filters, '-frames:v', frames] + ENCODE + [target])
    return target


def encode_title():
    target = WORK / '03-title.mp4'
    clips = CAPTURE / 'clips'
    metadata = json.loads((clips / '01-title-motion.json').read_text(encoding='utf-8'))
    run(['-ss', metadata['start_seconds'], '-i', clips / '01-title-motion.webm',
         '-loop', '1', '-framerate', '30', '-i', WORK / 'title-overlay.png',
         '-filter_complex', '[0:v]fps=30,crop=1920:1000:0:80,pad=1920:1080:0:0[title];[title][1:v]overlay=shortest=1,setsar=1',
         '-frames:v', '135'] + ENCODE + [target])
    return target


def verify(final):
    decoded = subprocess.run([FFMPEG, '-hide_banner', '-i', str(final), '-progress', 'pipe:1', '-nostats', '-f', 'null', '-'], stdout=subprocess.PIPE, stderr=subprocess.PIPE, creationflags=subprocess.CREATE_NO_WINDOW, check=True)
    progress, meta = decoded.stdout.decode('utf-8', 'replace'), decoded.stderr.decode('utf-8', 'replace')
    frames = int(re.findall(r'frame=(\d+)', progress)[-1])
    duration = int(re.findall(r'out_time_us=(\d+)', progress)[-1]) / 1000000
    assert frames == 1020, frames
    assert abs(duration - 34) < .05, duration
    assert '1920x1080' in meta and '30 fps' in meta and 'Video: h264' in meta and 'yuv420p' in meta, meta
    assert 'Audio: aac' in meta and '48000 Hz, stereo' in meta, meta
    with final.open('rb') as file:
        atoms = []
        while file.tell() < final.stat().st_size:
            position = file.tell()
            size, kind = struct.unpack('>I4s', file.read(8))
            if size == 1:
                size = struct.unpack('>Q', file.read(8))[0]
            atoms.append(kind.decode('ascii'))
            assert size > 0
            file.seek(position + size)
    assert atoms.index('moov') < atoms.index('mdat'), atoms
    times = [0, .3, 1, 2.5, 4.5, 9.5, 12, 14.5, 16.6, 17.5, 19.5, 22.5, 24.5, 26.5, 28.5, 31]
    for i, time in enumerate(times):
        run(['-ss', time, '-i', final, '-frames:v', '1', WORK / ('review-%02d.png' % i)])
    canvas = Image.new('RGB', (1920, 1200), NAVY)
    draw = ImageDraw.Draw(canvas)
    for i, time in enumerate(times):
        x, y = i % 4 * 480, i // 4 * 300
        with Image.open(str(WORK / ('review-%02d.png' % i))) as frame:
            frame.thumbnail((480, 270))
            canvas.paste(frame, (x, y + 25))
        draw.text((x + 8, y + 5), '%.2fs' % time, fill=WHITE)
    canvas.save(str(WORK / 'contact-sheet.jpg'), quality=94)
    report = {'duration_seconds': duration, 'frames': frames, 'width': 1920, 'height': 1080, 'fps': 30, 'codec': 'H.264', 'pixel_format': 'yuv420p', 'audio': 'AAC stereo 48 kHz', 'faststart': True, 'full_decode': 'ok', 'file_bytes': final.stat().st_size, 'font': FONT, 'review_frames': times, 'contact_sheet': str(WORK / 'contact-sheet.jpg')}
    (WORK / 'verification.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
    return report


def notes(report):
    lines = ['# 設計ブロックドリル：PV編集記録', '',
        '完成動画：[promo.mp4](promo.mp4)  ', 'サムネイル：[promo-thumbnail.png](promo-thumbnail.png)', '',
        '編集方針：[10-promo-edit.md](10-promo-edit.md)', '',
        '34秒、1920×1080、30fps、1020フレーム。H.264・yuv420p・MP4、faststart有効。音声はステレオAAC（48 kHz）。', '',
        '## 採用した構成', '', '| 完成動画の時間 | 素材・処理 |', '|---|---|',
        '| 0.00〜0.267秒 | 営業・折原の「即戦力としてお話ししておきました。経験は5年くらいで！」を全文表示。8フレーム。 |',
        '| 0.267〜4.00秒 | 同じセリフをタイプライターで再表示。2.20秒までに全文を揃え、4.00秒まで保持。 |',
        '| 4.00〜9.00秒 | screenshots/08-order-help-02.png。佐伯。左上に未経験・経験5年の説明。 |',
        '| 9.00〜11.50秒 | screenshots/08-order-help-03.png。真壁「確認よろしく！」 |',
        '| 11.50〜14.00秒 | screenshots/08-order-help-04.png。主人公の質問。 |',
        '| 14.00〜16.50秒 | screenshots/08-order-help-05.png。真壁の返答。 |',
        '| 16.50〜20.50秒 | clips/03-before.webmの12.00〜20.00秒、2倍速。Failが続く場面。 |',
        '| 20.50〜23.50秒 | clips/04-repair.webmの12.00〜18.00秒、2倍速。接続先の修正。 |',
        '| 23.50〜28.00秒 | clips/05-after.webmの12.00〜21.00秒、2倍速。Passが付く場面。 |',
        '| 28.00〜29.50秒 | clips/05-after.webmの32.00〜33.50秒、等速。Excellent・7/7。 |',
        '| 29.50〜34.00秒 | clips/01-title-motion.webm。背景のデモが動くタイトル画面を等速で使用。下部にコピー、無料表記、URLを4.5秒表示。 |', '',
        '素材パスはすべて `promo-capture/` 以下。会話は `01-02.intro` の発言2〜5を原文のまま使用。導入は `01-01.intro` の発言1。セリフは編集時に `src/story-data.mjs` から取得し、既存の会話文字を覆う字幕帯に大きく組み直しています。', '',
        '## 映像・文字', '',
        '- 静止画の背景に約1.8％の緩いズーム。字幕の位置・大きさは固定。',
        '- 会話字幕は游ゴシック太字54px、話者32px。佐伯のセリフは2行。説明テロップは最初の会話カットだけ表示。',
        '- FailとPassは冒頭から1秒かけて右側へ1.25倍に寄る。ケースの表示と実際の判定を残す。',
        '- 修正操作は左側の編集欄と接続線が見える範囲へ寄る。判定・接続線の描き替えは行っていない。',
        '- 最終カットのタイトルはゲーム画面の文字を使用。コピーは「株式会社コウカンゲンで 案件をこなして未経験からエンジニアに」。無料表記の背景は、描画した文字の上下左右に均等な余白を確保。',
        '- 日本語フォントは `' + FONT + '`。', '',
        '## 音声', '',
        '- 参考PV `26_report-drill/docs/promo/promo.mp4` から打鍵音（0.52〜0.63秒）と切り替え音（3.64〜3.82秒）を使用。',
        '- 会話の入りから、このPV用に作った120 BPMの電子音BGMを流す。設計パートで打楽器を増やし、Excellentでは音量を下げて成功音を聞かせる。',
        '- 4.00〜16.50秒の会話では、字幕の区切りに合わせてファミコン風の短いパルス音を控えめに鳴らす。佐伯、真壁、主人公で高さを変え、BGMを前に出す。',
        '- Fail、Pass、Excellentの効果音は `promo_audio.py` で合成。タイトルでBGMを戻し、末尾に向けてフェード。', '',
        '## 再実行', '', 'Node.js、Python、Pillow、NumPy、libx264対応FFmpegが必要です。リポジトリルートで実行します。', '',
        '```powershell', 'python 25_desgin-block-drill/docs/promo/edit-promo.py', '```', '',
        '必要に応じて環境変数 `PROMO_FFMPEG`（FFmpeg実行ファイル）、`PROMO_FONT`（日本語フォント）、`PROMO_WORK`（作業フォルダ）を指定します。既定のFFmpegは参考PVのローカルランタイムを再利用します。', '',
        'タイトル映像を撮り直す場合は、`node 25_desgin-block-drill/docs/promo/capture-promo-title.mjs` を実行します。Playwrightで `src/index.html` をローカルから開き、タイトル背景のデモを録画します。', '',
        '`--audio-only` で既存の `promo.mp4` に音声を付け直せます。`--prepare-only` で字幕・タイトル・サムネイルのプレビューを生成します。作業用の画像・中間動画・確認フレーム・検証JSONは `artifacts/design-block-promo-edit/` に保存します。', '',
        '## 検証', '',
        '- 完成MP4を全編デコードし、34秒・1020フレーム・1920×1080・30fpsを確認。',
        '- MP4のmoovがmdatより前にあり、faststartになっていることを確認。',
        '- 日本語字幕の描画領域が安全範囲内に収まることを描画時に検証。',
        '- 動画から16か所の確認フレームと時刻付き一覧画像を生成。',
        '- セリフ・使用区間・動画の速度は上表のとおり。', '',
        '出力サイズ：{:.2f} MB。'.format(report['file_bytes'] / 1000000), '']
    (ROOT / 'promo-edit-notes.md').write_text('\n'.join(lines), encoding='utf-8')


def finish_with_audio(video):
    from promo_audio import build_soundtrack

    soundtrack = WORK / 'promo-soundtrack.wav'
    reference = REPO / '26_report-drill/docs/promo/promo.mp4'
    build_soundtrack(FFMPEG, reference, soundtrack)
    final = WORK / 'promo-with-audio.mp4'
    run(['-i', video, '-i', soundtrack, '-map', '0:v:0', '-map', '1:a:0',
         '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', final])
    report = verify(final)
    final.replace(ROOT / 'promo.mp4')
    notes(report)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--prepare-only', action='store_true')
    parser.add_argument('--assemble-only', action='store_true')
    parser.add_argument('--audio-only', action='store_true', help='Mix the soundtrack onto the existing MP4')
    parser.add_argument('--refresh-title', action='store_true', help='Render the title again and reuse all earlier segments')
    args = parser.parse_args()
    if args.audio_only:
        WORK.mkdir(parents=True, exist_ok=True)
        finish_with_audio(ROOT / 'promo.mp4')
        print('COMPLETE: promo.mp4 with BGM and sound effects.', flush=True)
        return
    prepare()
    if args.prepare_only:
        return
    if args.assemble_only or args.refresh_title:
        if args.refresh_title:
            encode_title()
        segments = [WORK / name for name in ['00-intro.mp4'] + ['01-dialogue-%d.mp4' % i for i in range(4)] + ['02-fail.mp4', '02-repair.mp4', '02-pass.mp4', '02-excellent.mp4', '03-title.mp4']]
        assert all(file.is_file() and file.stat().st_size > 1000 for file in segments)
    else:
        segments = []
        print('Rendering intro', flush=True)
        segments.append(encode_intro())
        for index, frames in enumerate([150, 75, 75, 75]):
            print('Rendering dialogue %d/4' % (index + 1), flush=True)
            segments.append(encode_dialogue(index, frames))
        for spec in [('fail', '03-before.webm', 12, 8, 2, 120), ('repair', '04-repair.webm', 12, 6, 2, 90), ('pass', '05-after.webm', 12, 9, 2, 135), ('excellent', '05-after.webm', 32, 1.5, 1, 45)]:
            print('Rendering ' + spec[0], flush=True)
            segments.append(encode_play(*spec))
        print('Rendering title', flush=True)
        segments.append(encode_title())
    (WORK / 'concat.txt').write_text('\n'.join("file '%s'" % file.name for file in segments), encoding='ascii')
    final = WORK / 'promo-render.mp4'
    run(['-f', 'concat', '-safe', '0', '-i', 'concat.txt', '-c', 'copy', '-movflags', '+faststart', final.name], cwd=WORK)
    finish_with_audio(final)
    print('COMPLETE: promo.mp4 (34 seconds), thumbnail, edit notes.', flush=True)


if __name__ == '__main__':
    main()
