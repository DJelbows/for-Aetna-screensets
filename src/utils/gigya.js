import constants from '../utils/constants'

const gigyaHelper = {
    // Ensure app state is refreshed with user information
    listenForGigyaUser: setUser => {
        gigya.accounts.addEventHandlers({
            onLogin: e => setUser(e.profile),
            onLogout: () => setUser(null)
        })
        gigyaHelper.refreshUser(setUser)
    },

    // Retrieve user info from CDC and pass to app (refresh state)
    refreshUser: setUser => {
        gigya.accounts.getAccountInfo({
            callback: e => e.errorCode===0 ? setUser(e.profile) : null
        })
    },

    // Show one or more screens
    showScreens: screens => screens.map(s => gigya.accounts.showScreenSet(s)),

    // Remove email from account
    addRemoveEmailLink: (event, emailScreen, setUser) => {
        if(event.currentScreen!==constants.screensSets.profile.screens.editEmail.id) return

        // Show link only if email present
        let item =document.getElementsByClassName('aetna-remove-email')[1]
        if(event.profile.email) {
            item.style.display = 'inline-block'
            item.onclick = () => gigya.accounts.setAccountInfo({
                profile: { email: null },
                callback: () => {
                    gigya.accounts.switchScreen({
                        screenSet: emailScreen.screenSet,
                        screen: emailScreen.startScreen,
                        containerID: emailScreen.containerID
                    })
                    gigyaHelper.refreshUser(setUser)
                }
            })
        } else {
            item.style.display = 'none'
        }
    },

    // Refresh add/change email button
    refreshAddChangeButton: event => {
        if(event.currentScreen!==constants.screensSets.profile.screens.viewEmail.id) return

        // Show link only if email present
        let add=document.getElementsByClassName('aetna-add-email')[1]
        let change=document.getElementsByClassName('aetna-change-email')[1]

        add.style.display = event.profile.email ? 'none' : 'inline-block'
        change.style.display = event.profile.email ? 'inline-block' : 'none'
    },
    //add pop up screen for how we use your email
    addHowWeUseEmailPopup: event => {
        const currentScreen = document.getElementById(event.currentScreen)
        Array.from(currentScreen.getElementsByClassName('aetna-useemail-link')).forEach(el => {
            el.onclick = () => gigya.accounts.showScreenSet({
                screenSet: constants.screensSets.profile.id,
                startScreen: constants.screensSets.profile.screens.howWeUseEmail.id,
                onAfterScreenLoad: e => {
                    Array.from(document.getElementsByClassName('gigya-screen-dialog-top')).forEach((el => el.style.display = 'none'))
                    document.getElementById(e.currentScreen).onclick = () => gigya.accounts.hideScreenSet({
                        screenSet: e.currentScreen
                    })
                }
            })
        
        })    
            
    },
    // Format phone number on change
    addFormatNumberHandler: event => {
        if(event.isValid && event.field == 'data.phones.number') {
            var phoneNumber = event.value.replace(/[-/.)(]/g, '')
            phoneNumber = phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
            const currentScreen = document.getElementById(event.currentScreen)
            console.log(currentScreen)
            currentScreen.getElementsByName('data.phones.number')[0].value = phoneNumber
       }
    },

    // Find a phone type in array
    findPhone: (event, type) => {
        if(!event.data || !event.data.phones)
            return null

        return event.data.phones.find(o => o.type === type)
    },

    // Load formatted phone information in view mode
    loadPhoneData: (event, type) => {
        if(!event.currentScreen===constants.screensSets.profile.screens.viewPhone.id
            || !event.currentScreen===constants.screensSets.profile.screens.viewSecondaryPhone.id) return

        const currentScreen = document.getElementById(event.currentScreen)
        const phone = gigyaHelper.findPhone(event, type)
        Array.from(currentScreen.getElementsByClassName('aetna-primary-phone-labels')).forEach((el =>
            el.style.display = phone ? 'inline-block' : 'none'
        ))

        if(phone) {
            currentScreen.getElementsByClassName('aetna-sms')[0].style.display = phone.textReceive ? 'inline-block' : 'none'
            currentScreen.getElementsByClassName('aetna-no-sms')[0].style.display = phone.textReceive ? 'none' : 'inline-block'
            currentScreen.getElementsByClassName('aetna-contact-time')[0].innerText = phone.contactTime
            currentScreen.getElementsByClassName('aetna-phone-number-label')[0].innerText =
                `${phone.countryCode} ${phone.number} ${phone.extension ? `x${phone.extension}` : ''}`
        }
    },

    // Remove phone from account
    addRemovePhoneLink: (event, phoneScreen, setUser, type) => {
        if(!event.currentScreen===constants.screensSets.profile.screens.viewPhone.id
            || !event.currentScreen===constants.screensSets.profile.screens.viewSecondaryPhone.id) return
        
        
        
        // Show link only if phone is present
        const currentScreen = document.getElementById(event.currentScreen)
        const phone = gigyaHelper.findPhone(event, type)

        // Show corresponding add/edit buttons
        let bAdd=currentScreen.getElementsByClassName('aetna-add-phone')[0]
        let bEdit=currentScreen.getElementsByClassName('aetna-edit-phone')[0]
        let bDelete=currentScreen.getElementsByClassName('aetna-delete-phone')[0]

        bAdd.style.display = phone ? 'none' : 'inline-block'
        bEdit.style.display = phone ? 'inline-block' : 'none'
        bDelete.style.display = phone ? 'inline-block' : 'none'

        //Link is disabled if primary phone is not present
        if (type == 'secondary') {
            gigyaHelper.addSecondaryPhoneHandler(event)
        }

        //Set onclick function to delete phone number and move secondary to primary
        if(!phone) return
        bDelete.onclick = () => gigya.accounts.setAccountInfo({
            data: {
                phones: event.data.phones.filter(p => p.type !== type)
            },
            callback: (response) => {
                gigya.accounts.showScreenSet(phoneScreen)
                gigyaHelper.refreshUser(setUser)
                gigyaHelper.addSecondaryPhoneHandler(response)
                
            }
        })
    },
    //check if email address exists on paperless and communications page
    checkEmailData(event) {
        let noEmail = document.getElementsByClassName('aetna-no-email')[2]
        let changeEmail = document.getElementsByClassName('aetna-change-email-text')[2]
        noEmail.style.display = !event.profile.email ? 'block' : 'none'
        changeEmail.style.display = !event.profile.email ? 'none' : 'block'
    },
    //styling and adding behavior to paperless button
    checkPaperlessButton(event) {
        let paperlessButton = Array.from(document.getElementsByClassName('aetna-secondary-button')).filter(pb => pb.textContent == "Go Paperless for All")
        if (!event.profile.email) {
            paperlessButton[0].classList.add('aetna-secondary-button-disabled')
        } else {
            paperlessButton[0].classList.remove('aetna-secondary-button-disabled')
            paperlessButton[0].onclick = () => {
                let checkboxes = Array.from(document.getElementById('paperless').getElementsByTagName('input'))
                checkboxes.forEach((c) => {
                    if (c.type =='checkbox') {
                        //console.log(c)
                        c.checked = true
                    }
                })
                gigya.accounts.setAccountInfo({
                    preferences: {
                        other_paperlessExplanation : {
                            isConsentGranted: true
                        }
                    },
                    preferences: {
                        other_paperlessTaxDocs : {
                            isConsentGranted: true
                        }
                    },
                    preferences: {
                        other_paperlessOtherDocs : {
                            isConsentGranted: true
                        }
                    }
                })
                
            }
        } 
    },
    //Disabling/enabling second phone button after checking for primary phone
    addSecondaryPhoneHandler(event) {
        const secondaryScreen = document.getElementById('personalinfophonesecondview')
        let bAdd = secondaryScreen.getElementsByClassName('aetna-add-phone')[0]
        const phonePrimary = gigyaHelper.findPhone(event, 'primary')
        !phonePrimary ? bAdd.classList.add('aetna-primary-button-disabled') : bAdd.classList.remove('aetna-primary-button-disabled')
    }
}

export default gigyaHelper