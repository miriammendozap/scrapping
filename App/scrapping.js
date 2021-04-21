( async () => {
    let btnScrapSearch = document.getElementById('btnScrap');
  
    btnScrapSearch.addEventListener('click', async () => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const port = chrome.tabs.connect(tab.id);
      // 1. Send message 'scanning'
      port.postMessage({action: 'scanning'});
    
      port.onMessage.addListener(function (response) {
        const {action} = response;
        // 5. Receive msg 'endScanning'
        // 6. Send message 'scraping'
        if (action == 'endScanning')  port.postMessage({action: 'scraping'})
  
      });
    });
  })();


  