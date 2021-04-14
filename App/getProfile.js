let btnscrap = document.getElementById('btnscrap')

btnscrap.addEventListener('click', async ()=>{
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true }) // estoy escogiendo la primera posicion 
    // inyecta el siguient script al tab
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: scrapingProfile

    })
})

function scrapingProfile () {
    console.log('Hola mundo')
   
}