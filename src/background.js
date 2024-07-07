function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

chrome.webRequest.onCompleted.addListener(
  function (details) {

    if (details.url.includes('extension_request=true')) {
      return;
    }

    // 如果你只关心特定的API请求，可以添加条件检查
    if (details.url.includes('https://weread.qq.com/web/review/list?bookId=3300074771&listType=8&listMode=3&chapterUid=4')) {
      console.log("检测到目标API请求，开始发起请求", details);
      fetch('https://weread.qq.com/web/review/list?bookId=3300074771&listType=8&listMode=3&chapterUid=4&extension_request=true')
        .then(response => response.json())
        .then(async data => {
          console.log(data)
          for (let info of data.reviews) {
            console.log("弹幕：", info.review.content)

            // 发送弹幕
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
              if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {
                  action: 'showDanmaku',
                  text: info.review.content,
                  color: "#ffffff"
                });
              }
            });

            await sleep(1000);  // 等待1秒
          }
        })
        .catch(error => console.error('Error:', error));
    }
  },
  {
    urls: ["<all_urls>"], // 监听所有URL，你可以根据需要限制
    types: ["xmlhttprequest"] // 只监听XHR请求，可以根据需要调整
  }
);