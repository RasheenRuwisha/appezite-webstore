import React, {Component} from 'react';
import {
    Button,
    NavLink,
} from 'reactstrap';
import {connect} from 'react-redux';
import PropType from 'prop-types'
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import {MuiPickersUtilsProvider, DateTimePicker} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import moment from 'moment';
import Drawer from '@material-ui/core/Drawer';
import {PayPalButton} from "react-paypal-button-v2";
import {placeOrder, removeCart, updateCart} from '../../actions/cartActions';
import ReactLoading from 'react-loading';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import './DrawerComponent.css';
import DeleteIcon from '@material-ui/icons/Delete';


class DrawerComponent extends Component {

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
        address2Error: null,
        totalCart: 0,
        deliveryPrice: 0,
        tabValue: 0
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
            let deliveryLocation = deliveryLocations.find(x => x.city === firstCity && x.state === unique[0]);
            let totalCart = this.state.totalCart - this.state.deliveryPrice;
            let deliveryPrice = deliveryLocation.price;
            totalCart = this.state.totalCart + deliveryPrice;
            this.setState({totalCart: totalCart, deliveryPrice: deliveryPrice});
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
            (price) = parseFloat(price) + parseFloat(this.props.cart.cart.products[i].price);
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
        var deliveryLocations = this.props.business.business.deliveryLocation;
        let deliveryLocation = deliveryLocations.find(x => x.city === first[0] && x.state === e.target.value);
        let totalCart = this.state.totalCart - this.state.deliveryPrice;
        let deliveryPrice = deliveryLocation.price;
        totalCart = totalCart + deliveryPrice;
        this.setState({selectedState: e.target.value, selectedCity: first[0], totalCart: totalCart, deliveryPrice: deliveryPrice});
    };

    handlePaymentChange = (e) => {
        this.setState({payment: e.target.value});
    };

    handleCityChange = (e) => {
        var deliveryLocations = this.props.business.business.deliveryLocation;
        let deliveryLocation = deliveryLocations.find(x => x.city === e.target.value && x.state === this.state.selectedState);
        let totalCart = this.state.totalCart - this.state.deliveryPrice;
        let deliveryPrice = deliveryLocation.price;
        totalCart = totalCart + deliveryPrice;
        this.setState({selectedCity: e.target.value, totalCart: totalCart, deliveryPrice: deliveryPrice});
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

    // place order without payment
    onSubmit = e => {
        e.preventDefault();

        var price = 0;
        for (var i = 0; i < this.props.cart.cart.products.length; i++) {
            (price) = parseFloat(price) + parseFloat(this.props.cart.cart.products[i].price);
        }

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
            var order = {
                businessId: this.props.business.business.businessId,
                businessEmail: this.props.business.business.email,
                businessName: this.props.business.business.name,
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
                total: price,
                deliveryCharge: this.state.deliveryPrice,
                customerNumber: this.props.user.phone,
                notificationTokens : this.props.user.notificationTokens,
                businessNotification: this.props.business.business.businessNotification,
                businessUserNotification: this.props.business.business.notificationToken
            }

            this
                .props
                .placeOrder(order);
            this.setState({drawerState: 'checkingOut'})
        }

    };

    calculateTotal = () => {
        var price = 0;
        for (var i = 0; i < this.props.cart.cart.products.length; i++) {
            (price) = parseFloat(price) + parseFloat(this.props.cart.cart.products[i].price);
        }
        return (
            <span>{(Math.round(price * 100) / 100).toFixed(2)}</span>
        )
    }

    calculateSubTotal = () => {
        var price = 0;
        for (var i = 0; i < this.props.cart.cart.products.length; i++) {
            (price) = parseFloat(price) + parseFloat(this.props.cart.cart.products[i].price);
        }
        return (price)
    }

    calculateGrandTotal = () => {
        var price = 0;
        for (var i = 0; i < this.props.cart.cart.products.length; i++) {
            (price) = parseFloat(price) + parseFloat(this.props.cart.cart.products[i].price);
        }
        if (this.state.deliveryMethod == 'Delivery') {
            price = price + parseFloat(this.state.deliveryPrice);
        }
        return (price)
    }

    // render cart
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
                                className="marbotton"
                                style={{
                                width: 500
                            }}>

                                {this
                                    .props
                                    .cart
                                    .cart
                                    .products
                                    .map((cart, index) => (
                                        <div className="div-cont">
                                            <div className="flex row marover">
                                                <div>
                                                    <img className="img" src={cart.image}/>
                                                </div>

                                                <div className="flex column">
                                                    <div className="flex row namePriceContainer">
                                                        <p>{cart.name}</p>
                                                        <p>{(Math.round(cart.price * 100) / 100).toFixed(2)}</p>
                                                    </div>

                                                    <p className="variantText">{cart.variant} {cart.addons.length > 0
                                                            ? 'with ' + cart.addons.length + ' addons'
                                                            : null}</p>

                                                    <div className="flex row namePriceContainer">
                                                        <div aria-label="delete-item" onClick={() => this.removeCart(index)}>
                                                            <DeleteIcon
                                                                style={{
                                                                color: this.props.business.business.theme.dark
                                                            }}/>
                                                        </div>
                                                        <p>{(Math.round(cart.price * 100) / 100).toFixed(2)}
                                                            x {cart.quantity}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <Divider/>
                                        </div>
                                    ))}

                                <div className='total'>
                                    <div className="total-text">
                                        <p>
                                            Cart total : {this.calculateTotal()}</p>
                                    </div>
                                    <Button
                                        className="checkout-text"
                                        onClick={() => this.checkoutClick()}
                                        style={{
                                        background: this.props.business.business.theme.dark,
                                        color: 'white'
                                    }}>Checkout</Button>
                                </div>

                            </List>
                        : <h5 style={{
                            width: 500
                        }}>No Products in Cart! Lets add some</h5>
}

        </div>
    );

    // display address fields with available data
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

    //handle the date changes
    handleDateChange = (date) => {
        let dates = this.props.business.business.pickUpHours;
        let preparationTime = this.props.business.business.orderPreparationTime;

        // format the selected date to words 
        var selectedPickupDate = moment(date).format('dddd');
        // format the selected date to time
        var selectedPickupTime = moment(date).add(parseInt(preparationTime), 'minutes').format('HH:mm');

        this.setState({selectedDate: date})

        // Check wether the selected date is after the current date
        if (!moment(date).isAfter(new Date())) {
            this.setState({error: 'Plese Select a valid Time'});
            return true;
        } else {
            this.setState({error: null});
        }

        for (var i = 0; i < dates.length; i++) {
            // Check wether the selected day exist in the available times
            if (dates[i].dayOfWeek.toLowerCase() === selectedPickupDate.toLowerCase()) {
                if (!moment(date).isAfter(new Date())) {
                    this.setState({error: 'Plese Select a valid Time'});
                    return true;
                  // Check wetehr selected time is available in the avaiable time list  
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

    // handle the payment succes and place the order when used paypalor card to do the payment
    handlePaymentSuccess = (paymentDetails) => {
        var price = 0;
        for (var i = 0; i < this.props.cart.cart.products.length; i++) {
            (price) = parseFloat(price) + parseFloat(this.props.cart.cart.products[i].price);
        }

        var delivery = '';
        if (this.deliveryMethod === 'Delivery') {
            delivery = this.state.addressline1 + this.state.addressline2 + this.state.selectedCity + this.state.selectedState;
        }

        var selectedPickupDate = moment(this.state.selectedDate).format('DD-MM-YYYY HH:mm');
        var orderedDate = moment(new Date()).format('DD-MM-YYYY HH:mm');

        var order = {
            businessId: this.props.business.business.businessId,
            businessEmail: this.props.business.business.email,
            businessName: this.props.business.business.name,
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
            platform: 'WEBSTORE',
            total: price,
            deliveryCharge: this.state.deliveryPrice,
            customerNumber: this.props.user.phone,
            notificationTokens : this.props.user.notificationTokens,
            businessNotification: this.props.business.business.businessNotification,
            businessUserNotification: this.props.business.business.notificationToken
        }

        this
            .props
            .placeOrder(order)
        this.setState({drawerState: 'checkingOut'})
    }

    showOrderSummary = () => {
        var addressError = false;
        var address2Error = false;

        var dateError = this.handleDateChange(this.state.selectedDate);
        var nameError = this.handleNameError();
        if (this.state.deliveryMethod === 'Delivery') {
            addressError = this.handleAddress1Error();
            address2Error = this.handleAddress2Error();
        }
        if (!nameError && !addressError && !dateError && !address2Error) {
            this.setState({drawerState: 'orderSummary'})
        } else {
            this.setState({tabValue: 0});

        }
    }

    showOrderDetails = () => {
        this.setState({drawerState: 'checkout'})
    }

    handleChange = (event, newValue) => {
        if (newValue == 1) {
            this.showOrderSummary()
        } else {
            this.showOrderDetails()
        }
        this.setState({tabValue: newValue});
    };

    // render order summary with checkout option
    renderSummary = () => {
        return (
            <div>
                {this.state.drawerState === 'orderSummary'
                    ? <div role="presentation">

                            <List
                                style={this.state.payment === 'Card' ? {
                                width: 500,
                                padding: 50,
                                height:300,
                                overflow:'scroll'
                            } : {
                                width: 500,
                                padding: 50
                            }}>

                                <TableContainer component={Paper}>
                                    <Table
                                        style={{
                                        minWidth: 400
                                    }}
                                        aria-label="caption table">
                                        <TableBody>
                                            <TableRow key="name">
                                                <TableCell align="left">Collected by</TableCell>
                                                <TableCell align="right">{this.state.name}</TableCell>
                                            </TableRow>
                                            <TableRow key="date">
                                                <TableCell align="left">Order ready by</TableCell>
                                                <TableCell align="right">{moment(this.state.selectedDate).format('DD-MM-YYYY HH:mm')}</TableCell>
                                            </TableRow>
                                            <TableRow key="method">
                                                <TableCell align="left">Collection method</TableCell>
                                                <TableCell align="right">{this.state.deliveryMethod}</TableCell>
                                            </TableRow>
                                            <TableRow key="notes">
                                                <TableCell align="left">Special Notes</TableCell>
                                                <TableCell align="right">{this.state.notes}</TableCell>
                                            </TableRow>
                                            <TableRow key="method">
                                                <TableCell align="left"></TableCell>
                                                <TableCell align="left"></TableCell>
                                            </TableRow>
                                            <TableRow key="method">
                                                <TableCell align="left"></TableCell>
                                                <TableCell align="left"></TableCell>
                                            </TableRow>
                                            {this
                                                .props
                                                .cart
                                                .cart
                                                .products
                                                .map((cart, index) => (
                                                    <TableRow key="method">

                                                        <TableCell align="left">
                                                            <p>{cart.name}
                                                                - {cart.variant}</p>
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <p>
                                                                <span>{cart.quantity}
                                                                </span>
                                                                x
                                                                <span>
                                                                    {(Math.round(cart.price * 100) / 100).toFixed(2) / cart.quantity}</span>
                                                            </p>
                                                        </TableCell>
                                                        <Divider/>
                                                    </TableRow>

                                                ))}

                                            <TableRow key="price">
                                                <TableCell align="left">Subtotal</TableCell>
                                                <TableCell align="right">LKR {(Math.round(this.calculateSubTotal() * 100) / 100).toFixed(2)}</TableCell>
                                            </TableRow>
                                            {this.state.deliveryMethod == 'Delivery'
                                                ? <TableRow key="price">
                                                        <TableCell align="left">Delivery fee</TableCell>
                                                        <TableCell align="right">{(Math.round(this.state.deliveryPrice * 100) / 100).toFixed(2)}</TableCell>
                                                    </TableRow>
                                                : null
}

                                            <TableRow key="price">
                                                <TableCell align="left">Grandtotal</TableCell>
                                                <TableCell align="right">LKR {(Math.round(this.calculateGrandTotal() * 100) / 100).toFixed(2)}</TableCell>
                                            </TableRow>

                                        </TableBody>
                                    </Table>
                                </TableContainer>

                            </List>

                            <div
                                className= {this.state.payment === 'Card' ? 'total-paypal' : 'total'} 
                               >
                                {this.state.payment === 'Pay at Counter'
                                    ? <Button
                                            className="checkout-text"
                                            onClick={(e) => this.onSubmit(e)}
                                            style={{
                                            background: this.props.business.business.theme.dark,
                                            color: 'white'
                                        }}>Checkout</Button>
                                    : null}

                                {this.state.error == null && this.state.payment === 'Card'

                                    ? <div>
                                            <PayPalButton className="checkout-text" amount={parseFloat(this.state.total/180).toFixed(2)}
                                                shippingPreference="NO_SHIPPING"
                                                onCancel={(details, data) => {}} onError={(details, data) => {}} onSuccess={(details, data) => {
                                                this.handlePaymentSuccess(details);
                                            }} options={{
                                                clientId: this.props.business.business.paypalSecret
                                            }}/>
                                        </div>
                                    : null}
                            </div>

                        </div>
                    : <div style={{
                        width: 500
                    }}>
                        <div className='centerLoader'>
                            Placing Order
                            <ReactLoading type="bars" color="#000"/>
                        </div>
                    </div>
}
            </div>
        )
    }

    // render order details page to fill the details
    sideListChekcout = side => (
        <div>

            <AppBar position="static">
                <Tabs
                    variant="fullWidth"
                    value={this.state.tabValue}
                    onChange={this.handleChange}>
                    <Tab label="Order details"/>
                    <Tab label="Order summary"/>
                </Tabs>
            </AppBar>
            {this.state.drawerState == 'checkout'
                ? <div role="presentation">
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
                                    {this.props.business.business.deliveryEnabled && this.props.business.business.deliveryLocation != null
                                        ? <option value="Delivery">Delivery</option>
                                        : null}

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
                                    value={this.state.collectionMethod}
                                    onChange={(e) => {
                                    this.handlePaymentChange(e)
                                }}
                                    native
                                    labelWidth={400}
                                    inputProps={{
                                    name: 'age',
                                    id: 'outlined-age-native-simple'
                                }}>
                                    <option value='Pay at Counter'>Pay at Counter</option>
                                    {this.props.business.business.paypalSecret == null || this.props.business.business.paypalSecret == ''? null:
                                    < option value = 'Card' > Card </option>}
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
                                variant="outlined"/>

                        </List>

                        <div
                            className='total'
                            style={{
                            height: '50px'
                        }}>
                            <Button
                                className="checkout-text"
                                onClick={() => this.showOrderSummary()}
                                style={{
                                background: this.props.business.business.theme.dark,
                                color: 'white'
                            }}>Continue</Button>
                        </div>

                    </div>

                : this.renderSummary()
}

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
    user: state.auth.user,
    error: state.error,
    categories: state.categories,
    business: state.business,
    products: state.products,
    cart: state.cart
});

export default connect(mapStateToProps, {placeOrder, removeCart, updateCart})(DrawerComponent);
