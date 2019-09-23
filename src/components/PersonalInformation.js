import React from 'react';
import gigyaHelper from '../utils/gigya'
import constants from '../utils/constants'

export default class PersonalInformation extends React.Component {
    componentDidMount() {
      gigyaHelper.showScreens(
        constants.screensSets.profile.id,
        [
          { screen: constants.screensSets.profile.screens.viewEmail.id, container: 'personalinfoemail'},
          { screen: constants.screensSets.profile.screens.viewPhone.id, container: 'personalinfophone'}
        ]
      )
    }
    render() {
        return (
              <div>
                <h2>Personal Information</h2>
                <div id='personalinfoemail' className='subprofile' />
                <div id='personalinfophone' className='subprofileNext' />
              </div>
            )
        }
}