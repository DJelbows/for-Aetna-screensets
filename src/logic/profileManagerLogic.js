import PropTypes from 'prop-types'
import { kea } from 'kea'
import constants from '../utils/constants'

export default kea({
  actions: () => ({
    // toggleReportDrawer: () => ({}),
    setActiveTab: (tab) => ({ tab })
  }),

  reducers: ({ actions }) => ({
    // reportDrawer: [true, PropTypes.bool, {
    //   [actions.toggleReportDrawer]: (state) => !state
    // }],
    activeTab: [constants.tabs.personalInfo.id, PropTypes.string, {
      [actions.setActiveTab]: (_, payload) => payload.tab
    }]
  })
})
