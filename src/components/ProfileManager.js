import React from 'react';
import Navigation from './Navigation'
import { connect } from 'kea'
import constants from '../utils/constants'
import PersonalInformation from './PersonalInformation'
import Paperless from './Paperless'
import Communications from './Communications'
import profileManagerLogic from '../logic/profileManagerLogic'

@connect({
  values: [
    profileManagerLogic, [
      'activeTab',
    ]
  ]
})
export default class ProfileManager extends React.Component {
    render () {
        const { activeTab } = this.props
        return (
          <div>
            <h1>Profile &amp; Preferences</h1>
            <div className="container">
                <Navigation />
                {activeTab===constants.tabs.personalInfo.id && <PersonalInformation />}
                {activeTab===constants.tabs.paperless.id && <Paperless />}
                {activeTab===constants.tabs.communications.id && <Communications />}
            </div>
          </div>
        )
    }
}