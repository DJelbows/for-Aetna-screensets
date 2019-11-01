import constants from '../utils/constants'

const gigyaHelper = {
    // Ensure app state is refreshed with user information
    listenForGigyaUser: setUser => {
        gigya.accounts.addEventHandlers({
            onLogin: e =>  window.location = 'index.html',
            onLogout: () => window.location = 'login.html'
        })
        gigyaHelper.refreshUser(setUser)
    },

    // Retrieve user info from CDC and pass to app (refresh state)
    refreshUser: setUser => {
        gigya.accounts.getAccountInfo({
            callback: e => {setUser(e.errorCode===0 ? e.profile : null)}
        })
    },

    // Show one or more screens
    showScreens: screens => screens.map(s => gigya.accounts.showScreenSet(s)),
    
    //toggle menu when not on desktop
    toggleMenu: (label) => {
        document.getElementsByClassName('navigation')[0].classList.toggle('navOpen')
        if (label !== undefined) document.getElementsByClassName('navTitle')[0].innerHTML = label
    },

    // Remove email from account
    addRemoveEmailLink: (event, emailScreen, setUser) => {
        if(event.currentScreen!==constants.screensSets.profile.screens.editEmail.id) return

        // Show link only if email present
        let item =document.getElementsByClassName('aetna-remove-email')[1]
        if(event.data.commPrefsConsents.preferredContacts.emails.address) {
            item.style.display = 'inline-block'
            item.onclick = () => {
                gigyaHelper.confirmDeleteEmailPopup(() => gigya.accounts.setAccountInfo({
                    data: {
                        commPrefsConsents: {
                            preferredContacts: {
                                emails: {
                                    address: null
                                }
                            }
                        }
                    },
                    
                    callback: () => {
                        gigya.accounts.switchScreen({
                            screenSet: emailScreen.screenSet,
                            screen: emailScreen.startScreen,
                            containerID: emailScreen.containerID
                        })
                        gigyaHelper.refreshUser(setUser)
                    }
                }))
            }
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

        add.style.display = event.data.commPrefsConsents.preferredContacts.emails.address ? 'none' : 'inline-block'
        change.style.display = event.data.commPrefsConsents.preferredContacts.emails.address ? 'inline-block' : 'none'
    },
    //add pop up screen for how we use your email
    addHowWeUseEmailPopup: event => {
        const currentScreen = document.getElementById(event.currentScreen)
        Array.from(currentScreen.getElementsByClassName('aetna-useemail-link')).forEach(el => {
            el.onclick = () => gigya.accounts.showScreenSet({
                screenSet: constants.screensSets.profile.id,
                startScreen: constants.screensSets.profile.screens.howWeUseEmail.id,
                onAfterScreenLoad: e => {
                    document.activeElement.blur()
                    Array.from(document.getElementsByClassName('gigya-screen-dialog-top')).forEach((el => el.style.display = 'none'))
                    Array.from(document.getElementsByClassName('aetna-popup-close')).forEach(el => {
                        el.onclick = () => {
                            gigya.accounts.hideScreenSet({
                                screenSet: e.currentScreen
                            })
                        }
                    })
                }
            })

        })

    },
    // Format phone number on change
    addFormatNumberHandler: event => {
        console.log(event)
        if(event.isValid && event.field == 'data.commPrefsConsents.preferredContacts.phones.number') {
            var phoneNumber = event.value.replace(/[-/.)(]/g, '')
            phoneNumber = phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
            document.getElementById(event.screen).getElementsByClassName('aetna-phone-input')[0].value = phoneNumber
       } else if(event.isValid && event.field == 'data.phones.extension') {
            //console.log(document.getElementById(event.screen).getElementsByClassName('aetna-phone-checkbox'))
            Array.from(document.getElementById(event.screen).getElementsByTagName('input')).forEach((el) => {
                if (el.type == 'checkbox') event.value == "" ? el.disabled = false : el.disabled = true
            })
       }
    },

    // Find a phone type in array
    findPhone: (event, type) => {
        //console.log(event.data.commPrefsConsents.preferredContacts.phones)
        if(!event.data || !event.data.commPrefsConsents.preferredContacts.phones)
            return null

        return event.data.commPrefsConsents.preferredContacts.phones.find(o => o.type === type)
    },

    // Load formatted phone information in view mode
    loadPhoneData: (event, type) => {
        if(!event.currentScreen===constants.screensSets.profile.screens.viewPhone.id
            || !event.currentScreen===constants.screensSets.profile.screens.viewSecondaryPhone.id) return

        const currentScreen = document.getElementById(event.currentScreen)
        //console.log(gigyaHelper.findPhone(event, type))
        const phone = gigyaHelper.findPhone(event, type)
        Array.from(currentScreen.getElementsByClassName('aetna-primary-phone-labels')).forEach((el =>
            el.style.display = phone ? 'inline-block' : 'none'
        ))

        if(phone) {
            currentScreen.getElementsByClassName('aetna-sms')[0].style.display = phone.isTextCapable ? 'inline-block' : 'none'
            currentScreen.getElementsByClassName('aetna-no-sms')[0].style.display = phone.isTextCapable ? 'none' : 'inline-block'
            currentScreen.getElementsByClassName('aetna-contact-time')[0].innerText = phone.bestTimeToContact
            currentScreen.getElementsByClassName('aetna-phone-number-label')[0].innerText =
                `+1 ${phone.number} ${phone.extension ? `x${phone.extension}` : ''}`
        }
    },
    //add pop up confirmation screen for delete phone
    confirmDeletePhonePopup: (handler, type, number, phones) => {
        gigya.accounts.showScreenSet({
            screenSet: constants.screensSets.profile.id,
            startScreen: constants.screensSets.profile.screens.deletePhone.id,
            onAfterScreenLoad: e => {
                document.activeElement.blur()
                Array.from(document.getElementsByClassName('aetna-move-secondary-label')).forEach((el =>
                    el.style.display = (phones.length > 1 && type=='primary') ? 'inline-block' : 'none'))
                Array.from(document.getElementsByClassName('gigya-screen-dialog-top')).forEach((el => el.style.display = 'none'))
                Array.from(document.getElementsByClassName('aetna-close-handler')).forEach(el => {
                    el.onclick = () => {
                        gigya.accounts.hideScreenSet({
                            screenSet: e.currentScreen
                        })
                    }
                })
                Array.from(document.getElementsByClassName('aetna-delete-phone-button')).forEach(el => el.onclick = () => {
                    handler()
                    gigya.accounts.hideScreenSet({
                        screenSet: e.currentScreen
                    })
                })
                Array.from(document.getElementsByClassName('aetna-screen-header')).forEach((el =>
                    el.innerText = el.innerText.replace('{type}', type) ))
                Array.from(document.getElementsByClassName('aetna-phone-confirmation')).forEach((el =>
                    el.innerText = el.innerText.replace('{number}', number) ))
            }
        })
    },
    //add pop up confirmation screen for delete email
    confirmDeleteEmailPopup: handler => {
        gigya.accounts.showScreenSet({
            screenSet: constants.screensSets.profile.id,
            startScreen: constants.screensSets.profile.screens.deleteEmail.id,
            onAfterScreenLoad: e => {
                document.activeElement.blur()
                Array.from(document.getElementsByClassName('gigya-screen-dialog-top')).forEach((el => el.style.display = 'none'))
                Array.from(document.getElementsByClassName('aetna-close-handler')).forEach(el => {
                    el.onclick = () => {
                        gigya.accounts.hideScreenSet({
                            screenSet: e.currentScreen
                        })
                    }
                })
                Array.from(document.getElementsByClassName('aetna-delete-email-button')).forEach(el => el.onclick = () => {
                    handler()
                    gigya.accounts.hideScreenSet({
                        screenSet: e.currentScreen
                    })
                })
            }
        })
    },
    // Remove phone from account
    addRemovePhoneLink: (event, phoneScreen, setUser, type, secondaryScreen) => {
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
        bDelete.onclick = () => {
            // refresh phones data before performing confirmation
            gigya.accounts.getAccountInfo({
                include:'data,preferences',
                callback: user => {
                    // show confirmation popup
                    gigyaHelper.confirmDeletePhonePopup(() => {
                        // DELETION HANDLER
                        const newPhones = user.data.commPrefsConsents.preferredContacts.phones.filter(p => p.type !== type)
                        // remove consent for deleted phone
                        /*let consent = { preferences: {}}
                        if(type == 'primary')
                            consent.preferences.other_receiveText = { isConsentGranted: false }
                        else
                            consent.preferences.other_receiveTextSecondary = { isConsentGranted: false }*/
                        
                        //temporary to eliminate contact consents
                        if (newPhones.length == 0) {
                            gigya.accounts.setAccountInfo({
                                data: {
                                    commPrefsConsents: {
                                        communicationConsents : {
                                            contactConsents : {
                                                phoneContactConsents : []
                                            }
                                        } 
                                    }
                                        
                                }
                            })
                        }


                        // check if secondary phone must be moved to primary
                        if(newPhones.length && newPhones[0].type == 'secondary') {
                            newPhones[0].type = 'primary'
                            /*consent.preferences.other_receiveText = {
                                isConsentGranted: user.preferences.other_receiveTextSecondary.isConsentGranted
                            }
                            consent.preferences.other_receiveTextSecondary = { isConsentGranted: false }*/
                        }
                        
                        

                        gigya.accounts.setAccountInfo({
                            data: {
                                commPrefsConsents: {
                                    preferredContacts: {
                                        phones: newPhones
                                    }
                                }
                                    
                            },
                            //...consent,
                            callback: (response) => {
                                gigya.accounts.showScreenSet(phoneScreen)
                                gigyaHelper.refreshUser(setUser)
                                gigyaHelper.addSecondaryPhoneHandler(response)
                                if (type == 'primary') gigyaHelper.showScreens([secondaryScreen])
                            }
                        })

                    }, type, currentScreen.getElementsByClassName('aetna-phone-number-label')[0].innerText, user.data.commPrefsConsents.preferredContacts.phones
                )}
            })
        }
    },
    //check if email address exists on paperless and communications page
    checkEmailData(event) {
        let noEmail = document.getElementsByClassName('aetna-no-email')[2]
        let changeEmail = document.getElementsByClassName('aetna-change-email-text')[2]
        noEmail.style.display = !event.data.commPrefsConsents.preferredContacts.emails.address ? 'block' : 'none'
        changeEmail.style.display = !event.data.commPrefsConsents.preferredContacts.emails.address ? 'none' : 'block'
    },
    //styling and adding behavior to paperless button
    checkPaperlessButton(event) {
        let paperlessButton = Array.from(document.getElementsByClassName('aetna-secondary-button')).filter(pb => pb.textContent == "Go Paperless for All")
        let checkboxes = Array.from(document.getElementById('paperless').getElementsByTagName('input'))
        if (!event.data.commPrefsConsents.preferredContacts.emails.address) {
            paperlessButton[0].classList.add('aetna-secondary-button-disabled')
            checkboxes.forEach((c) => {
                if (c.type =='checkbox') {
                    c.disabled = true
                }
            })
        } else {
            paperlessButton[0].classList.remove('aetna-secondary-button-disabled')
            paperlessButton[0].onclick = () => {
                
                checkboxes.forEach((c) => {
                    if (c.type =='checkbox') {
                        c.checked = true
                    }
                })

            }
        }
    },
    //Disabling/enabling second phone button after checking for primary phone
    addSecondaryPhoneHandler(event) {
        const secondaryScreen = document.getElementById('personalinfophonesecondview')
        if(!secondaryScreen) return
        let bAdd = secondaryScreen.getElementsByClassName('aetna-add-phone')[0]
        const phonePrimary = gigyaHelper.findPhone(event, 'primary')
        !phonePrimary ? bAdd.classList.add('aetna-primary-button-disabled') : bAdd.classList.remove('aetna-primary-button-disabled')
    }
}

export default gigyaHelper