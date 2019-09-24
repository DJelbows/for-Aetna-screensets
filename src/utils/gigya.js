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

        if(!phone) return
        bDelete.onclick = () => gigya.accounts.setAccountInfo({
            data: {
                phones: event.data.phones.filter(p => p.type !== type)
            },
            callback: () => {
                gigya.accounts.showScreenSet(phoneScreen)
                gigyaHelper.refreshUser(setUser)
            }
        })
    },

}

export default gigyaHelper