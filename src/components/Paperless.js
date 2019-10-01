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
                    gigyaHelper.checkPaperlessButton(e)
                    console.log(document.getElementsByClassName('aetna-email-link'))
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
                <h2>Paperless</h2>
                <div id='paperless' className='subprofile' />
              </div>
            )
        }
}