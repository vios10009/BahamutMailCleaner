// ==UserScript==
// @name         巴哈姆特刪信助手
// @namespace    https://github.com/vios10009
// @version      1.0
// @description  一鍵刪除指定的通知信(預設刪除動畫瘋獲獎通知、【勇者福利社】成功獲得抽獎資格通知信)
// @author       vios10009
// @match        https://mailbox.gamer.com.tw/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamer.com.tw
// @grant        none
// @downloadURL https://github.com/vios10009/BahamutMailCleaner/raw/refs/heads/main/BahamutMailCleaner.user.js
// @updateURL https://github.com/vios10009/BahamutMailCleaner/raw/refs/heads/main/BahamutMailCleaner.user.js
// ==/UserScript==

let bhSlave = document.getElementById("BH-slave");
let newButton = document.createElement("button");

// 自訂要刪除的信件標題列表
const titlesToDelete = [
    "動畫瘋獲獎通知",
    "【勇者福利社】成功獲得抽獎資格通知信"
];

newButton.innerText = "刪除本頁的指定通知信";
newButton.style.cssText = `
  width: 100%;
  margin-bottom: 10px;
  height: 2.5rem;
  background-color: rgb(215, 84, 84);
  border-radius: 5px;
  border: 1px solid rgb(179, 59, 59);
  color: white;
`;
newButton.onclick = () => { deleteLetters(titlesToDelete) };
bhSlave.insertBefore(newButton, bhSlave.querySelector("h5"));

let deleteCount = 0; // 記錄刪除的信件數量

function deleteLetters(titles) {
    let bhTable = document.querySelector(".BH-table");
    let letters = bhTable.querySelectorAll("tr.readU, tr.readR");
    let found = false;

    for (let letter of letters) {
        let mailTitle = letter.querySelector(".mailTitle").innerText;
        if (titles.includes(mailTitle)) {
            letter.querySelector("input[type=checkbox]").checked = true;
            found = true;
            deleteCount++; // 累計刪除的信件數量
        }
    }

    if (found) {
        // 顯示按鈕區域
        document.getElementById("mail-action-area").style.display = "block";

        // 啟用刪除按鈕
        let deleteButton = document.querySelector("[onclick='mailbox.delMail();']");
        if (deleteButton) {
            deleteButton.classList.remove("is-disabled");
            deleteButton.click(); // 觸發刪除

            setTimeout(() => {
                let confirmButton = document.querySelector(".btn-box .btn-primary");
                if (confirmButton) {
                    confirmButton.click(); // 自動點擊「確定」

                    // 等待彈窗處理完畢後再點擊「關閉」
                    setTimeout(() => {
                        let closeButton = document.querySelector(".btn-box .btn-danger");
                        if (closeButton) {
                            closeButton.click(); // 自動點擊「關閉」
                        }
                        // 刪除後重新刪除目前頁面項目
                        setTimeout(() => deleteLetters(titles), 1000);
                    }, 1500);
                }
            }, 500);
        }
    } else {
        // 若當前頁面無可刪除的信件則結束並告知總共刪除的數量
        if (deleteCount == 0) {
            alert(`目前頁面沒有可刪除的信件。`);
        } else {
            alert(`刪除完成！總共刪除了 ${deleteCount} 封指定通知信。`);
        }        
    }
}
