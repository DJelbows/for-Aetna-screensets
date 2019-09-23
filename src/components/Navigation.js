import React from 'react';
import { connect } from 'kea'
import profileManagerLogic from '../logic/profileManagerLogic'
import constants from '../utils/constants'

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
              {Object.values(constants.tabs).map(t =>
                <div
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`link ${activeTab===t.id ? 'activeLink' : ''}`}
                >
                  { t.label}
                </div>
              )}
          </div>
      )
    }
}