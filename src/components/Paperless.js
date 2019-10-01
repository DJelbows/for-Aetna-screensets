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

export default class Paperless extends React.Component {
    
    componentDidMount() {
        const { setActiveTab } = this.actions
        gigyaHelper.showScreens([
            {
                screenSet: constants.screensSets.profile.id,
                startScreen: constants.screensSets.profile.screens.paperless.id,
                containerID: 'paperless',
                onAfterScreenLoad: e => {
                    gigyaHelper.checkEmailData(e)
                    let addEmailLink = document.getElementsByClassName('aetna-email-link')[2]
                    addEmailLink.onclick = () => setActiveTab(constants.tabs.personalInfo.id)
                }
            }
        ])
    }
    render() {
        return (
              <div>
                <h2>Paperless</h2>
                <div id='paperless' className='subprofile' />
              </div>
            )
        }
}