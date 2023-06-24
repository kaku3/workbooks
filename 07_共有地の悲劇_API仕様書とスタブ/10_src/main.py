from fastapi import FastAPI, Query
from fastapi.openapi.docs import get_redoc_html

app = FastAPI()

@app.get("/test")
async def test(
    id: int = Query(..., description="ユーザーID", example="12345"),    # id
    name: str = Query(..., description="ユーザー名", example="Taro")   # 名前
):
    """
    関数コメントは、ReDoc に表示される。md 記法が利用可能。
    1行改行は、改行として認識されない。

    改行したい時は、<br>brタグを利用するか、2行改行する。
    """
    return { "message": f'Hello {id}:{name}!' }

@app.get("/redoc", include_in_schema=False)
async def redoc_html():
    return get_redoc_html(
        openapi_url="/openapi.json",
        title=app.title + " - ReDoc",
        redoc_js_url="/static/redoc.standalone.js",
    )
