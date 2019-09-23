import React from 'react';
import gigyaHelper from '../utils/gigya'
import constants from '../utils/constants'

export default class Paperless extends React.Component {
    componentDidMount() {
      gigyaHelper.showScreens(
        constants.screensSets.profile.id,
        [
          { screen: constants.screensSets.profile.screens.paperless.id, container: 'paperless'}
        ]
      )
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