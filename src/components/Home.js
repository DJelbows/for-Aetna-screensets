import React from 'react';
import { connect } from 'kea'
import ProfileManager from './ProfileManager'
import Login from './Login'
import profileManagerLogic from '../logic/profileManagerLogic'
import gigyaHelper from '../utils/gigya'

@connect({
  actions: [
    profileManagerLogic, [
      'setUser'
    ]
  ],
  values: [
    profileManagerLogic, [
      'currentUser',
    ]
  ]
})
export default class Home extends React.Component {
    componentDidMount() {
        const { setUser } = this.actions
        gigyaHelper.listenForGigyaUser(setUser)
    }
    render () {
        const { currentUser } = this.props
        return currentUser ? <ProfileManager/> : <Login />
    }
}