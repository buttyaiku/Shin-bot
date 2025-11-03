const chat = document.getElementById("chat");
const form = document.getElementById("form");
const msg = document.getElementById("msg");
const sendBtn = document.getElementById("send");
const clearBtn = document.getElementById("clear");

const add = (text, cls) => {
  const div = document.createElement("div");
  div.className = `bubble ${cls}`;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
};

clearBtn.onclick = () => { chat.innerHTML = ""; msg.value = ""; };

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = msg.value.trim();
  if (!text) return;
  add(text, "me");
  msg.value = "";
  sendBtn.disabled = true;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });
    if (!res.ok) {
      const err = await res.text();
      add(`[エラー] ${res.status} ${err}`, "bot");
    } else {
      const data = await res.json();
      add(data.reply, "bot");
    }
  } catch (err) {
    add(`[通信エラー] ${err}`, "bot");
  } finally {
    sendBtn.disabled = false;
  }
});

// ウェルカムメッセージ
add("ようこそ。Shingoの思考でお話しします。まずは一言どうぞ。", "bot");
