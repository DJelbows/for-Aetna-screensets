const constants = {
  tabs: {
    personalInfo: {id: 'personalInfo', label: 'Personal Information'},
    paperless: {id: 'paperless', label: 'Paperless'},
    communications: {id: 'communications', label: 'Communications'}
  },
  screensSets: {
    loginReg: {
      id: 'Default-RegistrationLogin',
      screens: {
        login: {id: 'gigya-login-screen'}
      }
    },
    profile: {
      id: 'Default-ProfileUpdate',
      screens: {
        viewEmail: {id: 'personalinfoemailview'},
        editEmail: {id: 'personalinfoemail'},
        viewPhone: {id: 'personalinfophoneview'},
        editPhone: {id: 'personalinfophone'},
        viewSecondaryPhone: {id: 'personalinfophonesecondview'},
        editSecondaryPhone: {id: 'personalinfophonesecond'},
        paperless: {id: 'paperless'},
        communications: {id: 'communication'},
        howWeUseEmail: {id: 'howWeUseYourEmail'}
      }
    }
  }
}

export default constants
