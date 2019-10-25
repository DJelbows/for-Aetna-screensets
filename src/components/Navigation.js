import React from 'react';
import { connect } from 'kea'
import profileManagerLogic from '../logic/profileManagerLogic'
import constants from '../utils/constants'
import gigyaHelper from '../utils/gigya'

@connect({
  actions: [
    profileManagerLogic, [
      'setActiveTab'
    ]
  ],
  values: [
    profileManagerLogic, [
      'activeTab',
    ]
  ]
})
export default class Navigation extends React.Component {
    render() {
      const { activeTab } = this.props
      const { setActiveTab } = this.actions

      return (
          <div className='navigation'>
            <label className="navToggle" onClick={() => gigyaHelper.toggleMenu()}>&#9776;<span className='navTitle'>Personal Information</span></label>
              {Object.values(constants.tabs).map(t =>
                <div
                  key={t.id}
                  onClick={() => {
                    setActiveTab(t.id)
                    gigyaHelper.toggleMenu(t.label)
                  }}
                  className={`link ${activeTab===t.id ? 'activeLink' : ''}`}
                >
                  { t.label}
                </div>
              )}
          </div>
      )
    }
}