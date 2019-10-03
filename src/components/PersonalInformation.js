import React from 'react'
import { connect } from 'kea'
import gigyaHelper from '../utils/gigya'
import constants from '../utils/constants'
import profileManagerLogic from '../logic/profileManagerLogic'

@connect({
    actions: [
      profileManagerLogic, [
        'setUser'
      ]
    ]
  })
export default class PersonalInformation extends React.Component {
    componentDidMount() {
        const { setUser } = this.actions

        const emailScreen = {
            screenSet: constants.screensSets.profile.id,
            startScreen: constants.screensSets.profile.screens.viewEmail.id,
            containerID: 'personalinfoemail',
            onAfterScreenLoad: e => {
                gigyaHelper.addRemoveEmailLink(e, emailScreen, setUser)
                gigyaHelper.refreshAddChangeButton(e)
                gigyaHelper.addHowWeUseEmailPopup(e)
            }
        }

        const phoneScreen = {
            screenSet: constants.screensSets.profile.id,
            startScreen: constants.screensSets.profile.screens.viewPhone.id,
            containerID: 'personalinfophone',
            onAfterScreenLoad: e => {
                gigyaHelper.loadPhoneData(e, 'primary')
                gigyaHelper.addRemovePhoneLink(e, phoneScreen, setUser, 'primary')
            },
            onFieldChanged: e => {
                gigyaHelper.addFormatNumberHandler(e)
            },
            onAfterSubmit: e => {
                gigyaHelper.addSecondaryPhoneHandler(e)
            }
        }

        const secondaryPhoneScreen = {
            screenSet: constants.screensSets.profile.id,
            startScreen: constants.screensSets.profile.screens.viewSecondaryPhone.id,
            containerID: 'personalinfophonesecondary',
            onAfterScreenLoad: e => {
                gigyaHelper.loadPhoneData(e, 'secondary')
                gigyaHelper.addRemovePhoneLink(e, secondaryPhoneScreen, setUser, 'secondary')
            },
            onFieldChanged: e => {
                gigyaHelper.addFormatNumberHandler(e)
            }
        }

        gigyaHelper.showScreens([emailScreen, phoneScreen, secondaryPhoneScreen])
    }
    render() {
        return (
              <div>
                <h2>Personal Information</h2>
                <div id='personalinfoemail' className='subprofile' />
                <div className='subprofileNext'>
                    <div id='personalinfophone' />
                    <div id='personalinfophonesecondary' />
                </div>
              </div>
            )
        }
}