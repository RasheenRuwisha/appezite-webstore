
import React, {Component} from 'react'
import './404.css'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
      }
    
      static getDerivedStateFromError(error) {
        return { hasError: true };
      }
    
      componentDidCatch(error, errorInfo) {
          console.log(error)
      }
    
      render() {
        if (this.state.hasError) {
          return (
            <div className='textContainer'>
            <div className='msgBox'> 
                <ErrorOutlineIcon style={{ fontSize: 70 }} />
                <p className='errorText'>Something went wrong... It's not you its us..</p>
            </div>
        </div>
          )
        }
    
        return this.props.children; 
      }
  }

  export default ErrorBoundary