import React from 'react';

export default class Navigation extends React.Component {
    constructor (props) {
        super(props);
        //this.changeScreen=this.changeScreen.bind(this);
        // this.state = {
        //     screens: ['personalinfoemail', 'personalinfophone']
        // }
    }
    render() {
        const startScreen = 'navigation';
        return (
            <div id={startScreen} className="navigation">
                {
                    gigya.accounts.showScreenSet({screenSet:'Default-ProfileUpdate', startScreen:startScreen, containerID: startScreen, onAfterScreenLoad: event => {
                        const controlLinks = document.querySelectorAll('.gigya-composite-control-link');
                        controlLinks.forEach((el) => {
                            //gigya puts extra 'gigya-composite-control-links' on the screen, so if statement to verify which are legit
                            if (el.childNodes.length > 0){
                                el.addEventListener("click", () => {
                                    //resetting the style back to normal on all links to cover bases, even though just one link should have purple text and border
                                    for (let i=0;i<controlLinks.length;i++){
                                        controlLinks[i].classList.remove("leftNavSelected");
                                    }
                                    //the data-screen-name attr for each link should match the screen names in gigya, separated by space in order the screens should be displayed
                                    let elID = el.dataset.screenName;
                                    elID = elID.split(" ");
                                    this.props.changeScreen(elID);
                                });
                            }
                        })
                    }})
                }
            </div>
        )
    }
}