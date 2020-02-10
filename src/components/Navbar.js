import React, {Component, Fragment} from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Container
} from 'reactstrap';
import {Link} from 'react-router-dom';
import RegisterModal from './auth/RegisterModal';
import Logout from './auth/Logout';
import LoginModal from './auth/LoginModal';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import DrawerComponent from './DrawerComponent';

class AppNavbar extends Component {

    state = {
        isOpen: false
    }

    static propTypes = {
        auth: PropTypes.object.isRequired
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    render() {

        const {isAuthenticated, user} = this.props.auth;

        const authLinks = (
            <Fragment>
                {/* <NavItem>
                    <span className="navbar-text mr-3">
                        <strong>{user
                                ? `Welcome ${user[0].email} `
                                : ''}</strong>
                    </span>
                </NavItem> */}
                <NavItem>
                    <Logout/>
                </NavItem>
                <NavItem>
                    <DrawerComponent/>
                </NavItem>

                <NavItem>
                    <Link
                        style={{
                        color: "#fff"
                    }}
                        to={`/${this.props.business.business.businessId}/orders`}>
                        <NavLink
                            style={{
                            color: "#fff"
                        }}>
                            Orders
                        </NavLink>
                    </Link>
                </NavItem>
            </Fragment>
        )

        const guestLinks = (
            <Fragment>
                <NavItem>
                    <RegisterModal/>
                </NavItem>
                <NavItem>
                    <LoginModal/>
                </NavItem>
            </Fragment>
        )

        return (
            <div>
                <Navbar
                    expand="sm"
                    className="mb-5"
                    style={{
                    backgroundColor: `${this.props.business.business.theme.dark}`
                }}>
                    <Container>
                        <NavbarBrand
                            style={{
                            color: "#fff"
                        }}
                            href="#">
                            {this.props.business.business.name}
                        </NavbarBrand>

                        <NavbarToggler onClick={this.toggle}/>
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className="ml-auto" navbar>
                                <NavItem>
                                    <Link
                                        style={{
                                        color: "#fff"
                                    }}
                                        to={`/${this.props.business.business.businessId}`}>
                                        <NavLink
                                            style={{
                                            color: "#fff"
                                        }}>
                                            Home
                                        </NavLink>
                                    </Link>
                                </NavItem>
                                <NavItem>
                                    <Link
                                        style={{
                                        color: "#fff"
                                    }}
                                        to={`/${this.props.business.business.businessId}/categories`}>
                                        <NavLink
                                            style={{
                                            color: "#fff"
                                        }}>
                                            Categories
                                        </NavLink>
                                    </Link>
                                </NavItem>
                                {isAuthenticated
                                    ? authLinks
                                    : guestLinks}

                            </Nav>
                        </Collapse>
                    </Container>
                </Navbar>
            </div>
        )
    }

}
const mapStateToProps = state => ({auth: state.auth})
export default connect(mapStateToProps, null)(AppNavbar);