# README

## Python 環境の作成

VS Code でコマンドパレットで 環境の作成を選択。

```cmd
VS Code
Ctrl + Shift + P
Python: 環境の作成
```

![](./images/000_Python%E7%92%B0%E5%A2%83%E3%81%AE%E4%BD%9C%E6%88%90_00.png)
![](./images/000_Python%E7%92%B0%E5%A2%83%E3%81%AE%E4%BD%9C%E6%88%90_01_Venv.png)
![](./images/000_Python%E7%92%B0%E5%A2%83%E3%81%AE%E4%BD%9C%E6%88%90_02_version.png)

## Python ターミナルの作成

```cmd
VS Code
Ctrl + Shift + P
Python: ターミナルを作成する
```

![](./images/010_%E3%82%BF%E3%83%BC%E3%83%9F%E3%83%8A%E3%83%AB%E3%82%92%E4%BD%9C%E6%88%90.png)

## モジュール追加

```cmd
pip install fastapi
pip install uvicorn
```

## 実行

Pythonターミナルで以下実行。

```cmd
# --reload : ファイル更新時に自動リロード
uvicorn main:app --reload
```

## ReDoc API仕様書

![](./images/100_redoc.png)

## Thunder Client

![](./images/110_thunder_client.png)