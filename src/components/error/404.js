import React, {Component} from 'react'
import './404.css'
import LocalMallTwoToneIcon from '@material-ui/icons/LocalMallTwoTone';


class FourZeroFour extends Component {
    render() {
        return (
            <div className='textContainer'>
                <div className='msgBox'> 
                    <LocalMallTwoToneIcon style={{ fontSize: 70 }} />
                    <p className='errorText'>Something is wrong, check for the url</p>
                    
                </div>
            </div>
        )
    }
}



export default FourZeroFour;