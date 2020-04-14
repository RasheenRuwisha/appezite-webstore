import React, {Component} from 'react'
import {connect} from 'react-redux';
import {getBusiness} from '../../actions/businessActions';
import {getCategories} from '../../actions/categoryActions';
import './Home.css';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            width: 0,
            height: 0
        };
        this.updateWindowDimensions = this
            .updateWindowDimensions
            .bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({width: window.innerWidth, height: window.innerHeight});
    }

    render() {
        return (
            <div
                className="main"
                style={{
                background: `#1f1f1f url('${this.props.business.business.appconfig.backgroundImage}') no-repeat center/cover`,
                height: this.state.height
            }}>

                <div
                    className="header-logo"
                    style={{
                    background: `${this.props.business.business.theme.dark}`
                }}>
                    <img src={this.props.business.business.appconfig.logo}/>
                </div>

                <div className="nav">
                    <div className="nav-content">
                        <Link to={`/${this.props.business.business.businessId}`}>Home</Link>
                        <Link to={`/${this.props.business.business.businessId}/categories`}>Order</Link>
                    </div>
                </div>

                <div className="content">

                    <div className="business-name">
                        <p>{this.props.business.business.name}</p>
                    </div>
                    <div className="business-desc">
                        <p>{this.props.business.business.description}</p>
                    </div>
                </div>

            </div>
        )
    }
}

Home.propTypes = {
    getCategories: PropTypes.func.isRequired,
    categories: PropTypes.object.isRequired,
    products: PropTypes.object.isRequired,
    business: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({categories: state.categories, business: state.business, products: state.products})

export default connect(mapStateToProps, {getCategories, getBusiness})(Home);