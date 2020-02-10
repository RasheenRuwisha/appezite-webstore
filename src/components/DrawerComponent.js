import React, {Component} from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    Form,
    FormGroup,
    Label,
    Input,
    NavLink,
    Alert
} from 'reactstrap';
import {connect} from 'react-redux';
import PropType from 'prop-types'
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FormLabel from '@material-ui/core/FormLabel';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import {MuiPickersUtilsProvider, DateTimePicker} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import moment from 'moment';
import Drawer from '@material-ui/core/Drawer';
import {PayPalButton} from "react-paypal-button-v2";
import {placeOrder, removeCart, updateCart} from '../actions/cartActions';
import ReactLoading from 'react-loading';

const CLIENT = {
    sandbox: 'AbWZf5VD75nz75_a32ChZiz7qPc9zF_FqtBozZGTtu0zyIvv6yJReGbCu8IG5358rildRDBcAHZ78q69'
};
const ENV = 'sandbox';

class Address extends Component {

    state = {
        modal: false,
        email: '',
        password: '',
        msg: null,
        states: [],
        name: '',
        addressline1: '',
        addressline2: '',
        payment: 'Pay at Counter',
        notes: '',
        selectedDate: new Date(),
        total: 0,
        drawerState: 'cart',
        deliveryMethod: 'Pick Up',
        nameError: null,
        addressError: null,
        address2Error: null
    };

    static propTypes = {
        isAuthenticated: PropType.bool,
        clearErrors: PropType.func.isRequired,
        error: PropType.object.isRequired,
        login: PropType.func.isRequired,
        categories: PropType.object.isRequired,
        products: PropType.object.isRequired,
        business: PropType.object.isRequired
    }

    componentDidMount() {
        this.setState({modal: this.props.modal});
        let deliveryLocations = this.props.business.business.deliveryLocation;

        if (deliveryLocations !== null) {
            const unique = [...new Set(deliveryLocations.map(item => item.state))];
            let i = 0;
            var firstCity;
            this.setState({states: unique, selectedState: unique[0]})
            for (i; i < unique.length; i++) {
                let states = [];
                let cities = [];
                let stateName = unique[i] + 'options';
                for (let z = 0; z < deliveryLocations.length; z++) {
                    if (deliveryLocations[z].state === unique[i]) {
                        if (z == 0 && i == 0) {
                            firstCity = deliveryLocations[z].city
                        }
                        var option = <option value={deliveryLocations[z].city}>{deliveryLocations[z].city}</option>
                        states.push(option);
                        cities.push(deliveryLocations[z].city)
                    }
                }
                this.setState({
                    [unique[i]]: states,
                    [stateName]: cities
                })
            }
            this.setState({selectedCity: firstCity})
        }
    }

    componentDidUpdate(previousProps) {
        let isOrderPlaced = this.props.cart.placingOrder;

        if (this.state.right) {
            if (isOrderPlaced) {
                this.setState({side: 'right', right: false, drawerState: 'cart'});
            }
        }
    }

    toggleDrawer = (side, open) => event => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        if (open == false) {
            this.setState({drawerState: 'cart'})
        }
        this.setState({side: side, right: open});
    };

    removeCart = (index) => {
        this
            .props
            .updateCart();
        this
            .props
            .removeCart(index)
    }

    checkoutClick = () => {
        let price = 0;
        for (var i = 0; i < this.props.cart.cart.products.length; i++) {
            (price) = parseInt(price) + parseInt(this.props.cart.cart.products[i].price);
        }
        this.setState({drawerState: 'checkout', total: price});
    }

    checkoutProceedClick = () => {
        this.setState({drawerState: 'checkout'})
    }
    checkoutClose = () => {
        this.setState({drawerState: 'cart'})
    }

    toggle = () => e => {
        e.preventDefault();
        this.setState({
            modal: !this.state.modal
        });
    };

    handleStateChange = (e) => {
        var first = this.state[e.target.value + 'options'];
        this.setState({selectedState: e.target.value, selectedCity: first[0]});
    };

    handlePaymentChange = (e) => {
        this.setState({payment: e.target.value});
    };

    handleCityChange = (e) => {
        this.setState({selectedCity: e.target.value});
    };

    handleNameChange = (e) => {
        this.setState({name: e.target.value});
        this.handleNameError()
    };
    handleAddress1Change = (e) => {
        this.setState({addressline1: e.target.value});
        this.handleAddress1Error()
    };
    handleAddress2Change = (e) => {
        this.setState({addressline2: e.target.value});
        this.handleAddress2Error()
    };

    handleNotesChange = (e) => {
        this.setState({notes: e.target.value});
    };

    handleNameError = () => {
        if (this.state.name === "") {
            this.setState({nameError: 'Enter a valid name'});
            return true;
        } else {
            this.setState({nameError: null});
            return false;
        }
    };

    handleAddress1Error = () => {
        if (this.state.addressline1 === "") {
            this.setState({addressError: 'Enter a valid address'});
            return true;

        } else {
            this.setState({addressError: null});
            return false;

        }
    };

    handleAddress2Error = () => {
        if (this.state.addressline2 === "") {
            this.setState({address2Error: 'Enter a valid address'});
            return true;

        } else {
            this.setState({address2Error: null});
            return false;

        }
    };

    onSubmit = e => {
        e.preventDefault();

        var addressError = false;
        var address2Error = false;

        var dateError = this.handleDateChange(this.state.selectedDate);
        var nameError = this.handleNameError();
        if (this.state.deliveryMethod === 'Delivery') {
            addressError = this.handleAddress1Error();
            address2Error = this.handleAddress2Error();
        }

        if (!nameError && !addressError && !dateError && !address2Error) {
            var delivery = '';
            if (this.deliveryMethod === 'Delivery') {
                delivery = this.state.addressline1 + this.state.addressline2 + this.state.selectedCity + this.state.selectedState;
            }

            var selectedPickupDate = moment(this.state.selectedDate).format('DD-MM-YYYY HH:mm');
            var orderedDate = moment(new Date()).format('DD-MM-YYYY HH:mm');
            alert(selectedPickupDate)
            var order = {
                businessId: this.props.business.business.businessId,
                products: this.props.cart.cart.products,
                docType: 'PurchaseOrder',
                orderedAt: orderedDate,
                orderReadyBy: selectedPickupDate,
                delveryType: this.state.deliveryMethod,
                notes: this.state.notes,
                deliveryAddress: delivery,
                status: 'PENDING',
                customerName: this.state.name,
                platform: 'WEBSTORE',
                payment: 'Pay At Counter',
            }

            this
                .props
                .placeOrder(order);
        }

    };

    calculateTotal = () => {
        var price = 0;
        for (var i = 0; i < this.props.cart.cart.products.length; i++) {
            (price) = parseInt(price) + parseInt(this.props.cart.cart.products[i].price);
        }
        return (
            <p>{price}</p>
        )
    }

    sideList = side => (
        <div role="presentation" onClose={this.checkoutClose}>
            {this.props.cart.loading == true
                ? <div style={{
                        width: 500
                    }}>
                        <div className='centerLoader'>
                            <ReactLoading type="bars" color="#000"/>
                        </div>
                    </div>

                : this.props.cart.cart == null
                    ? null
                    : this.props.cart.cart.products.length > 0
                        ? <List
                                style={{
                                width: 500
                            }}>
                                {this.calculateTotal()}
                                {this
                                    .props
                                    .cart
                                    .cart
                                    .products
                                    .map((cart, index) => (
                                        <div>
                                            <p>{cart.variant}</p>
                                            <p>{cart.name}</p>
                                            <p>{cart.price}</p>
                                            <p>{cart.quantity}</p>
                                            <p>{cart.name}</p>
                                            <Button onClick={() => this.removeCart(index)}>Delete</Button>
                                            <Divider/>
                                        </div>
                                    ))}

                                <Button
                                    onClick={() => this.checkoutClick()}
                                    style={{
                                    background: this.props.business.business.theme.dark,
                                    color: 'white'
                                }}>Checkout</Button>

                            </List>
                        : <h5>No Products in Cart! Lets add some</h5>
}

        </div>
    );

    renderAddressFields = () => {
        let states = []
        for (let i = 0; i < this.state.states.length; i++) {
            states.push(
                <option value={this.state.states[i]}>{this.state.states[i]}</option>
            )
        }

        return (
            <div>
                <TextField
                    value={this.state.addressline1}
                    onChange={(e) => this.handleAddress1Change(e)}
                    style={{
                    width: '100%',
                    marginBottom: 30
                }}
                    error={this.state.addressError}
                    helperText={this.state.addressError}
                    id="outlined-basic"
                    label="Address Line 1"
                    variant="outlined"/>

                <br></br>
                <TextField
                    value={this.state.addressline2}
                    error={this.state.address2Error}
                    helperText={this.state.address2Error}
                    onChange={(e) => this.handleAddress2Change(e)}
                    style={{
                    width: '100%',
                    marginBottom: 30
                }}
                    id="outlined-basic"
                    label="Address Line 2"
                    variant="outlined"/>

                <br></br>
                <FormControl
                    variant="outlined"
                    style={{
                    width: '100%',
                    marginBottom: 30
                }}>
                    <InputLabel htmlFor="outlined-age-native-simple">
                        State
                    </InputLabel>
                    <Select
                        onChange={(e) => {
                        this.handleStateChange(e)
                    }}
                        native
                        labelWidth={400}
                        inputProps={{
                        name: 'age',
                        id: 'outlined-age-native-simple'
                    }}>
                        {states}
                    </Select>
                </FormControl>

                <br></br>
                <FormControl
                    variant="outlined"
                    style={{
                    width: '100%',
                    marginBottom: 30
                }}>
                    <InputLabel htmlFor="outlined-age-native-simple">
                        City
                    </InputLabel>
                    <Select
                        onChange={(e) => {
                        this.handleCityChange(e)
                    }}
                        native
                        labelWidth={400}
                        inputProps={{
                        name: 'age',
                        id: 'outlined-age-native-simple'
                    }}>
                        {this.state[this.state.selectedState]}
                    </Select>
                </FormControl>
            </div>
        )
    };

    handleCollectionChange = () => event => {
        this.setState({deliveryMethod: event.target.value})
    }
    handleDateChange = (date) => {
        let dates = this.props.business.business.pickUpHours;
        let preparationTime = this.props.business.business.orderPreparationTime;

        var selectedPickupDate = moment(date).format('dddd');
        var selectedPickupTime = moment(date).add(parseInt(preparationTime), 'minutes').format('HH:mm');

        this.setState({selectedDate: date})

        for (var i = 0; i < dates.length; i++) {
            if (dates[i].dayOfWeek.toLowerCase() === selectedPickupDate.toLowerCase()) {
                if (!moment(date).isAfter(new Date())) {
                    this.setState({error: 'Plese Select a valid Time'});
                    return true;

                } else if (selectedPickupTime > dates[i].from && selectedPickupTime < dates[i].to) {
                    this.setState({error: null});
                    return false;

                    break;
                } else {
                    this.setState({error: 'Restaurant closed on selected time'});
                    return true;

                }
            }
        }

    }
    onSuccess = (payment) => console.log('Successful payment!', payment);
    onError = (error) => console.log('Erroneous payment OR failed to load script!', error);
    onCancel = (data) => console.log('Cancelled payment!', data);

    handlePaymentSuccess = (paymentDetails) => {
        var delivery = '';
        if (this.deliveryMethod === 'Delivery') {
            delivery = this.state.addressline1 + this.state.addressline2 + this.state.selectedCity + this.state.selectedState;
        }

        var selectedPickupDate = moment(this.state.selectedDate).format('DD-MM-YYYY HH:mm');
        var orderedDate = moment(new Date()).format('DD-MM-YYYY HH:mm');

        var order = {
            businessId: this.props.business.business.businessId,
            products: this.props.cart.cart.products,
            docType: 'PurchaseOrder',
            payment: paymentDetails,
            orderedAt: orderedDate,
            orderReadyBy: selectedPickupDate,
            delveryType: this.state.deliveryMethod,
            notes: this.state.notes,
            deliveryAddress: delivery,
            status: 'PENDING',
            customerName: this.state.name,
            platform: 'WEBSTORE'
        }

        this
            .props
            .placeOrder(order)
    }

    sideListChekcout = side => (
        <div role="presentation">
            <List
                style={{
                width: 500,
                padding: 50
            }}>
                <TextField
                    value={this.state.name}
                    onChange={(e) => this.handleNameChange(e)}
                    style={{
                    width: '100%',
                    marginBottom: 30
                }}
                    error={this.state.nameError}
                    helperText={this.state.nameError}
                    id="outlined-basic"
                    label="Name"
                    variant="outlined"/>
                <br></br>
                <FormControl
                    variant="outlined"
                    style={{
                    width: '100%',
                    marginBottom: 30
                }}>
                    <InputLabel htmlFor="outlined-age-native-simple">
                        Collections Method
                    </InputLabel>
                    <Select
                        onChange={this.handleCollectionChange()}
                        native
                        labelWidth={400}
                        inputProps={{
                        name: 'age',
                        id: 'outlined-age-native-simple'
                    }}>
                        <option value="Pickup">Pickup</option>
                        {/* {this.props.business.business.deliveryEnabled
                            ? <option value="Delivery">Delivery</option>
                            : null} */}
                            <option value="Delivery">Delivery</option>

                    </Select>
                </FormControl>

                {this.state.deliveryMethod === 'Delivery'
                    ? this.renderAddressFields()
                    : null}
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DateTimePicker
                        ampm={false}
                        style={{
                        width: '100%',
                        marginBottom: 30
                    }}
                        value={this.state.selectedDate}
                        label="DateTimePicker"
                        onChange={date => this.handleDateChange(date)}
                        error={this.state.error}
                        helperText={this.state.error}
                        inputVariant="outlined"
                        disablePastTime
                        disablePast/>
                </MuiPickersUtilsProvider>

                <br></br>
                <FormControl
                    variant="outlined"
                    style={{
                    width: '100%',
                    marginBottom: 30
                }}>
                    <InputLabel htmlFor="outlined-age-native-simple">
                        Payment Method
                    </InputLabel>
                    <Select
                        onChange={(e) => {
                        this.handlePaymentChange(e)
                    }}
                        native
                        labelWidth={400}
                        inputProps={{
                        name: 'age',
                        id: 'outlined-age-native-simple'
                    }}>
                        <option>Pay at Counter</option>
                        <option>Card</option>
                    </Select>
                </FormControl>
                <br></br>
                <TextField
                    style={{
                    width: '100%',
                    marginBottom: 30
                }}
                    onChange={(e) => this.handleNotesChange(e)}
                    id="outlined-multiline-static"
                    label="Special Notes"
                    multiline
                    rows="4"
                    variant="outlined"/> {this.state.payment === 'Pay at Counter'
                    ? <Button
                            onClick={(e) => this.onSubmit(e)}
                            style={{
                            background: this.props.business.business.theme.dark,
                            color: 'white'
                        }}>Checkout</Button>
                    : null}

                {this.state.error == null && this.state.payment === 'Card'

                    ? <div>
                            <PayPalButton amount={this.state.total} // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                                onCancel={(details, data) => {
                                alert("Cancelled");
                            }} onError={(details, data) => {
                                alert("Shit happens");
                            }} onSuccess={(details, data) => {
                                alert("Transaction completed by " + details.payer.name.given_name);
                                this.handlePaymentSuccess(details);
                            }} options={{
                                clientId: this.props.business.business.paypalSecret
                            }}/>
                        </div>
                    : null}
            </List>
        </div>
    );

    render() {
        return (
            <div>
                <NavLink
                    style={{
                    color: '#fff'
                }}
                    href="#"
                    onClick={this.toggleDrawer('left', true)}>
                    Cart
                </NavLink>
                <Drawer
                    anchor="right"
                    open={this.state.right}
                    onClose={this.toggleDrawer('right', false)}>
                    {this.state.drawerState === 'cart'
                        ? this.sideList('right')
                        : this.sideListChekcout('right')}
                </Drawer>
            </div>

        );
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    user:state.auth.user[0],
    error: state.error,
    categories: state.categories,
    business: state.business,
    products: state.products,
    cart: state.cart
});

export default connect(mapStateToProps, {placeOrder, removeCart, updateCart})(Address);