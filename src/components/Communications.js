import React from 'react';
import { connect } from 'kea'
import gigyaHelper from '../utils/gigya'
import constants from '../utils/constants'
import profileManagerLogic from '../logic/profileManagerLogic'

@connect({
    actions: [
      profileManagerLogic, [
        'setActiveTab'
      ]
    ]
  })

export default class Communications extends React.Component {
    componentDidMount() {
        const { setActiveTab } = this.actions
        gigyaHelper.showScreens([
            {
                screenSet: constants.screensSets.profile.id,
                startScreen: constants.screensSets.profile.screens.communications.id,
                containerID: 'communication',
                onAfterScreenLoad: e => {
                    gigyaHelper.checkEmailData(e)
                    let editEmailLinks = Array.from(document.getElementsByClassName('aetna-email-link')).filter(l => l.textContent !== "")
                    editEmailLinks.forEach((el) => {
                        el.addEventListener('click', () => setActiveTab(constants.tabs.personalInfo.id))
                    })
                }
            }
        ])
    }
    render() {
        return (
              <div>
                <h2>Communications &amp; Alerts</h2>
                <div id='communication' className='subprofile' />
              </div>
            )
        }
}