import React, {Component} from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import CardActions from '@material-ui/core/CardActions'
import IconButton from '@material-ui/core/IconButton'
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import {connect} from 'react-redux';
import {loadOrders} from '../../actions/orderActions';
import ReactLoading from 'react-loading';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Navbar from '../NavBar/Navbar';

class Orders extends Component {

    componentDidMount() {
        this
            .props
            .loadOrders()
    }

    renderUserOrders(orders) {
        let userOrder = [];
        for (let i = 0; i < orders.length; i++) {
            let orderProducts = [];
            for (let z = 0; z < orders[i].products.length; z++) {
                orderProducts.push(
                    <p>{orders[i].products[z].name}
                        - {orders[i].products[z].variant === null
                            ? null
                            : orders[i].products[z].variant}</p>
                )
                for (let x = 0; x < orders[i].products[z].addons.length; x++) {
                    orderProducts.push(
                        <p>{orders[i].products[z].addons[x].child}</p>
                    )
                }
            }

            userOrder.push(
                <ExpansionPanel>
                    <ExpansionPanelSummary
                        expandIcon={< ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header">
                        <Typography>{orders[i].purchaseId}
                            - {orders[i].status}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <div
                            style={{
                            width: '100%'
                        }}>
                            {orderProducts}
                        </div>
                        <div
                            style={{
                            width: '100%'
                        }}></div>
                        <Typography>
                            {orders[i].delveryType}
                        </Typography>
                        <Typography>
                            {orders[i].total}
                        </Typography>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            )
        }
        return userOrder;
    }
    render() {
        return (
            <div style={{
                backgroundColor: '#dcdfdf'
            }}>
                <Navbar business={this.props.business} page="Orders"/> {this.props.orders.loading
                    ? <div className="centerLoader">
                            <ReactLoading type="bars" color="#000"/>
                        </div>
                    : <div>
                        {this.renderUserOrders(this.props.orders.orders)}
                    </div>
}
            </div>
        )
    }

}

const mapStateToProps = state => ({auth: state.auth, orders: state.orders, business: state.business})

export default connect(mapStateToProps, {loadOrders})(Orders)