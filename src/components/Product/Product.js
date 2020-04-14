import React, {Component} from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import CardActions from '@material-ui/core/CardActions'
import IconButton from '@material-ui/core/IconButton'
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
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
import LoginModal from '../auth/LoginModal';
import {Icon} from '@material-ui/core'
import AddtoCartLogin from '../auth/AddtoCartLogin'
import AddToCartModal from '../AddToCartModal/AddToCartModal'

class Product extends Component {

    render() {
        return (
            <Link>
                {this.props.product.visibility
                    ? (
                        <Card
                            style={{
                            textAlign: "left"
                        }}>
                            <Link to={`/${this.props.businessId}/product/${this.props.product.productId}`}>
                                <CardMedia
                                    style={{
                                    height: 0,
                                    paddingTop: '56.25%'
                                }}
                                    image={this.props.product.image}
                                    title={`${this.props.product.name} - ${this.props.product.price}`}/>
                            </Link>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h5">
                                    {`${this.props.product.name} - LKR ${ (Math.round(this.props.product.price * 100) / 100).toFixed(2)}`}
                                </Typography>
                            </CardContent>
                            <CardActions disableSpacing>
                                {this.props.auth.isAuthenticated
                                    ? <IconButton aria-label="add to favorites">
                                            <AddToCartModal product={this.props.product}/>
                                        </IconButton>
                                    : <IconButton>
                                        <AddtoCartLogin/>
                                    </IconButton>
}

                            </CardActions>
                        </Card>
                    )
                    : null}
            </Link>

        )
    }

}

const mapStateToProps = state => ({auth: state.auth})

export default connect(mapStateToProps, null)(Product)