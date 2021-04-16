let btnscrap = document.getElementById('btnscrap')

btnscrap.addEventListener('click', async ()=>{
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true }) // estoy escogiendo la primera posicion 
    // inyecta el siguient script al tab
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: scrapingProfile

    })
})


function scrapingProfile() {

    const cssSelectorsProfile = {
        profile: {
            name: 'div.ph5 > div.mt2 > div > ul > li',
            typeContact: 'div.ph5 > div.mt2 > div > ul > li.pv-top-card__distance-badge span.visually-hidden',
            resumen: 'div.ph5 > div.mt2 > div > ul ~ h2',
            // country: 'div.ph5.pb5 > div.display-flex.mt2.pv-top-card--reflow > div.pv-top-card__list-container > ul.cx.mt1 > li'
            country: 'div.ph5 > div.mt2 > div > ul.mt1 > li.t-16',
            email: 'div > section.pv-contact-info__contact-type.ci-email > div > a',
            phone: 'div > section.pv-contact-info__contact-type.ci-phone > ul > li > span',
            urlLinkedin: 'div > section.pv-contact-info__contact-type.ci-vanity-url > div > a'
        },
        option: {
            buttonSeeMore: '[data-control-name="contact_see_more"]',
            buttonCloseSeeMore: 'button.artdeco-modal__dismiss'
        }
    }

    const cssSelectorsExperience = {
        experience: {
            job: 'section#experience-section section.pv-profile-section a.ember-view h3',
            company: 'section#experience-section section.pv-profile-section a.ember-view p.pv-entity__secondary-title',
            date: 'section#experience-section section.pv-profile-section a.ember-view h4.pv-entity__date-range > span:nth-child(2)',
            time: 'section#experience-section section.pv-profile-section a.ember-view h4.pv-entity__date-range ~ h4 > span:nth-child(2)',
            descriptionExtra: 'section#experience-section section.pv-position-entity div.pv-entity__extra-details > p',
            // extraLinks: 'section#experience-section section.pv-position-entity div.pv-entity__extra-details > div a',
            // company: 'section#experience-section > ul.section-info > li > div.pv-entity__extra-details ',
        }
    }

    const wait = (milliseconds) => {
        return new Promise(function(resolve){
            setTimeout(function(){
                resolve()
            }, milliseconds);
        })
    }

    const autoscrollToElement = async function(cssSelector){
        const exists = document.querySelector(cssSelector)

        while (exists){
            let maxScrollTop = document.body.clientHeight - window.innerHeight
            let elementScrollTop = document.querySelector(cssSelector).offsetHeight
            let currentScrollTop = window.scrollY

            if (maxScrollTop == currentScrollTop || elementScrollTop <= currentScrollTop)
                break

            await wait(32)

            let newScrollTop = Math.min(currentScrollTop + 20, maxScrollTop)

            window.scrollTo(0, newScrollTop)
        }

        console.log('Finish autoscroll to element %s', cssSelector)

        return new Promise(function(resolve){
            resolve()
        })
    }

    const getContactProfile = async () => {
        const {
            profile: {
                name: nameCss,
                typeContact: typeContactCss,
                resumen: resumenCss,
                country: countryCss,
                email: emailCss,
                phone: phoneCss,
                urlLinkedin: urlLinkedinCss
            },
            option: {
                buttonSeeMore: buttonSeeMoreCss,
                buttonCloseSeeMore: buttonCloseSeeMoreCss
            }
        } = cssSelectorsProfile

        const name = document.querySelector(nameCss)?.innerText
        const typeContact = document.querySelector(typeContactCss)?.innerText
        const resumen = document.querySelector(resumenCss)?.innerText
        const country = document.querySelector(countryCss)?.innerText

       
        const buttonSeeMore = document.querySelector(buttonSeeMoreCss)
        buttonSeeMore.click()

        await wait(1000)
         // Get email and phone with click on 'See More'
        const email = document.querySelector(emailCss)?.innerText
        const phone = document.querySelector(phoneCss)?.innerText
        let urlLinkedin = document.querySelector(urlLinkedinCss)?.innerText
        if (urlLinkedin) {
            urlLinkedin = `https://${urlLinkedin}`
        }

        const buttonCloseSeeMore = document.querySelector(buttonCloseSeeMoreCss)
        buttonCloseSeeMore.click()

        return { resumen, country, email, phone, urlLinkedin }
    }
    const getInfoExperience = async () => {
        const {
            experience: {
                job: jobCss,
                company: companyCss,
                date: dateCss,
                time: timeCss,
                descriptionExtra: descriptionExtraCss
            }
        } = cssSelectorsExperience

        const job = document.querySelector(jobCss)?.innerText
        const company = document.querySelector(companyCss)?.innerText
        const date = document.querySelector(dateCss)?.innerText
        const time = document.querySelector(timeCss)?.innerText
        const descriptionExtra = document.querySelector(descriptionExtraCss)?.innerText

        await wait(1000)


        return { job, company, date, time, descriptionExtra }
    }

    const getProfile = async () => {
        const profile = await getContactProfile()
        const experience = await getInfoExperience()
        await autoscrollToElement('body')

        console.log(profile)
        console.log(experience)
        const node = document.createElement('p')
        const headings = document.createElement('h3')
        const headings_4 = document.createElement('h4')
        const container = document.createElement('div')
        const container2 = document.createElement('div')

        headings.append(document.querySelector(cssSelectorsProfile.profile.name)?.innerText + ' - '+ document.querySelector(cssSelectorsProfile.profile.typeContact)?.innerText)
        node.append(JSON.stringify(profile))
        // Profile
        container.append(headings)
        container.append(node)
        // Experience
        headings_4.append('Experiencia')
        container2.append(headings_4)
        container2.append(JSON.stringify(experience))

        document.getElementById('global-nav').prepend(container2)
        document.getElementById('global-nav').prepend(container)
    }


    

    const getTypeProfile = document.querySelector('div.ph5 > div.mt2 > div > ul > li.pv-top-card__distance-badge span.dist-value').innerText.charAt()
    
    switch (getTypeProfile) {
        case '1':
            console.log('Obtener datos de 1ra persona')
            getProfile()
            break;
    
        case '2':
            console.log('Obtener datos de 2da persona')
            getProfile()
            break;
        case '3':
            console.log('Obtener datos de 3ra persona')
            getProfile()
            break;
    }
}