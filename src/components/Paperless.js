import React from 'react';
import gigyaHelper from '../utils/gigya'
import constants from '../utils/constants'

export default class Paperless extends React.Component {
    componentDidMount() {
        gigyaHelper.showScreens([
            {
                screenSet: constants.screensSets.profile.id,
                startScreen: constants.screensSets.profile.screens.paperless.id,
                containerID: 'paperless',
                onAfterScreenLoad: e => {
                    gigyaHelper.checkEmailData(e)
                    let addEmailLink = document.getElementsByClassName('aetna-email-link')[2]
                    console.log(addEmailLink)
                    addEmailLink.onclick = () => {
                        console.log('clicked')
                    }
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