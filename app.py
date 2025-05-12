from flask import Flask, render_template, request, jsonify
from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
# tt
# 建立一個 OpenAI 客戶端實例
client = OpenAI(api_key=api_key)

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message")
    try:
        msgs = [
            {
                "role": "system",
                "content": (
                    "你是一位有耐心、善於引導的中文老師。"
                    "當學生提出問題時，你要用繁體中文回答，"
                    "語氣像在課堂上啟發學生思考，"
                    "並幫助他們一步步理解概念。"
                ),
            },
            {"role": "user", "content": user_message},
        ]
        # 使用新的 chat.completions.create 方法
        resp = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=msgs,
        )
        # 读取回复内容
        reply = resp.choices[0].message.content
        return jsonify({"reply": reply})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
