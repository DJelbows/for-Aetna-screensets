const gigyaHelper = {
  showScreens: (screenSet, screens) => {
    screens.map(s => gigya.accounts.showScreenSet({
      screenSet,
      startScreen: s.screen,
      containerID: s.container
    }))
  }
}

export default gigyaHelper